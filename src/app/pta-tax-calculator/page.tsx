import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import PtaTaxCalculator from "./PtaTaxCalculator";

export const metadata = {
  title: "PTA Tax Calculator 2026-27 — DIRBS Tax",
  description:
    "Free PTA tax calculator for 2026-27: DIRBS mobile registration tax on passport or CNIC, broken down line by line — duty, sales tax, levy and more.",
  keywords: [
    "pta tax calculator",
    "pta mobile tax calculator",
    "pta tax on passport",
    "pta tax on cnic",
    "dirbs tax calculator",
    "mobile registration tax pakistan",
    "iphone pta tax",
  ],
  alternates: { canonical: "https://frinjo.me/pta-tax-calculator" },
  openGraph: {
    title: "PTA Tax Calculator 2026-27 | WebStore Pro",
    description:
      "DIRBS registration tax on imported phones — passport vs CNIC, filer vs non-filer, every charge line by line. Free.",
    url: "https://frinjo.me/pta-tax-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PTA Mobile Tax Calculator 2026-27",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/pta-tax-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free calculator for the PTA DIRBS mobile registration tax in Pakistan for 2026-27 (SRO 1064(I)/2026 + Finance Act 2026). Enter the phone's USD value and exchange rate, choose CNIC or passport registration, filer status and smartphone/basic; the tool applies the value-band regulatory duty, Rs 250 customs duty, 18% or 25% sales tax, the band income tax (CNIC only, doubled for non-filers) and the smartphone handset levy, and shows every charge line by line with the total. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "PTA Tax Calculator", item: "https://frinjo.me/pta-tax-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is PTA tax calculated in 2026-27?",
    "Five charges: Rs 250 customs duty; a fixed regulatory duty by value band (Rs 240–17,600); sales tax of 18% (phones up to $500) or 25% (above $500) on value plus duties; a fixed income tax by band on CNIC registrations only (doubled for non-filers); and a mobile handset levy on smartphones.",
  ],
  [
    "Is PTA registration cheaper on passport or CNIC?",
    "Passport is cheaper by the income tax line only. Phones registered on passport within 60 days of arrival skip income tax; customs duty, regulatory duty, sales tax and handset levy are the same on both.",
  ],
  [
    "How much is the PTA tax on a $600 phone?",
    "Rs 83,813 on CNIC for a filer with a smartphone (at Rs 280 per dollar): Rs 250 customs duty + Rs 17,600 regulatory duty + Rs 46,463 sales tax at 25% + Rs 11,500 income tax + Rs 8,000 handset levy. On passport the same phone is Rs 72,313 because the income tax line drops out.",
  ],
  [
    "Do non-filers pay more PTA tax?",
    "Yes. On a CNIC registration the income tax line is doubled for non-filers — on a phone above $700 that alone adds Rs 11,500. Every other charge is identical for filers and non-filers.",
  ],
  [
    "Is the PTA Tax Calculator free?",
    "Yes, completely free with no sign-up. Everything is calculated in your browser; nothing is stored. The DIRBS amount on your PSID is always final — this tool is an estimate based on SRO 1064(I)/2026.",
  ],
  [
    "Why does PTA tax jump so sharply just above $500?",
    "Because several charges step up at the same band boundary. Moving from the $350–$500 band to the $500–$700 band, regulatory duty rises from Rs 12,000 to Rs 17,600, sales tax from 18% to 25%, the handset levy from Rs 4,000 to Rs 8,000 and income tax from Rs 5,000 to Rs 11,500 — so a $510 phone is taxed far more heavily than a $490 one.",
  ],
  [
    "What exchange rate should I enter for the phone's value?",
    "Enter a current rate close to the interbank dollar rate, because the tool first converts your phone's USD value at that rate (a $300 phone at Rs 280 is Rs 84,000) and sales tax is charged on the rupee figure. DIRBS assesses its own value when it issues your PSID, so your final amount can differ slightly from any estimate.",
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

export default function PtaTaxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · DIRBS 2026-27 · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            PTA Tax <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Mobile Registration Tax · Passport &amp; CNIC · Full Breakup
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Work out the DIRBS registration tax on an imported phone before you buy it — on passport
            or CNIC, filer or non-filer — with <strong>every charge shown line by line</strong>, not
            just a single unexplained total.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <PtaTaxCalculator />

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

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Five charges, in a fixed order"
            sub="Not one percentage of the price — five separate lines, each with its own rule."
          />
          <div className="text-left">
            <p className="text-stone-600 leading-relaxed">
              The calculator prices your phone from its USD value band. It first converts the value at
              the exchange rate you enter, then applies five lines: a flat Rs 250 customs duty; a fixed
              regulatory duty by band, from Rs 240 (up to $30) to Rs 17,600 (above $500); sales tax —
              18% up to $500, 25% above — on the value plus both duties; a fixed income tax by band, on
              CNIC registrations only, doubled for non-filers; and a smartphone-only handset levy, Rs
              100 to Rs 16,000 by band. The total is simply the five lines added together.
            </p>
            <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Worked example: a $300 phone at Rs 280 to the dollar</h3>
              <p className="text-stone-600 leading-relaxed">
                A $300 smartphone sits in the $200–$350 band and converts to Rs 84,000. Its lines:
                customs duty Rs 250; regulatory duty Rs 8,800; sales tax at 18% on Rs 93,050 (84,000 +
                250 + 8,800) = Rs 16,749; income tax Rs 970; handset levy Rs 1,800. Total on CNIC as a
                filer: Rs 28,569. Register the same phone on a passport and the income tax line drops
                out — Rs 27,599. Register on CNIC as a non-filer and that line doubles to Rs 1,940, for
                a total of Rs 29,539.
              </p>
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-stone-900 mb-3">Where estimates go wrong</h3>
            <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-5">
              <li>Guessing the dollar value. DIRBS taxes the assessed value of the model, not a bargain price paid abroad — enter the phone&apos;s full USD value or the estimate reads low.</li>
              <li>Missing the $500 step-up. Sales tax, regulatory duty, levy and income tax all rise above $500, so two similar phones can carry very different totals — the first question below breaks the jump down.</li>
              <li>Overrating filer status. It doubles only the income tax line: worth Rs 100 on the cheapest band, but Rs 11,500 on phones above $700.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="PTA mobile tax questions, answered" />
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
              Calculate your PTA tax <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
