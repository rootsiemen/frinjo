import { getDb } from "./db";

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

/** Returns a slug that doesn't collide with existing posts (optionally excluding one id). */
export async function uniqueBlogSlug(base: string, excludeId?: number): Promise<string> {
  const db = await getDb();
  let slug = base;
  let n = 2;
  for (;;) {
    const row = await db.prepare("SELECT id FROM blog_posts WHERE slug = ?").get(slug) as { id: number } | undefined;
    if (!row || (excludeId && row.id === excludeId)) return slug;
    slug = `${base}-${n++}`;
  }
}
