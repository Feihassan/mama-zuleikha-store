import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

let transporter;
if (SMTP_HOST && SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
} else {
  // Fallback: log emails to console in development
  transporter = null;
}

export async function sendEmail(to, subject, text, html) {
  if (!transporter) {
    console.log('Email (dev) ->', { to, subject, text, html });
    return Promise.resolve();
  }

  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html
  });
  return info;
}

export default sendEmail;
