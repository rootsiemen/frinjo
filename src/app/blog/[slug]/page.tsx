import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb, mapBlogPost } from "@/lib/db";
import { BRAND } from "@/lib/content";
import { Icon, btnPrimary, btnOutline } from "@/components/ui";
import BlogContent from "@/components/BlogContent";
import { formatDate } from "@/lib/blog";
import { REPO_POSTS } from "@/lib/repo-posts";

export const dynamic = "force-dynamic";

const SITE_URL = "https://frinjo.me";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'").get(slug);
  // Repo-shipped posts (git-push publishing) as fallback.
  const post = row ? mapBlogPost(row) : REPO_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  const description = post.metaDescription || post.excerpt;
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} — ${BRAND.name} Blog`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      siteName: BRAND.name,
      publishedTime: post.createdAt,
      authors: [BRAND.name],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  return `${Math.max(2, Math.round(words / 200))} min read`;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'").get(slug);
  // Repo-shipped posts (git-push publishing) as fallback.
  const post = row ? mapBlogPost(row) : REPO_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  let blocks: string[];
  try {
    const parsed = JSON.parse(post.content);
    blocks = Array.isArray(parsed) ? parsed.map(String) : post.content.split("\n");
  } catch {
    blocks = post.content.split("\n");
  }

  const others = (await db
    .prepare("SELECT * FROM blog_posts WHERE status = 'published' AND id != ? ORDER BY id DESC LIMIT 3")
    .all(post.id))
    .map(mapBlogPost);

  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I read your blog and I'd like a website for my business.")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: `${SITE_URL}/logo-w.png`,
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    inLanguage: "en",
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    author: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: BRAND.name,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo-w.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-orange-50 dot-grid py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-orange-600 transition mb-6">
            ← All articles
          </Link>
          <div className="flex items-center gap-3 text-xs mb-4">
            <span className="font-bold uppercase tracking-wider text-orange-950 bg-orange-400 rounded-full px-3 py-1">{post.category}</span>
            <span className="text-stone-500">{formatDate(post.createdAt.slice(0, 10))} · {estimateReadTime(post.content)}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg text-stone-600 leading-relaxed">{post.excerpt}</p>}
        </div>
      </section>

      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <BlogContent blocks={blocks} />

          <div className="mt-14 rounded-3xl bg-orange-50 border border-orange-200 p-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Need a website?</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mb-4">Let's build yours — in days, not months.</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link href="/pricing" className={btnPrimary}>
                See Packages <Icon name="arrow" className="w-5 h-5" />
              </Link>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                <Icon name="chat" className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </article>

      {others.length > 0 && (
        <section className="py-14 bg-stone-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-8">Keep reading</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {others.map((o) => (
                <Link key={o.id} href={`/blog/${o.slug}`} className="rounded-3xl border border-stone-200 bg-white p-6 hover:shadow-xl hover:border-orange-200 transition group">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">{o.category}</span>
                  <h3 className="font-display text-lg font-bold text-stone-900 mt-2 group-hover:text-orange-800 transition leading-snug">{o.title}</h3>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-orange-800">
                    Read <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
