import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";
import { sendEmail, siteUrl, resetPasswordHtml } from "@/lib/email";
import { randomBytes, createHash } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/auth/forgot-password { email } — always returns ok (no account leaking).
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail) return NextResponse.json({ error: "Email required." }, { status: 400 });

    const db = await getDb();
    const row = await db.prepare("SELECT id, name FROM customers WHERE email = ?").get(cleanEmail) as
      | { id: number; name: string } | undefined;
    if (row) {
      const token = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      await db.prepare("DELETE FROM customer_password_resets WHERE customer_id = ?").run(row.id);
      await db.prepare(
        "INSERT INTO customer_password_resets (token_hash, customer_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
      ).run(tokenHash, row.id, expiresAt, nowIso());
      const link = `${siteUrl(req)}/reset-password?token=${token}`;
      const sent = await sendEmail(cleanEmail, "Reset your Frinjo password", resetPasswordHtml(row.name || "there", link));
      return NextResponse.json({ ok: true, emailSent: sent });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("forgot-password failed", e);
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
