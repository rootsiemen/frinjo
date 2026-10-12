import { NextRequest, NextResponse } from "next/server";
import { getDb, mapBlogPost } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify, uniqueBlogSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

// GET /api/admin/blog-posts/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const row = await (await getDb()).prepare("SELECT * FROM blog_posts WHERE id = ?").get(Number(id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item: mapBlogPost(row) });
}

// PUT /api/admin/blog-posts/[id] { title, excerpt, category, content, status }
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { title, excerpt, metaDescription, category, content, status } = await req.json();
  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const db = await getDb();
  const existing = await db.prepare("SELECT slug FROM blog_posts WHERE id = ?").get(Number(id)) as { slug: string } | undefined;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const newSlugBase = slugify(String(title));
  const slug = await uniqueBlogSlug(newSlugBase, Number(id));
  const st = status === "published" ? "published" : "draft";
  await db.prepare(
    "UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, meta_description = ?, category = ?, content = ?, status = ? WHERE id = ?"
  ).run(
    String(title).trim().slice(0, 200),
    slug,
    String(excerpt || "").trim().slice(0, 500),
    String(metaDescription || "").trim().slice(0, 160),
    String(category || "General").trim().slice(0, 60),
    String(content || ""),
    st,
    Number(id)
  );
  return NextResponse.json({ ok: true, slug });
}

// DELETE /api/admin/blog-posts/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const { changes } = await (await getDb()).prepare("DELETE FROM blog_posts WHERE id = ?").run(Number(id));
  if (!changes) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
