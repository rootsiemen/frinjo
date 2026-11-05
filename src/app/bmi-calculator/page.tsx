import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import BmiCalculator from "./BmiCalculator";

export const metadata = {
  title: "BMI Calculator — Free Body Mass Index Calculator (ft/in & cm)",
  description:
    "Free BMI calculator for adults: enter your height and weight in feet/inches or cm/kg to get your Body Mass Index, your WHO category, and the healthy weight range for your height. Instant, private, no sign-up.",
  keywords: [
    "bmi calculator",
    "body mass index calculator",
    "bmi calculator for adults",
    "healthy weight calculator",
    "bmi chart",
    "what is my bmi",
  ],
  alternates: {
    canonical: "https://frinjo.me/bmi-calculator",
    languages: {
      en: "https://frinjo.me/bmi-calculator",
      fr: "https://frinjo.me/fr/calcul-imc",
    },
  },
  openGraph: {
    title: "BMI Calculator — Body Mass Index & Healthy Weight Range | WebStore Pro",
    description:
      "Your BMI, your category on the WHO scale, and the healthy weight range for your exact height — in imperial or metric, free and instant.",
    url: "https://frinjo.me/bmi-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BMI Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/bmi-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free Body Mass Index (BMI) calculator for adults aged 20 and over. BMI is calculated as weight in kilograms divided by the square of height in metres (kg/m²), and categorised on the World Health Organization scale: underweight below 18.5, healthy weight 18.5–24.9, overweight 25.0–29.9, obese 30.0 and above. The calculator also returns the healthy weight range for the entered height and runs locally in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "BMI Calculator", item: "https://frinjo.me/bmi-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is BMI calculated?",
    "BMI (Body Mass Index) is your weight in kilograms divided by the square of your height in metres: BMI = kg ÷ m². In imperial units the same formula is BMI = 703 × lb ÷ in². This calculator converts your feet/inches and pounds automatically and applies the metric formula.",
  ],
  [
    "What is a healthy BMI?",
    "On the World Health Organization scale used for adults, a BMI of 18.5 to 24.9 is classified as healthy weight. Below 18.5 is underweight, 25.0 to 29.9 is overweight, and 30.0 or above is obese. These ranges are population-level guides from the WHO and the CDC, not individual diagnoses.",
  ],
  [
    "What is the healthy weight range for my height?",
    "It is the weight range that puts your BMI between 18.5 and 24.9 at your height, and this calculator shows it next to your result — for example, at 5′9″ (175 cm) the healthy range is roughly 125 to 168 lb (56.7 to 76.3 kg).",
  ],
  [
    "Is BMI accurate for athletes and muscular people?",
    "BMI cannot distinguish muscle from fat, so very muscular people can score in the overweight range while being lean and fit. It also does not account for age, sex, bone density or where fat is carried. Doctors use it as a first screening number alongside waist circumference, blood pressure and blood tests — not as a standalone verdict.",
  ],
  [
    "Should children and teenagers use this calculator?",
    "No. For ages 2–19, BMI is interpreted as a percentile against growth charts for the child's age and sex (CDC BMI-for-age), not against the adult cut-offs. This calculator is built for adults aged 20 and over.",
  ],
  [
    "Is the BMI Calculator free? Is my data stored?",
    "Yes, completely free with no sign-up. Your height and weight are processed in your browser only — nothing is sent to or stored on our servers.",
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

export default function BmiCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Adults 20+
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            BMI <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Body Mass Index &amp; Healthy Weight Range
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter your height and weight — feet and pounds, or centimetres and kilos — and get your BMI on
            the WHO scale, plus the <strong>healthy weight range for your exact height</strong>. Updates as
            you type.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <BmiCalculator />

      {/* CATEGORIES */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The WHO scale"
            title="BMI categories, explained honestly"
            sub="The four adult categories used by the World Health Organization and the CDC. BMI is a screening tool — a useful first number, never the whole story about a body."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Below 18.5</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Underweight</h3>
              <p className="text-stone-600 leading-relaxed">
                Below the healthy range. Can carry risks of its own — nutrient deficiencies, weakened
                immunity, bone loss — and is worth a doctor&apos;s look if it was not deliberate.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">18.5 – 24.9</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Healthy weight</h3>
              <p className="text-stone-600 leading-relaxed">
                The range associated with the lowest overall health risk at population level. Fitness,
                strength and habits still matter inside it — the number is a range, not a finish line.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">25.0 – 29.9</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Overweight</h3>
              <p className="text-stone-600 leading-relaxed">
                Above the healthy range. Also the range where muscular builds most often get misread —
                BMI counts all mass the same, whether it is muscle or fat.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-3">30.0 &amp; above</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Obese</h3>
              <p className="text-stone-600 leading-relaxed">
                Associated at population level with higher risk of type 2 diabetes, heart disease and joint
                problems. A screening flag to discuss with a doctor — not a character judgement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIMITS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Know the limits
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            What BMI can and cannot tell you
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            BMI was designed in the 19th century as a <strong className="text-white">population statistic</strong>,
            and health bodies still use it that way: a cheap, consistent first screen. It{" "}
            <strong className="text-white">cannot</strong> tell muscle from fat, bone from water, or where
            fat sits on the body — and fat around the waist carries different risks than fat on the hips.
            It also ignores age, sex and ancestry, all of which shift what a given BMI means. Use your
            result here as the start of a picture that waist measurement, fitness, blood pressure and blood
            work complete — ideally with a clinician who knows you.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            More free tools in the{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              tools hub
            </Link>{" "}
            — including the{" "}
            <Link href="/sun-moon-rising-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              Big Three Calculator
            </Link>
            .
          </p>
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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="BMI questions, answered" />
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
              Check your BMI <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            This calculator is general information for adults, not medical advice. Talk to a clinician
            about your own health numbers.
          </p>
        </div>
      </section>
    </>
  );
}
