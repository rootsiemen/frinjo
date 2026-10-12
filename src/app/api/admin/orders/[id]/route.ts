import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendSms, orderStatusSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "paid", "cancelled"];

// PATCH /api/admin/orders/[id] { status } — update status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { status } = await req.json();
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const db = await getDb();
  const { changes } = await db
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(status, Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // SMS the customer about the status change (fire-and-forget)
  const order = await db
    .prepare("SELECT name, whatsapp FROM orders WHERE id = ?")
    .get(Number(id)) as { name: string; whatsapp: string } | undefined;
  if (order?.whatsapp) {
    void sendSms(order.whatsapp, orderStatusSms(order.name, id, status)).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/orders/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { changes } = await (await getDb()).prepare("DELETE FROM orders WHERE id = ?").run(Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
