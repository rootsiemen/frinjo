import { NextRequest, NextResponse } from "next/server";
import { getDb, nowIso } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/feedback { name, text, rating }
// Public endpoint: customer feedback goes in as "pending", shown only after admin approval.
export async function POST(req: NextRequest) {
  const { name, text, rating } = await req.json();
  if (!name || !String(name).trim() || !text || !String(text).trim()) {
    return NextResponse.json({ error: "Please share your name and feedback." }, { status: 400 });
  }
  const r = Math.min(5, Math.max(1, Number(rating) || 5));
  const { lastInsertRowid } = await (await getDb()).prepare(
    "INSERT INTO testimonials (name, text, rating, status, created_at) VALUES (?, ?, ?, 'pending', ?)"
  ).run(String(name).trim().slice(0, 200), String(text).trim().slice(0, 5000), r, nowIso());
  return NextResponse.json({ ok: true, id: lastInsertRowid });
}
