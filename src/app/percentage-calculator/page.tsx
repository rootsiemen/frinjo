import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Percentage from "./Percentage";

export const metadata = {
  title: "Percentage Calculator — % of a Number, Increase, Decrease & Reverse",
  description:
    "Free percentage calculator with all five modes on one page: what is X% of Y, X is what % of Y, percentage increase/decrease between two numbers, apply a % increase or discount, and reverse percentages. Instant, no sign-up.",
  keywords: [
    "percentage calculator",
    "percentage increase calculator",
    "percentage decrease calculator",
    "percent of a number",
    "percentage change calculator",
    "reverse percentage calculator",
    "what percent",
  ],
  alternates: { canonical: "https://frinjo.me/percentage-calculator" },
  openGraph: {
    title: "Percentage Calculator — All Five Modes, One Page | WebStore Pro",
    description:
      "Percent of a number, percentage change, discounts and reverse percentages — every mode, updating as you type. Free.",
    url: "https://frinjo.me/percentage-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Percentage Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/percentage-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free percentage calculator covering five modes on one page: (1) X percent of Y, calculated as (X/100)×Y; (2) X as a percentage of Y, (X/Y)×100; (3) percentage change from A to B, ((B−A)/|A|)×100, covering percentage increase and percentage decrease; (4) applying a percentage increase or decrease to a number; (5) the reverse percentage, finding the whole when a part and its percentage are known, X/(P/100). All results update live and run in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Percentage Calculator", item: "https://frinjo.me/percentage-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate a percentage of a number?",
    "Divide the percentage by 100 and multiply by the number: 20% of 150 = (20 ÷ 100) × 150 = 30. That is Mode 1 above — the calculation behind tips, sales tax, discounts and interest.",
  ],
  [
    "How do I calculate percentage increase?",
    "Subtract the old value from the new one, divide by the old value, and multiply by 100: a rise from 80 to 100 is (100 − 80) ÷ 80 × 100 = 25%. If the result is negative, it is a percentage decrease of that size. That is Mode 3, which also covers percentage decrease and percentage change generally.",
  ],
  [
    "What is the difference between percentage change and percentage points?",
    "Percentage change is relative: going from 4% interest to 5% is a 25% increase ((5−4)÷4×100). Percentage points are the plain arithmetic difference: that same move is +1 percentage point. News reports mix these up constantly — Mode 3 gives you the relative change.",
  ],
  [
    "How do I find the original price before a discount or tax?",
    "Use the reverse percentage (Mode 5). If you paid 84 after a 16% discount, the original was 84 ÷ (1 − 0.16) = 100. If a total of 120 includes 20% tax, the pre-tax price was 120 ÷ 1.20 = 100. Dividing by the discounted total is the step most people get wrong — adding the percentage back does not undo it.",
  ],
  [
    "Why doesn't a 20% increase followed by a 20% decrease return to the start?",
    "Because the second percentage is taken of a different base. 100 increased by 20% is 120; 120 decreased by 20% is 96, not 100 (20% of 120 is 24). Percentages are always relative to the current number — which is exactly why Mode 4 keeps the direction explicit.",
  ],
  [
    "Is the Percentage Calculator free?",
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

export default function PercentagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · All 5 modes, one page
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Percentage <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            % of a Number · Increase · Decrease · Reverse
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Every percentage question has one of five shapes. They are <strong>all on this page</strong> —
            no clicking through to a separate &quot;increase calculator&quot; — and every formula is printed
            under its result so you can check the working, not just the answer.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <Percentage />

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
          <SectionHead eyebrow="FAQ" title="Percentage questions, answered" />
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
              Calculate a percentage <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
