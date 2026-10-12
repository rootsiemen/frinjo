import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb, mapAdminUser } from "@/lib/db";
import { createSession, setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/admin/login { email, password }
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const row = await (await getDb()).prepare("SELECT * FROM admin_users WHERE email = ?").get(
      String(email || "").trim().toLowerCase()
    ) as Record<string, unknown> | undefined;
    if (!row) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    const admin = mapAdminUser(row);
    const ok = await bcrypt.compare(String(password || ""), admin.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = await createSession(admin.id);
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, name: admin.name });
  } catch (e) {
    console.error("login failed", e);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
