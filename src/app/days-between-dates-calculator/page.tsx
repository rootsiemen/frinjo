import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import DaysBetween from "./DaysBetween";

export const metadata = {
  title: "Days Between Dates Calculator — Workdays",
  description:
    "Free days between dates calculator: total days, business days and weeks between two dates — plus add or subtract days from any date. No sign-up.",
  keywords: [
    "days between dates calculator",
    "how many days between two dates",
    "business days calculator",
    "add days to date",
    "date calculator",
    "days calculator",
  ],
  alternates: {
    canonical: "https://frinjo.me/days-between-dates-calculator",
    languages: {
      en: "https://frinjo.me/days-between-dates-calculator",
      es: "https://frinjo.me/es/calculadora-de-dias-entre-fechas",
      fr: "https://frinjo.me/fr/jours-entre-deux-dates",
      "x-default": "https://frinjo.me/days-between-dates-calculator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Days Between Dates Calculator | WebStore Pro",
    description:
      "Total days, business days and weeks between two dates — plus add/subtract days with a business-day mode. Free and instant.",
    url: "https://frinjo.me/days-between-dates-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Days Between Dates Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/days-between-dates-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free date calculator with two tools: (1) the number of days between two dates, reported as total days, business days (Monday to Friday, excluding the start date and including the end date), full weeks plus remaining days, and a calendar years/months/days breakdown; (2) adding or subtracting a number of calendar days or business days to or from a date. Public holidays are not deducted, which the page states openly. All calculation runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Days Between Dates Calculator",
      item: "https://frinjo.me/days-between-dates-calculator",
    },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I count the days between two dates?",
    "Enter the start date and the end date. This calculator counts the days you must travel from the first date to land on the second: the start date itself is not counted, the end date is. That is the convention used for deadlines, contract periods and payroll — 'in 30 days' means the date 30 steps after today, not 29 or 31.",
  ],
  [
    "What are business days, and how are they counted here?",
    "Business days are Monday to Friday. This calculator walks from the start date to the end date and counts every landing day that falls Monday–Friday. Public holidays are not deducted — holiday calendars differ by country, state and employer, and a calculator that silently assumes one would give wrong answers everywhere else.",
  ],
  [
    "How do I find a date 90 days from today?",
    "Use the second tool on this page: leave the start date as today, enter 90, choose 'Add days' — the resulting date is shown with its weekday. Tick 'business days only' if you mean 90 working days, which lands roughly 18 weeks later instead of about 13.",
  ],
  [
    "Does the order of the dates matter?",
    "No. If the end date is earlier than the start date, the calculator counts backwards and tells you so — the totals are the same as counting forwards from the earlier date.",
  ],
  [
    "How many days are in a year, for date maths?",
    "A calendar year is 365 days, or 366 in a leap year (years divisible by 4, except century years not divisible by 400 — so 2000 was a leap year, 1900 was not). This calculator uses real calendar dates throughout, so leap days are always counted correctly.",
  ],
  [
    "Is the Days Between Dates Calculator free?",
    "Yes, completely free with no sign-up. The dates you enter are processed in your browser only and are never stored.",
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

export default function DaysBetweenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Counting rule stated plainly
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Days Between <span className="text-gold-gradient">Dates</span> Calculator
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Total Days, Business Days &amp; Weeks — Plus Add/Subtract
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            How many days until the deadline, the delivery, the visa expiry? Count them exactly — and when
            someone says <strong>&quot;90 business days&quot;</strong>, count those exactly too.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <DaysBetween />

      {/* USE CASES */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Where it earns its keep"
            title="Three jobs this calculator does daily"
            sub="Deadlines in contracts, payroll and travel are all date arithmetic — and all of them go wrong by a day when the counting rule is fuzzy."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Contracts &amp; deadlines</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">&quot;Within 45 days of signing&quot;</h3>
              <p className="text-stone-600 leading-relaxed">
                Add 45 days to the signing date and you have the deadline, weekday included — so you can see
                at a glance whether it lands on a weekend before you promise anything.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Payroll &amp; HR</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Notice periods and probation</h3>
              <p className="text-stone-600 leading-relaxed">
                Probation lengths, notice periods and &quot;10 business days to respond&quot; clauses are all
                business-day counts. The business-day mode walks weekdays only, so the date it gives is the
                date HR means.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Travel &amp; visas</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The 90/180 rule and trip lengths</h3>
              <p className="text-stone-600 leading-relaxed">
                Schengen&apos;s 90-days-in-180 rule, passport validity windows and simple trip lengths are
                day counts between real dates — leap days included, because this calculator uses the actual
                calendar, not 30-day months.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> , <Link href="/age-calculator" className="font-semibold text-orange-700 hover:text-orange-800">age calculator</Link>, <Link href="/time-duration-calculator" className="font-semibold text-orange-700 hover:text-orange-800">time duration calculator</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Date counting questions, answered" />
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
              Count some days <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
