import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Zodiac from "./Zodiac";

export const metadata = {
  title: "Zodiac Sign Calculator — Sign by Birth Date",
  description:
    "Free zodiac sign calculator: your sign, element, ruling planet, traits and best matches from your birth date — plus an honest cusp warning.",
  keywords: ["zodiac sign calculator", "what is my zodiac sign", "zodiac sign by date of birth", "star sign calculator", "zodiac dates", "cusp zodiac"],
  alternates: { canonical: "https://frinjo.me/zodiac-sign-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Zodiac Sign Calculator — Instant, With Cusp Check | WebStore Pro",
    description: "Your sign, element, planet, matches and Chinese zodiac — instantly, no submit button. Plus your Big Three.",
    url: "https://frinjo.me/zodiac-sign-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Zodiac Sign Calculator",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/zodiac-sign-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free zodiac sign calculator that returns the tropical zodiac sign for a birth date instantly, with its symbol, date range, element, ruling planet, a traits summary and best-match signs. Unlike simple lookup tables it flags birthdays within one day of a sign boundary as cusp cases and explains that the exact changeover moment varies by year, so birth time and place (via the site's linked Sun, Moon & Rising calculator) settle them. It also reports the Chinese zodiac sign using actual Lunar New Year dates rather than January 1. All computation is client-side.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Zodiac Sign Calculator", item: "https://frinjo.me/zodiac-sign-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What are the zodiac sign dates?",
    "Tropical zodiac: Capricorn Dec 22–Jan 19, Aquarius Jan 20–Feb 18, Pisces Feb 19–Mar 20, Aries Mar 21–Apr 19, Taurus Apr 20–May 20, Gemini May 21–Jun 20, Cancer Jun 21–Jul 22, Leo Jul 23–Aug 22, Virgo Aug 23–Sep 22, Libra Sep 23–Oct 22, Scorpio Oct 23–Nov 21, Sagittarius Nov 22–Dec 21. Boundary days can shift by a day in some years, which is what the cusp note on this page is about.",
  ],
  [
    "What does 'born on the cusp' actually mean?",
    "It means your birthday falls within about a day of the moment the Sun moved from one sign into the next. That moment is an exact timestamp that differs slightly each year — so two people born on the same calendar date in different years can genuinely have different Sun signs. Popular astrology often claims cusp-born people blend both signs; astronomically, the Sun is in exactly one sign at your birth moment, and a full chart calculation with your birth time and place settles which.",
  ],
  [
    "Why do I need my birth time for the full picture?",
    "Your Sun sign needs only a date (except on cusp days). Your Moon sign changes every ~2.5 days and your Rising sign every ~2 hours, so both need a birth time and place. Together — Sun, Moon, Rising — they form the 'Big Three' that astrologers consider the core of a chart; our linked Big Three Calculator computes them from real astronomical formulas.",
  ],
  [
    "Is my Chinese zodiac sign the same as my zodiac sign?",
    "No — they are separate systems. The Chinese zodiac is a 12-year cycle of animals (Rat, Ox, Tiger…) based on the lunar year, which starts at Lunar New Year, not January 1; this page applies the real Lunar New Year cut-off so January and February birthdays get the correct animal. Your Western sign is a 12-part division of the Sun's yearly path by date.",
  ],
  [
    "Which zodiac signs are most compatible?",
    "Traditional astrology pairs signs of harmonious elements: Fire with Air, Earth with Water. The matches on this page follow that convention (for example, Aries with Leo and Sagittarius, Taurus with Virgo and Capricorn). Treat compatibility as entertainment and a conversation starter — it is not a relationship verdict.",
  ],
  [
    "Is the Zodiac Sign Calculator free?",
    "Yes, completely free with no sign-up. Your birth date is processed in your browser and never stored.",
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

export default function ZodiacPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Instant result · Cusp check included
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Zodiac Sign <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Sign by Birth Date — Done Honestly
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Not just a lookup table: your sign, element, ruler, matches and Chinese zodiac — instantly —
            and if your birthday sits on a <strong>cusp</strong>, this page tells you, instead of guessing
            like the others do.
          </p>
        </div>
      </section>

      <Zodiac />

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
            {" "}· Explore the <Link href="/sun-moon-rising-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Big Three Calculator</Link> and <Link href="/love-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Love Calculator</Link> — or get your exact age from your birth date with the <Link href="/age-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Age Calculator</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Zodiac questions, answered" />
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
              Find my sign <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
