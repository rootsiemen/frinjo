import Link from "next/link";
import { getDb, mapPortfolioItem } from "@/lib/db";
import { Icon, btnPrimary } from "@/components/ui";

export const dynamic = "force-dynamic";

const HUES = [
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-orange-700",
  "from-teal-500 to-emerald-700",
  "from-stone-400 to-stone-600",
];

export default async function PortfolioPage() {
  const db = await getDb();
  const items = (await db.prepare("SELECT * FROM portfolio_items ORDER BY id DESC").all()).map(mapPortfolioItem);

  return (
    <>
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">Portfolio</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Websites I've built</h1>
          <p className="mt-4 text-stone-600 max-w-2xl">Real projects for real clients — each one designed, built and launched end to end.</p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          {items.length === 0 ? (
            <p className="text-center text-stone-500 py-16">Portfolio items coming soon.</p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {items.map((p, i) => (
                <article key={p.id} className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-xl transition">
                  <div className={`h-56 bg-gradient-to-br ${HUES[i % HUES.length]} relative grid place-items-center`}>
                    <span className="font-display text-7xl font-bold text-white/40">{p.title.charAt(0)}</span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/40 text-white text-xs font-semibold px-3 py-1.5 backdrop-blur">
                      Case study #{items.length - i}
                    </span>
                  </div>
                  <div className="p-8">
                    <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">{p.title}</h2>
                    <p className="text-stone-600 leading-relaxed mb-6">{p.description}</p>
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-900">
                        Visit live site <Icon name="arrow" className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="mt-14 rounded-3xl bg-emerald-50 border border-emerald-200 p-10 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">Your project could be next.</h2>
            <p className="mt-3 text-stone-600">Tell me what you want to sell — I'll handle the rest.</p>
            <Link href="/contact" className={`${btnPrimary} mt-6`}>Get a Free Quote <Icon name="arrow" className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
