import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import HourlySalary from "./HourlySalary";

export const metadata = {
  title: "Hourly to Salary Calculator — $/Hour to Year",
  description:
    "Free hourly to salary calculator: convert any wage to daily, weekly, biweekly, monthly and annual pay at your real hours and weeks. Gross pay.",
  keywords: [
    "hourly to salary calculator",
    "hourly wage to salary",
    "how much is an hour a year",
    "salary to hourly calculator",
    "annual salary calculator",
    "wage calculator",
  ],
  alternates: { canonical: "https://frinjo.me/hourly-to-salary-calculator" },
  openGraph: {
    title: "Hourly to Salary Calculator | WebStore Pro",
    description:
      "Any hourly rate → daily, weekly, biweekly, monthly and yearly pay, at your actual hours. Plus salary → hourly. Free.",
    url: "https://frinjo.me/hourly-to-salary-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Hourly to Salary Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/hourly-to-salary-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free hourly wage to salary converter. Annual pay is hourly rate × hours per week × weeks per year (2,080 hours at the standard 40 × 52). It reports daily, weekly, biweekly, monthly and annual gross pay, lets the user adjust hours per week and weeks per year (for unpaid time off), and converts in reverse from an annual salary to its hourly equivalent using the same assumptions. Figures are gross pay before taxes and deductions.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Hourly to Salary Calculator", item: "https://frinjo.me/hourly-to-salary-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I convert an hourly wage to an annual salary?",
    "Multiply the hourly rate by hours worked per week, then by weeks worked per year. At the standard full-time schedule — 40 hours a week, 52 weeks a year — that is rate × 2,080 hours. So $25/hour = $25 × 40 × 52 = $52,000 a year, before taxes.",
  ],
  [
    "What is $20 an hour annually?",
    "At 40 hours a week for 52 weeks, $20/hour is $41,600 a year — $800 a week, $1,600 every two weeks, about $3,467 a month. Every rate from $12 to $100 has its own full breakdown page linked from the calculator.",
  ],
  [
    "Should I count unpaid vacation in the calculation?",
    "If you are hourly and take unpaid time off, yes — reduce the weeks. Two unpaid weeks means 50 weeks: $25/hour × 40 × 50 = $50,000, not $52,000. Salaried comparisons should use the same honesty both ways: a salary divided by the hours actually expected (including regular overtime) gives the true hourly equivalent, which the reverse calculator handles by letting you set hours per week above 40.",
  ],
  [
    "Is the result before or after tax?",
    "Before tax (gross pay) — the same basis job offers and salary postings use. US take-home pay depends on federal and state tax, FICA (7.65%), and deductions like health insurance and 401(k), so no honest hourly conversion can quote your net pay without that information.",
  ],
  [
    "What is biweekly pay, and why is monthly not just 2× biweekly?",
    "Biweekly means every two weeks: 26 paydays a year, so biweekly = weekly × 2, and annual = biweekly × 26. Monthly is annual ÷ 12. Because 26 biweekly periods span slightly more than 12 'double-paycheck' months, monthly pay is a little higher than two biweekly checks — the difference trips people up when budgeting, and this calculator keeps both figures side by side so it cannot.",
  ],
  [
    "Is the Hourly to Salary Calculator free?",
    "Yes, completely free with no sign-up. The numbers are calculated in your browser and never stored.",
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

export default function HourlySalaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Your real hours, not just 40×52
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Hourly to <span className="text-gold-gradient">Salary</span> Calculator
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            What Your Wage Really Pays Per Year
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Job posts talk salary; hourly workers think in rates. Convert either way — at{" "}
            <strong>your actual hours and weeks</strong>, including unpaid time off — and compare offers
            on the same honest basis.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <HourlySalary />

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
          <SectionHead eyebrow="FAQ" title="Hourly pay questions, answered" />
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
              Convert a wage <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
