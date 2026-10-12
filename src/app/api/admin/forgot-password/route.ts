import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";
import { sendEmail, siteUrl, wrap as emailWrap } from "@/lib/email";
import { randomBytes, createHash } from "crypto";

export const dynamic = "force-dynamic";

const TOKEN_MINUTES = 15;

const adminResetHtml = (link: string) =>
  emailWrap(
    "Reset your admin password",
    `<p style="color:#44403c">Hi,</p>
     <p style="color:#44403c">We got a request to reset your WebStore Pro <strong>admin</strong> password. Click below to choose a new one:</p>
     <p style="text-align:center;margin:24px 0"><a href="${link}" style="background:#052e1f;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:bold">Reset Password</a></p>
     <p style="color:#78716c;font-size:13px">Or paste this link in your browser:<br><a href="${link}">${link}</a></p>
     <p style="color:#78716c;font-size:13px">This link expires in 15 minutes. If you didn't ask for this, just ignore this email — your password won't change.</p>`
  );

// POST /api/admin/forgot-password
//
// New email-based flow (no reset key needed):
//   { email } -> { ok: true, emailSent: true|false, message }
//   Sends a reset link to the admin email via SMTP.
//
// Legacy reset-key fallback (kept for emergencies, e.g. SMTP down):
//   { resetKey } -> { ok: true, emails: [...] }
//   { resetKey, email } -> { ok: true, token }  (raw token, no email)
export async function POST(req: NextRequest) {
  try {
    const { email, resetKey } = await req.json();
    const serverKey = process.env.ADMIN_RESET_KEY;
    const db = await getDb();

    // ---- Legacy reset-key fallback (optional, not required) ----
    if (resetKey) {
      if (!serverKey || String(resetKey) !== serverKey) {
        return NextResponse.json({ error: "Invalid reset key." }, { status: 401 });
      }
      if (!email) {
        const rows = (await db.prepare("SELECT email FROM admin_users ORDER BY id").all()) as { email: string }[];
        return NextResponse.json({ ok: true, emails: rows.map((r) => r.email) });
      }
      const row = (await db
        .prepare("SELECT id FROM admin_users WHERE email = ?")
        .get(String(email).trim().toLowerCase())) as { id: number } | undefined;
      if (!row) {
        return NextResponse.json({ error: "No admin account found for that email." }, { status: 404 });
      }
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + TOKEN_MINUTES * 60 * 1000).toISOString();
      await db.prepare("DELETE FROM password_resets WHERE admin_user_id = ?").run(row.id);
      await db
        .prepare("INSERT INTO password_resets (token_hash, admin_user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
        .run(tokenHash, row.id, expiresAt, nowIso());
      return NextResponse.json({ ok: true, token });
    }

    // ---- Email-based flow (no reset key required) ----
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ error: "Please enter your admin email address." }, { status: 400 });
    }

    const row = (await db
      .prepare("SELECT id FROM admin_users WHERE email = ?")
      .get(cleanEmail)) as { id: number } | undefined;

    // Always respond the same way so we don't reveal which emails are admins.
    if (!row) {
      return NextResponse.json({
        ok: true,
        emailSent: false,
        message: "If this email belongs to an admin account, a reset link has been sent.",
      });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_MINUTES * 60 * 1000).toISOString();

    await db.prepare("DELETE FROM password_resets WHERE admin_user_id = ?").run(row.id);
    await db
      .prepare("INSERT INTO password_resets (token_hash, admin_user_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
      .run(tokenHash, row.id, expiresAt, nowIso());

    const link = `${siteUrl(req)}/admin/reset-password?token=${token}`;
    const emailSent = await sendEmail(cleanEmail, "Reset your WebStore Pro admin password", adminResetHtml(link));

    return NextResponse.json({
      ok: true,
      emailSent,
      // If SMTP isn't configured, hand the link back so the owner isn't locked out.
      ...(emailSent ? {} : { link }),
      message: emailSent
        ? "A reset link has been sent to your email. It expires in 15 minutes."
        : "Email is not configured on the server. Use the link below to reset.",
    });
  } catch (e) {
    console.error("forgot-password failed", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
