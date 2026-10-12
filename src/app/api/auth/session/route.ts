import { NextResponse } from "next/server";
import { clearCustomerSessionCookie, getCustomer } from "@/lib/customer-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/auth/logout
export async function POST() {
  const customer = await getCustomer();
  if (customer) {
    try {
      const { cookies } = await import("next/headers");
      const token = (await cookies()).get("customer_session")?.value;
      if (token) await (await getDb()).prepare("DELETE FROM customer_sessions WHERE token = ?").run(token);
    } catch { /* best-effort */ }
  }
  await clearCustomerSessionCookie();
  return NextResponse.json({ ok: true });
}

// GET /api/auth/me — current customer or 401
export async function GET() {
  const customer = await getCustomer();
  if (!customer) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  return NextResponse.json({ customer });
}
