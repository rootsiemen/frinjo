import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import AffordabilityCalculator from "./AffordabilityCalculator";

export const metadata = {
  title: "Home Affordability Calculator — By Income",
  description:
    "Free home affordability calculator: how much house your income supports with Conventional, FHA and VA presets — tax, insurance, HOA and PMI in.",
  keywords: [
    "home affordability calculator",
    "how much house can i afford",
    "house affordability calculator",
    "how much home can i afford",
    "income needed to buy a house",
    "fha affordability calculator",
  ],
  alternates: { canonical: "https://frinjo.me/home-affordability-calculator" },
  openGraph: {
    title: "Home Affordability Calculator — How Much House Can I Afford? | Frinjo",
    description:
      "Affordability the way lenders compute it: both DTI ratios, loan-program presets, taxes, insurance, HOA and PMI — plus the reverse income-needed mode.",
    url: "https://frinjo.me/home-affordability-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Home Affordability Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/home-affordability-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Solves the maximum home price whose full monthly cost (principal & interest + property tax + homeowner's insurance + HOA + mortgage insurance) fits a loan program's front-end and back-end debt-to-income ratios. Program presets: Conventional 28/36, FHA 31/43 with 1.75% upfront MIP financed and 0.55% annual MIP, VA 41% back-end with a 2.15% financed funding fee and no monthly mortgage insurance. Conventional PMI is charged while the loan exceeds 80% of the price. A reverse mode solves the gross annual income a target price requires. Estimates for planning, not a pre-approval. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Home Affordability Calculator", item: "https://frinjo.me/home-affordability-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much house can I afford on a $95,000 salary?",
    "It depends on your debts, down payment and program — which is exactly what this calculator solves. With $400 a month of other debts, $60,000 down, a 6.75% 30-year rate, property tax at 1.1% of the price and insurance at $2,400 a year, a conventional loan tops out at $310,875: the total payment is $2,216.67 a month, exactly 28% of gross monthly income, so the front-end ratio is the binding limit. The same borrower qualifies for $335,498 on an FHA loan because FHA allows a 31% housing ratio — but FHA adds a 1.75% upfront mortgage insurance premium to the loan and $128.48 a month of annual MIP at that price, so the bigger approval is not free.",
  ],
  [
    "What is the 28/36 rule?",
    "The classic lender guideline: housing costs (principal, interest, taxes, insurance, HOA and mortgage insurance) should stay under 28% of gross monthly income, and housing plus all other recurring debt payments under 36%. Conventional automated underwriting can stretch the back-end ratio toward 50% with strong credit and cash reserves, FHA works to 31/43 (up to 56.9% with compensating factors), and VA uses a 41% back-end guideline plus a residual-income test instead of a front-end cap. This calculator uses the guideline ratios so the answer stays on the safe side of what lenders advertise.",
  ],
  [
    "Why does a bigger down payment raise the affordable price twice?",
    "First, every extra dollar down is a dollar you do not borrow, so the principal-and-interest part shrinks. Second, crossing 20% down removes conventional PMI entirely — on a roughly $250,000 loan at the default 0.5% annual PMI rate that is about $105 a month gone, which itself supports a higher price under the ratios. In the $95,000 example above, PMI is $104.53 of the monthly cost precisely because the $60,000 down payment lands just under 20% of the $310,875 price.",
  ],
  [
    "Does the calculator include taxes, insurance and HOA?",
    "Yes — lenders qualify you on the full housing payment, not principal and interest alone. In the worked example the $2,216.67 monthly total is $1,627.17 of principal and interest plus $284.97 of property tax, $200 of insurance and $104.53 of PMI. Skipping those lines is how simpler calculators overstate what you can afford by tens of thousands of dollars. Property tax is the swing factor: at 2.3% (New Jersey-like) instead of 1.1%, the same borrower affords $286,318 instead of $310,875 — about $25,000 less house on tax alone.",
  ],
  [
    "Is the result a mortgage pre-approval?",
    "No. It is the same ratio math a lender starts with, but a real pre-approval also verifies your income and assets, pulls your credit, prices the actual rate of the day, and checks the specific property's taxes and insurance. Treat the number here as the ceiling to shop under, and keep a margin — homes come with maintenance and moving costs that no ratio counts.",
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

export default function HomeAffordabilityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · FHA / VA presets · Reverse mode
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Home Affordability <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            How much house can you afford — the lender&apos;s way
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Both debt-to-income ratios, your loan program&apos;s real limits, and the full monthly cost —
            taxes, insurance, HOA and PMI included. Or flip it around and get the
            <strong> income a price needs</strong>.
          </p>
        </div>
      </section>

      <AffordabilityCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Affordability is two ratios and one honest payment"
            sub="Lenders never ask what price you like. They ask what payment your income survives — twice."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Ratio n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The front-end (housing) ratio</h3>
              <p className="text-stone-600 leading-relaxed">
                Housing cost alone against gross income: 28% for conventional loans, 31% for FHA, no cap
                for VA. It is the ratio that binds for most buyers with modest debts — in the worked
                example it caps the payment at $2,216.67 a month.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Ratio n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The back-end (total debt) ratio</h3>
              <p className="text-stone-600 leading-relaxed">
                Housing plus car loans, card minimums and student loans: 36% conventional, 43% FHA, 41%
                VA guideline. Heavy debts eat the house budget from this side — $400 a month of debts
                removes roughly $60,000 of buying power at today&apos;s rates.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">The honest payment</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">PITI + HOA + MI, not just P&I</h3>
              <p className="text-stone-600 leading-relaxed">
                Principal and interest are often barely two-thirds of the real payment. This calculator
                prices property tax as a % of the price, insurance, HOA dues and mortgage insurance
                (conventional PMI under 20% down, FHA&apos;s annual MIP) before it names a price.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Reverse mode</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Already found the house?</h3>
              <p className="text-stone-600 leading-relaxed">
                Enter the price and get the gross income that satisfies both ratios at once — the number
                to compare against a raise, a second income, or a cheaper target. It answers the
                question buyers actually ask after falling for a listing.
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
            Before and after the purchase
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Not sure what your debts add up to? Start with the <strong className="text-white">DTI
            calculator</strong> — it hands its numbers straight into this page. Already own the home?
            The <strong className="text-white">mortgage payoff calculator</strong> shows your PMI
            drop-off date and what extra payments save, and the{" "}
            <strong className="text-white">amortization calculator</strong> prints the full schedule
            behind any loan.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/dti-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              DTI calculator
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
          <SectionHead eyebrow="FAQ" title="Home affordability questions, answered" />
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
              Calculate my price <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimates for planning only — not a pre-approval, rate quote or lending decision.
          </p>
        </div>
      </section>
    </>
  );
}
