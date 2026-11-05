import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Concrete from "./Concrete";

export const metadata = {
  title: "Concrete Calculator — Yards & Bags Needed",
  description:
    "Free concrete calculator: slabs, round pours and post holes in one total — cubic yards, 40–80 lb bags, pallets and a bagged vs ready-mix verdict.",
  keywords: ["concrete calculator", "concrete bags calculator", "how many bags of concrete", "concrete slab calculator", "post hole concrete calculator", "bags of concrete per yard"],
  alternates: { canonical: "https://frinjo.me/concrete-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Concrete Calculator — All Your Pours, One Total | WebStore Pro",
    description: "Slabs + rounds + post holes in one answer: yards, bags, pallets, water and the ready-mix verdict. Free.",
    url: "https://frinjo.me/concrete-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Concrete Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/concrete-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free concrete calculator that totals multiple pour sections of different shapes — rectangular slabs (length × width × thickness), round slabs (π r² × depth) and multiple cylindrical post holes — into one volume in cubic feet and cubic yards. It applies a waste percentage, converts to pre-mix bags using standard yields (80 lb ≈ 0.60 cu ft, 60 lb ≈ 0.45, 50 lb ≈ 0.375, 40 lb ≈ 0.30; about 45 80-lb bags per cubic yard), reports typical pallet counts, estimates mixing water, compares bagged cost against ready-mix truck cost per cubic yard with a verdict, and produces a copyable shopping list. Runs in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Concrete Calculator", item: "https://frinjo.me/concrete-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How many bags of concrete do I need?",
    "First find the volume: length × width × thickness for a slab, in cubic feet. Then divide by the yield of your bag size: an 80 lb bag yields about 0.60 cu ft, a 60 lb bag 0.45, a 50 lb bag 0.375 and a 40 lb bag 0.30. A 10×10 ft slab 4 inches thick is 33.3 cu ft — about 56 bags of 80 lb before waste, 62 with a 10% allowance. This calculator does all of it, including mixed shapes in one project.",
  ],
  [
    "How many 80 lb bags of concrete are in a cubic yard?",
    "About 45. One cubic yard is 27 cu ft and an 80 lb bag yields ≈ 0.60 cu ft, so 27 ÷ 0.60 = 45 bags. (Some websites state 56 — that figure is wrong; it divides by the wrong yield.) For 60 lb bags it is 60 per yard, and for 40 lb bags, 90.",
  ],
  [
    "How much concrete do I need for a post hole?",
    "A post hole is a cylinder: π × radius² × depth. A typical fence-post hole 12 inches wide and 2.5 ft deep is about 1.96 cu ft — roughly 3–4 bags of 80 lb mix, from which the post itself displaces some volume (a 4×4 post in that hole displaces about 0.6 cu ft, so most people use 2–3 bags per hole in practice). Add your holes as a section here and the total includes them.",
  ],
  [
    "Bags or ready-mix truck — which is cheaper?",
    "Bags usually win on price below about 1 cubic yard and where a truck cannot reach; ready-mix wins on larger pours once you count your mixing time, and it arrives at a consistent mix. Trucks also charge short-load and delivery fees and enforce minimums (often 1 yd³). Enter both prices in the calculator and it gives a straight verdict for your volume.",
  ],
  [
    "How much water do I add per bag?",
    "Follow the bag's printed amount — roughly 1 gallon for an 80 lb bag, proportionally less for smaller bags. The calculator shows a total-water guide for planning. Never add extra water to make mixing easier: excess water can cut cured strength dramatically and is the most common DIY concrete mistake.",
  ],
  [
    "Is the Concrete Calculator free?",
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

export default function ConcretePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · All shapes, one total · Cost verdict included
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Concrete <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Bags for the Whole Job — Not One Shape at a Time
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A slab <em>and</em> a round pad <em>and</em> six post holes? Other calculators make you run each
            separately. Here they <strong>combine into one answer</strong>: yards, bags, pallets, water —
            and whether a ready-mix truck beats bags for your job.
          </p>
        </div>
      </section>

      <Concrete />

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
            {" "}· Measuring the area first? Use the <Link href="/square-feet-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Square Feet Calculator</Link> — and for the rest of the job, the <Link href="/board-foot-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Board Foot Calculator</Link> and <Link href="/mulch-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Mulch Calculator</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Concrete questions, answered" />
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
              Calculate your pour <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
