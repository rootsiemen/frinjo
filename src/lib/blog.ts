// Blog data model. Full article bodies live in blog-posts.ts (written separately).
// Content format: array of blocks.
//   - Plain string            -> paragraph
//   - "## Heading"            -> h2 section heading
//   - "- item"                -> bullet list item (consecutive items group into one list)
//   - "> quote"               -> highlighted callout/quote block

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // YYYY-MM-DD
  readTime: string; // e.g. "7 min read"
  category: string;
  content: string[];
}

export function getAllPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
