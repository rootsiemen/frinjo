import Link from "next/link";
import { getDb, mapPortfolioItem } from "@/lib/db";
import { Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

/** Category eyebrow + highlight chips per project, derived from title. */
function projectMeta(title: string): { category: string; chips: string[] } {
  const t = title.toLowerCase();
  if (t.includes("qomash"))
    return { category: "Fashion Ecommerce", chips: ["Next.js", "Turso", "Cloudinary", "Google login"] };
  if (t.includes("babli"))
    return { category: "Fashion Ecommerce", chips: ["AI chatbot", "Blog", "Newsletter", "COD"] };
  if (t.includes("temp mail"))
    return { category: "Web App", chips: ["Next.js", "Cloudflare Workers", "Real-time inbox"] };
  if (t.includes("playzone") || t.includes("play zone"))
    return { category: "Gaming Portal", chips: ["12 games", "Touch support", "SEO"] };
  if (t.includes("libaas"))
    return { category: "Garments Ecommerce", chips: ["COD", "JazzCash", "WhatsApp checkout"] };
  if (t.includes("portfolio"))
    return { category: "Developer Portfolio", chips: ["Open source", "Case studies"] };
  return { category: "Website", chips: ["Responsive", "SEO"] };
}

export default async function PortfolioPage() {
  const db = await getDb();
  const items = (await db.prepare("SELECT * FROM portfolio_items ORDER BY id DESC").all()).map(mapPortfolioItem);
  const featured = items[0];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-orange-50 dot-grid py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-4">Portfolio</p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight">
                Websites I&apos;ve built
              </h1>
              <p className="mt-5 text-lg text-stone-600 max-w-xl leading-relaxed">
                Real projects for real clients — each one designed, built and launched end to end.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#work" className={btnPrimary}>
                  View selected work <Icon name="arrow" className="w-5 h-5" />
                </a>
                <Link href="/contact" className={btnOutline}>
                  Discuss your website
                </Link>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Available for new client projects
              </p>
            </div>

            {/* Featured project card */}
            {featured && (
              <a
                href={featured.link || "#work"}
                target={featured.link ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative rounded-3xl overflow-hidden border border-orange-200 bg-white shadow-xl shadow-orange-900/10 hover:shadow-2xl transition-shadow"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  {featured.imageUrl ? (
                    <img
                      src={featured.imageUrl}
                      alt={`${featured.title} website screenshot`}
                      className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 grid place-items-center">
                      <span className="font-display text-7xl font-bold text-white/40">{featured.title.charAt(0)}</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 rounded-full bg-black/45 text-white text-xs font-semibold px-3 py-1.5 backdrop-blur">
                    {featured.title} — live store
                  </span>
                </div>
                <div className="p-6">
                  <p className="font-display text-xl font-bold text-stone-900">Built to sell</p>
                  <p className="mt-2 text-sm text-stone-500">Mobile-first · Fast · Easy to manage</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── Selected work ────────────────────────────────── */}
      <section id="work" className="py-16 sm:py-24 bg-white scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">01 — Selected work</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Live builds, shipped end to end.
            </h2>
            <p className="mt-4 text-stone-600">
              Fashion ecommerce, garments retail, web apps and gaming portals — every build ships
              mobile-first, with the admin tools and payment options a real business needs.
            </p>
          </div>

          {items.length === 0 ? (
            <p className="text-center text-stone-500 py-16">Portfolio items coming soon.</p>
          ) : (
            <div className="space-y-16 sm:space-y-24">
              {items.map((p, i) => {
                const meta = projectMeta(p.title);
                const num = String(i + 1).padStart(2, "0");
                const flip = i % 2 === 1;
                return (
                  <article key={p.id} className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                    {/* Screenshot */}
                    <div className={`relative ${flip ? "lg:order-2" : ""}`}>
                      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg shadow-stone-900/5 bg-stone-100">
                        <div className="relative aspect-[16/10] overflow-hidden group">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={`${p.title} website screenshot`}
                              className="absolute inset-0 h-full w-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-700 grid place-items-center">
                              <span className="font-display text-7xl font-bold text-white/40">{p.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="absolute -top-3 left-6 rounded-full bg-orange-600 text-white text-xs font-bold px-3 py-1 shadow">
                        {num}
                      </span>
                    </div>

                    {/* Details */}
                    <div className={flip ? "lg:order-1" : ""}>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                        {num} / {meta.category}
                      </p>
                      <h3 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-stone-900">{p.title}</h3>
                      <p className="mt-4 text-stone-600 leading-relaxed">{p.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {meta.chips.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-700 hover:text-orange-900 hover:gap-3 transition-all"
                        >
                          View Live Site <Icon name="arrow" className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-orange-50 border border-orange-200 p-10 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">Your project could be next.</h2>
            <p className="mt-3 text-stone-600">Tell me what you want to sell — I&apos;ll handle the rest.</p>
            <Link href="/contact" className={`${btnPrimary} mt-6`}>
              Get a Free Quote <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
