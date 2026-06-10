import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../model/index.js";
import protect from "../middleware/auth.js";

const router = Router();


// 🚀 Insert API
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    // check if already exists
    const existingUser = await Admin.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newAdmin = new Admin({
      email,
      password: hashedPassword
    })

    await newAdmin.save()

    res.status(201).json({ message: "User registered successfully" })

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message })
  }
})


// ── Admin Login ───────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ success: true, token, admin: { email: admin.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Verify token (used by frontend to check session) ─────────────────────────
router.get("/verify", protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

export default router;
