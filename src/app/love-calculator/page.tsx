import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import LoveCalculator from "./LoveCalculator";

export const metadata = {
  title: "Love Calculator — Free Love Compatibility Test by Name & Zodiac",
  description:
    "Free love calculator: enter two names for an instant, always-consistent compatibility score, plus an optional zodiac layer that reads your elements together. Runs privately in your browser — no sign-up, nothing stored.",
  keywords: [
    "love calculator",
    "love compatibility calculator",
    "love test by name",
    "compatibility calculator",
    "zodiac compatibility calculator",
    "love percentage calculator",
    "name compatibility test",
  ],
  alternates: { canonical: "https://frinjo.me/love-calculator" },
  openGraph: {
    title: "Love Calculator — Love Compatibility by Name & Zodiac | WebStore Pro",
    description:
      "Two names, one honest score — the same every time — plus a zodiac compatibility reading when you add your signs. Free and private.",
    url: "https://frinjo.me/love-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Love Calculator",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/love-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free love compatibility calculator. It produces a deterministic compatibility score (24–99%) from two names using a letter-fingerprint algorithm, so the same pair of names always receives the same score, and optionally adds a zodiac compatibility reading based on the two signs' elements (fire, earth, air, water). It is an entertainment tool; the calculation runs locally in the visitor's browser and no names are stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Love Calculator", item: "https://frinjo.me/love-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does the love calculator work?",
    "It builds a fingerprint from the two names — their letters, the letters they share, and their order — and turns that fingerprint into a score between 24% and 99%. The method is deterministic: the same two names always produce the same score, on any day, on any device. If you add both zodiac signs, it adds a second reading based on how the two signs' elements (fire, earth, air, water) interact.",
  ],
  [
    "Why do other love calculators give a different score every time?",
    "Most of them roll a random number each visit, which is why the same couple can score 40% in the morning and 95% at night. This calculator never uses randomness — your score is computed from your names, so it is stable and shareable. Whether you believe a name-based score means anything is up to you; at least here it is honest about what it does.",
  ],
  [
    "Is a love calculator score real?",
    "It is real arithmetic on your names, and it is entertainment — not a measurement of your relationship. No calculator can score two people's actual compatibility; that is built from communication, timing and how you treat each other. Treat the number as a conversation starter, and the verdict text as a prompt for that conversation.",
  ],
  [
    "What does the zodiac part add?",
    "If both signs are selected, the calculator reads the pairing through the four elements: fire with air tends to accelerate, earth with water tends to nurture, and so on for all ten element combinations, alongside each sign's core relationship style. To find your full signs — including your Moon and Rising, which say more about emotional compatibility than the Sun alone — use the Sun, Moon & Rising Calculator on this site.",
  ],
  [
    "Does the order of the names matter?",
    "No. The pair is sorted before scoring, so 'Alex + Sam' and 'Sam + Alex' always give the same result. Capital letters, spaces and punctuation are ignored; only the letters of the two names count.",
  ],
  [
    "Is the Love Calculator free? Are the names stored?",
    "Yes, completely free with no sign-up. The score is calculated entirely in your browser — the names you type are never sent to or stored on our servers.",
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

export default function LoveCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Same score, every time
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Love <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            A Compatibility Test That Doesn&apos;t Roll Dice
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Most love calculators give you a random number. This one computes your score from your two
            names, so it is <strong>the same today, tomorrow and on your partner&apos;s phone</strong> —
            and if you add your zodiac signs, it reads your elements together too.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <LoveCalculator />

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The method"
            title="How this love calculator works"
            sub="Three ingredients, zero randomness. Your score is a fingerprint of the pair — which is why couples can share it and argue about it properly."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Step 1 — The letters</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Both names become one fingerprint</h3>
              <p className="text-stone-600 leading-relaxed">
                The two names are cleaned to letters only, sorted as a pair and fingerprinted — every letter
                and its position counts. Change one letter and the score can move; keep the names and it
                never does.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Step 2 — The overlap</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Shared letters raise the floor</h3>
              <p className="text-stone-600 leading-relaxed">
                Letters the two names share add a bonus — an old name-compatibility tradition that says pairs
                whose names literally contain pieces of each other start with something in common.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Step 3 — The stars</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Optional: the zodiac layer</h3>
              <p className="text-stone-600 leading-relaxed">
                Add both signs and the reading deepens: how your two elements interact, and how each sign
                loves. For emotional compatibility, astrologers weigh the Moon sign heaviest — find yours in
                the{" "}
                <Link href="/sun-moon-rising-calculator" className="font-semibold text-orange-700 hover:text-orange-800">
                  Big Three Calculator
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCORE BANDS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Reading your result
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            What the score bands mean
          </h2>
          <div className="mt-10 space-y-4 text-left">
            {[
              ["85–99%", "Written in the stars — rare, easy chemistry. The risk is taking it for granted."],
              ["70–84%", "A strong, warm match — shared values with attraction on top. Small frictions, quickly forgiven."],
              ["55–69%", "Plenty to build on — the connection is real; communication decides where it goes."],
              ["40–54%", "A slow-burn pairing — different rhythms that ask for patience and honest talking."],
              ["24–39%", "A challenging mix — opposite instincts. If it works, it is because both people chose it daily."],
            ].map(([band, text]) => (
              <div key={band} className="rounded-3xl border border-stone-800 bg-stone-900 p-6 flex gap-5 items-start">
                <div className="font-display text-2xl font-bold text-orange-400 shrink-0 w-24">{band}</div>
                <p className="text-stone-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Entertainment, honestly labelled — and calculated properly. Browse the full{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              tools hub
            </Link>{" "}
            for more.
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
          <SectionHead eyebrow="FAQ" title="Love calculator questions, answered" />
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
              Test a pair <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
