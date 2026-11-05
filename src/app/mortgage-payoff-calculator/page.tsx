import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import MortgagePayoffCalculator from "./MortgagePayoffCalculator";

export const metadata = {
  title: "Mortgage Payoff Calculator — Debt-Free Date",
  description:
    "Free mortgage payoff calculator: your debt-free date with extra principal or biweekly payments, the PMI drop-off date, and interest saved.",
  keywords: [
    "mortgage payoff calculator",
    "mortgage payoff calculator with extra payments",
    "pmi removal calculator",
    "when will my mortgage be paid off",
    "biweekly mortgage calculator",
    "early mortgage payoff calculator",
  ],
  alternates: { canonical: "https://frinjo.me/mortgage-payoff-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Mortgage Payoff Calculator — PMI Drop-Off & Debt-Free Date | Frinjo",
    description:
      "Extra payments, biweekly and lump sums — plus the date PMI falls off and the extra needed to be mortgage-free by your target year.",
    url: "https://frinjo.me/mortgage-payoff-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mortgage Payoff Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/mortgage-payoff-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Compares a mortgage's current payoff path with an accelerated path (extra monthly principal and/or biweekly payments, modeled as one extra monthly payment per year). Computes months and interest saved, the PMI drop-off month — the first month the balance reaches 80% of the original home value, when PMI removal can be requested (78% is automatic termination) — and total PMI still to pay on each path. Includes a solver for the extra monthly principal needed to be mortgage-free within a chosen number of years. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Mortgage Payoff Calculator", item: "https://frinjo.me/mortgage-payoff-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What does an extra $300 a month do to a mortgage?",
    "On a $320,000 balance at 6.25% with 25 years left, the contractual payment is $2,111.14 and the remaining interest is about $313,000. Adding $300 a month to principal ends the loan 73 months — just over 6 years — sooner and saves $87,790.30 of interest. It also pulls the PMI drop-off forward from month 34 to month 21, saving another $1,950 of PMI premiums ($5,100 still to pay becomes $3,150). Extra principal is the only mortgage move that pays you three times at once.",
  ],
  [
    "When can I remove PMI?",
    "On a conventional loan, two thresholds measured against the home's original value (the lower of purchase price or original appraisal): at 80% loan-to-value you may request removal in writing once you are current on payments; at 78%, the servicer must terminate PMI automatically. In the example above the balance crosses 80% of the $380,000 original value in month 34 on schedule — month 21 with $300 extra. FHA loans are different: mortgage insurance premiums on loans with less than 10% down last the life of the loan, and exiting usually means refinancing into a conventional loan.",
  ],
  [
    "Do biweekly payments really pay off a mortgage faster?",
    "Yes, but the magic is arithmetic, not the two-week cycle: 26 half-payments a year equal 13 full monthly payments, so you sneak in one extra payment annually. On the example loan that is like adding about $176 a month, worth years off the term. One caution: some servicers and third parties charge fees to run a biweekly plan, or hold half-payments until the month completes — which erases the benefit. Paying the same extra directly to principal yourself is free and at least as good.",
  ],
  [
    "Should I pay off my mortgage early or invest the extra?",
    "The honest comparison: extra principal earns a guaranteed return equal to your mortgage rate, after no tax on the saving; investing earns an uncertain, taxable market return. At a 6–7% mortgage rate the guaranteed option is genuinely competitive; at a 3% rate it usually is not — once an emergency fund exists and any higher-rate debts (cards at 20%+) are gone. This calculator shows the guaranteed side of the trade exactly; what markets do is the part nobody can schedule.",
  ],
  [
    "How much extra do I need to be mortgage-free by a specific year?",
    "That is the solver in the calculator: enter your balance, rate and years left, then the years you want it gone in. For the example loan, finishing in 20 years instead of 25 needs a $2,338.96 monthly principal-and-interest payment — $227.82 a month of extra principal over the current $2,111.14.",
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

export default function MortgagePayoffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · PMI drop-off date · Biweekly · Date solver
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Mortgage Payoff <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            The date the bank stops owning your calendar
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Extra principal, biweekly payments, and the two dates nobody else shows you:
            <strong> when PMI falls off</strong>, and <strong>when you are mortgage-free</strong> —
            on your current path and on your faster one.
          </p>
        </div>
      </section>

      <MortgagePayoffCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Three returns on the same extra dollar"
            sub="Extra principal on a mortgage is the rare move that pays you in interest, in time and in PMI."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Return n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Interest never charged</h3>
              <p className="text-stone-600 leading-relaxed">
                $300 a month extra on the example loan saves $87,790.30 — because every prepaid dollar
                stops generating interest for the remaining decades. The earlier the dollar lands, the
                more interest it deletes.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Return n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Years handed back</h3>
              <p className="text-stone-600 leading-relaxed">
                The same plan cuts 73 months — the mortgage ends in a different season of life.
                Retiring the payment before retirement itself is the most common goal this calculator
                gets used for.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Return n° 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">PMI, gone sooner</h3>
              <p className="text-stone-600 leading-relaxed">
                PMI protects the lender, not you, and it ends at 80% of the original value. Extras pull
                that date from month 34 to month 21 in the example — $1,950 of premiums never billed,
                on top of the interest saving.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The solver</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Pick the year, get the number</h3>
              <p className="text-stone-600 leading-relaxed">
                Mortgage-free by 55? By the last tuition bill? Enter the years and the calculator
                returns the exact extra principal per month that lands the payoff in that window —
                for the example, $227.82 a month buys the 20-year finish.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The mortgage cluster
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Still shopping, or already paying?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Before the purchase, the <strong className="text-white">home affordability
            calculator</strong> and the <strong className="text-white">DTI calculator</strong> set the
            budget the lender will actually honor. For the raw schedule behind any loan — with a CSV
            download — use the <strong className="text-white">amortization calculator</strong>.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/home-affordability-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Home affordability
            </Link>{" "}
            ·{" "}
            <Link href="/dti-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              DTI calculator
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
          <SectionHead eyebrow="FAQ" title="Mortgage payoff questions, answered" />
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
              Find my mortgage-free date <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimates for fixed-rate loans; servicer statements and your note govern the real dates.
          </p>
        </div>
      </section>
    </>
  );
}
