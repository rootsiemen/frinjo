import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/auth/reset-password { token, password }
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const pw = String(password || "");
    if (pw.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

    const tokenHash = createHash("sha256").update(String(token)).digest("hex");
    const db = await getDb();
    const row = await db.prepare(
      "SELECT customer_id, expires_at FROM customer_password_resets WHERE token_hash = ?"
    ).get(tokenHash) as { customer_id: number; expires_at: string } | undefined;

    if (!row || new Date(row.expires_at) < new Date()) {
      if (row) await db.prepare("DELETE FROM customer_password_resets WHERE token_hash = ?").run(tokenHash);
      return NextResponse.json({ error: "This link expired. Please request a new one." }, { status: 400 });
    }

    const hash = await bcrypt.hash(pw, 10);
    await db.prepare("UPDATE customers SET password_hash = ? WHERE id = ?").run(hash, row.customer_id);
    await db.prepare("DELETE FROM customer_password_resets WHERE token_hash = ?").run(tokenHash);
    await db.prepare("DELETE FROM customer_sessions WHERE customer_id = ?").run(row.customer_id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password failed", e);
    return NextResponse.json({ error: "Request failed." }, { status: 500 });
  }
}
