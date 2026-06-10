import { Router } from "express";
import protect from "../middleware/auth.js";
import { Hero, About, SkillCategory, Project, Education } from "../model/index.js";

const router = Router();

// ── Helper: generic single-doc upsert ────────────────────────────────────────
const upsertOne = (Model) => async (req, res) => {
  try {
    let doc = await Model.findOne();
    if (doc) {
      Object.assign(doc, req.body);
      await doc.save();
    } else {
      doc = await Model.create(req.body);
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════════════════════════════════════════
// ── HERO ──────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
router.get("/hero", async (_req, res) => {
  const data = await Hero.findOne();
  res.json({ success: true, data });
});
router.put("/hero", protect, upsertOne(Hero));

// ════════════════════════════════════════════════════════════════════════════
// ── ABOUT ─────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
router.get("/about", async (_req, res) => {
  const data = await About.findOne();
  res.json({ success: true, data });
});
router.put("/about", protect, upsertOne(About));

// ════════════════════════════════════════════════════════════════════════════
// ── SKILLS ────────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
router.get("/skills", async (_req, res) => {
  const data = await SkillCategory.find().sort({ order: 1 });
  res.json({ success: true, data });
});

router.post("/skills", protect, async (req, res) => {
  try {
    const doc = await SkillCategory.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/skills/:id", protect, async (req, res) => {
  try {
    const doc = await SkillCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ success: false, message: "Skill category not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/skills/:id", protect, async (req, res) => {
  try {
    await SkillCategory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Skill category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ── PROJECTS ──────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
router.get("/projects", async (_req, res) => {
  const data = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data });
});

router.post("/projects", protect, async (req, res) => {
  try {
    const doc = await Project.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/projects/:id", protect, async (req, res) => {
  try {
    const doc = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/projects/:id", protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ── EDUCATION / TIMELINE ──────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
router.get("/education", async (_req, res) => {
  const data = await Education.find().sort({ order: 1 });
  res.json({ success: true, data });
});

router.post("/education", protect, async (req, res) => {
  try {
    const doc = await Education.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put("/education/:id", protect, async (req, res) => {
  try {
    const doc = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ success: false, message: "Education entry not found" });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete("/education/:id", protect, async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Education entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
