import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import LoanPayoffCalculator from "./LoanPayoffCalculator";

export const metadata = {
  title: "Loan Payoff Calculator — Pay Off Your Loan Early | Frinjo",
  description:
    "Free loan payoff calculator: extra monthly payments and lump sums against any loan, the payoff-by-a-target-date solver, interest saved and a year-by-year schedule. Works for car, personal, student and other installment loans. No sign-up.",
  keywords: [
    "loan payoff calculator",
    "pay off loan early calculator",
    "loan payoff calculator with extra payments",
    "early payoff calculator",
    "how long to pay off loan",
  ],
  alternates: { canonical: "https://frinjo.me/loan-payoff-calculator" },
  openGraph: {
    title: "Loan Payoff Calculator — Pay Off Your Loan Early | Frinjo",
    description:
      "Extra payments, lump sums and a payoff-by-date solver on one page — with the interest saved and the new debt-free date, for any installment loan.",
    url: "https://frinjo.me/loan-payoff-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Loan Payoff Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/loan-payoff-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Computes the contractual payment from balance, APR and remaining term, then re-runs the amortization with extra monthly principal and one-time lump sums: new payoff date, months saved, interest saved, and a year-by-year schedule. A second mode solves the extra monthly payment required to be debt-free within a chosen number of months. Assumes extras are applied to principal and no prepayment penalty. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Loan Payoff Calculator", item: "https://frinjo.me/loan-payoff-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much faster does $150 extra a month pay off a car loan?",
    "Take a $28,000 car loan at 8.9% with 5 years left: the contractual payment is $579.88 and the remaining interest is $6,792.50. Add $150 a month to principal and the loan dies in 46 months instead of 60 — 14 months sooner — and $1,721.57 of that interest is never paid. The leverage is time: extra principal paid in year one removes interest charges in every later month, which is why the same $150 started two years late saves noticeably less.",
  ],
  [
    "Is a lump sum or a monthly extra better?",
    "Mathematically, money paid earlier wins: a $3,000 lump sum in month 6 removes more interest than the same $3,000 dripped over the following years, because the balance it would have sat on is gone sooner. Behaviorally, the monthly extra wins for most people because it is automatic. This calculator lets you combine both — a monthly extra plus one dated lump sum — which is how bonuses and tax refunds actually arrive.",
  ],
  [
    "How do I make sure my extra payment goes to principal?",
    "Tell the lender, in the payment instructions, 'apply to principal'. Some servicers default extra money to pre-paying the next months' bills (which advances your due date but barely cuts interest), and some require a separate principal-only payment channel. Check the next statement: the balance should fall by the payment plus the full extra, minus only that month's interest.",
  ],
  [
    "Should I pay off a loan early at all?",
    "Compare the loan's APR with what the money does elsewhere and with your safety net. Extra payments earn a guaranteed, tax-free return equal to the APR — repaying an 8.9% car loan is an 8.9% risk-free return. But draining your emergency fund to kill a cheap 3% loan trades a small saving for real fragility, and some loans carry prepayment penalties (this calculator assumes none — check your contract). High-APR first, cushion intact, is the usual order.",
  ],
  [
    "Can I pick my payoff date instead of an extra amount?",
    "Yes — that is the second mode above. Enter the loan and the number of months you want it gone in, and the calculator solves the payment that lands exactly on that date and the extra above your current payment needed to fund it. It is the right way to plan around a lease start, a move, or a second loan you want sequenced after this one.",
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

export default function LoanPayoffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Extra payments · Payoff-by-date solver
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Loan Payoff <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your debt-free date, moved closer — on purpose
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Extra monthly payments, a one-time lump sum, or a target date you refuse to miss:
            see the <strong>new payoff date</strong> and the <strong>interest you never pay</strong>,
            for any installment loan.
          </p>
        </div>
      </section>

      <LoanPayoffCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Interest is rent on a balance — shrink the balance"
            sub="Every payoff strategy is the same trick at a different speed: get principal down earlier."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Lever n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The monthly extra</h3>
              <p className="text-stone-600 leading-relaxed">
                Small, automatic, relentless. Because interest is charged on the remaining balance,
                each month&apos;s extra removes a little interest from every month after it — the
                savings compound in your favor for once.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Lever n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The dated lump sum</h3>
              <p className="text-stone-600 leading-relaxed">
                Bonuses, refunds and sold-the-car money. Paid early, a lump sum deletes a slice of
                balance and all the interest that slice would have generated for the rest of the term.
                This calculator dates it to the month so you see the real effect.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The solver</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Work backwards from a date</h3>
              <p className="text-stone-600 leading-relaxed">
                Deadlines are how life actually schedules debt: the loan gone before the baby, the
                move, the next loan. Pick the month count and the calculator returns the exact payment
                that lands on it — no guessing, no spreadsheet.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The fine print</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Principal-only, penalty-checked</h3>
              <p className="text-stone-600 leading-relaxed">
                The math assumes extras hit principal immediately and the loan has no prepayment
                penalty. Both are usually true for car, personal and student loans — and both are
                worth one phone call to confirm before you send real money.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The payoff cluster
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            One loan, or the whole pile?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Mortgages get their own version — the <strong className="text-white">mortgage payoff
            calculator</strong> adds the PMI drop-off date and biweekly payments. Several balances at
            once belong in the <strong className="text-white">credit card payoff calculator</strong>{" "}
            (avalanche vs snowball) or the{" "}
            <strong className="text-white">debt consolidation calculator</strong>, which prices
            rolling everything into one loan without flinching.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/mortgage-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Mortgage payoff
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
          <SectionHead eyebrow="FAQ" title="Loan payoff questions, answered" />
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
              Move my payoff date <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimates assume on-time payments and extras applied to principal; your servicer&apos;s
            statement is the final word.
          </p>
        </div>
      </section>
    </>
  );
}
