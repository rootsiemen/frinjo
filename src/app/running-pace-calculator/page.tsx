import type { Metadata } from "next";
import Link from "next/link";
import PaceCalculator from "./PaceCalculator";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Running Pace Calculator — Pace, Finish Time & Splits";
const DESCRIPTION =
  "Free running pace calculator: find your pace per km or mile, predict finish times for 5K, 10K, half and full marathons, and get a full even-split table. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["running pace calculator", "pace calculator", "marathon pace calculator", "5k pace calculator", "finish time predictor", "running splits calculator", "min per mile calculator"],
  alternates: { canonical: "https://frinjo.me/running-pace-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Running Pace Calculator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/running-pace-calculator",
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
  name: "Running Pace Calculator — Pace, Finish Time & Splits",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/running-pace-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Three-mode running calculator: pace from distance and time, finish time from distance and pace, and distance from time and pace. Works in kilometres or miles, includes one-tap presets for 5K, 10K, half marathon, marathon and 50K, and generates a full even-split table for any race distance.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Running Pace Calculator", item: "https://frinjo.me/running-pace-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate my running pace?",
    "Divide your finish time by the distance. A 10K finished in 50:00 gives 50 ÷ 10 = 5:00 per kilometre (about 8:03 per mile). Pace is just the inverse of speed — runners use it because 'hold 5:00/km' is easier to act on mid-run than 'run at 12 km/h'.",
  ],
  [
    "What pace do I need for a sub-2-hour half marathon?",
    "A half marathon is 21.0975 km, so 2:00:00 requires 5:41 per km (9:09 per mile) or faster — with no margin for hills, water stations or a slow start. Target 5:38/km in training calculations to bank a small buffer. Enter 21.1 km and 5:41 pace in the 'Find finish time' mode to check any goal.",
  ],
  [
    "What is a good 5K pace for a beginner?",
    "Most healthy beginners finish a first 5K in 30–40 minutes — a pace of 6:00–8:00 per km (9:39–12:52 per mile). A 30-minute 5K (6:00/km) is a classic first milestone; trained club runners run 20–25 minutes (4:00–5:00/km). Whatever your number, it improves fastest with mostly easy miles plus one faster session a week.",
  ],
  [
    "Should I run even splits or negative splits?",
    "For most runners, even-to-slightly-negative splits (second half a touch faster) produce the best times: you avoid the late-race crash that a fast start guarantees. World records are almost always negative splits. The split table here assumes perfectly even pacing — use it as your ceiling for the first half, not a target to beat.",
  ],
  [
    "How do I convert pace between min/km and min/mile?",
    "Multiply min/km by 1.609 to get min/mile: 5:00/km × 1.609 = 8:03/mile. Divide min/mile by 1.609 to go back. Or just flip the km/mi toggle in this calculator — the conversion is instant and the split table re-renders in the new unit.",
  ],
  [
    "How accurate is a finish-time prediction from a shorter race?",
    "This calculator assumes you hold the same pace over a longer distance, which real runners can't quite do — fatigue makes longer races slower per km. A common rule (Riegel's formula) predicts a marathon from a half marathon at roughly 2 × half time × 1.06–1.10 for well-trained runners. Treat same-pace predictions as optimistic targets, and train to the long-run, not the spreadsheet.",
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

export default function PaceCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Running · Racing · Training
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Running Pace <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Pace, finish time or distance — plus the split table for race day.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Three calculators in one: work out your pace from a run, predict a finish time from a goal pace, or find how
            far a tempo run takes you. Presets for 5K, 10K, half and full marathon, kilometres or miles — and an even-split
            table you can race against.
          </p>
        </div>
      </section>

      <PaceCalculator />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. Coaching, gym and race sites convert far better with
            interactive tools like this one.
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
            explore the <Link href="/body-fat-calculator" className="text-orange-400 font-semibold hover:underline">Body Fat Calculator</Link>,{" "}
            <Link href="/bmi-calculator" className="text-orange-400 font-semibold hover:underline">BMI Calculator</Link> and{" "}
            <Link href="/calorie-calculator" className="text-orange-400 font-semibold hover:underline">Calorie Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How pace math works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Pace = time ÷ distance.</strong> Finish time = pace × distance, and
              distance = time ÷ pace. Those three rearrangements are the whole tool — the craft is in the units
              (1 mile = 1.609344 km) and in racing the number sensibly with even or slightly negative splits.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                You run <strong className="text-stone-900">10 km in 50:00</strong> → pace = 50 ÷ 10 ={" "}
                <strong className="text-stone-900">5:00/km</strong>. Hold that pace for a half marathon (21.0975 km) and
                you finish in 21.0975 × 5:00 = <strong className="text-stone-900">1:45:29</strong>. In miles the same pace
                is 5:00 × 1.609 = <strong className="text-stone-900">8:03/mile</strong>. The calculator does all three
                directions and prints every kilometre split.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Goal pace is a ceiling for the first half, not a target — bank nothing early, finish strong.",
                "Add 1–2% to flat-course predictions for hilly or hot races.",
                "Train most miles 60–90 seconds per km slower than goal pace; speed work earns the pace, easy miles keep it.",
                "Check the split table the night before and write the halfway split on your hand.",
                "A GPS watch's instant pace jumps around — judge by lap pace per km/mile instead.",
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
          <SectionHead eyebrow="FAQ" title="Pace calculator questions, answered" />
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
