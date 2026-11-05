import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import DtiCalculator from "./DtiCalculator";

export const metadata = {
  title: "DTI Calculator — Debt-to-Income Ratio for a Mortgage | Frinjo",
  description:
    "Free debt-to-income (DTI) calculator: front-end and back-end ratios from your real payments, verdicts by Conventional, FHA and VA guidelines, and how much more debt you can carry at 36% and 43%. No sign-up.",
  keywords: [
    "dti calculator",
    "debt to income ratio calculator",
    "debt-to-income calculator",
    "dti ratio calculator",
    "mortgage dti calculator",
    "how to calculate dti",
  ],
  alternates: { canonical: "https://frinjo.me/dti-calculator" },
  openGraph: {
    title: "DTI Calculator — Debt-to-Income Ratio for a Mortgage | Frinjo",
    description:
      "Front-end and back-end DTI from your actual payments, checked against Conventional 28/36, FHA 31/43 and VA 41 guidelines — plus your remaining borrowing room.",
    url: "https://frinjo.me/dti-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "DTI Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/dti-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Computes front-end DTI (housing cost / gross monthly income) and back-end DTI ((housing + all recurring monthly debt payments) / gross monthly income), itemizing debts individually. Checks both ratios against Conventional (28/36), FHA (31/43) and VA (41% back-end) guidelines, shows the maximum housing payment each program allows for the borrower's numbers, and solves how much additional monthly debt payment fits under 36% and 43% back-end targets. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "DTI Calculator", item: "https://frinjo.me/dti-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate my debt-to-income ratio? A worked example",
    "Add up the payments, not the balances. Take gross monthly income of $7,500, a housing cost of $2,100 and other debt payments of $950 (car, cards, student loan). Front-end DTI = 2,100 ÷ 7,500 = 28.00% — right at the classic housing guideline. Back-end DTI = (2,100 + 950) ÷ 7,500 = 40.67% — above the conventional 36% guideline but inside FHA's 43%. For that borrower a conventional lender's ratio math allows a housing payment of at most $1,750 (the back-end cap binds: 36% of $7,500 minus the $950 of debts), while at the FHA 43% level there is room for $175 a month of additional debt payment. Run your own numbers above — the table updates per program.",
  ],
  [
    "What is a good DTI ratio for a mortgage?",
    "Under 20% back-end is excellent and passes everything. 21–36% is the classic comfort zone (the 28/36 rule). 37–43% is workable — FHA's guideline ceiling and a range conventional automated underwriting regularly approves with good credit or reserves. 44–50% is stretched: possible with strong compensating factors, fragile in real life. Above 50%, mainstream programs generally say no until debts shrink. Lenders look at both ratios, but the back-end number decides most files.",
  ],
  [
    "What counts as a debt in DTI — and what does not?",
    "Counts: mortgage or rent, car loans and leases, credit-card minimum payments (the minimum, not the balance), student loans, personal loans, child support and alimony, and other installment payments that show on a credit report. Does not count: groceries, utilities, phone bills, insurance premiums, subscriptions, and day-to-day spending. One trap: a co-signed loan counts against you unless you can document 12 months of the other person paying it.",
  ],
  [
    "What is the difference between front-end and back-end DTI?",
    "Front-end is housing alone: rent or the full mortgage payment (principal, interest, taxes, insurance, HOA) divided by gross monthly income. Back-end adds every other recurring debt payment on top. Conventional guidelines watch both (28/36); FHA uses 31/43; VA has no front-end cap at all and works from a 41% back-end guideline plus residual income — what is left over after debts, taxes and living costs.",
  ],
  [
    "How can I lower my DTI fastest before applying?",
    "DTI moves with payments, not balances — so the fastest win is killing a payment entirely. A $3,000 car loan with a $450 payment hurts your ratio far more than a $9,000 card balance with a $180 minimum. Paying off small installment debts outright, then the debt with the largest payment per dollar owed, beats spreading extra money evenly. Also honest: a higher documented income (a raise, a second job held for two years) moves the denominator the same way.",
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

export default function DtiPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Itemized debts · Program verdicts
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            DTI <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your debt-to-income ratio, judged like an underwriter
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Front-end and back-end ratios from your real payments — checked against Conventional,
            FHA and VA guidelines, with the answer to the next question:
            <strong> how much more debt can you carry?</strong>
          </p>
        </div>
      </section>

      <DtiCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="One division, two ratios, three programs"
            sub="DTI is simple arithmetic with strict audiences. Here is what each number is for."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The inputs</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Payments, never balances</h3>
              <p className="text-stone-600 leading-relaxed">
                A $20,000 car loan at $380 a month counts as $380. A $900 card balance counts as its
                ~$25 minimum. Lenders care about the monthly claim on your income, which is why this
                calculator asks for payments and lets you itemize every debt.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The programs</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">28/36, 31/43, and VA&apos;s 41</h3>
              <p className="text-stone-600 leading-relaxed">
                The same borrower can fail conventional and pass FHA in the same afternoon. The results
                table shows, per program, the largest housing payment your income and debts allow — so
                you can see which door is actually open.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The next question</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Borrowing room, solved</h3>
              <p className="text-stone-600 leading-relaxed">
                Most DTI tools stop at the ratio. This one also solves the lender&apos;s follow-up: at a
                36% or 43% back-end target, how many dollars of new monthly payment still fit? That is
                the number that decides whether the car waits until after the house.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The hand-off</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Straight into affordability</h3>
              <p className="text-stone-600 leading-relaxed">
                Your income and total debts travel with one click into the home affordability
                calculator, which turns the ratios into a maximum home price with taxes, insurance
                and PMI priced in. No retyping, no sign-up.
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
            Ratios are the start, not the answer
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Turn the ratio into a price with the <strong className="text-white">home affordability
            calculator</strong>. Already paying a mortgage? The{" "}
            <strong className="text-white">mortgage payoff calculator</strong> finds your PMI drop-off
            date — and every point of DTI your extra payments buy back.
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
          <SectionHead eyebrow="FAQ" title="Debt-to-income questions, answered" />
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
              Calculate my DTI <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Guideline ratios are planning estimates; individual lenders apply their own overlays.
          </p>
        </div>
      </section>
    </>
  );
}
