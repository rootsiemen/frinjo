import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";
import { sendSms, inquiryAlertSms, ownerNumber } from "@/lib/sms";

export const dynamic = "force-dynamic";

// POST /api/inquiries — public contact form submission
export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, package: pkg, message } = await req.json();
    if (!name || !email || !whatsapp || !message) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
    if (!emailOk) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const db = await getDb();
    const { lastInsertRowid } = await db.prepare(
      "INSERT INTO inquiries (name, email, whatsapp, package, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
    ).run(
      String(name).trim().slice(0, 200),
      String(email).trim().toLowerCase().slice(0, 200),
      String(whatsapp).trim().slice(0, 50),
      String(pkg || "").slice(0, 100),
      String(message).trim().slice(0, 5000),
      nowIso()
    );
    // SMS alert to the site owner (fire-and-forget; never blocks the form)
    void sendSms(
      ownerNumber(),
      inquiryAlertSms(String(name).trim(), String(whatsapp).trim(), String(message))
    ).catch(() => {});
    return NextResponse.json({ ok: true, id: lastInsertRowid });
  } catch (e) {
    console.error("inquiry failed", e);
    return NextResponse.json({ error: "Could not save your inquiry. Please try again." }, { status: 500 });
  }
}
