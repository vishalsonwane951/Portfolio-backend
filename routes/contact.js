import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { Contact } from "../model/index.js";
import { sendContactEmail, sendAutoReply } from "../config/email.js";
import protect from "../middleware/auth.js";

const router = Router();

// ── Rate Limiter — public form submissions only ───────────────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many messages. Please try again in 15 minutes." },
});

// ── PUBLIC: Submit Contact Form ───────────────────────────────────────────────
router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    if (message.length < 10) {
      return res.status(400).json({ success: false, message: "Message too short (min 10 chars)" });
    }

    // Save to DB
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // Fire emails concurrently (non-blocking on failure)
    await Promise.allSettled([
      sendContactEmail({ name, email, message }).catch((err) =>
        console.error("❌ Owner notification failed:", err.message)
      ),
      sendAutoReply({ name, email }).catch((err) =>
        console.error("❌ Auto-reply failed:", err.message)
      ),
    ]);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      id: contact._id,
    });
  } catch (err) {
    console.error("Contact route error:", err);
    return res.status(500).json({ success: false, message: "Server error, please try again later" });
  }
});

// ── ADMIN: Get All Messages ───────────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const filter = unread === "true" ? { isRead: false } : {};
    const total = await Contact.countDocuments(filter);
    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: Mark as Read ───────────────────────────────────────────────────────
router.patch("/:id/read", protect, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ADMIN: Delete Message ─────────────────────────────────────────────────────
router.delete("/:id", protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;