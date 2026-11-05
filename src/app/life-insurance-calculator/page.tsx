import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import LifeInsuranceCalculator from "./LifeInsuranceCalculator";

export const metadata = {
  title: "Life Insurance Needs Calculator — DIME, No Lead Form | Frinjo",
  description:
    "Free life insurance needs calculator using the DIME method with the offsets others skip — spouse income, Social Security survivor benefits, stay-at-home parent value — compared with HLV and the 10× rule. No sign-up, no agent, no lead form.",
  keywords: [
    "life insurance needs calculator",
    "how much life insurance do i need calculator",
    "dime method life insurance calculator",
    "life insurance calculator",
    "term life insurance needs calculator",
  ],
  alternates: { canonical: "https://frinjo.me/life-insurance-calculator" },
  openGraph: {
    title: "Life Insurance Needs Calculator — DIME, No Lead Form | Frinjo",
    description:
      "An itemized coverage number with honest offsets and a three-method comparison — and no form harvesting your phone number at the end.",
    url: "https://frinjo.me/life-insurance-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Life Insurance Needs Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/life-insurance-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Estimates life insurance need three ways on the same inputs: the DIME method (Debts + final expenses + Income replacement + Mortgage + Education, plus the replacement cost of a stay-at-home parent's work), a discounted human-life-value method (income as an annuity present value), and the 10-times-income rule. All three subtract the same offsets: existing coverage, liquid assets, a surviving spouse's continuing income, and user-estimated Social Security survivor benefits. An illustrative term-premium orientation uses published 2025 market averages for a healthy non-smoker and is labeled as not a quote. No data is collected; calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Life Insurance Needs Calculator", item: "https://frinjo.me/life-insurance-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much life insurance do I need? A worked example",
    "Run the DIME method for a typical family: $25,000 of non-mortgage debts, $15,000 of final expenses, a $90,000 income replaced for 12 years ($1,080,000), a $280,000 mortgage, and two children with a $100,000 education fund each. The gross need is $1,600,000 before offsets ($1,840,000 if you also count replacing a stay-at-home parent's work at $30,000 a year for 8 years). Now the part most calculators skip: subtract what already exists — $100,000 of current coverage, $50,000 of savings, a spouse's $40,000 income continuing for 10 years ($400,000), and estimated Social Security survivor benefits of $2,000 a month for 16 years ($384,000). The offsets total $934,000, and the coverage actually needed lands at $906,000 on the full example. The same family priced by the crude 10× rule gets a very different — and much less defensible — number.",
  ],
  [
    "What is the DIME method?",
    "DIME itemizes the need instead of multiplying the income: Debts to clear (excluding the mortgage, which gets its own letter), Income to replace for a chosen number of years, the Mortgage balance itself, and Education funding per child — plus final expenses and, in this calculator, the cost of replacing a stay-at-home parent's unpaid work. Because every line is visible, you can argue with it line by line, which is exactly what a rule of thumb never allows.",
  ],
  [
    "Why do Social Security survivor benefits and a spouse's income reduce the number?",
    "Because the question is not 'what is a life worth' but 'what cash gap opens if this income stops'. A surviving spouse who keeps earning replaces part of that income; Social Security survivor benefits — paid to children until 18 and to a spouse caring for young children — replace another part. Ignoring them, as the calculators built to sell bigger policies do, overstates the gap by hundreds of thousands of dollars. Your SSA statement (ssa.gov) shows your family's estimated survivor benefit; enter it honestly and the number gets honest with it.",
  ],
  [
    "How does the premium estimate work — is it a quote?",
    "It is not a quote, and it does not pretend to be. It scales published 2025 market averages for a healthy non-smoker buying a 20-year term policy (for example, about $36 a month per $500,000 of coverage at age 35, about $112 at age 50) to your calculated need, purely so you can see the order of magnitude before you talk to anyone. Real quotes move substantially with health, smoking, family history and the insurer. No information from this page goes anywhere — there is no form behind the number.",
  ],
  [
    "Term or whole life — which does the calculator assume?",
    "The need it calculates is an income-replacement gap that shrinks as debts die, children grow and savings build — which is the shape term insurance is built for, and why the premium orientation uses term prices. Permanent (whole/universal) policies answer different questions (estate liquidity, lifelong dependents, business succession). If one of those is your situation, the DIME number is still a reasonable floor for the protection element — but the product decision deserves advice this page does not sell.",
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

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition";

export default function LifeInsurancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No lead form · No agent calls
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Life Insurance <span className="text-gold-gradient">Needs Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            How much coverage do you actually need?
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The DIME method, itemized — with the offsets the sales calculators skip:
            your spouse&apos;s income, Social Security survivor benefits, and the value of a
            stay-at-home parent. <strong>Your number, and nobody&apos;s lead.</strong>
          </p>
        </div>
      </section>

      <LifeInsuranceCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Three methods, one honest breakdown"
            sub="Most calculators give you a multiple of your salary and a phone call. This one shows its work."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The method</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">DIME, line by line</h3>
              <p className="text-stone-600 leading-relaxed">
                Debts, Income, Mortgage, Education — plus final expenses. In the worked example the
                gross need is $1,600,000 before a single offset is counted. Every line is yours to
                challenge, which is the point: a number you can audit beats a number you must trust.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The offsets</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">What already stands in the gap</h3>
              <p className="text-stone-600 leading-relaxed">
                Existing coverage and savings, a working spouse&apos;s continuing income ($400,000 in
                the example), and Social Security survivor benefits ($384,000) shrink the gap to
                $906,000. Calculators that skip the offsets are not being careful — they are selling
                a bigger policy.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The invisible worker</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">A stay-at-home parent is not a $0</h3>
              <p className="text-stone-600 leading-relaxed">
                Childcare, transport, cooking, logistics: replacing that work at $30,000 a year for
                8 years adds $240,000 of genuine need. Families routinely insure the earning parent
                and forget the one whose labor everyone else&apos;s schedule is built on.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The comparison</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">DIME vs HLV vs 10×</h3>
              <p className="text-stone-600 leading-relaxed">
                Same inputs, three philosophies: the itemized DIME figure, the economist&apos;s
                discounted human-life-value, and the famous 10× rule — which on the example family
                lands at $271,000 after offsets, less than a third of the itemized need. Rules of
                thumb are fast. Fast is all they are.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Protect the rest of the balance sheet
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Insurance is one line of the plan
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            The debts in your DIME calculation shrink fastest with a plan: the{" "}
            <strong className="text-white">credit card payoff calculator</strong> and the{" "}
            <strong className="text-white">debt consolidation calculator</strong> attack them from
            both sides, while the <strong className="text-white">car insurance calculator</strong>{" "}
            checks the coverage your family already pays for every month.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/car-insurance-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Car insurance needs
            </Link>{" "}
            ·{" "}
            <Link href="/credit-card-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Credit card payoff
            </Link>{" "}
            ·{" "}
            <Link href="/debt-consolidation-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Debt consolidation
            </Link>{" "}
            ·{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              All tools
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Built for you"
            title="Want a calculator like this on your site?"
            sub="WebStore Pro builds fast Full Stack Web Development projects and custom calculators that rank: designed, developed and SEO-ready from day one."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a free quote <Icon name="arrow" className="w-5 h-5" />
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

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Life insurance questions, answered" />
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
              Calculate my number <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            A planning estimate, not insurance advice; premium figures are illustrative published
            averages, not quotes.
          </p>
        </div>
      </section>
    </>
  );
}
