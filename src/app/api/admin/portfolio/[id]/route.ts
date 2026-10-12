import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT /api/admin/portfolio/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { title, description, image_url, link } = await req.json();
  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const { changes } = await (await getDb()).prepare(
    "UPDATE portfolio_items SET title = ?, description = ?, image_url = ?, link = ? WHERE id = ?"
  ).run(
    String(title).trim().slice(0, 200),
    String(description || "").trim().slice(0, 5000),
    String(image_url || "").trim().slice(0, 500),
    String(link || "").trim().slice(0, 500),
    Number(id)
  );
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/portfolio/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { changes } = await (await getDb()).prepare("DELETE FROM portfolio_items WHERE id = ?").run(Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
