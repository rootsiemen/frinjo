import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import SquareFeet from "./SquareFeet";

export const metadata = {
  title: "Square Feet Calculator — Sq Ft for Rooms, Flooring & Yards",
  description:
    "Free square feet calculator: add multiple rooms and shapes (rectangle, triangle, circle), get total sq ft with a waste allowance and a material cost estimate, plus sq yd and m² conversions. For flooring, tile, paint and yards. No sign-up.",
  keywords: [
    "square feet calculator",
    "sq ft calculator",
    "square footage calculator",
    "flooring calculator",
    "how many square feet",
    "room square feet",
  ],
  alternates: { canonical: "https://frinjo.me/square-feet-calculator" },
  openGraph: {
    title: "Square Feet Calculator — Multi-Room, With Waste & Cost | WebStore Pro",
    description:
      "Measure every room, add waste, price the material — total square footage done right, free.",
    url: "https://frinjo.me/square-feet-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Square Feet Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/square-feet-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free square footage calculator that accepts multiple areas in one calculation. Each area can be a rectangle (length × width), a triangle (base × height ÷ 2) or a circle (π × radius²), measured in feet. It totals the areas, adds a configurable waste/cutting allowance percentage, converts to square yards and square metres, and estimates material cost from a price per square foot. It runs locally in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Square Feet Calculator", item: "https://frinjo.me/square-feet-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate square feet?",
    "For a rectangular room, multiply length by width, both in feet: a 12 ft × 10 ft room is 120 sq ft. For a triangle, multiply base by height and halve it. For a circle, square the radius and multiply by π (3.14159). This calculator does all three shapes and adds multiple areas together.",
  ],
  [
    "How much extra should I buy for waste?",
    "For straight-laid flooring, 10% extra covers cuts and the occasional ruined board. For diagonal or patterned tile, herringbone floors and irregular rooms, use 15%. Round up to whole boxes afterwards — flooring is sold by the box, and a matched dye lot is hard to find later.",
  ],
  [
    "How do I measure an L-shaped room?",
    "Split it into two rectangles, measure each, and add them as two areas here. The same trick works for any irregular space: rectangles (plus the odd triangle or circle) cover almost every real room.",
  ],
  [
    "How many square feet are in a square yard or a square metre?",
    "One square yard is 9 square feet, and one square metre is about 10.764 square feet. This calculator shows every area in all three units automatically, which matters because flooring, carpet and landscaping materials are sold in different units.",
  ],
  [
    "Does square footage include closets, stairs and hallways?",
    "For flooring and paint estimates, yes — measure and add them; you will be buying material for them. For real-estate listing square footage, rules differ (generally only heated, finished, above-grade living space counts, per ANSI Z765 in the US), so do not use a material estimate as a listing figure.",
  ],
  [
    "Is the Square Feet Calculator free?",
    "Yes, completely free with no sign-up. Your measurements are processed in your browser and never stored.",
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

export default function SquareFeetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Multi-room
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Square Feet <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Every Room, the Waste Allowance &amp; the Material Cost
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            One room is easy maths. Real projects are five rooms, a hallway and a round rug — this
            calculator adds <strong>every area together</strong>, adds the cutting waste installers
            actually need, and prices the material before you order.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <SquareFeet />

      {/* FORMULAS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The formulas"
            title="Square footage for every shape"
            sub="Three shapes cover nearly every floor, yard and wall you will ever measure."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Rectangle / square</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Length × width</h3>
              <p className="text-stone-600 leading-relaxed">
                Rooms, walls, yards, plots. A 12 × 10 ft room is 120 sq ft. Measure wall to wall, in feet
                and decimal inches (6 inches = 0.5 ft).
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Triangle</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Base × height ÷ 2</h3>
              <p className="text-stone-600 leading-relaxed">
                Gable ends, triangular garden beds, corner lots. The height is the perpendicular distance
                from the base to the opposite corner — not the slanted side.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Circle</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">π × radius²</h3>
              <p className="text-stone-600 leading-relaxed">
                Round rugs, pools, patios and fire pits. The radius is half the diameter — a 10 ft wide
                round rug has a radius of 5 ft and covers about 78.5 sq ft.
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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Square footage questions, answered" />
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
              Measure a space <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
