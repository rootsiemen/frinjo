import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Mulch from "./Mulch";

export const metadata = {
  title: "Mulch Calculator — Cubic Yards & Bags",
  description:
    "Free mulch calculator: cubic yards and bags for multiple beds of any shape, weight by mulch type — 1 yd³ covers 108 sq ft at 3 inches deep.",
  keywords: ["mulch calculator", "how much mulch do i need", "mulch bags calculator", "cubic yards mulch", "mulch coverage calculator"],
  alternates: { canonical: "https://frinjo.me/mulch-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Mulch Calculator — Multi-Bed, Any Shape, With Weight | WebStore Pro",
    description: "Yards, bags, weight and the bags-vs-bulk verdict for all your beds at once. Free.",
    url: "https://frinjo.me/mulch-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Mulch Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/mulch-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free mulch calculator that totals multiple garden beds of different shapes — rectangles, circles and triangles, each measured independently rather than multiplied copies of one bed — at a chosen depth (1–6 inches, with guidance: 3 in for established beds, 4 in for new beds, 2 in for refreshes). It reports cubic yards, cubic feet, the number of 1.5, 2 or 3 cu ft bags, and an estimated total weight by mulch type (for example shredded hardwood at about 450 lb per cubic yard, with a note that moisture changes it). With prices entered, it compares bagged versus bulk cost with a verdict, and it produces a copyable shopping list. A quick-answer block states the key coverage facts: one cubic yard covers 108 sq ft at 3 inches deep, and a 2 cu ft bag covers 8 sq ft at 3 inches.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Mulch Calculator", item: "https://frinjo.me/mulch-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How much mulch do I need?",
    "Multiply each bed's area (length × width in feet) by the depth in feet, and divide by 27 for cubic yards. Quick reference: one cubic yard covers 108 sq ft at 3 inches deep, 162 sq ft at 2 inches, or 81 sq ft at 4 inches. This calculator handles several beds of different shapes at once and converts the total into bags as well.",
  ],
  [
    "How many bags of mulch equal a cubic yard?",
    "A cubic yard is 27 cubic feet. In 2 cu ft bags — the standard size — that is 13.5, so 14 bags per yard. In 3 cu ft bags it is 9 per yard; in 1.5 cu ft bags, 18. Enter your bag size above and the count is exact for your beds and depth.",
  ],
  [
    "How deep should mulch be?",
    "Three inches is the standard for established beds: enough to suppress weeds and hold moisture without smothering roots. Use 4 inches for brand-new beds (it settles), 2 inches for an annual colour refresh, and keep mulch a few inches away from trunks and stems — the 'mulch volcano' piled against a trunk rots bark and invites pests.",
  ],
  [
    "Is bagged or bulk mulch cheaper?",
    "Per unit of mulch, bulk is usually cheaper — but it often carries a delivery fee and sometimes a minimum order, and it lands as a pile you must move the same week. Under about 2–3 cubic yards, bags are frequently competitive and far more convenient; above that, bulk pulls away. Enter both prices above and the calculator gives a verdict for your exact volume.",
  ],
  [
    "How much does a cubic yard of mulch weigh?",
    "Roughly 400–700 lb depending on type and moisture: cedar around 380 lb, pine bark ~400, shredded hardwood ~450, rubber mulch ~550, compost up to ~650 — and rain-soaked material weighs more. The weight matters for pickup trucks: a half-ton pickup is at its limit around 1–1.5 yards of hardwood mulch. This calculator shows the estimate for your chosen type.",
  ],
  [
    "Is the Mulch Calculator free?",
    "Yes, completely free with no sign-up. Calculations run in your browser; nothing is stored.",
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

export default function MulchPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Multi-bed · Bags vs bulk verdict
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Mulch <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Every Bed, Every Shape — One Total
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Rectangular beds, the round tree ring, the triangular corner — other calculators do one
            rectangle and multiply. This one measures <strong>each bed properly</strong>, then gives yards,
            bags, the weight your truck will feel, and whether bulk beats bags.
          </p>
        </div>
      </section>

      <Mulch />

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
            {" "}· Area first: <Link href="/square-feet-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Square Feet Calculator</Link>; volume work: <Link href="/concrete-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Concrete Calculator</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Mulch questions, answered" />
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
              Calculate your mulch <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
