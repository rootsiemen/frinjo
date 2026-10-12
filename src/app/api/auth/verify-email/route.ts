import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createHash } from "crypto";
import { createCustomerSession, setCustomerSessionCookie } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

// POST /api/auth/verify-email { token }
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

    const tokenHash = createHash("sha256").update(String(token)).digest("hex");
    const db = await getDb();
    const row = await db.prepare(
      "SELECT id, name, verify_expires_at, email_verified FROM customers WHERE verify_token_hash = ?"
    ).get(tokenHash) as
      | { id: number; name: string; verify_expires_at: string; email_verified: number }
      | undefined;

    if (!row) return NextResponse.json({ error: "Invalid verification link." }, { status: 400 });
    if (row.email_verified) return NextResponse.json({ ok: true, already: true, name: row.name });
    if (row.verify_expires_at && new Date(row.verify_expires_at) < new Date()) {
      return NextResponse.json({ error: "Verification link expired. Please request a new one.", expired: true }, { status: 400 });
    }

    await db.prepare(
      "UPDATE customers SET email_verified = 1, verify_token_hash = NULL, verify_expires_at = NULL WHERE id = ?"
    ).run(row.id);

    // Auto sign-in after successful verification.
    const sessionToken = await createCustomerSession(row.id);
    await setCustomerSessionCookie(sessionToken);
    return NextResponse.json({ ok: true, name: row.name });
  } catch (e) {
    console.error("verify-email failed", e);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
