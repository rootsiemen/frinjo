import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import H1bLotteryCalculator from "./H1bLotteryCalculator";

export const metadata = {
  title: "H-1B Lottery Calculator — Selection Odds by Wage Level (FY2027)",
  description:
    "Free H-1B lottery calculator: estimate your selection chance under the wage-weighted lottery by DOL prevailing wage level — Level I ~15%, II ~30%, III ~45%, IV ~61% — based on official FY2027 USCIS data (211,600 registrations, ~40% overall).",
  keywords: [
    "h1b lottery calculator",
    "h-1b lottery odds",
    "h1b selection chances",
    "h1b weighted lottery",
    "h1b wage level odds",
    "h1b lottery fy2027",
  ],
  alternates: { canonical: "https://frinjo.me/h1b-lottery-calculator" },
  openGraph: {
    title: "H-1B Lottery Calculator (FY2027) | WebStore Pro",
    description:
      "Your H-1B selection odds under the wage-weighted lottery, by prevailing wage level. Based on FY2027 USCIS data. Free.",
    url: "https://frinjo.me/h1b-lottery-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "H-1B Lottery Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/h1b-lottery-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free H-1B lottery odds calculator for the FY2027 wage-weighted selection system. Pick your DOL prevailing wage level (I–IV) and whether you hold a US advanced degree; the tool returns the estimated selection chance (Level I ~15% with 1 pool entry, Level II ~30% with 2, Level III ~45% with 3, Level IV ~61% with 4) based on DHS FY2027 projections and USCIS registration data (211,600 registrations, ~40% overall selection). Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "H-1B Lottery Calculator", item: "https://frinjo.me/h1b-lottery-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does the new H-1B weighted lottery work?",
    "Since FY2027, USCIS weights H-1B registrations by the DOL prevailing wage level: Level I gets 1 entry, Level II gets 2, Level III gets 3, and Level IV gets 4 entries in the selection pool. Higher wage offers get proportionally better odds.",
  ],
  [
    "What were the H-1B lottery odds for FY2027?",
    "USCIS received 211,600 eligible registrations for FY2027 and the overall selection rate was about 40%. DHS projected roughly 15% odds for wage Level I and about 61% for Level IV. 71.5% of selected beneficiaries held a US advanced degree.",
  ],
  [
    "Does a US master's degree improve my H-1B odds?",
    "The weighted entries come from your wage level, not your degree — but the FY2027 outcome strongly favoured advanced-degree holders: 71.5% of selected beneficiaries held a US master's or higher (which also gives access to the 20,000 advanced-degree exemption slots inside the 85,000 cap). Only 17.7% of selections were wage Level I, so the wage level on the offer is the lever that moves your odds most.",
  ],
  [
    "When is the next H-1B registration?",
    "The next H-1B cap registration window opens in March 2027 for the FY2028 cap. There was no second lottery for FY2027.",
  ],
  [
    "Is the H-1B Lottery Calculator free?",
    "Yes, completely free with no sign-up. Everything runs in your browser; nothing is stored. The odds are estimates from DHS FY2027 projections — general information, not legal advice.",
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

export default function H1bLotteryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · FY2027 weighted lottery · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            H-1B Lottery <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Selection Odds by Wage Level (FY2027)
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Under the wage-weighted lottery your prevailing wage level <strong>is</strong> your odds:
            Level I sits near 15%, Level IV near 61%. Pick your level below to see your estimated
            selection chance from the official FY2027 data.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <H1bLotteryCalculator />

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack websites and custom calculators that rank — designed, built and SEO-ready from day one."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a Free Quote <Icon name="arrow" className="w-5 h-5" />
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

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="H-1B lottery questions, answered" />
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
              Check your H-1B odds <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
