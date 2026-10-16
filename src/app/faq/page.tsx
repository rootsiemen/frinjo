import Link from "next/link";
import { BRAND, FAQS } from "@/lib/content";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `FAQ — ${BRAND.name}`,
  description: `Frequently asked questions about ${BRAND.name} website packages: delivery time, pricing, payments, admin panel, and what you need to get started.`,
  alternates: { canonical: "https://frinjo.me/faq" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FaqPage() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I have a question about your website packages.")}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-orange-50 dot-grid py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">FAQ</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
            Questions, answered.
          </h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-3xl">
            Everything you need to know before ordering a website from {BRAND.name} —
            delivery times, pricing, payments, and how we work together.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
          <div className="space-y-4">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-stone-200 bg-stone-50 open:bg-white open:shadow-sm transition"
              >
                <summary className="cursor-pointer list-none px-6 py-5 font-semibold text-stone-900 flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-orange-700 text-xl group-open:rotate-45 transition shrink-0">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-stone-200 bg-stone-50 p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-stone-900">Still have a question?</h2>
            <p className="mt-2 text-stone-600">Message me on WhatsApp — I reply fast.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                <Icon name="chat" className="w-5 h-5" /> WhatsApp Me
              </a>
              <Link href="/pricing" className={btnOutline}>
                See Packages <Icon name="arrow" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
