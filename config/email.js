import nodemailer from "nodemailer";

// ── Transporter ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Email transporter error:", err.message);
  else console.log("✅ Email transporter ready");
});

// ── Owner Notification ────────────────────────────────────────────────────────
export const sendContactEmail = async ({ name, email, message }) => {
  const safeMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Message from ${name}`,
    text: `New Portfolio Message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f0f1a;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c6ff7,#5b4fcf);padding:28px 32px;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">New Portfolio Message</h2>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Someone reached out through your portfolio contact form.</p>
        </div>
        <div style="padding:28px 32px;background:#13131f;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);width:90px;vertical-align:top;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8888aa;font-weight:600;">Name</span>
              </td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                <span style="color:#f0f0f8;font-weight:600;font-size:14px;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);vertical-align:top;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8888aa;font-weight:600;">Email</span>
              </td>
              <td style="padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);">
                <a href="mailto:${email}" style="color:#a78bfa;text-decoration:none;font-size:14px;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;vertical-align:top;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#8888aa;font-weight:600;">Message</span>
              </td>
              <td style="padding:12px 0;">
                <p style="color:#f0f0f8;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${safeMessage}</p>
              </td>
            </tr>
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c6ff7,#5b4fcf);color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
              Reply to ${name} &rarr;
            </a>
          </div>
        </div>
        <div style="padding:16px 32px;background:#0a0a0f;text-align:center;">
          <p style="color:#5a5a7a;font-size:11px;margin:0;">Sent from your portfolio contact form</p>
        </div>
      </div>
    `,
  });
};

// ── Auto-Reply to Visitor ─────────────────────────────────────────────────────
export const sendAutoReply = async ({ name, email }) => {
  await transporter.sendMail({
    from: `"Vishal Sonwane" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    // Plain-text is critical — spam filters penalise HTML-only emails
    text: `Hey ${name},\n\nThanks for getting in touch! I've received your message and will get back to you within 24–48 hours.\n\nIn the meantime, feel free to connect:\nLinkedIn: https://linkedin.com/in/vishal-sonwane-48766b16a\nGitHub:   https://github.com/vishalsonwane951\n\n— Vishal Sonwane\nFull Stack Developer · Pune, India`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#0f0f1a;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c6ff7,#5b4fcf);padding:28px 32px;">
          <h2 style="color:#fff;margin:0;font-size:20px;font-weight:700;">Hey ${name}! 👋</h2>
          <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">Thanks for getting in touch.</p>
        </div>
        <div style="padding:28px 32px;background:#13131f;">
          <p style="color:#c4b5fd;font-size:15px;line-height:1.8;margin:0 0 16px;">
            I've received your message and will get back to you within
            <strong style="color:#a78bfa;">24–48 hours</strong>.
          </p>
          <p style="color:#8888aa;font-size:14px;line-height:1.7;margin:0 0 24px;">
            In the meantime, feel free to connect with me on LinkedIn or check out my projects on GitHub.
          </p>
          <!-- Social links — table-based for email client compatibility -->
          <table style="border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding-right:12px;">
                <a href="https://linkedin.com/in/vishal-sonwane-48766b16a"
                   style="display:inline-block;padding:10px 20px;background:rgba(124,111,247,0.15);border:1px solid rgba(124,111,247,0.3);color:#a78bfa;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
                  LinkedIn
                </a>
              </td>
              <td>
                <a href="https://github.com/vishalsonwane951"
                   style="display:inline-block;padding:10px 20px;background:rgba(124,111,247,0.15);border:1px solid rgba(124,111,247,0.3);color:#a78bfa;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
                  GitHub
                </a>
              </td>
            </tr>
          </table>
          <p style="color:#5a5a7a;font-size:13px;margin:0;">
            — Vishal Sonwane<br>
            <span style="color:#8888aa;">Full Stack Developer &middot; Pune, India</span>
          </p>
        </div>
        <div style="padding:16px 32px;background:#0a0a0f;text-align:center;">
          <p style="color:#5a5a7a;font-size:11px;margin:0;">This is an automated reply &middot; Please do not reply to this email</p>
        </div>
      </div>
    `,
  });
};