import nodemailer from "nodemailer";

export function isEmailTransportConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.AUTH_EMAIL_FROM
  );
}

export type SendOtpResult = { mode: "sent" } | { mode: "dev_logged" } | { mode: "not_configured" };

export async function sendSignupOtpEmail(
  to: string,
  code: string
): Promise<SendOtpResult> {
  const subject = "Your Somali Procurement Portal verification code";
  const text = [
    "Hello,",
    "",
    `Your verification code is: ${code}`,
    "",
    "It expires in 15 minutes. If you didn’t request this, you can ignore this email.",
    "",
    "— Somali Procurement Portal",
  ].join("\n");

  const html = `
    <p>Hello,</p>
    <p>Your verification code is:</p>
    <p style="font-size:1.5rem;font-weight:700;letter-spacing:0.2em;">${code}</p>
    <p>It expires in 15 minutes. If you didn’t request this, you can ignore this email.</p>
    <p>— Somali Procurement Portal</p>
  `;

  if (!isEmailTransportConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("\n[signup-otp] (dev) to:", to, "code:", code, "\n");
      return { mode: "dev_logged" };
    }
    return { mode: "not_configured" };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.AUTH_EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  return { mode: "sent" };
}
