import { NextRequest, NextResponse } from "next/server";
import { requireCustomer } from "@/lib/customer-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

// PUT /api/auth/profile { name, whatsapp } — update logged-in customer's profile
export async function PUT(req: NextRequest) {
  const { customer, error } = await requireCustomer();
  if (error) return error;
  try {
    const { name, whatsapp } = await req.json();
    const cleanName = String(name || "").trim();
    const cleanWhatsapp = String(whatsapp || "").trim();
    if (cleanName.length < 2) return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
    if (!cleanWhatsapp) return NextResponse.json({ error: "Please enter your WhatsApp number" }, { status: 400 });

    await (await getDb()).prepare(
      "UPDATE customers SET name = ?, whatsapp = ? WHERE id = ?"
    ).run(cleanName, cleanWhatsapp, customer.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("profile update failed", e);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
