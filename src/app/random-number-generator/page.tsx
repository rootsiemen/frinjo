import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Rng from "./Rng";

export const metadata = {
  title: "Random Number Generator — Up to 1,000 Numbers + Lottery Quick Pick",
  description:
    "Free random number generator: draw up to 1,000 numbers at once with no-duplicate and sort options, copy-all and download — plus built-in lottery quick picks for Powerball, Mega Millions, EuroMillions, UK Lotto and Cash4Life. Crypto-grade randomness, nothing stored.",
  keywords: ["random number generator", "number generator", "lottery number generator", "quick pick generator", "random number picker", "powerball number generator"],
  alternates: { canonical: "https://frinjo.me/random-number-generator" },
  openGraph: {
    title: "Random Number Generator + Lottery Quick Pick | WebStore Pro",
    description: "1,000 numbers at once, no duplicates, copy/download — and real lottery formats with bonus balls. Free.",
    url: "https://frinjo.me/random-number-generator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Random Number Generator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/random-number-generator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free random number generator that draws up to 1,000 integers in a chosen range per click, with duplicate-free (sampling without replacement) and sort options, copy-all and plain-text download, and a session history. Randomness comes from the Web Crypto API with rejection sampling for a uniform distribution. It also includes lottery quick-pick presets with correct current formats — Powerball (5 of 1–69 plus 1 of 1–26), Mega Millions (5 of 1–70 plus Mega Ball 1 of 1–24, the format in force since April 2025), EuroMillions (5 of 1–50 plus 2 Lucky Stars of 1–12), UK Lotto (6 of 1–59) and Cash4Life (5 of 1–60 plus Cash Ball 1 of 1–4) — generating multiple lines at once. The page states plainly that quick picks carry the same odds as any other line.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Random Number Generator", item: "https://frinjo.me/random-number-generator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How random are these numbers, really?",
    "They are drawn from your browser's cryptographic random number generator (crypto.getRandomValues — the same source used for security tokens), with rejection sampling so every value in your range is exactly equally likely, with no modulo bias. That is a stronger guarantee than the Math.random pseudo-randomness many simple tools use.",
  ],
  [
    "Can I generate numbers without duplicates?",
    "Yes — tick 'No duplicates' and the generator samples without replacement, so every number in the result is unique (up to the size of the range itself). That is the mode to use for raffles, draws, draft orders and lottery-style picks.",
  ],
  [
    "What are the current Powerball and Mega Millions formats?",
    "Powerball: 5 numbers from 1–69 plus a Powerball from 1–26. Mega Millions: 5 numbers from 1–70 plus a Mega Ball from 1–24 — note the Mega Ball pool shrank from 25 to 24 (and the matrix changed) in the game's April 2025 relaunch, so older generators offering 1–25 are out of date. The quick-pick presets on this page use the current formats.",
  ],
  [
    "Do quick picks have worse odds than choosing my own numbers?",
    "No. Every combination has exactly the same probability, and roughly 70–80% of lottery winners are quick picks simply because most tickets sold are quick picks. What choosing unpopular numbers can change is how often a jackpot would be shared — it does not change the chance of winning. Play for entertainment, within a budget you can afford to lose.",
  ],
  [
    "What is the generator used for besides games?",
    "Raffles and giveaway draws, classroom and team randomisation, draft orders, sampling and quality checks (pick 20 random units from a batch), A/B assignments, and seeding simulations. The 1,000-at-once output with download is built for those practical uses, not just one number at a time.",
  ],
  [
    "Is the Random Number Generator free?",
    "Yes, completely free with no sign-up. Draws happen in your browser; nothing is stored on a server.",
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

export default function RngPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · 1,000 at once · Lottery presets built in
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Random Number <span className="text-gold-gradient">Generator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Bulk Draws — and a Real Lottery Quick Pick
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Not one slow spin at a time: up to <strong>1,000 numbers per click</strong>, duplicate-free if
            you want, ready to copy or download — plus quick picks in the actual current formats of
            Powerball, Mega Millions, EuroMillions and more.
          </p>
        </div>
      </section>

      <Rng />

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack websites and custom tools that rank — designed, built and SEO-ready from day one."
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
            {" "}· Also try the <Link href="/dice-roller" className="font-semibold text-orange-700 hover:text-orange-800">Dice Roller</Link> and <Link href="/coin-flip" className="font-semibold text-orange-700 hover:text-orange-800">Coin Flip</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Random number questions, answered" />
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
              Generate numbers <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
