import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import UkTakeHomeCalculator from "./UkTakeHomeCalculator";

export const metadata = {
  title: "UK Take-Home Pay Calculator 2026/27",
  description:
    "Free UK take-home pay calculator for 2026/27: income tax and National Insurance on your salary — yearly, monthly and weekly net pay, incl. Scotland.",
  keywords: [
    "uk take home pay calculator",
    "take home pay calculator 2026/27",
    "uk salary calculator",
    "after tax salary uk",
    "national insurance calculator",
    "scotland take home pay calculator",
  ],
  alternates: { canonical: "https://frinjo.me/uk-take-home-pay-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "UK Take-Home Pay Calculator 2026/27 | WebStore Pro",
    description:
      "Salary or hourly rate in → income tax, National Insurance and net take-home pay out, for England and Scotland. Free.",
    url: "https://frinjo.me/uk-take-home-pay-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Take-Home Pay Calculator 2026/27",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/uk-take-home-pay-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free UK take-home pay calculator for the 2026/27 tax year. Enter an annual salary or an hourly rate and hours per week, choose England/Wales/NI or Scotland; the tool applies the £12,570 personal allowance (with the £1-per-£2 taper above £100,000), the income tax bands (20/40/45% in England, Wales & NI; six bands 19–48% in Scotland) and employee National Insurance (8% between £12,570 and £50,270, then 2%), and returns net pay per year, month and week with a full deduction breakdown. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "UK Take-Home Pay Calculator", item: "https://frinjo.me/uk-take-home-pay-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much tax do I pay on my salary in 2026/27?",
    "In England, Wales and Northern Ireland: 0% on the first £12,570 (personal allowance), 20% basic rate to £50,270, 40% higher rate to £125,140, and 45% above. Employee National Insurance is 8% between £12,570 and £50,270, then 2% above.",
  ],
  [
    "What is the take-home pay on a £50,000 salary?",
    "£39,520 a year in England, Wales or Northern Ireland — £7,486 of income tax and £2,994 of employee National Insurance — which is £3,293 a month. In Scotland the same salary takes home £38,024 because Scotland's bands are higher in the middle range.",
  ],
  [
    "What is the personal allowance for 2026/27?",
    "£12,570. It reduces by £1 for every £2 earned over £100,000, disappearing entirely at £125,140 — creating an effective 60% marginal rate in that band.",
  ],
  [
    "Does Scotland have different tax bands?",
    "Yes. Scotland has six bands in 2026/27: starter 19%, basic 20%, intermediate 21%, higher 42%, advanced 45% and top 48% above £125,140, on the same £12,570 personal allowance.",
  ],
  [
    "Can I calculate take-home pay from an hourly rate?",
    "Yes. Switch to Hourly rate above, enter your rate and hours per week, and the calculator annualises it (rate × hours × 52) before applying the same tax and NI — useful for comparing a job offer quoted hourly against a salaried one.",
  ],
  [
    "Is the UK Take-Home Pay Calculator free?",
    "Yes, completely free with no sign-up. Everything is calculated in your browser; nothing is stored. It assumes a standard 1257L tax code with no pension or student loan deductions.",
  ],
  [
    "What is the take-home pay on a £30,000 salary?",
    "£25,120 a year in England, Wales or Northern Ireland: income tax is 20% of the £17,430 above the £12,570 personal allowance (£3,486), and National Insurance is 8% of the same slice (£1,394) — leaving £2,093 a month. Scotland's bands change the tax line slightly on the same salary.",
  ],
  [
    "Why is my payslip different from this calculator's result?",
    "Because real payslips carry deductions this calculator leaves out by design: pension contributions, student loan repayments, salary-sacrifice schemes and anything under a non-standard tax code. It assumes the standard 1257L code, so use its figure as the clean baseline — every extra deduction on your payslip should be explainable line by line against it.",
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

export default function UkTakeHomePayPage() {
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
            UK Take-Home Pay <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Income Tax · National Insurance · Net Pay 2026/27
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A £50,000 salary takes home <strong>£39,520 a year</strong> in England — enter your own pay
            to see your income tax, employee National Insurance and net pay per year, month and week,
            for England, Wales &amp; NI or Scotland.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <UkTakeHomeCalculator />

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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> , <Link href="/umbrella-vs-limited-company" className="font-semibold text-orange-700 hover:text-orange-800">umbrella vs limited company guide</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Band by band, never one flat rate"
            sub="Your salary is taxed in slices — the allowance first, then each band in turn."
          />
          <div className="text-left">
            <p className="text-stone-600 leading-relaxed">
              The calculator never taxes your whole salary at a single rate. It first removes your
              personal allowance — £12,570, reduced by £1 for every £2 earned above £100,000 — then
              taxes what remains slice by slice: in England, Wales and Northern Ireland, 20% on the
              first £37,700 of taxable income, 40% on the next £74,870 and 45% beyond. National
              Insurance runs on gross pay alongside: nothing below £12,570, then 8% up to £50,270 and
              2% above. Scotland keeps the same allowance and NI but swaps in six bands, from 19% to 48%.
            </p>
            <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Worked example: a £35,000 salary, both regions</h3>
              <p className="text-stone-600 leading-relaxed">
                Taxable income is £35,000 − £12,570 = £22,430, all inside the basic band, so income tax
                is 20% × £22,430 = £4,486 and National Insurance is 8% × £22,430 = £1,794. Net pay:
                £35,000 − £4,486 − £1,794 = £28,720 a year, £2,393 a month. In Scotland the same salary
                pays £4,501 of tax — the 19% starter band helps before the 21% intermediate band bites
                — leaving £28,705: fifteen pounds a year apart, from bands alone.
              </p>
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-stone-900 mb-3">Two traps to know</h3>
            <p className="text-stone-600 leading-relaxed">
              The hourly mode annualises as rate × hours × 52, so it assumes pay for all 52 weeks — a
              contract with unpaid breaks lands lower. And crossing £50,270 flips your marginal rate
              from 28% (20% tax + 8% NI) to 42% (40% tax + 2% NI), so a small rise over the line is
              taxed harder than the same rise below it.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="UK take-home pay questions, answered" />
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
              Calculate your take-home pay <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
