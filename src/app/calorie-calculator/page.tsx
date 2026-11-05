import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Calorie from "./Calorie";

export const metadata = {
  title: "Calorie Calculator — TDEE, BMR & Macros",
  description:
    "Free calorie calculator (Mifflin-St Jeor): your BMR, maintenance TDEE and the exact daily calories to lose, maintain or gain — with a macro split.",
  keywords: [
    "calorie calculator",
    "tdee calculator",
    "how many calories should i eat",
    "bmr calculator",
    "daily calorie calculator",
    "calories to lose weight",
  ],
  alternates: { canonical: "https://frinjo.me/calorie-calculator" },
  openGraph: {
    title: "Calorie Calculator — BMR, TDEE & Your Goal Target | WebStore Pro",
    description:
      "Maintenance calories and the daily target for your goal, from the best-validated equation. Free, with macros.",
    url: "https://frinjo.me/calorie-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calorie Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/calorie-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free daily calorie calculator using the Mifflin-St Jeor equation for basal metabolic rate (men: 10×weight kg + 6.25×height cm − 5×age + 5; women: the same − 161), multiplied by an activity factor (1.2–1.9) to give total daily energy expenditure (maintenance calories). Goal targets subtract 500 or 1,000 kcal for weight loss (floored at 1,200 kcal) or add 250 or 500 kcal for weight gain, and include a 30/40/30 protein/carb/fat macro split in grams. Supports imperial and metric units. General information only, not medical advice.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Calorie Calculator", item: "https://frinjo.me/calorie-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How many calories should I eat a day?",
    "Enough to match your maintenance level (TDEE) if you want to stay the same weight — the calculator above estimates it from your age, sex, height, weight and activity. Eat about 500 kcal/day below maintenance to lose roughly 1 lb (0.45 kg) a week, or about 250–500 above to gain. Averages for adults land around 2,000 kcal for women and 2,500 kcal for men, but individual values range widely, which is why a personal calculation beats a generic number.",
  ],
  [
    "What is the difference between BMR and TDEE?",
    "BMR (basal metabolic rate) is the energy your body burns at complete rest just staying alive — breathing, circulation, cell repair. TDEE (total daily energy expenditure) is BMR multiplied by an activity factor (1.2 for sedentary up to 1.9 for very heavy training), so it is the number that actually maintains your weight. You should almost never eat at or below BMR on purpose; deficits are taken from TDEE.",
  ],
  [
    "How accurate is the Mifflin-St Jeor equation?",
    "It is the most accurate widely used predictive equation for most adults: a 2005 review in the Journal of the American Dietetic Association (Frankenfield et al.) found it predicted measured resting metabolic rate within 10% more often than alternatives like Harris-Benedict. Even so, individual bodies vary — use the output as a starting estimate, track your weight trend for 2–3 weeks at that intake, and adjust by 100–200 kcal based on what actually happens.",
  ],
  [
    "Is a 500-calorie deficit safe?",
    "For most healthy adults, a 500 kcal/day deficit producing about 1 lb of loss per week is the standard, sustainable rate used in clinical guidance. Very aggressive deficits — and any target under about 1,200 kcal/day for women or 1,500 for men — risk muscle loss, nutrient shortfalls and rebound, and should only be followed under medical supervision; this calculator never sets a target below 1,200 kcal. If you are pregnant, under 18, or managing a medical condition, ask your clinician instead of using a calculator.",
  ],
  [
    "Do the macro percentages matter?",
    "Total calories decide the direction of weight change; macros decide how you feel getting there. Protein (shown at 30% here) protects muscle during a deficit and is the most satiating macro — many coaches use roughly 1.6–2.2 g per kg of body weight for people who train. The 30/40/30 split on this page is a common, balanced starting point, not a rule.",
  ],
  [
    "Is the Calorie Calculator free?",
    "Yes, completely free with no sign-up. Your details are calculated in your browser and never stored.",
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

export default function CaloriePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Mifflin-St Jeor · Imperial &amp; metric
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calorie <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Maintenance Calories — and the Target for Your Goal
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Not a generic &quot;2,000 a day&quot; — <strong>your</strong> number, from the best-validated
            equation in the research, plus the exact daily target for losing, maintaining or gaining, and
            a macro split to go with it.
          </p>
          <p className="mt-3 text-sm text-stone-500">
            Pair it with our <Link href="/bmi-calculator" className="font-semibold text-orange-700 hover:text-orange-800">BMI Calculator</Link> for the full picture.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <Calorie />

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
          <SectionHead eyebrow="FAQ" title="Calorie questions, answered" />
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
              Get your number <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
