import type { Metadata } from "next";
import Link from "next/link";
import DiscountCalculator from "./DiscountCalculator";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Discount Calculator — Sale Price, Stacked % Off & Tax";
const DESCRIPTION =
  "Free discount calculator: find the sale price and savings from any % off, stack two discounts correctly, add sales tax after discount, and reverse-check % off or original price.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["discount calculator", "sale price calculator", "percent off calculator", "stacked discount calculator", "price after discount", "discount with tax calculator"],
  alternates: { canonical: "https://frinjo.me/discount-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Discount Calculator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/discount-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.jpg"],
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Discount Calculator — Sale Price & Stacked Discounts",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/discount-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculate the price after a percentage discount, stack a second percentage discount correctly (multiplicative, not additive), add sales tax after the discount, and use two reverse modes: find the % off from a was/now price pair, and find the original price from a discounted price and a known % off. Shows a step-by-step price breakdown.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Discount Calculator", item: "https://frinjo.me/discount-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate a discount price?",
    "Multiply the price by (1 − discount ÷ 100). For 25% off $120: 120 × 0.75 = $90, so you save $30. To do it mentally, find 10% (move the decimal), then scale: 25% is two 10%s plus a 5% (half of 10%).",
  ],
  [
    "Is 20% off plus an extra 10% off the same as 30% off?",
    "No — and this is where stores quietly win. Stacked discounts multiply: $100 → 20% off = $80 → 10% off the $80 = $72. That is 28% off in total, not 30% (which would be $70). The calculator shows each step and the true total percentage so you can compare offers honestly.",
  ],
  [
    "Is sales tax calculated before or after a discount?",
    "In most US states, tax is charged on the discounted price when the discount comes from the store (a sale or store coupon), because tax applies to what you actually pay. Manufacturer coupons are treated differently in some states (tax on the pre-discount price). This calculator applies tax after the discount — enter your state rate to see the register total.",
  ],
  [
    "How do I find the original price from a sale price?",
    "Divide the sale price by (1 − discount ÷ 100). Paid $90 after 25% off? 90 ÷ 0.75 = $120 original. The reverse mode in the calculator does exactly this — useful for checking whether a 'sale' was marked up first.",
  ],
  [
    "How do I work out the % off from two prices?",
    "Percentage off = (1 − sale ÷ original) × 100. Was $200, now $150 → (1 − 0.75) × 100 = 25% off. The second reverse mode handles it — handy when a listing shows prices but hides the percentage, or inflates it.",
  ],
  [
    "What does 'up to 70% off' actually mean?",
    "It means at least one item is 70% off — possibly the only one. Check the % off on the specific item you want with the reverse mode above, and compare the final price (with tax) across stores, not the headline percentage.",
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

export default function DiscountCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Shopping · Sales · Coupons
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Discount <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            What you actually pay — including stacked discounts and tax.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            One % off is easy math. Real checkouts stack them — &quot;25% off, plus an extra 10% today, plus tax&quot; —
            and the percentages stop meaning what you think. This calculator walks the price down step by step, and its
            reverse modes expose the true % off or the original price behind any sale tag.
          </p>
        </div>
      </section>

      <DiscountCalculator />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. Running a store? I build the whole shop — products,
            discounts, checkout and all.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Start a project <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              <Icon name="whatsapp" className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-stone-400">
            Prefer email?{" "}
            <a href="mailto:neilsonsmarry@gmail.com" className="text-orange-400 font-semibold hover:underline">
              neilsonsmarry@gmail.com
            </a>{" "}
            · See <Link href="/services" className="text-orange-400 font-semibold hover:underline">my services</Link> — or
            explore the <Link href="/tip-calculator" className="text-orange-400 font-semibold hover:underline">Tip Calculator</Link>,{" "}
            <Link href="/percentage-calculator" className="text-orange-400 font-semibold hover:underline">Percentage Calculator</Link> and{" "}
            <Link href="/compound-interest-calculator" className="text-orange-400 font-semibold hover:underline">Compound Interest Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How discount math works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Sale price = price × (1 − % ÷ 100).</strong> A second discount applies
              to the already-reduced price, so stacked percentages multiply their remainders: 25% then 10% leaves
              0.75 × 0.90 = 0.675 of the price — 32.5% off, not 35%. Sales tax then applies to the discounted amount.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                A jacket at <strong className="text-stone-900">$120</strong> with <strong className="text-stone-900">25% off</strong> drops
                to $90. An extra <strong className="text-stone-900">10% off</strong> at the register makes it $81 — a total
                saving of $39, i.e. <strong className="text-stone-900">32.5% off</strong>, not 35%. Add 8% tax on $81 and
                the register total is <strong className="text-stone-900">$87.48</strong>. Try it above.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Compare final prices (with tax), never headline percentages, across stores.",
                "'Extra X% off sale prices' is always worth less than the same X% as a single discount.",
                "A coupon for $20 off beats 20% off on anything under $100 — run both numbers.",
                "Check the was-price: if it was inflated before the sale, the reverse mode exposes the real % off.",
                "BOGO '50% off the second item' = 25% off the pair, if both items cost the same.",
              ].map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 grid place-items-center">
                    <Icon name="check" className="w-3 h-3" />
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Discount calculator questions, answered" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="#top" className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline">
              ↑ Back to the calculator
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
