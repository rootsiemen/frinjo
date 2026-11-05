import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import PersonalLoanCalculator from "./PersonalLoanCalculator";

export const metadata = {
  title: "Personal Loan Calculator — True APR With the Fee Counted | Frinjo",
  description:
    "Free personal loan calculator that counts the origination fee: true APR, cash you actually receive, total cost, repayment schedule and a DTI affordability check. Compare offers honestly. No sign-up.",
  keywords: [
    "personal loan calculator",
    "personal loan calculator with origination fee",
    "true apr calculator",
    "personal loan apr calculator",
    "how much personal loan can i afford",
  ],
  alternates: { canonical: "https://frinjo.me/personal-loan-calculator" },
  openGraph: {
    title: "Personal Loan Calculator — True APR With the Fee Counted | Frinjo",
    description:
      "The quoted rate prices the payments. The true APR prices what you received. Fee in, both modes, plus total cost and an affordability check.",
    url: "https://frinjo.me/personal-loan-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Personal Loan Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/personal-loan-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Computes a personal loan's payment from the note rate, then solves the true APR — the rate that makes the payment stream worth exactly the cash the borrower receives — with the origination fee either deducted from the proceeds or financed into the balance. Shows net cash received, fee amount, total interest, total cost (payments minus cash received), a year-by-year schedule, and a back-end DTI affordability check with the new payment included. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Personal Loan Calculator", item: "https://frinjo.me/personal-loan-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Why is my loan's APR higher than the rate I was quoted?",
    "Because the quoted (note) rate prices only the payments, while the APR prices the payments against the cash you actually receive. Worked example from this calculator: borrow $15,000 at 11.5% for 48 months with a 6% origination fee deducted. The payment is $391.34 — but only $14,100 reaches your account; $900 stayed with the lender. The rate that makes those payments worth $14,100 is a true APR of 14.85%, and the loan's total cost (everything paid minus cash received) is $4,684.02. Federal law requires lenders to disclose an APR, but many calculators quietly use the note rate. This one never does.",
  ],
  [
    "Is a fee deducted or financed — which is worse?",
    "Per dollar you actually receive, deducted is worse. Run the worked example both ways: with the 6% fee deducted, the true APR is 14.85% — you make payments on $15,000 while only $14,100 ever reached you. With the fee financed, you receive the full $15,000 and repay $15,900; the true APR is 14.65%, lower because the fee is effectively borrowed at the note rate instead of being discounted from your proceeds on day one. The catch: financing the fee means paying interest on it, so neither treatment is free — which is why this calculator insists on knowing how the fee is taken before naming a rate.",
  ],
  [
    "What is a fair rate for a personal loan?",
    "The Federal Reserve's G.19 release puts the average rate on a 24-month personal loan from commercial banks at about 11.9% (11.86–11.90% in recent releases). Excellent credit borrows well below that; fair credit pays several points more; offers above 20% should be compared against credit cards, which at least charge no origination fee. Judge every offer by its true APR and total cost from this calculator, not by the monthly payment a long term can make deceptively small.",
  ],
  [
    "How much personal loan can I afford?",
    "Lenders look at your back-end debt-to-income ratio with the new payment added: under 36% is comfortable, 36–43% is the cautious zone, and above that approvals thin out and prices rise. The affordability panel above runs that check with your numbers. A second, older test also helps: if the payment requires the loan to go perfectly — no overtime cut, no car repair — for its whole term, the loan is too big at any rate.",
  ],
  [
    "Does the calculator include the fee in the schedule?",
    "Yes. When the fee is financed, the schedule amortizes the full balance including the fee, so the interest shown includes interest on the fee itself. When it is deducted, the schedule covers the loan amount and the fee is reported separately in the total cost. Both treatments end at the same honest place: total cost.",
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

export default function PersonalLoanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · True APR · Fee counted both ways
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Personal Loan <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            The rate you were quoted is not the rate you are paying
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            An origination fee of a few percent quietly adds points to your real rate. This calculator
            counts it — and shows the <strong>true APR</strong>, the <strong>cash you actually
            receive</strong>, and the <strong>total cost</strong> of the loan.
          </p>
        </div>
      </section>

      <PersonalLoanCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Two rates live inside every loan offer"
            sub="The note rate is marketing. The APR is accounting. Only one of them is your money."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Rate n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The note rate prices payments</h3>
              <p className="text-stone-600 leading-relaxed">
                It is applied to the full loan amount to produce the monthly payment — in the worked
                example, $391.34 on $15,000 at 11.5%. Nothing about it is false; it is simply not the
                whole price.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Rate n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The APR prices what you received</h3>
              <p className="text-stone-600 leading-relaxed">
                With $900 of fee deducted, you received $14,100 but pay as if you got $15,000. Solving
                for the rate that reconciles the two gives 14.85% — the number that makes offers with
                different fees comparable at a glance.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The tiebreaker</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Total cost settles arguments</h3>
              <p className="text-stone-600 leading-relaxed">
                Payments out minus cash in. It absorbs rate, fee and term into one figure, which is why
                a slightly higher rate with no fee so often beats a &lsquo;cheaper&rsquo; loan carrying
                6% off the top.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The guardrail</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Affordability, checked the lender&apos;s way</h3>
              <p className="text-stone-600 leading-relaxed">
                The optional panel adds the new payment to your debts and reports your back-end DTI —
                the ratio that decides approvals and, more importantly, whether the loan leaves your
                budget any room to breathe.
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
            Borrowing to end debt? Check the other side first
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            If this loan would consolidate cards, run the{" "}
            <strong className="text-white">debt consolidation calculator</strong> before signing — it
            prices keeping the cards against the loan, fees on both sides. Already have the loan? The{" "}
            <strong className="text-white">loan payoff calculator</strong> shows what extra payments
            save, and the <strong className="text-white">amortization calculator</strong> prints its
            full schedule.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/debt-consolidation-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Debt consolidation
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
          <SectionHead eyebrow="FAQ" title="Personal loan questions, answered" />
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
              Get my true APR <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimates only; the APR on your lender&apos;s Truth in Lending disclosure governs.
          </p>
        </div>
      </section>
    </>
  );
}
