import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// PUT /api/admin/testimonials/[id] — accepts { name, text, rating } and/or { status }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const db = await getDb();

  // Status-only update (approve / hide feedback)
  if (body.status && !body.name && !body.text) {
    const st = body.status === "approved" ? "approved" : "pending";
    const { changes } = await db.prepare("UPDATE testimonials SET status = ? WHERE id = ?").run(st, Number(id));
    if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  }

  const { name, text, rating } = body;
  if (!name || !String(name).trim() || !text || !String(text).trim()) {
    return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
  }
  const r = Math.min(5, Math.max(1, Number(rating) || 5));
  const { changes } = await (await getDb()).prepare(
    "UPDATE testimonials SET name = ?, text = ?, rating = ? WHERE id = ?"
  ).run(String(name).trim().slice(0, 200), String(text).trim().slice(0, 5000), r, Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/testimonials/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { changes } = await (await getDb()).prepare("DELETE FROM testimonials WHERE id = ?").run(Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
