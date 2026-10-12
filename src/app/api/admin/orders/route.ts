import { NextResponse } from "next/server";
import { getDb, mapOrder } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/orders — list all, newest first
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rows = await (await getDb()).prepare("SELECT * FROM orders ORDER BY id DESC").all();
  return NextResponse.json({ orders: rows.map(mapOrder) });
}
