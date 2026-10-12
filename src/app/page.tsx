import Link from "next/link";
import { BRAND, FAQS, SERVICES } from "@/lib/content";
import { getDb, mapPortfolioItem, mapTestimonial } from "@/lib/db";
import { SectionHead, Icon, Stars, btnPrimary, btnOutline, btnDark } from "@/components/ui";
import PricingCards from "@/components/PricingCards";
import FeedbackForm from "@/components/FeedbackForm";

export const dynamic = "force-dynamic";

// CSS-only browser mockup visual (no external images).
function BrowserMock({ title, hue }: { title: string; hue: string }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xl shadow-stone-900/10 bg-white">
      <div className="flex items-center gap-1.5 px-4 py-3 bg-stone-100 border-b border-stone-200">
        <span className="w-3 h-3 rounded-full bg-red-400" />
        <span className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="w-3 h-3 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs text-stone-500 bg-white rounded-full px-4 py-1 border border-stone-200 flex-1 max-w-[240px] truncate">
          {title}
        </span>
      </div>
      <div className={`h-44 sm:h-52 bg-gradient-to-br ${hue} p-5`}>
        <div className="h-4 w-2/3 rounded bg-white/70 mb-3" />
        <div className="h-4 w-1/2 rounded bg-white/40 mb-5" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-white/80 p-2">
              <div className={`h-12 rounded bg-gradient-to-br ${hue}`} />
              <div className="h-2.5 w-4/5 rounded bg-stone-300 mt-2" />
              <div className="h-2.5 w-2/5 rounded bg-amber-400 mt-1.5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const db = await getDb();
  const portfolio = (await db.prepare("SELECT * FROM portfolio_items ORDER BY id DESC LIMIT 3").all()).map(mapPortfolioItem);
  const testimonials = (await db.prepare("SELECT * FROM testimonials WHERE status = 'approved' ORDER BY id DESC LIMIT 3").all()).map(mapTestimonial);
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I want a website for my business.")}`;

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative bg-emerald-50 dot-grid overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-300/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-[0.18em] px-4 py-2 mb-6">
              <Icon name="rocket" className="w-4 h-4" /> Ecommerce Website Developer
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-tight">
              I build ecommerce websites <span className="text-gold-gradient">that sell.</span>
            </h1>
            <p className="mt-6 text-lg text-stone-600 max-w-lg">
              Complete online stores with admin panel, shopping cart, Cash on Delivery, WhatsApp ordering and payment
              integration — delivered ready to launch, anywhere in the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className={btnPrimary}>
                Start Your Project <Icon name="arrow" className="w-5 h-5" />
              </Link>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                Chat on WhatsApp
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
              {["Mobile responsive", "Admin panel included", "Fast delivery"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <Icon name="check" className="w-5 h-5 text-amber-600" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <BrowserMock title="mystore.com — online shop" hue="from-emerald-600 to-emerald-800" />
            <div className="grid grid-cols-2 gap-5">
              <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <Icon name="bolt" className="w-7 h-7 text-amber-600 mb-2" />
                <p className="text-stone-900 font-bold text-lg">5 days</p>
                <p className="text-stone-500 text-sm">fastest delivery</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-5 shadow-sm">
                <Icon name="shield" className="w-7 h-7 text-amber-600 mb-2" />
                <p className="text-stone-900 font-bold text-lg">30-day</p>
                <p className="text-stone-500 text-sm">free support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="What I do"
            title="Everything your business needs online"
            sub="From a simple business website to a full online store — one developer, end to end."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="rounded-2xl border border-stone-200 p-7 hover:shadow-lg hover:border-emerald-200 transition bg-white group">
                <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center mb-5">
                  <Icon name={s.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-lg text-stone-900 mb-2 group-hover:text-emerald-800 transition">{s.title}</h3>
                <p className="text-stone-600 text-sm leading-relaxed">{s.desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-emerald-800">
                  Learn more <Icon name="arrow" className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services" className={btnDark}>View All Services <Icon name="arrow" className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* ---------- PORTFOLIO PREVIEW ---------- */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Recent work" title="Websites I've built" sub="Real projects, delivered to real clients." />
          <div className="grid gap-6 md:grid-cols-3">
            {portfolio.map((p, i) => (
              <article key={p.id} className="rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-lg transition">
                <div className={`h-40 bg-gradient-to-br ${["from-emerald-600 to-emerald-800", "from-amber-500 to-orange-700", "from-teal-600 to-emerald-800"][i % 3]} grid place-items-center`}>
                  <span className="font-display text-5xl font-bold text-white/40">{p.title.charAt(0)}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-stone-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-stone-600 line-clamp-3">{p.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/portfolio" className={btnDark}>See Full Portfolio <Icon name="arrow" className="w-5 h-5" /></Link>
          </div>
        </div>
      </section>

      {/* ---------- PRICING PREVIEW ---------- */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Our packages" title="Pick a package, launch your store" sub="Message us on WhatsApp for pricing — no advance needed to talk." />
          <PricingCards />
          <p className="text-center mt-8 text-sm text-stone-500">
            Need something custom? <Link href="/contact" className="text-emerald-700 font-semibold underline">Tell me about your project</Link> — I'll quote it personally.
          </p>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="py-20 bg-emerald-50 dot-grid">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Client love" title="Trusted by business owners" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-2xl bg-white border border-stone-200 p-7 shadow-sm">
                <Icon name="quote" className="w-8 h-8 text-amber-500 mb-4" />
                <blockquote className="text-stone-700 text-sm leading-relaxed mb-5">“{t.text}”</blockquote>
                <figcaption className="flex items-center justify-between">
                  <span className="text-stone-900 font-semibold text-sm">{t.name}</span>
                  <Stars rating={t.rating} />
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mt-10">
            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-stone-200 bg-stone-50 open:bg-white open:shadow-sm transition">
                <summary className="cursor-pointer list-none px-6 py-5 font-semibold text-stone-900 flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-emerald-700 text-xl group-open:rotate-45 transition shrink-0">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative py-20 bg-emerald-50 overflow-hidden">
        <div className="absolute inset-0 dot-grid" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">Ready to take your business online?</h2>
          <p className="mt-4 text-stone-600">Tell me about your project — I reply fast, usually within a few hours.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>Get a Free Quote <Icon name="arrow" className="w-5 h-5" /></Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnOutline}>WhatsApp Me</a>
          </div>
          <p className="mt-6 text-xs text-stone-500">No advance needed to talk — message us on WhatsApp anytime</p>
        </div>
      </section>
    </>
  );
}
