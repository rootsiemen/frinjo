import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { sendEmail, siteUrl, verifyEmailHtml } from "@/lib/email";
import { randomBytes, createHash } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/auth/resend-verification { email }
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) return NextResponse.json({ error: "Email required." }, { status: 400 });

    const db = await getDb();
    const row = await db.prepare("SELECT id, name, email_verified FROM customers WHERE email = ?").get(cleanEmail) as
      | { id: number; name: string; email_verified: number } | undefined;

    // Always return ok to avoid leaking which emails are registered.
    if (!row || row.email_verified) return NextResponse.json({ ok: true });

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await db.prepare("UPDATE customers SET verify_token_hash = ?, verify_expires_at = ? WHERE id = ?").run(tokenHash, expiresAt, row.id);

    const link = `${siteUrl(req)}/verify-email?token=${token}`;
    const sent = await sendEmail(cleanEmail, "Verify your Frinjo email", verifyEmailHtml(row.name || "there", link));
    return NextResponse.json({ ok: true, emailSent: sent });
  } catch (e) {
    console.error("resend-verification failed", e);
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
