import { NextResponse } from "next/server";
import { getDb, mapInquiry } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/inquiries — list all, newest first
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rows = await (await getDb()).prepare("SELECT * FROM inquiries ORDER BY id DESC").all();
  return NextResponse.json({ inquiries: rows.map(mapInquiry) });
}
