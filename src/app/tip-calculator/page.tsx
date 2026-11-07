import type { Metadata } from "next";
import Link from "next/link";
import TipCalculator from "./TipCalculator";
import { TIP_GUIDE } from "./calc";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Tip Calculator — Tip, Tax & Bill Split Per Person";
const DESCRIPTION =
  "Free tip calculator with bill split: enter the bill, pick a tip %, add tax and split between any number of people — see tip, total and per-person amounts instantly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["tip calculator", "bill split calculator", "split the bill", "gratuity calculator", "tip calculator with tax", "how much to tip", "split check calculator"],
  alternates: { canonical: "https://frinjo.me/tip-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Tip Calculator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/tip-calculator",
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
  name: "Tip Calculator — Tip, Tax & Bill Split",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/tip-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculate a restaurant tip and split the bill: tip presets from 10% to 25% or a custom percentage, optional sales tax, tipping on the pre-tax or post-tax amount, split between 1–50 people with per-person share and tip, and a round-up-the-total option. Updates instantly as you type.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Tip Calculator", item: "https://frinjo.me/tip-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much should I tip at a restaurant?",
    "In the US, 18–22% of the pre-tax bill is standard for table service — 20% is the easy default (move the decimal one place left and double it). 15% is the floor for acceptable service, 25%+ for exceptional service. This calculator defaults to 20% and shows preset buttons from 10% to 25%.",
  ],
  [
    "Do you tip on the total before or after tax?",
    "Custom is to tip on the pre-tax amount — you are tipping for the service, not for the government's cut. Most people simply tip on the total because it is easier and the difference is small. The toggle in this calculator lets you choose; on an $86.40 bill with 8.25% tax, tipping 20% pre-tax is $17.28 vs $18.71 post-tax.",
  ],
  [
    "How do I split a bill evenly with tip included?",
    "Add the tip and any tax to the bill, then divide by the number of people — that is exactly what this calculator's per-person panel does, and it also breaks out each person's share of the bill vs their share of the tip, which helps when one person wants to tip extra. Splitting unevenly (each pays for what they ordered) is fairer for very different orders, but even-split is the social default.",
  ],
  [
    "How much do I tip for delivery and takeout?",
    "Delivery: 15–20% of the order, with a practical minimum around $5 on small orders — drivers rely on tips and often use their own car. Takeout/counter service: tipping is optional and 0–10% is normal; many people round up or add a dollar or two for large or complicated orders.",
  ],
  [
    "What is the quick mental math for a 20% tip?",
    "Take 10% by moving the decimal point one place left ($86.40 → $8.64), then double it → $17.28. For 15%, take 10% and add half of it ($8.64 + $4.32 = $12.96). For 18%, take 20% and subtract 2% (a tenth of the 20% figure).",
  ],
  [
    "Is tipping expected outside the US?",
    "It varies a lot. Much of Europe includes service in the price (round up or leave 5–10% for great service in Germany/France; UK restaurants often add a 10–12.5% service charge). In Japan tipping is not customary and can confuse. In Canada and Mexico, 15–20% is normal, similar to the US.",
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

export default function TipCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Restaurants · Groups · Delivery
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Tip <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            The tip, the tax and the split — worked out before the check gets awkward.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter the bill, tap a tip percentage, add your local tax if you want, and split between the table. You get
            the tip, the grand total, and exactly what each person owes — including how much of that is tip. Optional
            round-up makes cash splits painless.
          </p>
        </div>
      </section>

      <TipCalculator />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. A tip/split widget is a classic add-on for restaurant
            and food-delivery sites — I can build it for you.
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
            explore the <Link href="/discount-calculator" className="text-orange-400 font-semibold hover:underline">Discount Calculator</Link>,{" "}
            <Link href="/percentage-calculator" className="text-orange-400 font-semibold hover:underline">Percentage Calculator</Link> and{" "}
            <Link href="/hourly-to-salary-calculator" className="text-orange-400 font-semibold hover:underline">Hourly to Salary Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How the tip and split are calculated" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Tip = bill × tip%.</strong> The standard base is the pre-tax bill; tax is
              added on top, and the total is split evenly. Per person = (bill + tax + tip) ÷ people.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                A dinner bill of <strong className="text-stone-900">$86.40</strong> with <strong className="text-stone-900">8.25% tax</strong> and
                a <strong className="text-stone-900">20% tip</strong>, split between <strong className="text-stone-900">2 people</strong>:
                tax is $7.13, the tip (on the pre-tax bill) is $17.28, and the total is $110.81 — so each person pays{" "}
                <strong className="text-stone-900">$55.41</strong> ($46.77 share + $8.64 tip). Type those numbers into the
                calculator above to see it live.
              </p>
            </div>
            <div>
              <p className="font-bold text-stone-900 mb-3">Standard US tipping guide</p>
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                {TIP_GUIDE.map(([what, how], i) => (
                  <div key={what} className={`flex justify-between gap-4 px-5 py-3 text-sm ${i % 2 ? "bg-stone-50" : "bg-white"}`}>
                    <span className="text-stone-600">{what}</span>
                    <span className="font-bold text-stone-900 text-right">{how}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Tip calculator questions, answered" />
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
