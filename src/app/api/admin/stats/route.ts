import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/stats — dashboard counts
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const db = await getDb();
  const count = async (table: string) =>
    ((await db.prepare(`SELECT COUNT(*) AS c FROM ${table}`).get()) as { c: number }).c;
  const newInquiries = (
    await db.prepare("SELECT COUNT(*) AS c FROM inquiries WHERE status = 'new'").get() as { c: number }
  ).c;
  const pendingOrders = (
    await db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending'").get() as { c: number }
  ).c;
  const paidRevenue = (
    await db.prepare("SELECT COALESCE(SUM(amount), 0) AS s FROM orders WHERE status = 'paid'").get() as { s: number }
  ).s;
  return NextResponse.json({
    inquiries: await count("inquiries"),
    newInquiries,
    portfolio: await count("portfolio_items"),
    testimonials: await count("testimonials"),
    orders: await count("orders"),
    pendingOrders,
    paidRevenue,
  });
}
