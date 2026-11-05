import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import ConsolidationCalculator from "./ConsolidationCalculator";

export const metadata = {
  title: "Debt Consolidation Calculator — Per-Debt",
  description:
    "Free debt consolidation calculator: every debt modeled separately, comparing staying put, a consolidation loan and a balance transfer — honestly.",
  keywords: [
    "debt consolidation calculator",
    "consolidation loan calculator",
    "debt consolidation loan calculator",
    "is debt consolidation worth it calculator",
    "balance transfer calculator",
  ],
  alternates: { canonical: "https://frinjo.me/debt-consolidation-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Debt Consolidation Calculator — Per-Debt, With the Honest Verdict | Frinjo",
    description:
      "Each debt on its own balance, APR and payment. Staying put vs a consolidation loan vs a balance transfer — and a verdict that can tell you to stay put.",
    url: "https://frinjo.me/debt-consolidation-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Debt Consolidation Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/debt-consolidation-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Models each debt independently (own balance, APR and monthly payment, amortized separately; a payment that does not cover interest is flagged as never paying off) and compares three paths: staying the course, a consolidation loan (rate, term, origination fee financed or paid in cash), and a balance-transfer offer (promo APR and months, transfer fee, go-to APR, fixed monthly payment). Returns total cost, time and interest per path and a verdict naming the cheapest — including when staying put wins. No lender relationships; calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Debt Consolidation Calculator", item: "https://frinjo.me/debt-consolidation-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Is debt consolidation worth it? A worked example",
    "It depends entirely on the numbers — here is a real run of this calculator. Debts: an $8,000 card at 24.99% paid at $250 a month, and a $4,000 card at 19.99% paid at $150. Staying put costs $6,649.63 of interest and ends in month 54 (total paid $18,649.62). A consolidation loan at 11% for 48 months with a 3% fee financed costs $2,973.64 of interest, $15,333.65 all-in — $3,315.97 cheaper, and the payment drops from $400 to $319.45. Worth it here, clearly. But change the term to 7 years and the same loan's lower payment hides a higher total interest bill: consolidation is worth it when the total cost falls, not when the monthly payment does.",
  ],
  [
    "Why does this calculator refuse to average my debts?",
    "Because the average lies in the borrower's disfavor. A $500 balance at 29.99% and a $9,500 balance at 9.99% do not behave like $10,000 at some blended rate: the small toxic balance dies quickly on its own payment, and the big cheap one dominates the timeline. Blended-average calculators (several top results for this search admit to it on the page) systematically misprice both paths. Here each debt is amortized on its own terms, and a debt whose payment misses its interest is labeled as never paying off — the single most important fact in a consolidation decision.",
  ],
  [
    "How does the origination fee change the answer?",
    "The fee is real money: 3% on $12,000 is $360, owed whether it is financed into the loan (where it also earns the lender interest) or paid in cash. This calculator prices both treatments and counts the fee in the loan's total cost, so a 'low rate' with a fat fee cannot sneak past. As a rule, every point of fee needs roughly a point of rate advantage over a longer term to pay for itself — the comparison above does that math exactly.",
  ],
  [
    "Consolidation loan or balance transfer — which is better?",
    "A balance transfer is cheaper when you can truly kill the balance inside the promo window: in the worked example the 0%-for-12-months transfer with a 3% fee beats the consolidation loan on total cost — if the $400 monthly payment holds. Miss the window and the go-to rate (22.99% in the example) starts eating the saving. A consolidation loan is the more forgiving instrument: fixed payment, fixed end date, no cliff. The calculator prices both against your actual payoff speed instead of awarding either one by slogan.",
  ],
  [
    "When is consolidation a bad idea?",
    "Three times: when the new loan's total cost is higher (long term, modest rate cut, big fee) — the verdict above will say so; when a current debt never pays off and the real problem is the payment level, not the rate; and when the freed-up cards get spent back to their limits, the classic failure that doubles the debt instead of halving it. Consolidation rearranges debt. Only payments retire it.",
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

export default function DebtConsolidationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Per-debt modeling · No lender ads
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Debt Consolidation <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Every debt on its own terms — and a verdict that can say &ldquo;don&apos;t&rdquo;
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            No blended averages, no loan offers, no lead form. Your debts, a consolidation loan and a
            balance transfer priced side by side — and the <strong>cheapest path named honestly</strong>,
            even when it is staying put.
          </p>
        </div>
      </section>

      <ConsolidationCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Consolidation is a pricing question, not a product"
            sub="Three paths, one winner — decided by total cost, never by the size of the monthly payment."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Honesty n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Per-debt, never blended</h3>
              <p className="text-stone-600 leading-relaxed">
                Each balance keeps its own APR and payment, because that is how debt actually behaves.
                The per-debt table shows exactly when each one clears — and flags any payment that
                does not cover its own interest.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Honesty n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Fees counted, both ways</h3>
              <p className="text-stone-600 leading-relaxed">
                Origination and transfer fees are inside the totals — financed (with the interest they
                accrue) or in cash. A 3% fee on $12,000 is $360 that a rate-only comparison pretends
                does not exist.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The trap</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">A lower payment can cost more</h3>
              <p className="text-stone-600 leading-relaxed">
                Stretching $12,000 over 7 years at 11% feels easier monthly and charges more overall
                than the 48-month version. The verdict compares total cost first — payment size is
                reported, never celebrated on its own.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">The third path</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Balance transfers priced honestly</h3>
              <p className="text-stone-600 leading-relaxed">
                Promo rate, promo window, transfer fee, go-to rate — all four, because the fourth is
                where transfers go wrong. If the balance survives the window, the model keeps charging
                the real rate until it is gone.
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
            If you keep the cards, pay them in the right order
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Staying put works best with a strategy: the{" "}
            <strong className="text-white">credit card payoff calculator</strong> runs avalanche vs
            snowball on your balances. One single loan instead? The{" "}
            <strong className="text-white">personal loan calculator</strong> exposes the fee hiding
            inside its APR, and the <strong className="text-white">loan payoff calculator</strong>{" "}
            prices any early-payoff plan.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/credit-card-payoff-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Credit card payoff
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
          <SectionHead eyebrow="FAQ" title="Debt consolidation questions, answered" />
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
              Price my three paths <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            A planning tool, not financial advice or a loan offer; lenders&apos; actual terms govern.
          </p>
        </div>
      </section>
    </>
  );
}
