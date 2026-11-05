import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CompoundCalculator from "./CompoundCalculator";

export const metadata = {
  title: "Compound Interest Calculator — With Contributions, Tax & CD Mode | Frinjo",
  description:
    "Free compound interest calculator: monthly contributions, daily-to-annual compounding, effective APY, inflation-adjusted real value, an annual tax drag on interest, a goal solver and a CD mode with early-withdrawal penalties. No sign-up.",
  keywords: [
    "compound interest calculator",
    "compound interest calculator with contributions",
    "compound interest calculator with monthly contributions",
    "cd calculator",
    "how long to reach savings goal",
    "effective apy calculator",
  ],
  alternates: { canonical: "https://frinjo.me/compound-interest-calculator" },
  openGraph: {
    title: "Compound Interest Calculator — With Contributions, Tax & CD Mode | Frinjo",
    description:
      "Contributions, inflation, tax drag, APY and a goal date in one tool — plus the CD mode other calculators charge a separate page for.",
    url: "https://frinjo.me/compound-interest-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Compound Interest Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/compound-interest-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Future value with compound interest and regular contributions: FV = P(1 + r/n)^(n·t) + PMT × [((1 + r/n)^(n·t) − 1) / (r/n)], contributions at period end, compounding annually, quarterly, monthly or daily. Shows total contributed, gross and after-tax interest (an optional annual tax drag skimmed from each period's interest), the effective APY, a year-by-year chart and table, and the inflation-adjusted real value. A goal mode solves the years needed to reach a target. A CD mode values a certificate of deposit on an APY basis with early-withdrawal penalties in months of interest, capped at interest earned. Projections, not guarantees. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Compound Interest Calculator", item: "https://frinjo.me/compound-interest-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does compound interest work? A worked example",
    "Each period, interest is paid on the balance including all interest already earned — your money earns money that earns money. The formula: FV = P × (1 + r/n)^(n·t), plus the contribution term. Reference run of this calculator: $10,000 at 5% for 10 years with no contributions becomes $16,288.95 compounded annually — versus $15,000 with simple interest. Add $200 a month for 20 years at 5% (monthly compounding) and the value reaches $109,333.14: you contributed $58,000 and interest added $51,333.14. Time is the strongest ingredient — the second decade does more work than the first.",
  ],
  [
    "What does inflation do to the result?",
    "It quietly re-prices it. The $109,333.14 above, discounted at 2% annual inflation over 20 years, is about $73,578 in today's purchasing power — that is the number to compare against today's goals and prices. It is also the test of any product: a 2% return against 2% inflation preserves purchasing power without growing it. This calculator always shows the nominal value and the real one side by side.",
  ],
  [
    "How much does tax on interest cost over time?",
    "More than a single year's bill suggests, because taxed interest never gets to compound. Same plan — $10,000 plus $200 a month at 5% for 20 years — with a 22% annual tax drag on the interest ends at $94,323.46 instead of $109,333.14: $10,245.08 paid in tax along the way, and about $15,010 less at the end. It is the arithmetic argument for sheltering interest-bearing savings in an IRA, 401(k) or other tax-advantaged wrapper where the drag is zero — set the tax field to 0 to model those accounts.",
  ],
  [
    "How does the CD mode work — and the early-withdrawal penalty?",
    "CDs quote APY, the effective yield, so value at any month t is deposit × (1 + APY)^(t/12): $10,000 at 5% APY for 12 months matures at exactly $10,500. Withdraw at month 6 and the interest earned is $246.95 — but the typical penalty (3 months of interest here) takes back $122.72, leaving $10,124.23. Penalties are capped at the interest earned; a bank cannot take your principal through the penalty itself. The mode exists because a standalone CD calculator is a compound calculator wearing a suit — here it is one tab, with the penalty honest.",
  ],
  [
    "Daily vs monthly vs annual compounding: how much does it matter?",
    "Less than the rate or the years. At 5%, $10,000 over 10 years: $16,288.95 compounded annually, about $16,470 monthly, about $16,487 daily — the effective APY rises from 5.00% to about 5.12%. Worth having, never worth chasing at the expense of a better headline rate. The calculator shows the APY for your chosen frequency so products quoted differently can be compared cleanly.",
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

export default function CompoundInterestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Tax drag · Goal solver · CD mode
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Compound Interest <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Watch your contributions work — and inflation and tax take their cut
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Starting amount, monthly contributions, any compounding frequency — with the chart that
            separates <strong>what you put in</strong> from <strong>what interest adds</strong>, the
            value in today&apos;s dollars, and three modes most calculators split across three pages.
          </p>
        </div>
      </section>

      <CompoundCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="The four forces on every savings plan"
            sub="In order of real impact: time, consistency, the rate — and two quiet enemies."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Force n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Time: exponential, not linear</h3>
              <p className="text-stone-600 leading-relaxed">
                At 5%, $10,000 becomes $16,289 in 10 years, $26,533 in 20 and $43,219 in 30 — each decade
                adds more than the one before. Starting early beats contributing late and large, at any
                realistic rate.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Force n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Contributions feed the machine</h3>
              <p className="text-stone-600 leading-relaxed">
                $200 a month for 20 years is $48,000 out of pocket — which at 5% grows into more than
                $34,000 of interest all by itself. Regularity turns a modest habit into the engine of
                the whole projection.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The enemies</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Inflation and the tax drag</h3>
              <p className="text-stone-600 leading-relaxed">
                At 2% inflation, idle money loses a third of its purchasing power in 20 years; a 22% tax
                drag on interest costs the example plan roughly $15,010 of final value. Both are modeled
                here, not footnoted — the real value and the after-tax value are the honest results.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The extra modes</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Goals and CDs, same engine</h3>
              <p className="text-stone-600 leading-relaxed">
                Ask how long a target takes instead of what a term produces — or flip to the CD tab for
                a certificate valued on its APY with the early-withdrawal penalty priced in months of
                interest. One tool, no page-hopping.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            In other languages
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Compound interest travels well
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            The French version of this tool — <strong className="text-white">Intérêts Composés</strong>{" "}
            — runs the same engine with Livret A, assurance-vie and PEA presets. Debt on the other side
            of the ledger? The <strong className="text-white">loan payoff calculator</strong> and{" "}
            <strong className="text-white">amortization calculator</strong> run compounding in reverse,
            against the bank.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/fr/interets-composes" className="font-semibold text-orange-400 hover:text-orange-300">
              Intérêts composés (FR)
            </Link>{" "}
            ·{" "}
            <Link href="/loan-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Loan payoff
            </Link>{" "}
            ·{" "}
            <Link href="/amortization-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Amortization schedule
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
          <SectionHead eyebrow="FAQ" title="Compound interest questions, answered" />
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
              Project my savings <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            A projection at a constant rate — real investments vary year to year, and past performance
            does not predict future returns.
          </p>
        </div>
      </section>
    </>
  );
}
