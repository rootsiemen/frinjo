import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const metadata = {
  title: "Umbrella vs Limited Company — UK Guide",
  description:
    "On a £100k contract: roughly £56–59k take-home via umbrella vs £65–68k via a limited company. Fees, employer NI, levy and IR35 in plain English.",
  keywords: [
    "umbrella vs limited company",
    "umbrella company vs limited company",
    "uk contractor umbrella or limited",
    "umbrella company deductions explained",
    "limited company contractor guide",
  ],
  alternates: { canonical: "https://frinjo.me/umbrella-vs-limited-company" },
  openGraph: {
    title: "Umbrella vs Limited Company — Which Is Right for You? | WebStore Pro",
    description:
      "How umbrella deductions really work, limited company basics, and a side-by-side comparison for UK contractors. Free guide.",
    url: "https://frinjo.me/umbrella-vs-limited-company",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Umbrella vs Limited Company", item: "https://frinjo.me/umbrella-vs-limited-company" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is the difference between an umbrella company and a limited company?",
    "An umbrella company employs you: it receives the assignment rate, covers employer costs and its margin, then pays you a salary through PAYE with employment rights like holiday pay. A limited company is your own company: the client pays it gross, and you extract money as a small salary plus dividends after corporation tax — more tax-efficient outside IR35, but you carry the admin.",
  ],
  [
    "How much does an umbrella company take from my pay?",
    "The umbrella's own fee (margin) is typically £15–£30 per week — that is the only part the umbrella keeps. The bigger deductions are not the umbrella's profit: employer National Insurance (15% above £5,000 a year) and the 0.5% apprenticeship levy are met out of the assignment rate before your gross pay is set, then your own PAYE tax and employee NI come out of gross pay.",
  ],
  [
    "Is a limited company always better than an umbrella?",
    "No. Inside IR35 there is no tax advantage to a limited company — you are taxed as an employee either way, so the umbrella's zero admin usually wins. A limited company pays off on longer, outside-IR35 contracts at higher day rates, where the salary-plus-dividends structure and deductible expenses compound over time.",
  ],
  [
    "Why does my umbrella payslip show employer National Insurance?",
    "Employer NI is a cost of employing you, and under an umbrella it is funded from the assignment rate — the rate the agency pays the umbrella — before your gross pay is calculated. It must never appear as a deduction from your gross pay itself; if it does, challenge it and ask for a written reconciliation of assignment rate to gross pay.",
  ],
  [
    "How much take-home pay do I get on a £100,000 contract?",
    "Roughly £56,000–£59,000 through an umbrella or inside IR35 (PAYE on the deemed salary), versus roughly £65,000–£68,000 through a limited company outside IR35 on a salary-plus-dividends basis. Try the exact numbers for your day rate in our IR35 Calculator and UK Take-Home Pay Calculator.",
  ],
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Umbrella vs Limited Company — UK Contractor Guide & Comparison (2026/27)",
  url: "https://frinjo.me/umbrella-vs-limited-company",
  mainEntityOfPage: "https://frinjo.me/umbrella-vs-limited-company",
  inLanguage: "en",
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  publisher: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Umbrella company vs limited company for UK contractors: how umbrella deductions really work (margin, employer NI, the 0.5% levy), limited company basics, a side-by-side take-home comparison and who should pick which.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function UmbrellaVsLimitedPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free guide · UK contractors · 2026/27
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Umbrella vs <span className="text-gold-gradient">Limited Company</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The two main ways UK contractors get paid — explained without the jargon,
            including where every pound of an umbrella deduction actually goes.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-stone-900">How an umbrella company works</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              An umbrella company employs you. Your agency pays the umbrella an{" "}
              <strong>assignment rate</strong> — and that rate has to cover the cost
              of employing you, not just your wage. Here is the deduction chain, in order:
            </p>
            <ol className="mt-4 space-y-3 text-stone-600 list-decimal pl-5">
              <li>
                <strong className="text-stone-900">Umbrella margin</strong> — the umbrella&apos;s
                fee, typically <strong>£15–£30 per week</strong> (£80–£150/month). This is
                the only fee the umbrella keeps.
              </li>
              <li>
                <strong className="text-stone-900">Employer National Insurance</strong> — 15%
                on everything above £5,000 a year. This is <em>met out of the assignment
                rate</em> before your gross pay is set. It must never appear as a deduction
                from your gross pay on the payslip — if it does, challenge it.
              </li>
              <li>
                <strong className="text-stone-900">Apprenticeship / Growth &amp; Skills Levy</strong> — 0.5%
                where the umbrella&apos;s pay bill exceeds £3m. Most large umbrellas pass this on.
              </li>
              <li>
                <strong className="text-stone-900">Your gross pay</strong> — whatever is left.
                From this the umbrella deducts income tax (PAYE), employee NI, your pension
                contribution and any student loan.
              </li>
              <li>
                <strong className="text-stone-900">Take-home pay</strong> — what lands in your bank.
              </li>
            </ol>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Rule of thumb: on a £400/day assignment, roughly £2,000 of weekly assignment
              income becomes about £1,700 of gross pay <em>before</em> your own tax. Always
              ask whether a quoted rate is the assignment rate or the rate after deductions —
              and get a written reconciliation of assignment rate → gross pay.
            </p>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Umbrella employees do get employment rights: paid holiday (usually accrued at
              12.07% of gross or rolled up), minimum wage protection and auto-enrolment pension.
            </p>
          </section>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-stone-900">How a limited company works</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              You run your own company (usually a personal service company). The client pays
              your company gross. You then decide how to extract the money — the classic
              approach outside IR35 is a small director&apos;s salary (around the NI threshold)
              plus dividends from the remaining profit after corporation tax (19% on profits
              up to £50,000, 25% above £250,000, marginal relief between).
            </p>
            <ul className="mt-3 space-y-2 text-stone-600 list-disc pl-5">
              <li>Legitimate business expenses (travel, equipment, accountancy, training) reduce taxable profit.</li>
              <li>You control timing — profits can be retained in the company.</li>
              <li>You handle (or pay an accountant for) bookkeeping, VAT, payroll and annual filings — typically £100–£150/month for accountancy.</li>
              <li>Dividends have a £500 annual allowance, then dividend tax at 10.75% (basic), 35.75% (higher) or 39.35% (additional) for 2026/27.</li>
            </ul>
          </section>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-stone-900">Side-by-side comparison</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-200">
                    <th className="py-2 pr-4"></th>
                    <th className="py-2 pr-4">Umbrella</th>
                    <th className="py-2">Limited company</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Best for", "Short contracts, inside-IR35 roles, first-time contractors", "Longer contracts, outside-IR35 roles, higher day rates"],
                    ["Admin", "Almost none — umbrella runs payroll", "Bookkeeping, filings, VAT — usually via accountant"],
                    ["Take-home on £100k", "Roughly £56–59k equivalent (PAYE)", "Roughly £65–68k via salary + dividends"],
                    ["Expenses", "Very limited", "Deductible against profit"],
                    ["Employment rights", "Holiday pay, pension auto-enrolment", "None (you're the director)"],
                    ["IR35 risk", "None — you're an employee", "You/your client must assess status"],
                    ["Cost", "£15–30/week margin", "£100–150/month accountancy"],
                  ].map(([k, a, b]) => (
                    <tr key={k} className="border-b border-stone-100">
                      <td className="py-2 pr-4 font-semibold text-stone-900">{k}</td>
                      <td className="py-2 pr-4 text-stone-600">{a}</td>
                      <td className="py-2 text-stone-600">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-stone-900">Who should pick which?</h2>
            <ul className="mt-3 space-y-2 text-stone-600 list-disc pl-5">
              <li><strong className="text-stone-900">Pick umbrella</strong> if your contract is inside IR35, the assignment is short, or you want zero admin. Inside IR35 there is no tax advantage to a limited company anyway.</li>
              <li><strong className="text-stone-900">Pick limited</strong> if contracts are outside IR35, your day rate is high, and you&apos;re comfortable with (or paying for) the admin. The tax efficiency compounds over time.</li>
              <li><strong className="text-stone-900">Red flags:</strong> any umbrella promising &quot;90% retention&quot; or unusually high take-home is likely a disguised tax avoidance scheme. Stick to established, accredited providers.</li>
            </ul>
            <p className="mt-4 text-xs text-stone-500">
              General information only — not financial or tax advice. Figures are 2026/27
              estimates; confirm with a qualified accountant before deciding. Run your own
              numbers in the <Link href="/ir35-calculator" className="font-semibold text-orange-700 hover:text-orange-800">IR35 Calculator</Link> and{" "}
              <Link href="/uk-take-home-pay-calculator" className="font-semibold text-orange-700 hover:text-orange-800">UK Take-Home Pay Calculator</Link>.
            </p>
          </section>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a website like this on your own domain?"
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
          <SectionHead eyebrow="FAQ" title="Umbrella vs limited questions, answered" />
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
              Compare your options <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
