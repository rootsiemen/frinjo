import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CreditCardPayoffCalculator from "./CreditCardPayoffCalculator";

export const metadata = {
  title: "Credit Card Payoff Calculator — Avalanche vs Snowball | Frinjo",
  description:
    "Free credit card payoff calculator: multiple cards, real issuer minimum-payment formulas, avalanche vs snowball on one budget, and the minimum-payment trap priced out in months and interest. No sign-up.",
  keywords: [
    "credit card payoff calculator",
    "credit card debt payoff calculator",
    "avalanche vs snowball calculator",
    "credit card payoff calculator with extra payments",
    "how long to pay off credit card",
  ],
  alternates: { canonical: "https://frinjo.me/credit-card-payoff-calculator" },
  openGraph: {
    title: "Credit Card Payoff Calculator — Avalanche vs Snowball | Frinjo",
    description:
      "Both payoff strategies on your real cards and minimum formulas — plus what minimum payments alone actually cost you.",
    url: "https://frinjo.me/credit-card-payoff-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Credit Card Payoff Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/credit-card-payoff-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Simulates multiple credit cards month by month: interest accrues on each balance, minimum payments follow issuer-style formulas (interest + 1% of balance with a $25 floor, interest + 2%, 2% or 3% of balance with a $15 floor, or a fixed payment), and a constant total budget (initial minimums plus the user's extra) is rolled into a target card — highest APR first (avalanche) or smallest balance first (snowball), with freed payments rolling over as cards are retired. Also prices the minimum-payments-only path. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Credit Card Payoff Calculator", item: "https://frinjo.me/credit-card-payoff-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How long does it take to pay off $6,000 of credit card debt on minimums?",
    "Longer than the debt deserves. At 22.99% APR — near the Federal Reserve's 22.36% average for interest-charged accounts — with the common 'interest + 1% of balance' minimum formula, $6,000 takes 250 months: 20 years and 10 months. The interest paid is $10,404.65, more than the original balance, for a total of $16,404.69 handed to the issuer. The balance falls just 1% a month at first, and the $25 payment floor only binds near the very end. This calculator shows that path for your own cards before showing anything else, because it is the baseline every strategy has to beat.",
  ],
  [
    "What does paying $250 a month instead change?",
    "Everything. The same $6,000 at 22.99% paid at a flat $250 a month is gone in 33 months with $2,113.20 of interest — $8,291.45 less interest and roughly 18 years sooner than minimums. The lesson generalizes: a fixed payment that does not shrink as the balance falls is the whole trick. Both strategies in this calculator work that way — minimums on every card, everything else aimed at one target, and the total never drops when a card dies.",
  ],
  [
    "Avalanche or snowball: which payoff strategy is better?",
    "Avalanche (highest APR first) is always the cheapest or tied — it kills the most expensive balance earliest, so less interest accrues overall. Snowball (smallest balance first) retires a card sooner, which some people need to stay the course; its interest penalty is usually modest when balances and rates are not wildly different. Here both run on the same budget and the same cards, so the price of the motivational route is printed in dollars, not argued about. Pick the one whose number you can live with — the best strategy is the one still running in month nine.",
  ],
  [
    "How do issuers actually calculate minimum payments?",
    "The most common big-issuer formula is the month's interest plus 1% of the balance, with a floor around $25. Others use interest + 2%, or a flat 2–3% of the balance with a floor near $15; some smaller issuers set fixed minimums. Your cardholder agreement states yours — this calculator offers the main formulas per card, because a '2% of balance' card behaves very differently from an 'interest + 1%' card at the same APR. If any payment would not cover the month's interest, the calculator says so instead of projecting a payoff that never comes.",
  ],
  [
    "Should I consolidate instead of paying the cards off?",
    "Sometimes. If a consolidation loan or a 0% balance transfer prices out cheaper than your best payoff strategy — after its fees, which are real money — moving the debt wins. The debt consolidation calculator runs that comparison on the same per-debt honesty: every balance on its own APR and payment, fees inside the totals, and a verdict that can still tell you to keep the cards and just pay them in avalanche order.",
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

export default function CreditCardPayoffPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Multi-card · Real minimum formulas
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Credit Card Payoff <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Avalanche vs snowball — on your cards, your budget
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            First, the minimum-payment trap, priced. Then both payoff strategies on one constant
            budget, with the <strong>payoff order</strong>, the <strong>debt-free date</strong> and
            the <strong>interest difference in dollars</strong>.
          </p>
        </div>
      </section>

      <CreditCardPayoffCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="The budget stays constant — only the target changes"
            sub="Every serious payoff method is the same machine. The strategies just aim it differently."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">The machine</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Minimums everywhere, surplus on one</h3>
              <p className="text-stone-600 leading-relaxed">
                Pay every card&apos;s minimum (so nothing defaults), aim every spare dollar at a single
                target, and when it dies, roll its whole payment into the next. The total leaving your
                account never shrinks — which is exactly why the end accelerates.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Avalanche</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Highest APR first</h3>
              <p className="text-stone-600 leading-relaxed">
                The mathematically cheapest order: the most expensive balance dies first, so the total
                interest meter slows soonest. On most real card piles it beats snowball by a few
                hundred dollars — the calculator prints the exact figure for yours.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Snowball</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Smallest balance first</h3>
              <p className="text-stone-600 leading-relaxed">
                A card at zero within the first months is proof the plan works — and plans people
                believe in are plans people finish. If its interest premium over avalanche is small,
                snowball is a rational purchase of momentum.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The formulas</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Your issuer&apos;s minimum, not a guess</h3>
              <p className="text-stone-600 leading-relaxed">
                Interest + 1%, interest + 2%, 2% or 3% of balance, or a fixed payment — pick the formula
                from your card agreement per card. Averages hide it, but the formula decides whether
                minimums take 8 years or 21.
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
            When paying them off is not the cheapest exit
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            The <strong className="text-white">debt consolidation calculator</strong> prices moving
            the balances to one loan or a 0% transfer — fees included, verdict honest. A single
            installment loan instead? The <strong className="text-white">loan payoff
            calculator</strong> handles it, and the{" "}
            <strong className="text-white">personal loan calculator</strong> shows the true APR of
            any offer you are quoted.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/debt-consolidation-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Debt consolidation
            </Link>{" "}
            ·{" "}
            <Link href="/personal-loan-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Personal loan
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
          <SectionHead eyebrow="FAQ" title="Credit card payoff questions, answered" />
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
              Run my payoff plan <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Assumes no new charges on the cards — a payoff plan and fresh spending cannot coexist.
          </p>
        </div>
      </section>
    </>
  );
}
