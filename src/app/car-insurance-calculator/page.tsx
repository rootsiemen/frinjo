import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CarInsuranceCalculator from "./CarInsuranceCalculator";
import { STATE_MINIMUMS } from "./states";
import { limitsLabel } from "./calc";

export const metadata = {
  title: "Car Insurance Calculator — Coverage by State",
  description:
    "Free car insurance calculator: liability limits sized to your net worth and income, checked against all 50 state minimums. No quotes, no lead form.",
  keywords: [
    "how much car insurance do i need",
    "car insurance coverage calculator",
    "how much liability insurance do i need",
    "state minimum car insurance",
    "100/300/100 insurance meaning",
  ],
  alternates: { canonical: "https://frinjo.me/car-insurance-calculator" },
  openGraph: {
    title: "How Much Car Insurance Do I Need? — Coverage Calculator | Frinjo",
    description:
      "Limits matched to what you actually have to lose, floored at your state's legal minimum — with the full 50-state minimum table on the same page.",
    url: "https://frinjo.me/car-insurance-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Car Insurance Coverage Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/car-insurance-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Recommends auto liability limits from the driver's exposure (net worth plus one year of income, a consumer-planning proxy for what a judgment can reach), rounded up to standard split limits (50/100/50, 100/300/100, 250/500/100, 250/500/250 plus an umbrella suggestion), and never below the selected state's legal minimum from a built-in 50-state + DC table of minimum liability requirements compiled from published state data (November 2026). Adds uninsured/underinsured motorist matching advice, a collision/comprehensive verdict based on financing and vehicle value, and rough national cost orientation anchored on Insure.com's published $2,578 average full-coverage premium (2025), labeled as not a quote. Calculated in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "How Much Car Insurance Do I Need?", item: "https://frinjo.me/car-insurance-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much car insurance do I actually need?",
    "Enough liability coverage to cover what a court could take if you cause a serious crash: roughly your net worth plus a year of income, rounded up to a standard limit. A driver with $120,000 of net worth and an $80,000 salary has about $200,000 of exposure and lands on 100/300/100 — $100,000 per injured person, $300,000 per accident, $100,000 of property damage. A renter with $15,000 to their name needs the floor far less than a homeowner with savings, which is why any answer that ignores your balance sheet — including the state minimum — is a guess wearing a uniform.",
  ],
  [
    "What does 100/300/100 mean?",
    "The three numbers are thousands of dollars of liability coverage: $100,000 for one person's injuries, $300,000 for all injuries in one accident, $100,000 for property damage (the other car, a fence, a building). It is the most commonly recommended configuration in the US because most drivers' exposure sits in that band. State minimums are written the same way — Texas is 30/60/25, California became 30/60/15 in 2025, and Pennsylvania still allows 15/30/5, a property-damage limit a modern bumper can exceed in a parking-lot tap.",
  ],
  [
    "Why is the state minimum not enough?",
    "Because it was set to keep driving legal, not to keep you solvent, and many minimums have barely moved in decades. One accident with two injured people can produce medical bills, lost wages and pain-and-suffering claims in the hundreds of thousands; at a 25/50 minimum the insurer pays $50,000 of that and the rest has your name on it — collected from savings, home equity and, in most states, future wages. The gap between minimum and recommended limits is usually the cheapest insurance on the whole policy, because severe crashes are rare and insurers price them that way.",
  ],
  [
    "What are UM/UIM coverage and why match them to liability?",
    "Uninsured and underinsured motorist coverage pays you when the driver who hits you has no insurance — or only a state minimum that cannot cover your injuries. Roughly one in eight US drivers is uninsured. UM/UIM is the only part of your policy that protects your own body and income, it is inexpensive next to liability, and the standard advice is to carry it at the same limits as your liability coverage. This calculator's recommendation assumes you match them.",
  ],
  [
    "Which states are special cases?",
    "Florida requires $10,000 of PIP and $10,000 of property-damage liability — bodily-injury liability is not mandatory for most drivers, which makes UM coverage there close to essential. Michigan lets eligible drivers choose bodily-injury limits as low as 50/100 under a default of 250/500, with PIP medical chosen separately. New Hampshire does not mandate insurance at all (financial-responsibility rules apply instead, at 25/50/25 if you buy). And minimums move: California (2025), Virginia (2025), Utah (2025), North Carolina (2025) and New Jersey (2026 step) all raised theirs recently — the table below is dated November 2026, and your state insurance department is the final source.",
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

const fmtK = (n: number) => (n === 0 ? "—" : `$${(n / 1000).toLocaleString("en-US")}k`);

export default function CarInsurancePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · All 50 states · No quote form
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            How Much Car Insurance <span className="text-gold-gradient">Do I Need?</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Coverage sized to what you have to lose
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Your <strong>recommended limits</strong> from your net worth and income, your{" "}
            <strong>state&apos;s legal minimum</strong> beside them, and the{" "}
            <strong>full 50-state minimum table</strong> on the same page. No quote engine, no phone
            number harvested.
          </p>
        </div>
      </section>

      <CarInsuranceCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The 50-state table"
            title="Minimum liability insurance by state"
            sub="Bodily injury per person / per accident / property damage. Compiled from published state requirements (Insurance Information Institute summaries), November 2026 — minimums change, so confirm with your state insurance department before relying on a figure."
          />
          <div className="overflow-x-auto rounded-3xl border border-stone-200">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200 bg-stone-50">
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Minimum</th>
                  <th className="py-3 px-4 text-right">Per person</th>
                  <th className="py-3 px-4 text-right">Per accident</th>
                  <th className="py-3 px-4 text-right">Property</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody>
                {STATE_MINIMUMS.map((s) => (
                  <tr key={s.code} className="border-b border-stone-100 last:border-0">
                    <td className="py-2.5 px-4 font-bold text-stone-800">{s.name}</td>
                    <td className="py-2.5 px-4 text-stone-600">{s.biPerson === 0 ? "See note" : limitsLabel(s)}</td>
                    <td className="py-2.5 px-4 text-right text-stone-600">{fmtK(s.biPerson)}</td>
                    <td className="py-2.5 px-4 text-right text-stone-600">{fmtK(s.biAccident)}</td>
                    <td className="py-2.5 px-4 text-right text-stone-600">{fmtK(s.pd)}</td>
                    <td className="py-2.5 px-4 text-stone-500 text-xs max-w-[260px]">{s.pip ? "PIP required. " : ""}{s.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="One flow: exposure → limits → cost context"
            sub="Needs and cost usually live on separate pages. Here they answer together."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Step n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Your exposure, not your car</h3>
              <p className="text-stone-600 leading-relaxed">
                Liability insurance protects your balance sheet, so the input is what a judgment could
                reach: net worth plus a year of income. The car&apos;s value matters only for the
                collision/comprehensive decision — a separate question this page answers separately.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Step n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The legal floor underneath</h3>
              <p className="text-stone-600 leading-relaxed">
                Your recommendation can never fall below your state&apos;s minimum from the 51-row
                table — and the table itself is the moat: dated, sourced, and specific about the weird
                states (Florida, Michigan, New Hampshire) instead of pretending they are normal.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Step n° 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">UM/UIM: the coverage for you</h3>
              <p className="text-stone-600 leading-relaxed">
                One in eight drivers carries no insurance. Uninsured/underinsured motorist coverage is
                the part of the policy that pays your medical bills in that crash — carry it at your
                liability limits, which the recommendation assumes.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Cost, honestly framed</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Orientation, not a fake quote</h3>
              <p className="text-stone-600 leading-relaxed">
                Real quotes need licensed carrier data; this page will not invent one. It anchors cost
                to the published national average full-coverage premium ($2,578/year, Insure.com 2025)
                and gives a labeled range for your coverage tier. Driving in Pakistan instead? Our{" "}
                <Link href="/blog/car-insurance-cost-in-pakistan-2026-real-prices-by-car" className="font-semibold text-orange-700 hover:text-orange-800">
                  Pakistan car insurance cost guide
                </Link>{" "}
                has real prices by car.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The insurance pair
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Cars protected — now the family
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            The <strong className="text-white">life insurance needs calculator</strong> runs the same
            philosophy on the bigger risk: an itemized number, honest offsets, and no lead form at the
            end of it.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/life-insurance-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Life insurance needs
            </Link>{" "}
            ·{" "}
            <Link href="/blog/car-insurance-cost-in-pakistan-2026-real-prices-by-car" className="font-semibold text-orange-400 hover:text-orange-300">
              Car insurance costs (Pakistan guide)
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
          <SectionHead eyebrow="FAQ" title="Car insurance coverage questions, answered" />
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
              Get my recommended limits <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Coverage guidance for planning, not insurance advice or a quote; state minimums compiled
            November 2026 — confirm with your state insurance department.
          </p>
        </div>
      </section>
    </>
  );
}
