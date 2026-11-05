import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Ir35Calculator from "./Ir35Calculator";

export const metadata = {
  title: "IR35 Calculator 2026/27 — Inside vs Outside IR35 Take-Home Pay",
  description:
    "Free IR35 calculator for 2026/27. Enter your day rate to see inside-IR35 take-home pay after employer NI, the skills levy, PAYE tax and employee NI — and how outside IR35 compares. Every deduction line by line.",
  keywords: [
    "ir35 calculator",
    "inside ir35 calculator",
    "outside ir35 take home",
    "contractor take home pay calculator",
    "day rate calculator uk",
    "deemed employment calculator",
  ],
  alternates: { canonical: "https://frinjo.me/ir35-calculator" },
  openGraph: {
    title: "IR35 Calculator 2026/27 | WebStore Pro",
    description:
      "Day rate in → inside vs outside IR35 take-home out, with employer NI, levy, PAYE and NI shown line by line. Free.",
    url: "https://frinjo.me/ir35-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "IR35 Calculator 2026/27",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/ir35-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free IR35 calculator for UK contractors for 2026/27. Enter a day rate, days per week and weeks per year; for inside IR35 the tool models deemed employment under the off-payroll rules — employer National Insurance (15% above £5,000) and the 0.5% apprenticeship/skills levy come out of the assignment rate first, then PAYE income tax and employee NI are deducted from the deemed salary using the 2026/27 bands for England/Wales/NI or Scotland — and returns take-home pay, retention percentage and effective day rate. Outside IR35 shows the gross contract value paid to a limited company. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "IR35 Calculator", item: "https://frinjo.me/ir35-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is the difference between inside and outside IR35?",
    "Inside IR35, HMRC treats you as a disguised employee: the fee payer deducts employer National Insurance from your rate, then PAYE income tax and employee NI from what's left. Outside IR35 you are genuinely self-employed and typically work through your limited company on a salary-plus-dividends basis, keeping more of the contract value.",
  ],
  [
    "How much take-home pay does a £500 day rate give inside IR35?",
    "£67,354 a year at 5 days a week for 46 weeks (a £115,000 contract): £16,500 employer NI and £575 skills levy come out of the rate first, leaving a £97,925 deemed salary, then £26,602 PAYE income tax and £3,969 employee NI. That is 58.6% of the contract value — an effective £293 a day.",
  ],
  [
    "Who decides my IR35 status?",
    "Since the April 2021 off-payroll reforms, medium and large private-sector clients (and all public-sector clients) decide your status and must give you a Status Determination Statement. For small private-sector clients, your own limited company remains responsible.",
  ],
  [
    "How much does being inside IR35 cost?",
    "Typically 6–11% of the contract value versus outside IR35, mainly because employer National Insurance (15% above £5,000) comes out of your assignment rate before you are paid.",
  ],
  [
    "Is the IR35 Calculator free?",
    "Yes, completely free with no sign-up. Everything is calculated in your browser; nothing is stored. Results are estimates on the deemed-employment model — confirm your position with a qualified accountant.",
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

export default function Ir35Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Tax year 2026/27 · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            IR35 <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Inside vs Outside IR35 · Take-Home by Day Rate
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Inside IR35, employer costs come out of your rate before you see a penny. Enter your day
            rate to see your real take-home — <strong>every deduction shown line by line</strong> —
            and what changes outside IR35.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <Ir35Calculator />

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
          <SectionHead eyebrow="FAQ" title="IR35 questions, answered" />
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
              Calculate your IR35 take-home <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
