import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import ZakatCalculator from "./ZakatCalculator";

export const metadata = {
  title: "Zakat Calculator 2026 — 2.5% with Nisab",
  description:
    "Free zakat calculator: 2.5% zakat on cash, gold, silver and business assets, with nisab worked out from gold and silver rates you can edit. Instant, no sign-up.",
  keywords: [
    "zakat calculator",
    "zakat calculator pakistan",
    "nisab 2026",
    "zakat on gold calculator",
    "calculate zakat online",
    "zakat 2.5 percent",
  ],
  alternates: { canonical: "https://frinjo.me/zakat-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Zakat Calculator 2026 | WebStore Pro",
    description:
      "2.5% zakat on cash, gold, silver and business assets, with nisab from today's bullion rates. Free.",
    url: "https://frinjo.me/zakat-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Zakat Calculator 2026",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/zakat-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free zakat calculator. Enter cash, gold (tola), silver (tola), investments/business stock and debts; the tool values gold and silver at editable per-tola rates, computes nisab as the lower of 7.5 tola of gold and 52.5 tola of silver, and — when net zakatable wealth meets nisab — returns zakat due at 2.5%. Default bullion rates are the October 2026 Pakistan rates and can be updated in the tool. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Zakat Calculator", item: "https://frinjo.me/zakat-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much zakat do I have to pay?",
    "2.5% of your net zakatable wealth — but only if that wealth meets or exceeds nisab and has been held for one lunar year. For example, net zakatable wealth of Rs 1,000,000 means Rs 25,000 of zakat. Below nisab, no zakat is due.",
  ],
  [
    "What is the nisab in Pakistan for 2026?",
    "Nisab is the lower of the value of 7.5 tola of gold and 52.5 tola of silver. At this calculator's default October 2026 rates (gold Rs 437,836 per tola, silver Rs 6,148 per tola), the silver nisab is Rs 322,770 and the gold nisab is Rs 3,283,770 — so nisab is Rs 322,770. Bullion rates move daily; edit the rates in the tool to get today's exact nisab.",
  ],
  [
    "What assets are zakat calculated on?",
    "Cash in hand and in bank accounts, gold and silver you own, and investments or business stock — minus debts you owe. Those are exactly the inputs this calculator uses; your home and personal-use items are not part of the calculation.",
  ],
  [
    "Is zakat due on gold jewellery?",
    "Gold you own counts toward zakatable wealth at its current value in the standard calculation used here. Rulings on personal jewellery differ between schools of thought — if that is your situation, confirm with a scholar.",
  ],
  [
    "Is the Zakat Calculator free?",
    "Yes, completely free with no sign-up. Everything is calculated in your browser; nothing is stored.",
  ],
  [
    "Is zakat due on money in my bank account?",
    "Yes — cash in hand and money in bank accounts are core zakatable assets in this calculation, counted at their balance on your zakat date. What matters is the total you hold when the lunar year completes, not the salary that passed through the account during the year, so a spent salary is not counted twice.",
  ],
  [
    "What if my wealth falls below nisab during the year?",
    "This calculator takes the position on the day you calculate: net zakatable wealth at or above nisab means zakat is due at 2.5%. Schools of thought differ on how a mid-year dip below nisab affects the year's count, so if your wealth moved in and out of nisab, confirm your specific case with a scholar.",
  ],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function ZakatPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Nisab included · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Zakat <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            2.5% on Cash, Gold, Silver &amp; Business Assets
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter what you own and what you owe. The calculator values your gold and silver, works out
            nisab from the bullion rates (edit them if today&apos;s rate differs), and tells you plainly
            whether zakat is due — and exactly how much.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <ZakatCalculator />

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack websites and custom calculators that rank — designed, built and SEO-ready from day one."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a Free Quote <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              WhatsApp +92 325 8774221
            </a>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            Prefer email? <a href="mailto:neilsonsmarry@gmail.com" className="font-semibold text-orange-700 hover:text-orange-800">neilsonsmarry@gmail.com</a>
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> , <Link href="/pta-tax-calculator" className="font-semibold text-orange-700 hover:text-orange-800">PTA tax calculator</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Nisab first, then a flat 2.5%"
            sub="Two checks decide everything: does your net wealth reach nisab, and what is 2.5% of it?"
          />
          <div className="text-left">
            <p className="text-stone-600 leading-relaxed">
              The calculator works in three steps. First, nisab: it prices 7.5 tola of gold at your
              gold rate against 52.5 tola of silver at your silver rate and takes the lower figure — at
              the default October 2026 rates that is Rs 322,770 from silver, far below the gold figure
              of Rs 3,283,770. Second, it totals your zakatable wealth: cash, plus your gold and silver
              valued at those same rates, plus investments and business stock, minus the debts you owe.
              Third, if the net total reaches nisab, zakat is a flat 2.5% of the whole total — not only
              of the part above nisab.
            </p>
            <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Worked example: cash, gold, stock and a debt</h3>
              <p className="text-stone-600 leading-relaxed">
                You hold Rs 500,000 in cash, 2 tola of gold, Rs 200,000 of business stock and a Rs
                75,000 debt. The gold is worth 2 × Rs 437,836 = Rs 875,672. Net zakatable wealth:
                500,000 + 875,672 + 200,000 − 75,000 = Rs 1,500,672 — comfortably above the Rs 322,770
                nisab. Zakat due: 2.5% of Rs 1,500,672 = Rs 37,516.80. Change any one input and both the
                total and the 2.5% move with it, which is why the debts field matters as much as the
                assets.
              </p>
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-stone-900 mb-3">Three errors that change the answer</h3>
            <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-5">
              <li>Using old bullion rates. Nisab is priced from gold and silver on the day; the defaults here are October 2026 rates, so edit both rate fields before trusting the nisab figure in a later year.</li>
              <li>Leaving debts out. Money you owe comes off before the 2.5% is applied — skipping a Rs 75,000 debt overstates your zakat by Rs 1,875.</li>
              <li>Testing against the gold nisab only. The calculator takes the lower threshold, so most people qualify on silver long before their wealth nears the gold figure.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Zakat questions, answered" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-stone-50/60 open:bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#top" className={btnPrimary}>
              Calculate your zakat <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
