import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { createCustomerSession, setCustomerSessionCookie } from "@/lib/customer-auth";

export const dynamic = "force-dynamic";

// POST /api/auth/login { email, password }
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const row = await (await getDb()).prepare("SELECT * FROM customers WHERE email = ?").get(cleanEmail) as Record<string, unknown> | undefined;
    if (!row) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    const ok = await bcrypt.compare(String(password || ""), row.password_hash as string);
    if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    if (!row.email_verified) {
      return NextResponse.json(
        { error: "Please verify your email first. Check your inbox for the verification link.", needsVerification: true, email: cleanEmail },
        { status: 403 }
      );
    }

    const token = await createCustomerSession(row.id as number);
    await setCustomerSessionCookie(token);
    return NextResponse.json({ ok: true, name: row.name });
  } catch (e) {
    console.error("login failed", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
