import { NextRequest, NextResponse } from "next/server";
import { getDb, mapPortfolioItem, nowIso } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/admin/portfolio — list all
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rows = await (await getDb()).prepare("SELECT * FROM portfolio_items ORDER BY id DESC").all();
  return NextResponse.json({ items: rows.map(mapPortfolioItem) });
}

// POST /api/admin/portfolio { title, description, image_url, link }
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { title, description, image_url, link } = await req.json();
  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const { lastInsertRowid } = await (await getDb()).prepare(
    "INSERT INTO portfolio_items (title, description, image_url, link, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(
    String(title).trim().slice(0, 200),
    String(description || "").trim().slice(0, 5000),
    String(image_url || "").trim().slice(0, 500),
    String(link || "").trim().slice(0, 500),
    nowIso()
  );
  return NextResponse.json({ ok: true, id: lastInsertRowid });
}
