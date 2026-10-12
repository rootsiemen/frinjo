import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, nowIso } from "@/lib/db";
import { sendEmail, siteUrl, verifyEmailHtml, isEmailConfigured } from "@/lib/email";
import { randomBytes, createHash } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/auth/signup { name, email, password, whatsapp? }
// Creates an UNVERIFIED customer and emails a verification link.
export async function POST(req: NextRequest) {
  try {
    const { name, email, password, whatsapp } = await req.json();
    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "");
    const cleanWhatsapp = String(whatsapp || "").trim() || "";

    if (cleanName.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return NextResponse.json({ error: "Please enter a valid email" }, { status: 400 });
    if (cleanPass.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    const db = await getDb();
    const existing = await db.prepare("SELECT id, email_verified, name FROM customers WHERE email = ?").get(cleanEmail) as
      | { id: number; email_verified: number; name: string } | undefined;

    const issueToken = async (customerId: number, displayName: string) => {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await db.prepare("UPDATE customers SET verify_token_hash = ?, verify_expires_at = ? WHERE id = ?").run(tokenHash, expiresAt, customerId);
      return token;
    };
    const mailLink = async (customerId: number, displayName: string) => {
      const token = await issueToken(customerId, displayName);
      const link = `${siteUrl(req)}/verify-email?token=${token}`;
      const sent = await sendEmail(cleanEmail, "Verify your WebStore Pro email", verifyEmailHtml(displayName || "there", link));
      return { sent, link };
    };

    if (existing) {
      if (existing.email_verified) {
        return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
      }
      // Unverified duplicate: resend a fresh verification link instead of erroring.
      const { sent } = await mailLink(existing.id, existing.name);
      return NextResponse.json({ ok: true, needsVerification: true, emailSent: sent });
    }

    const hash = await bcrypt.hash(cleanPass, 10);

    // If the server can't send email (no SMTP), don't trap the customer —
    // verify immediately, exactly like the old behavior.
    if (!isEmailConfigured()) {
      const result = await db.prepare(
        "INSERT INTO customers (name, email, password_hash, whatsapp, email_verified, created_at) VALUES (?, ?, ?, ?, 1, ?)"
      ).run(cleanName, cleanEmail, hash, cleanWhatsapp, nowIso());
      const customerId = Number((result as { lastInsertRowid: number }).lastInsertRowid);
      const { createCustomerSession, setCustomerSessionCookie } = await import("@/lib/customer-auth");
      const token = await createCustomerSession(customerId);
      await setCustomerSessionCookie(token);
      console.log("[auth] SMTP not configured — customer auto-verified:", cleanEmail);
      return NextResponse.json({ ok: true, name: cleanName });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const result = await db.prepare(
      "INSERT INTO customers (name, email, password_hash, whatsapp, email_verified, verify_token_hash, verify_expires_at, created_at) VALUES (?, ?, ?, ?, 0, ?, ?, ?)"
    ).run(cleanName, cleanEmail, hash, cleanWhatsapp, tokenHash, expiresAt, nowIso());
    void result;

    const link = `${siteUrl(req)}/verify-email?token=${token}`;
    const sent = await sendEmail(cleanEmail, "Verify your WebStore Pro email", verifyEmailHtml(cleanName, link));

    // NOTE: no session cookie — the customer must verify email first.
    return NextResponse.json({ ok: true, needsVerification: true, emailSent: sent });
  } catch (e) {
    console.error("signup failed", e);
    return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
  }
}
