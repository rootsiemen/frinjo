// Email sending via SMTP (nodemailer). Configure on the server:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// If not configured, emails are logged to the console (dev fallback) and the
// API reports emailSent: false so the UI can show the link manually.
import nodemailer from "nodemailer";

function getConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user, pass },
    from: process.env.SMTP_FROM || user,
  };
}

export function isEmailConfigured(): boolean {
  return getConfig() !== null;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) {
    const links = [...html.matchAll(/https?:\/\/[^\s"']+/g)].map((m) => m[0]);
    console.log(`[email:dev] To: ${to} | Subject: ${subject} | Links: ${[...new Set(links)].join(" ")}`);
    return false;
  }
  try {
    const transport = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    });
    await transport.sendMail({ from: cfg.from, to, subject, html });
    return true;
  } catch (e) {
    console.error("sendEmail failed", e);
    return false;
  }
}

export function siteUrl(req?: { headers: { get: (k: string) => string | null } }): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/$/, "");
  try {
    const host = req?.headers.get("x-forwarded-host") || req?.headers.get("host");
    const proto = req?.headers.get("x-forwarded-proto") || "https";
    if (host) return `${proto}://${host}`;
  } catch { /* ignore */ }
  return "https://frinjo.me";
}

const wrap = (title: string, body: string) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden">
  <div style="background:#052e1f;padding:28px;text-align:center">
    <div style="display:inline-block;background:linear-gradient(135deg,#fcd34d,#d97706);color:#052e1f;font-weight:bold;font-size:22px;width:48px;height:48px;line-height:48px;border-radius:14px">W</div>
    <div style="color:#fff;font-size:20px;font-weight:bold;margin-top:10px">WebStore Pro</div>
  </div>
  <div style="padding:28px;background:#fff">
    <h2 style="color:#1c1917;margin:0 0 12px">${title}</h2>
    ${body}
  </div>
  <div style="padding:16px;text-align:center;color:#78716c;font-size:12px">Websites that sell — WebStore Pro</div>
</div>`;

export const verifyEmailHtml = (name: string, link: string) =>
  wrap(
    "Verify your email",
    `<p style="color:#44403c">Hi ${name},</p>
     <p style="color:#44403c">Thanks for creating your WebStore Pro account! Please confirm your email address by clicking the button below:</p>
     <p style="text-align:center;margin:24px 0"><a href="${link}" style="background:#052e1f;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:bold">Verify Email</a></p>
     <p style="color:#78716c;font-size:13px">Or paste this link in your browser:<br><a href="${link}">${link}</a></p>
     <p style="color:#78716c;font-size:13px">This link expires in 24 hours. If you didn't create this account, just ignore this email.</p>`
  );

export const resetPasswordHtml = (name: string, link: string) =>
  wrap(
    "Reset your password",
    `<p style="color:#44403c">Hi ${name},</p>
     <p style="color:#44403c">We got a request to reset your WebStore Pro password. Click below to choose a new one:</p>
     <p style="text-align:center;margin:24px 0"><a href="${link}" style="background:#052e1f;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:bold">Reset Password</a></p>
     <p style="color:#78716c;font-size:13px">Or paste this link in your browser:<br><a href="${link}">${link}</a></p>
     <p style="color:#78716c;font-size:13px">This link expires in 1 hour. If you didn't ask for this, just ignore this email — your password won't change.</p>`
  );
