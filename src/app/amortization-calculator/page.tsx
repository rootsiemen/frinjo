import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import AmortizationCalculator from "./AmortizationCalculator";

export const metadata = {
  title: "Amortization Calculator — Full Schedule, CSV & Crossover | Frinjo",
  description:
    "Free amortization calculator with extra monthly, annual and one-time payments built in: full monthly and yearly schedules, the principal/interest crossover point, CSV download and print. No sign-up.",
  keywords: [
    "amortization calculator",
    "amortization schedule calculator",
    "loan amortization calculator",
    "amortization calculator with extra payments",
    "mortgage amortization calculator",
  ],
  alternates: { canonical: "https://frinjo.me/amortization-calculator" },
  openGraph: {
    title: "Amortization Calculator — Full Schedule, CSV & Crossover | Frinjo",
    description:
      "The complete schedule — monthly and yearly — with extras, the crossover month, CSV export and print. The mortgage cluster's second door.",
    url: "https://frinjo.me/amortization-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Amortization Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/amortization-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Builds the full amortization schedule for a fixed-rate loan: monthly payment M = P × r(1+r)^n / ((1+r)^n − 1), month-by-month principal/interest split, yearly aggregation, total interest, and the crossover month in which the principal portion of the payment first exceeds the interest portion. Supports extra monthly principal, a yearly lump sum and a one-time lump sum, with CSV download and print of the complete schedule. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Amortization Calculator", item: "https://frinjo.me/amortization-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is an amortization schedule calculated?",
    "Each month: interest = remaining balance × (annual rate ÷ 12); the rest of the fixed payment cuts principal; the balance falls by that principal. On a $320,000 loan at 6.25% over 30 years the payment is $1,970.30. In month one, interest takes $1,666.67 of it and principal gets $303.63. Because the balance shrinks slowly at first, year one totals just $3,749.80 of principal against $19,893.80 of interest — the schedule above shows every month of your own loan the same way.",
  ],
  [
    "What is the crossover point in an amortization schedule?",
    "The month where the principal portion of a payment first exceeds the interest portion — the loan's halfway point in spirit, though not in time. On the $320,000, 6.25%, 30-year example it arrives at payment #228, deep into year 19. Before it, most of every payment is rent to the lender; after it, most builds equity. Extra payments drag the crossover years earlier, which is a cleaner way to feel their effect than the interest total alone.",
  ],
  [
    "How much of a 30-year mortgage is interest, really?",
    "At 6.25%, the $320,000 example pays $389,302.92 of interest over 30 years — more than the house loan itself, and 54.9% of everything paid. The halfway shock is worse: after 15 years of on-time payments ($354,654 handed over), only $90,208.77 of principal is gone and the balance still stands at $229,791.25. That shape — not the rate alone — is why early extra payments are worth so much more than late ones.",
  ],
  [
    "Can I download or print the schedule?",
    "Yes. The CSV button exports the complete month-by-month schedule (payment, principal, interest, extra principal, balance) for a spreadsheet, and the print button produces a clean copy of the results and yearly table. Everything is generated in your browser from the numbers you typed — nothing is uploaded.",
  ],
  [
    "Does the schedule include taxes and insurance?",
    "No — amortization covers principal and interest only, by definition. Property tax, homeowner's insurance, HOA dues and PMI ride on top of the scheduled payment in a real mortgage bill (usually through escrow). The home affordability calculator prices those lines in before naming a home price; this page shows the loan itself, undiluted.",
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

export default function AmortizationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Full schedule · CSV + print
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Amortization <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Every payment, split open — principal vs interest
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The complete schedule with extra payments built in, the{" "}
            <strong>crossover month</strong> where your payment starts working for you, and a CSV
            you can keep. No feature is hiding behind a paid tier.
          </p>
        </div>
      </section>

      <AmortizationCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="A fixed payment with a moving split"
            sub="The payment never changes. What it buys changes every single month."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The shape</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Interest first, by construction</h3>
              <p className="text-stone-600 leading-relaxed">
                Interest is charged on what you still owe, so the earliest payments are almost all
                interest: year one of the example loan retires $3,749.80 of principal while paying
                $19,893.80 of interest. That is not a bank trick — it is arithmetic on a big balance —
                but seeing it is what motivates every payoff strategy.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The extras</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Three kinds, one schedule</h3>
              <p className="text-stone-600 leading-relaxed">
                Monthly extra principal, a yearly lump each December, and a one-time lump in the month
                you choose — most calculators give you one of the three. Here they combine, and the
                schedule, payoff date and crossover all recompute honestly.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The crossover</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The loan&apos;s turning point</h3>
              <p className="text-stone-600 leading-relaxed">
                Payment #228 of 360 in the example — the first month principal beats interest. Lenders
                do not print it on your statement; this calculator names it, because watching it move
                closer is the most motivating number in the whole schedule.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The export</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Yours to keep</h3>
              <p className="text-stone-600 leading-relaxed">
                Download the full monthly schedule as CSV for your own models, or print the yearly
                summary for a refinance conversation. Generated locally, from your numbers, with no
                account and no watermark.
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
            The schedule is the map — these are the vehicles
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Shopping for the home? The <strong className="text-white">home affordability
            calculator</strong> works backwards from your income. Paying one off? The{" "}
            <strong className="text-white">mortgage payoff calculator</strong> adds the PMI drop-off
            date and the debt-free-date solver. A smaller loan belongs in the{" "}
            <strong className="text-white">loan payoff calculator</strong>.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/home-affordability-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Home affordability
            </Link>{" "}
            ·{" "}
            <Link href="/mortgage-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Mortgage payoff
            </Link>{" "}
            ·{" "}
            <Link href="/loan-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Loan payoff
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
          <SectionHead eyebrow="FAQ" title="Amortization questions, answered" />
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
              Build my schedule <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Fixed-rate schedules only; adjustable-rate loans re-price at each reset, which no static
            schedule can promise.
          </p>
        </div>
      </section>
    </>
  );
}
