import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";
import { randomBytes, createHash } from "crypto";

export const dynamic = "force-dynamic";

const TOKEN_MINUTES = 15;

// POST /api/admin/forgot-password { resetKey } -> { ok, emails: [...] }
// POST /api/admin/forgot-password { resetKey, email } -> { ok, token }
export async function POST(req: NextRequest) {
  try {
    const { email, resetKey } = await req.json();
    const serverKey = process.env.ADMIN_RESET_KEY;

    if (!serverKey) {
      return NextResponse.json(
        { error: "Password reset is not set up on this site yet. Add ADMIN_RESET_KEY to the server environment first." },
        { status: 503 }
      );
    }
    if (!resetKey || String(resetKey) !== serverKey) {
      return NextResponse.json({ error: "Invalid reset key." }, { status: 401 });
    }

    const db = await getDb();

    // Step 1: no email yet — list admin emails so the owner can pick.
    if (!email) {
      const rows = await db.prepare("SELECT email FROM admin_users ORDER BY id").all() as { email: string }[];
      return NextResponse.json({ ok: true, emails: rows.map((r) => r.email) });
    }

    const row = await db
      .prepare("SELECT id FROM admin_users WHERE email = ?")
      .get(String(email).trim().toLowerCase()) as { id: number } | undefined;
    if (!row) {
      return NextResponse.json({ error: "No admin account found for that email." }, { status: 404 });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + TOKEN_MINUTES * 60 * 1000).toISOString();

    await db.prepare("DELETE FROM password_resets WHERE admin_user_id = ?").run(row.id);
    await db.prepare(
      "INSERT INTO password_resets (token_hash, admin_user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
    ).run(tokenHash, row.id, expiresAt, nowIso());

    return NextResponse.json({ ok: true, token });
  } catch (e) {
    console.error("forgot-password failed", e);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}
