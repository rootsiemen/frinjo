import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import ZakatCalculator from "./ZakatCalculator";

export const metadata = {
  title: "Zakat Calculator 2026 — 2.5% Zakat on Cash, Gold & Silver with Nisab",
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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
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
