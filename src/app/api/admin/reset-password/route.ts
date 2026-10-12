import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// POST /api/admin/reset-password { token, password }
export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    const pw = String(password || "");
    if (pw.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!token) {
      return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
    }

    const tokenHash = createHash("sha256").update(String(token)).digest("hex");
    const db = await getDb();
    const row = await db
      .prepare("SELECT admin_user_id, expires_at FROM password_resets WHERE token_hash = ?")
      .get(tokenHash) as { admin_user_id: number; expires_at: string } | undefined;

    if (!row || new Date(row.expires_at) < new Date()) {
      if (row) await db.prepare("DELETE FROM password_resets WHERE token_hash = ?").run(tokenHash);
      return NextResponse.json({ error: "Reset link expired. Please request a new one." }, { status: 401 });
    }

    const passwordHash = await bcrypt.hash(pw, 10);
    await db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(passwordHash, row.admin_user_id);
    await db.prepare("DELETE FROM password_resets WHERE token_hash = ?").run(tokenHash);
    // Log out all existing sessions so the old password stops working everywhere.
    await db.prepare("DELETE FROM sessions WHERE admin_user_id = ?").run(row.admin_user_id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password failed", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
