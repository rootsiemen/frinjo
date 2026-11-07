import type { Metadata } from "next";
import Link from "next/link";
import BodyFatCalculator from "./BodyFatCalculator";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Body Fat Calculator — US Navy Method, Fat & Lean Mass";
const DESCRIPTION =
  "Free body fat calculator using the US Navy circumference method: neck, waist (and hip for women) + height give body fat %, ACE category, fat mass and lean mass. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["body fat calculator", "body fat percentage calculator", "navy body fat calculator", "us navy method", "lean body mass calculator", "body fat percentage"],
  alternates: { canonical: "https://frinjo.me/body-fat-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Body Fat Calculator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/body-fat-calculator",
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
  name: "Body Fat Calculator — US Navy Method",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/body-fat-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Estimate body fat percentage with the US Navy circumference method (Hodgdon & Beckett): height, neck and waist for men, plus hip for women, in inches or centimetres. Reports body fat %, ACE category, fat mass, lean body mass, and the body weight that matches a target body-fat percentage at the same lean mass.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Body Fat Calculator", item: "https://frinjo.me/body-fat-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How accurate is the Navy body fat method?",
    "Against lab methods (DEXA, hydrostatic weighing), the Navy circumference method is typically within about ±3–4 percentage points for most people — good enough to track change over time, which is what matters. It is the method the US military uses for its fitness standards. Measure the same way, at the same time of day, and the trend is reliable even if the absolute number is off by a point or two.",
  ],
  [
    "How do I measure correctly?",
    "Use a flexible tape on bare skin, snug but not compressing. Neck: the narrowest point, just below the Adam's apple, tape sloping slightly down to the front. Waist: at the navel (men) or the narrowest point above the navel (women), after a normal exhale — do not suck in. Hip (women): the widest point of the buttocks. Height without shoes.",
  ],
  [
    "What is a healthy body fat percentage?",
    "By the ACE categories used here: men — athletes 6–13%, fitness 14–17%, average 18–24%, obese 25%+. Women — athletes 14–20%, fitness 21–24%, average 25–31%, obese 32%+. Women carry more essential fat (10–13% vs 2–5% for men) by physiology. For general health, the fitness-to-average boundary is a sensible target zone.",
  ],
  [
    "Body fat % vs BMI — which should I use?",
    "Body fat % describes composition; BMI only relates weight to height, so a muscular person reads 'overweight' on BMI with a low body fat %. If you lift weights or play sports, body fat % is the meaningful number. Use our BMI Calculator for the population-level screening figure and this calculator for composition — together they tell the full story.",
  ],
  [
    "How do I use the target-weight figure?",
    "The panel shows the weight you would be at a target body fat % if your lean mass stayed the same: target weight = lean mass ÷ (1 − target %). It converts an abstract 'get to 15%' goal into a concrete scale number. In reality, dieting loses a little lean mass too, so treat it as the optimistic edge of the range — and lift weights while dieting to defend the lean side.",
  ],
  [
    "Why does the formula need my hip measurement (women) but not men's?",
    "Fat distribution differs by sex: men store proportionally more around the waist, women around both waist and hips. The Navy equations were fitted on large measured samples, and for women the waist + hip − neck combination predicts body fat far better than waist alone. Men only need waist − neck because hip adds little signal for them.",
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

export default function BodyFatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Health · Fitness · No scale tricks
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Body Fat <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Your body fat % from three tape measurements — the US Navy way.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            No smart scale, no calipers, no lab visit. Height, neck and waist (plus hip for women) feed the same formula
            the US Navy uses, and you get your body fat %, your ACE category, and — with your weight — fat mass, lean
            mass and the scale weight that matches a leaner target.
          </p>
        </div>
      </section>

      <BodyFatCalculator />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. Gyms, coaches and clinics use tools like this to
            turn visitors into leads.
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
            explore the <Link href="/bmi-calculator" className="text-orange-400 font-semibold hover:underline">BMI Calculator</Link>,{" "}
            <Link href="/calorie-calculator" className="text-orange-400 font-semibold hover:underline">Calorie Calculator</Link> and{" "}
            <Link href="/running-pace-calculator" className="text-orange-400 font-semibold hover:underline">Running Pace Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How the Navy formula works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Circumferences predict composition.</strong> Developed for the US Navy
              (Hodgdon &amp; Beckett), the method exploits the fact that fat gathers at the waist (and hips in women)
              while the neck tracks lean frame size. In inches — Men:{" "}
              <span className="font-mono text-sm">86.010·log₁₀(waist − neck) − 70.041·log₁₀(height) + 36.76</span>; Women:{" "}
              <span className="font-mono text-sm">163.205·log₁₀(waist + hip − neck) − 97.684·log₁₀(height) − 78.387</span>.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                A man, <strong className="text-stone-900">70 in</strong> tall, neck <strong className="text-stone-900">15 in</strong>,
                waist <strong className="text-stone-900">34 in</strong>: waist − neck = 19, so
                86.010 × log₁₀(19) − 70.041 × log₁₀(70) + 36.76 ≈ <strong className="text-stone-900">17.5% body fat</strong> —
                the top of the ACE &quot;Fitness&quot; range. At 180 lb that is ≈31.5 lb of fat and ≈148.5 lb of lean
                mass. Enter the defaults above and watch it compute.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Measure in the morning, before eating, for repeatable numbers.",
                "Tape flat and level, snug on skin without denting it — a 0.5 in sloppiness shifts the result ~1%.",
                "Re-measure every 2–4 weeks; single readings wobble, trends don't.",
                "If waist ≤ neck, the formula can't run — re-measure; the waist is at the navel, not the belt line.",
                "This is a health estimate, not a diagnosis — see a clinician for medical decisions.",
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
          <SectionHead eyebrow="FAQ" title="Body fat calculator questions, answered" />
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
