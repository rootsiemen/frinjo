import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead, Icon, btnPrimary } from "@/components/ui";
import HourlySalary from "../HourlySalary";
import { POPULAR_RATES, rateSlug, breakdown, money } from "../rates";

export function generateStaticParams() {
  return POPULAR_RATES.map((r) => ({ rate: rateSlug(r) }));
}

function parseRate(slug: string): number | null {
  const m = slug.match(/^(\d+)-an-hour-is-how-much-a-year$/);
  if (!m) return null;
  const n = Number(m[1]);
  return POPULAR_RATES.includes(n) ? n : null;
}

export async function generateMetadata({ params }: { params: Promise<{ rate: string }> }) {
  const { rate } = await params;
  const r = parseRate(rate);
  if (!r) return {};
  const b = breakdown(r, 40, 52);
  return {
    title: `$${r} an Hour Is How Much a Year?`,
    description: `$${r} an hour is ${money(b.annual)} a year at 40 hours a week — ${money(b.weekly)} a week, ${money(b.biweekly)} biweekly, ${money(b.monthly)} a month, before taxes. Free calculator.`,
    keywords: [
      `${r} an hour is how much a year`,
      `$${r} an hour salary`,
      `${r} dollars an hour annual`,
      "hourly to salary",
    ],
    alternates: { canonical: `https://frinjo.me/hourly-to-salary-calculator/${rateSlug(r)}` },
    openGraph: {
      title: `$${r} an Hour = ${money(b.annual)} a Year | WebStore Pro`,
      description: `Full breakdown for $${r}/hour: ${money(b.monthly)}/month, ${money(b.biweekly)} biweekly, ${money(b.weekly)}/week.`,
      url: `https://frinjo.me/hourly-to-salary-calculator/${rateSlug(r)}`,
      type: "website",
    },
  };
}

export default async function RatePage({ params }: { params: Promise<{ rate: string }> }) {
  const { rate } = await params;
  const r = parseRate(rate);
  if (!r) notFound();
  const b = breakdown(r, 40, 52);
  const b50 = breakdown(r, 40, 50);
  const b37 = breakdown(r, 37.5, 52);

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `$${r} an Hour to Salary Calculator`,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `https://frinjo.me/hourly-to-salary-calculator/${rateSlug(r)}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
    description: `Converts $${r} per hour to an annual salary. At 40 hours per week and 52 weeks per year, $${r} an hour equals ${money(b.annual)} per year, ${money(b.monthly)} per month, ${money(b.biweekly)} biweekly and ${money(b.weekly)} per week, before taxes. The calculator on the page adjusts for part-time hours and unpaid weeks.`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
      { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
      { "@type": "ListItem", position: 3, name: "Hourly to Salary Calculator", item: "https://frinjo.me/hourly-to-salary-calculator" },
      { "@type": "ListItem", position: 4, name: `$${r} an hour`, item: `https://frinjo.me/hourly-to-salary-calculator/${rateSlug(r)}` },
    ],
  };

  const rows: [string, number][] = [
    ["Per day (8-hour day)", b.daily],
    ["Per week", b.weekly],
    ["Every two weeks", b.biweekly],
    ["Per month", b.monthly],
    ["Per year", b.annual],
  ];

  const FAQS: [string, string][] = [
    [
      `How much is $${r} an hour per month?`,
      `$${r} an hour is ${money(b.monthly)} a month — the ${money(b.annual)} annual figure divided by 12. On shorter cycles it is ${money(b.biweekly)} every two weeks and ${money(b.weekly)} a week, all before taxes. If you are paid biweekly you get 26 paychecks a year, so two months a year carry a third paycheck.`,
    ],
    [
      `How much is $${r} an hour with overtime?`,
      `At time-and-a-half, overtime pays ${money(r * 1.5)} an hour; double time pays ${money(r * 2)} an hour. Five overtime hours a week at time-and-a-half add ${money(r * 1.5 * 5 * 52)} a year before tax on top of the ${money(b.annual)} base — which is why the same hourly rate can mean very different annual pay.`,
    ],
    [
      `Is $${r} an hour before or after tax?`,
      `Before tax — every figure on this page is gross pay. Your take-home pay is lower after income tax and, in the US, FICA (Social Security and Medicare, 7.65% for employees), plus any benefit deductions. Gross is the right basis for comparing a wage against a salary offer; budget from your actual net pay.`,
    ],
    [
      `What is $${r} an hour if I work part-time or take time off?`,
      `At 37.5 hours a week, $${r} an hour is ${money(b37.annual)} a year. At full time but with 2 weeks of unpaid time off (50 working weeks), it is ${money(b50.annual)} instead of ${money(b.annual)}. Enter your real hours and weeks in the calculator above and every figure — daily to annual — updates to match.`,
    ],
    [
      `Is $${r} an hour a good wage?`,
      `In gross terms it is ${money(b.annual)} a year for full-time work — judge it against your rent, your city's cost of living and whether the job adds overtime, tips or benefits on top. The honest comparison is annual gross against annual gross: a salaried offer of the same ${money(b.annual)} with paid holidays is worth more than the wage if your time off is unpaid.`,
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            40 hrs/week · 52 weeks · Gross pay
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            ${r} an Hour is <span className="text-gold-gradient">{money(b.annual)}</span> a Year
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            ${r}/hour × 40 hours × 52 weeks = <strong>{money(b.annual)} a year</strong> before taxes —
            {money(b.monthly)} a month, {money(b.biweekly)} every two weeks, {money(b.weekly)} a week.
            Work different hours? Adjust below and every figure updates.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="overflow-hidden rounded-3xl border border-stone-200">
            {rows.map(([label, val], i) => (
              <div key={label} className={`flex items-center justify-between px-6 sm:px-8 py-5 ${i % 2 ? "bg-stone-50" : "bg-white"}`}>
                <span className="font-semibold text-stone-600">${r}/hour — {label.toLowerCase()}</span>
                <span className="font-display text-2xl font-bold text-stone-900">{money(val)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-6">
              <p className="font-display text-xl font-bold text-stone-900">{money(b50.annual)} / year</p>
              <p className="mt-1 text-sm text-stone-500">If you take 2 weeks of unpaid time off (50 working weeks)</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-6">
              <p className="font-display text-xl font-bold text-stone-900">{money(b37.annual)} / year</p>
              <p className="mt-1 text-sm text-stone-500">At 37.5 hours a week (a common part-time/full-time boundary)</p>
            </div>
          </div>
        </div>
      </section>

      <HourlySalary initialRate={r} />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title={`$${r} an hour — questions, answered`} />
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
        </div>
      </section>

      <section className="py-14 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead eyebrow="Calculator" title="Convert any other rate" sub="Every wage from $12 to $100 has its own page on the main calculator — or type any number into it." />
          <Link href="/hourly-to-salary-calculator" className={btnPrimary}>
            Open the Hourly to Salary Calculator <Icon name="arrow" className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
