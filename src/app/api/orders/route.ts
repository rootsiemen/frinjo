import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";
import { getCustomer } from "@/lib/customer-auth";
import { PACKAGES, PAYMENTS } from "@/lib/content";
import { sendSms, orderConfirmationSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

// POST /api/orders — public checkout submission
export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, package: pkg, payMethod, txnId, note } = await req.json();
    if (!name || !email || !whatsapp || !pkg || !payMethod || !txnId) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    if (!emailOk) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const pkgDef = PACKAGES.find(
      (p) => p.name.toLowerCase().replace(/\s+website$/, "") === String(pkg).toLowerCase()
        || p.name.toLowerCase() === String(pkg).toLowerCase()
    );
    if (!pkgDef) {
      return NextResponse.json({ error: "Invalid package selected." }, { status: 400 });
    }
    const payDef = PAYMENTS.find((p) => p.id === String(payMethod));
    if (!payDef) {
      return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
    }
    const db = await getDb();
    const customer = await getCustomer();
    const { lastInsertRowid } = await db.prepare(
      "INSERT INTO orders (name, email, whatsapp, package, amount, pay_method, txn_id, note, status, customer_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)"
    ).run(
      String(name).trim().slice(0, 200),
      String(email).trim().toLowerCase().slice(0, 200),
      String(whatsapp).trim().slice(0, 50),
      pkgDef.name,
      pkgDef.price,
      payDef.id,
      String(txnId).trim().slice(0, 200),
      String(note || "").trim().slice(0, 2000),
      customer ? customer.id : 0,
      nowIso()
    );
    // SMS confirmation to the customer (fire-and-forget; never blocks checkout)
    void sendSms(
      String(whatsapp),
      orderConfirmationSms(String(name).trim(), lastInsertRowid, pkgDef.name, pkgDef.price)
    ).catch(() => {});
    return NextResponse.json({ ok: true, id: lastInsertRowid });
  } catch (e) {
    console.error("order failed", e);
    return NextResponse.json({ error: "Could not place your order. Please try again." }, { status: 500 });
  }
}
