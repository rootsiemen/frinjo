import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import WaterIntake from "./WaterIntake";

export const metadata = {
  title: "Water Intake Calculator — Daily Target",
  description:
    "Free water intake calculator: your daily water target from body weight, exercise, climate, pregnancy and breastfeeding — in litres, oz and cups.",
  keywords: ["water intake calculator", "how much water should i drink", "daily water intake", "hydration calculator", "water calculator by weight"],
  alternates: { canonical: "https://frinjo.me/water-intake-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Water Intake Calculator — Your Daily Target | WebStore Pro",
    description: "Daily water from your weight and activity — litres, oz, cups and glasses, with honest reference values. Free.",
    url: "https://frinjo.me/water-intake-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Water Intake Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/water-intake-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free daily water intake calculator using the common weight-based rule of thumb of about 35 ml of drinking water per kilogram of body weight (roughly 0.5 oz per pound), adding about 355 ml per 30 minutes of exercise, 500 ml for hot climates or heavy sweating, 300 ml in pregnancy and 700 ml while breastfeeding. Results are shown in litres, fluid ounces, 8-ounce cups and 250 ml glasses, with EFSA adequate intakes for total water (including food moisture, about 2.5 L/day for men and 2.0 L/day for women) given as context. General information, not medical advice.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Water Intake Calculator", item: "https://frinjo.me/water-intake-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much water should I drink a day?",
    "A practical starting point is about 35 ml per kilogram of body weight in drinks — for a 70 kg (154 lb) adult, roughly 2.4 litres — adjusted upward for exercise (about 355 ml per 30 minutes), heat, pregnancy and breastfeeding. Official reference values for total water from all sources, including food, are about 2.5 L/day for men and 2.0 L/day for women (EFSA); US reference intakes are higher (3.7 L and 2.7 L total). Your needs sit in that landscape — this calculator personalizes the drinking portion.",
  ],
  [
    "Is the '8 glasses a day' rule real?",
    "It is a memorable simplification, not a scientific threshold — it traces to a 1945 Food and Nutrition Board note whose own context (that much of it comes from food) was dropped as the rule spread. Eight 250 ml glasses is 2 litres, which happens to be a reasonable target for many adults, but a 50 kg person and a 100 kg athlete do not share one number.",
  ],
  [
    "Does coffee, tea and food count toward water intake?",
    "Yes. All beverages contribute, including caffeinated ones — caffeine's mild diuretic effect is outweighed by the water in the drink at normal intakes. Food also supplies roughly 20–30% of daily water (fruit, vegetables, soups, even rice and bread contain water). This calculator targets the drinks portion deliberately.",
  ],
  [
    "Can you drink too much water?",
    "Yes, though it is uncommon: drinking far beyond thirst for prolonged periods can dilute blood sodium (hyponatremia), which is dangerous. It is mainly a risk in endurance events when people force fluids on a schedule. For everyday life, drinking to thirst plus a glass with meals is a safe pattern for healthy adults; people with kidney, heart or liver conditions should follow their clinician's fluid guidance instead of any calculator.",
  ],
  [
    "What are simple signs I am drinking enough?",
    "Pale-yellow urine (like lemonade, not apple juice), rarely feeling very thirsty, and no drop in energy from dehydration headaches. Dark urine, strong thirst and dry mouth mean drink more; completely clear urine all day means you can ease off.",
  ],
  [
    "Is the Water Intake Calculator free?",
    "Yes, completely free with no sign-up. Your details are calculated in your browser and never stored.",
  ],
  [
    "How much water should a 60 kg person drink on a rest day?",
    "On the rule this calculator uses, 60 × 35 ml = 2,100 ml — 2.10 litres of drinks, about 8.4 glasses of 250 ml. That is the base before any exercise, heat, pregnancy or breastfeeding additions, and before the water that arrives with food, which supplies more on top.",
  ],
  [
    "Should I drink more water when I am ill or it is very hot?",
    "Generally yes for heat — this calculator adds 500 ml for a hot climate or heavy sweating, and exercise in heat adds its own share on top. With illness, fever, vomiting or diarrhoea increase fluid losses, so drink steadily and seek medical advice if you cannot keep fluids down.",
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

export default function WaterIntakePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Weight-based · Reference values included
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Water Intake <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            How Much Water Should You Actually Drink?
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Not the same flat &quot;8 glasses&quot; for everyone — a target from <strong>your</strong> weight,
            your exercise and your climate, with the official reference numbers shown alongside so you can
            sanity-check it.
          </p>
        </div>
      </section>

      <WaterIntake />

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

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="How it works" title="How your daily target is built" />
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              The estimate starts from the standard weight-based rule of thumb: about 35 ml of drinking
              water per kilogram of body weight (roughly 0.5 oz per pound). It then adds fixed amounts for
              the losses and demands you select: about 355 ml for every 30 minutes of exercise, 500 ml for
              a hot climate or heavy sweating, 300 ml in pregnancy and 700 ml while breastfeeding. The
              total is shown in litres, fluid ounces, 8-ounce cups and 250 ml glasses.
            </p>
            <p>
              <strong className="text-stone-900">Worked example:</strong> an 80 kg adult who exercises for
              60 minutes on a hot day. Base: 80 × 35 ml = 2,800 ml. Exercise: (60 ÷ 30) × 355 ml = 710 ml.
              Heat: +500 ml. Total: 2,800 + 710 + 500 = 4,010 ml — 4.01 litres a day, about 136 fluid
              ounces or roughly 16 glasses of 250 ml.
            </p>
            <p>
              Three things trip people up. Mistaking this target for total water — it is the drinks portion
              only; food moisture comes on top, which is why the EFSA total-water references shown with the
              result (2.5 L men, 2.0 L women) can look lower than your number. Entering pounds with the unit
              left on kilograms, which more than doubles the answer. And trying to drink the whole target at
              once — spread it across the day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Water intake questions, answered" />
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
              Get your target <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
