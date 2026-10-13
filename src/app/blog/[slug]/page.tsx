import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb, mapBlogPost } from "@/lib/db";
import { BRAND } from "@/lib/content";
import { Icon, btnPrimary, btnOutline } from "@/components/ui";
import BlogContent from "@/components/BlogContent";
import { formatDate } from "@/lib/blog";

export const dynamic = "force-dynamic";

const SITE_URL = "https://frinjo.me";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'").get(slug);
  if (!row) return {};
  const post = mapBlogPost(row);
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
  if (!row) notFound();
  const post = mapBlogPost(row);

  let blocks: string[];
  try {
    const parsed = JSON.parse(post.content);
    blocks = Array.isArray(parsed) ? parsed.map(String) : post.content.split("\n");
  } catch {
    blocks = post.content.split("\n");
  }

  const allOthers = (await db
    .prepare("SELECT * FROM blog_posts WHERE status = 'published' AND id != ?")
    .all(post.id))
    .map(mapBlogPost);

  // --- Internal backlinks: pick topically related posts (category + keyword overlap) ---
  const STOP = new Set("a,an,the,and,or,for,to,in,on,of,with,how,what,why,when,your,you,your,vs,is,are,be,by,from,at,as,it,its,this,that,these,those,into,top,ways,guide,tips,pakistan,pakistani".split(","));
  const keywords = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  const postKeys = new Set(keywords(post.title + " " + post.category));
  const scored = allOthers.map((o) => {
    let score = 0;
    if (o.category && post.category && o.category.toLowerCase() === post.category.toLowerCase()) score += 5;
    const oKeys = keywords(o.title + " " + o.category);
    for (const k of oKeys) if (postKeys.has(k)) score += 1;
    return { post: o, score };
  });
  scored.sort((a, b) => b.score - a.score || b.post.id - a.post.id);
  const related = scored.slice(0, 2).map((s) => s.post);
  const others = scored.slice(0, 3).map((s) => s.post);

  // Category-matched service page backlink
  const cat = (post.category || "").toLowerCase() + " " + post.title.toLowerCase();
  let serviceLink = { href: "/services", label: "Our website services" };
  if (/payment|jazzcash|easypaisa|checkout|binance/.test(cat)) serviceLink = { href: "/services/payment-integration", label: "Payment integration service" };
  else if (/whatsapp/.test(cat)) serviceLink = { href: "/services/whatsapp-ordering", label: "WhatsApp ordering setup" };
  else if (/seo|rank|google/.test(cat)) serviceLink = { href: "/services/seo-basics", label: "SEO services" };
  else if (/ecommerce|shopify|store|shop|online selling/.test(cat)) serviceLink = { href: "/services/ecommerce-website", label: "Ecommerce website service" };
  else if (/speed|performance/.test(cat)) serviceLink = { href: "/services/business-website", label: "Business website service" };

  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I read your blog and I'd like a website for my business.")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    datePublished: post.createdAt,
    author: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
    publisher: { "@type": "Organization", name: BRAND.name, url: SITE_URL },
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

          {(related.length > 0) && (
            <div className="mt-10 rounded-2xl border border-stone-200 bg-stone-50 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-4">Related guides</p>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link href={`/blog/${r.slug}`} className="group inline-flex items-start gap-2 text-stone-800 hover:text-orange-700 transition font-medium leading-snug">
                      <span className="text-orange-500 font-bold shrink-0 mt-0.5">→</span>
                      <span className="group-hover:underline">{r.title}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href={serviceLink.href} className="group inline-flex items-start gap-2 text-stone-800 hover:text-orange-700 transition font-medium leading-snug">
                    <span className="text-orange-500 font-bold shrink-0 mt-0.5">→</span>
                    <span className="group-hover:underline">Need help with this? See our {serviceLink.label}</span>
                  </Link>
                </li>
              </ul>
            </div>
          )}

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
