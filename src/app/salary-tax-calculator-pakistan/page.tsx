import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import SalaryTaxCalculator from "./SalaryTaxCalculator";

export const metadata = {
  title: "Income Tax Calculator Pakistan 2026-27 — Salary Tax & Take-Home Pay",
  description:
    "Free Pakistan salary tax calculator for 2026-27. Enter your monthly salary to get monthly and annual income tax, take-home pay and the full FBR slab breakdown under the Finance Act 2026. Instant, no sign-up.",
  keywords: [
    "income tax calculator pakistan",
    "salary tax calculator pakistan",
    "income tax calculator 2026-27",
    "fbr tax slabs 2026-27",
    "salary tax pakistan",
    "take home salary calculator pakistan",
  ],
  alternates: { canonical: "https://frinjo.me/salary-tax-calculator-pakistan" },
  openGraph: {
    title: "Income Tax Calculator Pakistan 2026-27 | WebStore Pro",
    description:
      "Monthly salary in → monthly tax, take-home pay and FBR slab breakdown out. Finance Act 2026 slabs, free.",
    url: "https://frinjo.me/salary-tax-calculator-pakistan",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Income Tax Calculator Pakistan 2026-27",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/salary-tax-calculator-pakistan",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free Pakistan salary income tax calculator for FY 2026-27 (Finance Act 2026). Enter a monthly gross salary; the tool annualises it, applies the FBR salaried slabs (0% to Rs 600,000, then 1%, 11%, 20%, 25%, 29%, 32% and 35% with the cumulative fixed amounts), and returns annual tax, monthly tax, monthly take-home pay, the effective tax rate and the slab table with your slab highlighted. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Income Tax Calculator Pakistan", item: "https://frinjo.me/salary-tax-calculator-pakistan" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What are the income tax slabs for salaried individuals in Pakistan 2026-27?",
    "0% up to Rs 600,000; 1% on Rs 600,001–1,200,000; Rs 6,000 + 11% on Rs 1,200,001–2,200,000; Rs 116,000 + 20% on Rs 2,200,001–3,200,000; Rs 316,000 + 25% on Rs 3,200,001–4,100,000; Rs 541,000 + 29% on Rs 4,100,001–5,600,000; Rs 976,000 + 32% on Rs 5,600,001–7,000,000; Rs 1,424,000 + 35% above Rs 7,000,000.",
  ],
  [
    "What is the minimum taxable salary in Pakistan for 2026-27?",
    "Annual salary up to Rs 600,000 (Rs 50,000 per month) is fully exempt from income tax.",
  ],
  [
    "How much income tax do I pay on a Rs 150,000 monthly salary?",
    "Rs 6,000 per month. Rs 150,000 a month is Rs 1,800,000 a year, which falls in the Rs 1,200,001–2,200,000 slab: Rs 6,000 + 11% of the Rs 600,000 above Rs 1,200,000 = Rs 72,000 of tax a year, withheld as Rs 6,000 a month. Your take-home pay is Rs 144,000 a month.",
  ],
  [
    "Does my employer deduct this tax automatically?",
    "Yes. Salaried income tax is withheld by your employer every month and adjusted against the slabs above, so the monthly figure from this calculator should match the tax line on your payslip.",
  ],
  [
    "Is there still a surcharge on high salaries in 2026-27?",
    "No. The 9% surcharge that applied on income above Rs 10 million has been abolished for 2026-27, so the slab amounts above are the full liability for salaried individuals.",
  ],
  [
    "Is the Income Tax Calculator Pakistan free?",
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

export default function SalaryTaxPakistanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · FBR slabs 2026-27 · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Income Tax Calculator <span className="text-gold-gradient">Pakistan 2026-27</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Salary Tax · Take-Home Pay · Slab Breakdown
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            On a monthly salary of Rs 100,000, your tax is <strong>Rs 500 a month</strong> — enter your own
            salary below to see your monthly tax, take-home pay and exactly which FBR slab you fall in,
            under the Finance Act 2026 slabs.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <SalaryTaxCalculator />

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
          <SectionHead eyebrow="FAQ" title="Pakistan salary tax questions, answered" />
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
              Calculate your salary tax <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
