import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import BoardFoot from "./BoardFoot";

export const metadata = {
  title: "Board Foot Calculator — Lumber BF Math",
  description:
    "Free board foot calculator: thickness × width × length ÷ 144, with quantity and price per board foot — and the nominal vs actual sizes (2×4 = 1.5×3.5).",
  keywords: ["board foot calculator", "board feet calculator", "lumber calculator", "how to calculate board feet", "bf calculator"],
  alternates: { canonical: "https://frinjo.me/board-foot-calculator" },
  openGraph: {
    title: "Board Foot Calculator — Honest Lumber Maths | WebStore Pro",
    description: "Board feet from actual dimensions, with price — and the nominal vs actual sizes table built in. Free.",
    url: "https://frinjo.me/board-foot-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Board Foot Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/board-foot-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free board foot calculator using the standard formula board feet = thickness in inches × width in inches × length in inches ÷ 144 (one board foot equals 144 cubic inches). It multiplies by board quantity, prices the total from a per-board-foot rate, and includes a nominal-vs-actual lumber size table (for example a nominal 2×4 measures 1.5 by 3.5 inches actual) with one-tap fill-in, because board feet calculated on nominal softwood sizes overstate the wood actually received.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Board Foot Calculator", item: "https://frinjo.me/board-foot-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do you calculate board feet?",
    "Board feet = thickness (inches) × width (inches) × length (inches) ÷ 144. If length is in feet, the equivalent formula is thickness × width × length (ft) ÷ 12. Example: a board 1″ thick, 6″ wide and 8 ft long is 1 × 6 × 96 ÷ 144 = 4 board feet. One board foot is a volume of 144 cubic inches — a 12″ × 12″ × 1″ slab.",
  ],
  [
    "How many board feet are in a 2×4?",
    "It depends on which dimensions you use. At nominal size, an 8 ft 2×4 is 2 × 4 × 96 ÷ 144 = 5.33 BF. At its actual milled size (1.5″ × 3.5″) it is 1.5 × 3.5 × 96 ÷ 144 = 3.5 BF. Lumberyards price hardwood by actual board feet; softwood framing lumber is usually priced per piece, so check which basis a quote uses before comparing.",
  ],
  [
    "Why is a 2×4 not 2 by 4 inches?",
    "The name is the rough-sawn size before drying and planing smooth. Drying shrinks the board and surfacing removes more, leaving 1.5″ × 3.5″. The convention is over a century old and standardized (US NIST voluntary product standard PS 20) — everyone in the trade prices with it in mind, which is why calculators should use actual dimensions.",
  ],
  [
    "What does 4/4, 5/4 and 8/4 mean for hardwood?",
    "Hardwood thickness is sold in quarter-inch increments measured before surfacing: 4/4 is 1 inch thick rough, 5/4 is 1.25″, 6/4 is 1.5″, 8/4 is 2″. After surfacing two sides (S2S), 4/4 typically finishes at 13/16″. A yard's board-foot tally uses the rough thickness.",
  ],
  [
    "How much extra lumber should I buy?",
    "Add 10–15% for cuts, defects and grain-matching on straightforward projects; 20% for first projects, diagonal layouts or highly figured wood where selection waste is higher. Rough hardwood also loses volume when you mill it flat and square, which the waste factor covers.",
  ],
  [
    "Is the Board Foot Calculator free?",
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

export default function BoardFootPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Actual sizes, not nominal
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Board Foot <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Lumber Volume &amp; Price, Counted Honestly
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Thickness × width × length ÷ 144 — plus the table most calculators skip: a 2×4 is really
            1.5″ × 3.5″, and counting nominal sizes means paying for wood you never receive.
          </p>
        </div>
      </section>

      <BoardFoot />

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

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Board foot questions, answered" />
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
              Calculate board feet <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
