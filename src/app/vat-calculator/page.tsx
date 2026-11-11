import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import VatCalculator from "./VatCalculator";
import { COUNTRY_PRESETS } from "./calc";

export const metadata = {
  title: "VAT Calculator 2026 — Add or Remove VAT for 11 Countries",
  description:
    "Free VAT calculator for 11 countries: add or remove VAT on multi-line invoices, with withholdings and the total in words. Spain, Mexico and more.",
  keywords: [
    "VAT calculator",
    "calculate VAT",
    "VAT calculator Spain",
    "VAT calculator Mexico",
    "remove VAT from a price",
    "add VAT to a price",
    "VAT on an invoice",
    "total in words",
  ],
  alternates: {
    canonical: "https://frinjo.me/vat-calculator",
    languages: {
      en: "https://frinjo.me/vat-calculator",
      es: "https://frinjo.me/es/calculadora-de-iva",
      fr: "https://frinjo.me/fr/calcul-tva",
      "x-default": "https://frinjo.me/vat-calculator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "VAT Calculator 2026 — Spain, Mexico & Latin America | Frinjo",
    description:
      "Add or remove VAT with the official rates of 11 countries: multi-line invoices, withholdings, total in words and a copyable summary. Free, no sign-up.",
    url: "https://frinjo.me/vat-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "VAT Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/vat-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free VAT calculator for Spain, Mexico, Colombia, Argentina, Chile, Peru, Ecuador, Uruguay, the Dominican Republic, Costa Rica and Panama. Method: to add the tax, tax = net amount × rate ÷ 100; to remove the tax from a VAT-inclusive price, net = total ÷ (1 + rate ÷ 100) and tax = total − net. Includes multi-line invoices with a different rate per line, optional income-tax withholding (on the net) and VAT withholding (on the tax), and the total in words in English. All calculations run in the visitor's browser; no data is sent or stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "VAT Calculator", item: "https://frinjo.me/vat-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is VAT and who actually pays it?",
    "VAT (Value Added Tax, IVA in Spanish) is an indirect consumption tax: the final customer pays it, but the seller charges it on every invoice and remits it to the tax authority. That is why the VAT amount is never your income — it is money you collect for the government and later settle in your tax return (form 303 in Spain, the monthly SAT filing in Mexico).",
  ],
  [
    "What are the VAT rates in Spain in 2026?",
    "Spain keeps three rates: the standard 21% (most goods and services), the reduced 10% (hospitality, passenger transport, much of food) and the super-reduced 4% (bread, milk, books, medicines and other essentials). Some activities are exempt (0%), such as healthcare and regulated education. This calculator includes all three rates plus 0% on every line.",
  ],
  [
    "How do I calculate the VAT in a price?",
    "It depends on whether the price already includes the tax. To ADD VAT: tax = net × rate ÷ 100 (example: €100 at 21% → €21 of VAT, total €121). To REMOVE VAT from a final price: net = total ÷ (1 + rate ÷ 100) (example: €121 at 21% → net €100, tax €21). The most common mistake is subtracting the percentage directly (121 − 21% = 95.59), which is wrong: the percentage is calculated on the net amount, not on the total.",
  ],
  [
    "What is the difference between adding and removing VAT?",
    "Adding is the sales-invoice case: you start from your net price and put the tax on top. Removing (or breaking down) is the opposite: you have a closed price with tax included — a rate, a receipt, a 'VAT included' quote — and you need to know how much is net and how much is tax to book or deduct it. The switch in this calculator flips between both modes without touching your lines.",
  ],
  [
    "What are the ISR and IVA withholdings in Mexico?",
    "When an individual provides professional services to a company (persona moral) in Mexico, the company withholds part of the payment: typically 10% income tax (ISR) on the net amount and two thirds of the VAT (66.67% of the tax amount). Both fields here are optional and default to zero: the income-tax withholding applies to the net amount and the VAT withholding to the tax amount, exactly as shown on the invoice. If your regime is RESICO or another special case, enter the percentages that apply to you.",
  ],
  [
    "Is the calculator free? Is my data stored?",
    "Yes, it is completely free with no sign-up. Every calculation happens in your browser: your invoice figures are never sent to a server or stored anywhere. Close the page and no trace of the amounts you calculated remains.",
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

const RATE_NOTES: Record<string, string> = {
  es: "Standard 21% · reduced 10% · super-reduced 4%",
  mx: "Standard 16% · 8% in the northern border zone · 0% food and medicines",
  co: "Standard 19% · differential rate of 5%",
  ar: "Standard 21% · reduced 10.5% · increased 27%",
  cl: "Single rate of 19%",
  pe: "IGV 18% = 16% IGV + 2% municipal promotion tax",
  ec: "Standard 15% since April 2024 · 0% rate on basic goods",
  uy: "Standard 22% · reduced 10%",
  do: "General ITBIS of 18%",
  cr: "Standard 13% · reduced rates of 4%, 2% and 1%",
  pa: "General ITBMS of 7% (10% and 15% in special cases)",
};

export default function VatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · 11 countries
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            VAT <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Spain, Mexico and all of Latin America on one page
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Build your invoice line by line, each with its own tax rate, add withholdings if they apply and
            get the net, the tax, the total and the <strong>total in words</strong> ready to copy. Add or
            remove the tax with a single switch.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <VatCalculator />

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="VAT maths, explained plainly"
            sub="Two formulas solve everything. The calculator applies them line by line and adds up with the two-decimal rounding every invoice uses."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Add the tax</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Tax = net × rate ÷ 100</h3>
              <p className="text-stone-600 leading-relaxed">
                You start from the net price. A net of 1,000 at 21% generates 210 of tax and a total of
                1,210. This is the sales-invoice calculation: the tax goes <strong>on top</strong> of your price.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Remove the tax</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Net = total ÷ (1 + rate ÷ 100)</h3>
              <p className="text-stone-600 leading-relaxed">
                You start from the closed price. A total of 1,210 at 21% hides a net of 1,000 and 210 of
                tax. Never subtract the percentage from the total: that shortcut gives a smaller net and
                the wrong tax.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Withholdings</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Income tax on the net, VAT on the tax</h3>
              <p className="text-stone-600 leading-relaxed">
                In Mexico, when a professional invoices a company, the company withholds part of the
                payment: the income tax is calculated on the net amount and the VAT withholding on the tax
                amount (usually two thirds, 66.67%). Both fields default to zero: enable them only if they
                apply to you.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Total in words</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The amount, also in words</h3>
              <p className="text-stone-600 leading-relaxed">
                Many invoices require the total written out in words to prevent tampering. The calculator
                generates it automatically in your country&apos;s currency — euros, pesos, soles, colones or
                dollars — and includes it in the summary you can copy.
              </p>
            </div>
          </div>

          {/* RATE TABLE */}
          <div className="mt-14 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-stone-900 text-center mb-6">
              VAT rates by country (2026)
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50 text-left text-xs uppercase tracking-wide text-stone-500">
                    <th className="py-3 px-4">Country</th>
                    <th className="py-3 px-4">Tax</th>
                    <th className="py-3 px-4 text-right">Standard rate</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {COUNTRY_PRESETS.map((c) => (
                    <tr key={c.id} className="border-t border-stone-100">
                      <td className="py-3 px-4 font-bold text-stone-800">{c.name}</td>
                      <td className="py-3 px-4 text-stone-600">{c.taxName}</td>
                      <td className="py-3 px-4 text-right font-bold text-stone-800">{c.defaultRate}%</td>
                      <td className="py-3 px-4 text-stone-600">{RATE_NOTES[c.id]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-stone-400 text-center">
              Standard rates shown for reference. Every country has special rates by sector; the valid
              amount is the one in your regulations and your specific invoice.
            </p>
          </div>
        </div>
      </section>

      {/* MORE TOOLS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            More free tools
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            VAT is only the start of your numbers
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Pricing a job goes hand in hand with financing it: the{" "}
            <strong className="text-white">personal loan calculator</strong> shows the true APR with the
            fee counted, and the <strong className="text-white">compound interest calculator</strong>{" "}
            projects your savings with contributions, tax and a CD mode. This calculator is also available
            in Spanish and French.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/personal-loan-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Personal Loan Calculator
            </Link>{" "}
            ·{" "}
            <Link href="/compound-interest-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Compound Interest Calculator
            </Link>{" "}
            ·{" "}
            <Link href="/es/calculadora-de-iva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calculadora de IVA (ES)
            </Link>{" "}
            ·{" "}
            <Link href="/fr/calcul-tva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calcul TVA (FR)
            </Link>
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Built for you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack Web Development sites and custom calculators that rank: designed, coded and SEO-ready from day one."
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

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="VAT questions, answered" />
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
              Calculate my VAT <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            This calculator is general information, not tax advice. For your specific case, consult an
            adviser or your country&apos;s tax authority.
          </p>
        </div>
      </section>
    </>
  );
}
