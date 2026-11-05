import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import BigThreeCalculator from "./BigThreeCalculator";
import { SIGNS } from "./astro";

export const metadata = {
  title: "Sun, Moon & Rising Calculator — Big Three",
  description:
    "Free Big Three calculator: your Sun, Moon and Rising signs with exact degrees from birth date, time and city — real astronomy, in your browser.",
  keywords: [
    "sun moon rising calculator",
    "big three calculator",
    "sun moon and rising sign calculator",
    "rising sign calculator",
    "moon sign calculator",
    "ascendant calculator",
    "big 3 astrology",
    "what is my rising sign",
  ],
  alternates: { canonical: "https://frinjo.me/sun-moon-rising-calculator" },
  openGraph: {
    title: "Sun, Moon & Rising Calculator — Your Big Three | WebStore Pro",
    description:
      "Your Sun, Moon and Rising signs with exact degrees, from your birth date, time and city — free, instant, and calculated privately in your browser.",
    url: "https://frinjo.me/sun-moon-rising-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sun, Moon & Rising Calculator (Big Three Calculator)",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/sun-moon-rising-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free Big Three astrology calculator. It computes the Sun sign, Moon sign and Rising sign (Ascendant) from a birth date, birth time and birth city, using the low-precision astronomical algorithms of Jean Meeus (Astronomical Algorithms) in the tropical zodiac. The Sun's position is accurate to about 0.01 degrees and the Moon's to about 0.3 degrees; results within half a degree of a sign boundary are flagged as cusp results. All calculation runs locally in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Sun, Moon & Rising Calculator",
      item: "https://frinjo.me/sun-moon-rising-calculator",
    },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is the Big Three in astrology?",
    "The Big Three are the three most personal placements in a birth chart: the Sun sign (your core identity and direction), the Moon sign (your emotional nature and what you need to feel safe) and the Rising sign, also called the Ascendant (how you meet the world and the first impression you make). Together they summarise a chart faster than any other combination, which is why 'what's your Big Three?' has replaced 'what's your sign?' as the standard question.",
  ],
  [
    "What do I need to calculate my Sun, Moon and Rising signs?",
    "Your birth date alone gives your Sun sign. Your Moon sign needs the birth date and, on days when the Moon changes signs, the birth time. Your Rising sign always needs all three: birth date, exact birth time and birth city, because the sign on the eastern horizon changes roughly every two hours and depends on where on Earth you were born.",
  ],
  [
    "How is the Rising sign calculated?",
    "The calculator converts your local birth time to UTC using your birth city's time zone, computes the local sidereal time for that moment, and from it the degree of the ecliptic that was rising over the eastern horizon at your latitude. That degree's zodiac sign is your Rising sign. This is why a birth time that is off by an hour can change the result.",
  ],
  [
    "How accurate is this calculator?",
    "The Sun and Moon positions use the astronomical algorithms published by Jean Meeus in Astronomical Algorithms. The Sun's longitude is accurate to about 0.01 degrees and the Moon's to about 0.3 degrees. That fixes every sign correctly except when a position falls within about half a degree of a sign boundary — this calculator flags those as cusp results so you can read the neighbouring sign too. Signs are given in the tropical zodiac, the system used by most Western astrologers.",
  ],
  [
    "I don't know my birth time. Can I still use it?",
    "Yes. Tick 'I don't know my birth time' and you will get an exact Sun sign and a Moon sign read at midday on your birth date. The Moon sign can only be wrong if the Moon changed signs that day (it does so every two to three days, so most days are unaffected). The Rising sign cannot be calculated without a birth time — your birth certificate or hospital record usually has it.",
  ],
  [
    "Why is my Moon sign different from what another site said?",
    "Usually one of three reasons: the other calculator used a different birth time or time zone, the Moon was near a sign boundary on your birth date (a cusp — small differences in method tip it either way), or the site uses the sidereal (Vedic) zodiac instead of the tropical zodiac. This calculator uses the tropical zodiac and shows the exact degree, so you can see how close to a boundary your Moon sits.",
  ],
  [
    "Is the Sun, Moon & Rising Calculator free? Is my data stored?",
    "Yes, it is completely free with no sign-up. The calculation runs entirely in your browser — your birth date and time are never sent to or stored on our servers. The only request made is the city search, which sends just the city name you type to the Open-Meteo geocoding service to get its coordinates and time zone.",
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

export default function BigThreePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Private — runs in your browser
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Sun, Moon &amp; <span className="text-gold-gradient">Rising</span> Calculator
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Big Three — Sun ☀️ Moon 🌙 Rising ⬆️
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter your birth date, time and city. This calculator works out the real positions of the Sun
            and Moon at the moment you were born and the sign that was rising over your birthplace — and
            shows each sign with its <strong>exact degree</strong>, not just a date-range guess.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <BigThreeCalculator />

      {/* WHAT IS THE BIG THREE */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The basics"
            title="What is the Big Three?"
            sub="Three placements, three different clocks. The Sun changes sign about once a month, the Moon about every two and a half days, and the Rising sign about every two hours — which is why the three together describe a person far better than a Sun sign alone."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">☀️ The Sun sign</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Who you are becoming</h3>
              <p className="text-stone-600 leading-relaxed">
                The sign the Sun was in on your birth date. It describes your core identity, your direction
                and the qualities you grow into over a lifetime. It is the sign most people already know —
                and only one third of the picture.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">🌙 The Moon sign</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">What you need to feel safe</h3>
              <p className="text-stone-600 leading-relaxed">
                The sign the Moon was in at your birth moment. It describes your emotional nature: how you
                process feelings, what comforts you, and what you instinctively reach for under stress. The
                Moon moves fast, so birth time can matter.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">⬆️ The Rising sign</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">How the world meets you</h3>
              <p className="text-stone-600 leading-relaxed">
                Also called the Ascendant: the sign rising over the eastern horizon at your birth time and
                place. It describes your first impression, your style and the lens you meet life through —
                and it is the placement that needs your exact birth time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT IS CALCULATED */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The method
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            How this calculator works
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Most free calculators look your signs up in a date table. This one computes them. Your birth
            time is converted from your birth city&apos;s time zone to UTC, then the{" "}
            <strong className="text-white">ecliptic longitudes of the Sun and Moon</strong> are calculated
            for that exact moment using the algorithms in Jean Meeus&apos;s{" "}
            <em>Astronomical Algorithms</em> — the standard reference behind most ephemeris software. The{" "}
            <strong className="text-white">Rising sign</strong> comes from your local sidereal time and
            latitude: the degree of the zodiac that stood on the eastern horizon when you were born. Signs
            are read in the <strong className="text-white">tropical zodiac</strong>, the system used by
            most Western astrology.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0.01°</div>
              <p className="mt-2 text-stone-400 text-sm">
                Accuracy of the Sun&apos;s calculated position — your Sun sign is exact, never a date-range
                approximation.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0.3°</div>
              <p className="mt-2 text-stone-400 text-sm">
                Accuracy of the Moon&apos;s position. When any result falls within half a degree of a sign
                boundary, the calculator flags it as a cusp instead of pretending certainty.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">100%</div>
              <p className="mt-2 text-stone-400 text-sm">
                Of the calculation runs in your own browser. Your birth date and time are never stored or
                sent to our servers.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Checking a website instead of a birth chart? Run it through{" "}
            <Link href="/botview" className="font-semibold text-orange-400 hover:text-orange-300">
              BotView
            </Link>{" "}
            for SEO and AI-visibility scores — or browse the full{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              tools hub
            </Link>
            .
          </p>
        </div>
      </section>

      {/* THE 12 SIGNS */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Reference"
            title="The 12 zodiac signs at a glance"
            sub="The Sun spends about a month in each sign. Find yours above for the exact degree — dates below are the typical ranges and shift slightly by year and time zone."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {SIGNS.map((s) => (
              <div key={s.name} className="rounded-3xl border border-stone-200 bg-white p-6">
                <p className="font-display text-2xl font-bold text-stone-900">
                  <span className="text-orange-500 mr-2">{s.glyph}</span>
                  {s.name}
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-500">{s.dates}</p>
                <p className="mt-2 text-sm text-stone-600">
                  {s.element} sign · ruled by {s.ruler}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
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
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Sun, Moon & Rising questions, answered" />
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
              Calculate my Big Three <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Astrology is a tool for reflection and entertainment. Positions are computed astronomically;
            interpretations follow the Western astrological tradition.
          </p>
        </div>
      </section>
    </>
  );
}
