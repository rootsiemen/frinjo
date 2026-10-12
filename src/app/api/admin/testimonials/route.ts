import { NextRequest, NextResponse } from "next/server";
import { getDb, mapTestimonial, nowIso } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/testimonials — list all
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rows = await (await getDb()).prepare("SELECT * FROM testimonials ORDER BY id DESC").all();
  return NextResponse.json({ items: rows.map(mapTestimonial) });
}

// POST /api/admin/testimonials { name, text, rating }
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { name, text, rating } = await req.json();
  if (!name || !String(name).trim() || !text || !String(text).trim()) {
    return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
  }
  const r = Math.min(5, Math.max(1, Number(rating) || 5));
  const { lastInsertRowid } = await (await getDb()).prepare(
    "INSERT INTO testimonials (name, text, rating, created_at) VALUES (?, ?, ?, ?)"
  ).run(String(name).trim().slice(0, 200), String(text).trim().slice(0, 5000), r, nowIso());
  return NextResponse.json({ ok: true, id: lastInsertRowid });
}
