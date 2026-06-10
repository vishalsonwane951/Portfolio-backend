import mongoose from "mongoose";

// ── CONTACT MESSAGE MODEL ────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ── HERO / PROFILE MODEL ─────────────────────────────────────────────────────
const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String },   // "Full Stack Developer — MERN & Python"
    subtitle: { type: String },   // paragraph under name
    role: { type: String },
    location: { type: String },
    available: { type: Boolean, default: true },
    stats: [
      {
        val: String,
        sup: String,
        lab: String,
      },
    ],
    photoUrl: { type: String },
    company: { type: String },
    companyRole: { type: String },
    companySince: { type: String },
    techChips: [String],           // ["MERN","Python","AWS"]
  },
  { timestamps: true }
);

// ── ABOUT MODEL ──────────────────────────────────────────────────────────────
const aboutSchema = new mongoose.Schema(
  {
    bio: { type: String },
    features: [String],         // ["Responsive Design", "REST APIs", ...]
    email: { type: String },
    phone: { type: String },
    locationDetail: { type: String },
    languages: { type: String },
    nationality: { type: String },
    status: { type: String }, // "Open to Work" / "Employed"
    company: { type: String },
    companyRole: { type: String },
    companyMeta: { type: String },
    companyTechs: [String],
    githubUrl: { type: String },
    linkedinUrl: { type: String },
  },
  { timestamps: true }
);

// ── SKILLS MODEL ─────────────────────────────────────────────────────────────
const skillCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String },
    skills: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── PROJECT MODEL ─────────────────────────────────────────────────────────────
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    skills: [String],
    keyFeatures: [String],
    progress: { type: Number, default: 100 },
    status: { type: String, default: "Completed" },
    projectLink: { type: String, default: "" },
    githubLink: [String],
    featured: { type: Boolean, default: false },
    icon: { type: String, default: "💻" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── EDUCATION / TIMELINE MODEL ────────────────────────────────────────────────
const educationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["experience", "degree", "certification"], required: true },
    icon: { type: String },
    dotStyle: { type: String, enum: ["exp", "deg", "cert"], default: "deg" },
    yearRange: { type: String },          // "2024 – Present"
    title: { type: String, required: true },
    institution: { type: String },
    location: { type: String },
    employmentType: { type: String },          // "Full-time"
    cgpa: { type: String },
    chips: [String],
    isCurrent: { type: Boolean, default: false },
    certFile: { type: String },          // "/certificates/Convocation26.pdf"
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ── ADMIN MODEL ───────────────────────────────────────────────────────────────
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
export const Hero = mongoose.model("Hero", heroSchema);
export const About = mongoose.model("About", aboutSchema);
export const SkillCategory = mongoose.model("SkillCategory", skillCategorySchema);
export const Project = mongoose.model("Project", projectSchema);
export const Education = mongoose.model("Education", educationSchema);
export const Admin = mongoose.model("Admin", adminSchema);
