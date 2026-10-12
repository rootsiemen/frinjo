import { NextRequest, NextResponse } from "next/server";
import { getDb, mapBlogPost, nowIso } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { slugify, uniqueBlogSlug } from "@/lib/slug";

export const dynamic = "force-dynamic";

// GET /api/admin/blog-posts — list all (drafts + published)
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const rows = await (await getDb()).prepare("SELECT * FROM blog_posts ORDER BY id DESC").all();
  return NextResponse.json({ items: rows.map(mapBlogPost) });
}

// POST /api/admin/blog-posts { title, excerpt, category, content, status }
export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { title, excerpt, metaDescription, category, content, status } = await req.json();
  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const slug = await uniqueBlogSlug(slugify(String(title)));
  const st = status === "published" ? "published" : "draft";
  const { lastInsertRowid } = await (await getDb()).prepare(
    "INSERT INTO blog_posts (title, slug, excerpt, meta_description, category, content, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(
    String(title).trim().slice(0, 200),
    slug,
    String(excerpt || "").trim().slice(0, 500),
    String(metaDescription || "").trim().slice(0, 160),
    String(category || "General").trim().slice(0, 60),
    String(content || ""),
    st,
    nowIso()
  );
  return NextResponse.json({ ok: true, id: lastInsertRowid, slug });
}
