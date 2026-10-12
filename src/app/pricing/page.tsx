import { BRAND, FAQS } from "@/lib/content";
import { SectionHead, Icon } from "@/components/ui";
import PricingCards from "@/components/PricingCards";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    "Hi, I'm interested in a website package. Please share pricing details."
  )}`;
  return (
    <>
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">Packages</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Simple, honest packages</h1>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            One-time payment. You own the website, the domain and everything on it. No monthly fees to me, ever.
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <PricingCards />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["Honest pricing", "I quote every project personally on WhatsApp before we start — no surprises, no hidden costs. Domain & hosting (~$15/yr) are the only extras, paid directly to the provider."],
              ["You own everything", "Full source code, admin access and credentials are handed over to you on launch day."],
              ["Free revisions", "Every package includes revision rounds — I don't stop until you're happy with the result."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl bg-white border border-stone-200 p-6 flex gap-4">
                <Icon name="shield" className="w-8 h-8 text-emerald-700 shrink-0" />
                <div>
                  <h3 className="font-bold text-stone-900 mb-1">{t}</h3>
                  <p className="text-sm text-stone-600">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Pricing questions" />
          <div className="space-y-4">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q} className="group rounded-2xl border border-stone-200 bg-stone-50 open:bg-white open:shadow-sm transition">
                <summary className="cursor-pointer list-none px-6 py-5 font-semibold text-stone-900 flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-emerald-700 text-xl group-open:rotate-45 transition shrink-0">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center mt-10">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-green-600 text-white font-bold px-8 py-4 hover:bg-green-700 transition">
              Contact for Pricing <Icon name="arrow" className="w-5 h-5" />
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
