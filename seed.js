/**
 * seed.js — Run once to create the admin user and seed sample portfolio data.
 * Usage:  node src/seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {
  Admin,
  Hero,
  About,
  SkillCategory,
  Project,
  Education,
} from "./model/index.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── Admin ──────────────────────────────────────────────────────────────────
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 12);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashed });
    console.log("✅ Admin user created:", process.env.ADMIN_EMAIL);
  } else {
    console.log("ℹ️  Admin already exists — skipping");
  }

  // ── Hero ───────────────────────────────────────────────────────────────────
  await Hero.deleteMany();
  await Hero.create({
    name: "Vishal Sonwane",
    tagline: "Full Stack Developer — MERN & Python",
    subtitle:
      "I build scalable web applications and turn complex problems into elegant, performant solutions. Passionate about clean code, great UX, and continuous learning.",
    role: "Full Stack Developer",
    location: "Pune, India",
    available: true,
    photoUrl: "/photo1.jpg",
    company: "Tech Company",
    companyRole: "Software Engineer",
    companySince: "2024 – Present · Pune",
    techChips: ["MongoDB", "Express", "React", "Node.js", "Python"],
    stats: [
      { val: "6+", sup: "", lab: "Projects" },
      { val: "2", sup: "", lab: "Certifications" },
      { val: "1", sup: "yr", lab: "Experience" },
      { val: "10", sup: "+", lab: "Skills" },
    ],
  });
  console.log("✅ Hero seeded");

  // ── About ──────────────────────────────────────────────────────────────────
  await About.deleteMany();
  await About.create({
    bio: "Full Stack Developer based in Pune, India, specialising in the MERN stack and Python. I love crafting performant, accessible, and visually polished web experiences.",
    features: [
      "Responsive Design",
      "REST APIs",
      "Database Design",
      "Authentication & Auth",
      "Cloud Deployment",
      "Performance Optimisation",
    ],
    email: "vishal@example.com",
    phone: "+91 98765 43210",
    locationDetail: "Pune, Maharashtra, India",
    languages: "English, Hindi, Marathi",
    nationality: "Indian",
    status: "Open to Work",
    company: "Tech Company",
    companyRole: "Software Engineer",
    companyMeta: "Pune · Full-time · Jan 2024 – Present",
    companyTechs: ["React", "Node.js", "MongoDB", "AWS"],
    githubUrl: "https://github.com/vishalsonwane951",
    linkedinUrl: "https://linkedin.com/in/vishal-sonwane-48766b16a",
  });
  console.log("✅ About seeded");

  // ── Skills ─────────────────────────────────────────────────────────────────
  await SkillCategory.deleteMany();
  await SkillCategory.insertMany([
    { title: "Frontend",    icon: "🎨", order: 1, skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "JavaScript (ES6+)"] },
    { title: "Backend",     icon: "⚙️", order: 2, skills: ["Node.js", "Express.js", "Python", "REST APIs"] },
    { title: "Database",    icon: "🗄️", order: 3, skills: ["MongoDB", "Mongoose", "MySQL", "Redis"] },
    { title: "DevOps",      icon: "☁️", order: 4, skills: ["AWS (EC2, S3)", "Docker", "Git", "GitHub Actions"] },
    { title: "Tools",       icon: "🛠️", order: 5, skills: ["VS Code", "Postman", "Figma", "Jira"] },
  ]);
  console.log("✅ Skills seeded");

  // ── Projects ───────────────────────────────────────────────────────────────
  await Project.deleteMany();
  await Project.insertMany([
    {
      title: "Portfolio CMS",
      description: "A full-stack portfolio content management system with an admin panel, live API, and email notifications.",
      skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Nodemailer"],
      keyFeatures: ["JWT Authentication", "CRUD for all sections", "Email notifications", "Responsive admin UI"],
      progress: 100,
      status: "Completed",
      projectLink: "https://example.com",
      githubLink: ["https://github.com/vishalsonwane951/portfolio-backend"],
      featured: true,
      icon: "🗂️",
      order: 1,
    },
    {
      title: "E-Commerce Platform",
      description: "A scalable e-commerce web app with product listings, cart, checkout, and Stripe payments.",
      skills: ["React.js", "Node.js", "MongoDB", "Stripe API", "Tailwind CSS"],
      keyFeatures: ["Stripe Integration", "User Auth", "Order Tracking", "Admin Dashboard"],
      progress: 90,
      status: "In Progress",
      projectLink: "",
      githubLink: [],
      featured: true,
      icon: "🛒",
      order: 2,
    },
  ]);
  console.log("✅ Projects seeded");

  // ── Education ──────────────────────────────────────────────────────────────
  await Education.deleteMany();
  await Education.insertMany([
    {
      type: "experience",
      dotStyle: "exp",
      icon: "💼",
      yearRange: "2024 – Present",
      title: "Software Engineer",
      institution: "Tech Company",
      location: "Pune, India",
      employmentType: "Full-time",
      chips: ["React", "Node.js", "MongoDB"],
      isCurrent: true,
      order: 1,
    },
    {
      type: "degree",
      dotStyle: "deg",
      icon: "🎓",
      yearRange: "2020 – 2024",
      title: "B.E. Computer Engineering",
      institution: "Savitribai Phule Pune University",
      location: "Pune, India",
      cgpa: "8.5",
      chips: ["DSA", "OS", "DBMS", "CN"],
      isCurrent: false,
      order: 2,
    },
    {
      type: "certification",
      dotStyle: "cert",
      icon: "⚡",
      yearRange: "2023",
      title: "AWS Cloud Practitioner",
      institution: "Amazon Web Services",
      chips: ["AWS", "Cloud", "EC2", "S3"],
      isCurrent: false,
      certFile: "/certificates/aws-cloud-practitioner.pdf",
      order: 3,
    },
  ]);
  console.log("✅ Education seeded");

  console.log("\n🎉 Seed complete!");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
