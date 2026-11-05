import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import PtaTaxCalculator from "./PtaTaxCalculator";

export const metadata = {
  title: "PTA Tax Calculator 2026-27 — Mobile Registration Tax (Passport & CNIC)",
  description:
    "Free PTA mobile tax calculator for 2026-27: work out the DIRBS registration tax on an imported phone on passport or CNIC, with a line-by-line breakup — customs duty, regulatory duty, sales tax, income tax and handset levy.",
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
