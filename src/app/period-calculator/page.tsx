import type { Metadata } from "next";
import Link from "next/link";
import PeriodCalculator from "./PeriodCalculator";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Period Calculator — Next Period, Ovulation & 3 Cycles";
const DESCRIPTION =
  "Free period calculator: enter your last period and cycle length to predict your next period date, fertile window and ovulation — with a 3-cycle forecast. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["period calculator", "next period calculator", "menstrual cycle calculator", "period tracker calculator", "when is my next period", "cycle length calculator"],
  alternates: { canonical: "https://frinjo.me/period-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Period Calculator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/period-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.jpg"],
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Period Calculator — Next Period & Cycle Forecast",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/period-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Predict your next period from the first day of your last period and your average cycle length, with a ±2-day window, your current cycle day and phase, the estimated fertile window and ovulation date, and a forecast table for the next three cycles. Nothing is stored — dates never leave your browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Period Calculator", item: "https://frinjo.me/period-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is my next period date calculated?",
    "By adding your average cycle length to the first day of your last period. Cycle length is counted from day 1 of one period to day 1 of the next — not from the end of bleeding. With a 28-day cycle and a last period starting 5 November, the next period is expected around 3 December. This calculator shows a ±2-day window because real cycles flex by a few days.",
  ],
  [
    "What is a normal cycle length?",
    "For adults, cycles of 21–35 days are considered normal, with 28 days the textbook average (only about 1 in 8 women actually runs exactly 28). Teen cycles are often longer (21–45 days). What matters medically is your own pattern: a sudden change of more than about 7–9 days, or cycles outside the normal range repeatedly, is worth discussing with a doctor.",
  ],
  [
    "When do I ovulate, and what is the fertile window?",
    "Ovulation happens about 14 days before the next period starts — so on day (cycle length − 14): day 14 of a 28-day cycle, day 17 of a 31-day cycle. The fertile window is the 5 days before ovulation plus ovulation day itself, because sperm can survive up to 5 days while the egg lasts about 24 hours. This calculator estimates both for each forecasted cycle.",
  ],
  [
    "How accurate is a period calculator?",
    "For women with regular cycles it usually lands within 2–3 days. Stress, illness, travel, weight change, intense training and hormonal contraception all shift real dates. Treat every date here as an estimate for planning (trips, events, supplies), never as proof about pregnancy — and never as a contraception method, because ovulation can arrive early or late in any given cycle.",
  ],
  [
    "My period is late — what should I do?",
    "A few days' variation is normal. If your period is more than about a week late and there is any chance of pregnancy, take a home pregnancy test (most accurate from the first missed day, with morning urine). If tests are negative and periods keep disappearing or staying irregular for 3+ months, see a clinician — thyroid, PCOS, stress and perimenopause are common causes that deserve a proper workup.",
  ],
  [
    "Does the calculator store my dates?",
    "No. Everything is calculated in your browser the moment you type; nothing is sent to a server, saved in an account or tracked. Reload the page and it is gone. If you want ongoing tracking with history, a dedicated period-tracking app is the better tool — this calculator is for quick, private forecasts.",
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

export default function PeriodCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Health · Planning · Private
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Period <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Your next period date — and the three cycles after it.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter the first day of your last period and your usual cycle length. You get the expected next period (with
            the honest ±2-day window), which cycle day you are on today, your fertile window and ovulation estimate, and
            a forecast table for the next three cycles — no app, no account, nothing stored.
          </p>
        </div>
      </section>

      <PeriodCalculator />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. Health and wellness sites grow fast with useful
            calculators like this one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Start a project <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              <Icon name="whatsapp" className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-stone-400">
            Prefer email?{" "}
            <a href="mailto:neilsonsmarry@gmail.com" className="text-orange-400 font-semibold hover:underline">
              neilsonsmarry@gmail.com
            </a>{" "}
            · See <Link href="/services" className="text-orange-400 font-semibold hover:underline">my services</Link> — or
            explore the <Link href="/ovulation-calculator" className="text-orange-400 font-semibold hover:underline">Ovulation Calculator</Link>,{" "}
            <Link href="/bmi-calculator" className="text-orange-400 font-semibold hover:underline">BMI Calculator</Link> and{" "}
            <Link href="/water-intake-calculator" className="text-orange-400 font-semibold hover:underline">Water Intake Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How the prediction works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Next period = last period + cycle length.</strong> The luteal phase
              (ovulation → next period) is fairly constant at about 14 days, so ovulation is estimated at
              cycle length − 14 days after the period starts, and the fertile window is the five days before ovulation
              plus ovulation day. This calculator rolls the same arithmetic forward for three cycles.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                Last period started <strong className="text-stone-900">5 November</strong>, cycle length{" "}
                <strong className="text-stone-900">29 days</strong>, period length 5 days. Next period: 5 Nov + 29 days ={" "}
                <strong className="text-stone-900">4 December</strong> (window: 2–6 December). Ovulation estimate:
                day 29 − 14 = day 15 → <strong className="text-stone-900">19 November</strong>, with a fertile window of
                14–19 November. The cycle after starts 2 January.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Use your average cycle length over the last 3–6 cycles, not just the last one.",
                "Count cycle length from the first day of one period to the first day of the next.",
                "Planning a wedding or trip? Count forward with the 3-cycle table, and pack for the ±2-day window.",
                "TTC? The fertile window here pairs with the Ovulation Calculator's day-by-day detail.",
                "Estimates only — this tool does not diagnose anything and is not a contraceptive method.",
              ].map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 grid place-items-center">
                    <Icon name="check" className="w-3 h-3" />
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Period calculator questions, answered" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="#top" className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline">
              ↑ Back to the calculator
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
