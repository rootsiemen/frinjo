import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CoinFlip from "./CoinFlip";

export const metadata = {
  title: "Coin Flip — Flip 1–3 Coins Online Free",
  description:
    "Free coin flip: flip 1–3 coins, name the sides to decide anything, race best-of formats, or flip 1,000 at once with percentages. Crypto-fair 50/50.",
  keywords: ["coin flip", "flip a coin", "heads or tails", "online coin flip", "coin flipper", "decision maker coin"],
  alternates: { canonical: "https://frinjo.me/coin-flip" },
  openGraph: {
    title: "Coin Flip — Multi-Coin, Best-Of & Decisions | WebStore Pro",
    description: "1–3 coins, custom side names, best-of races, batches up to 1,000 and saved history. Fair crypto randomness. Free.",
    url: "https://frinjo.me/coin-flip",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Coin Flip",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/coin-flip",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free online coin flip that flips 1 to 3 distinct coins simultaneously with animated faces, lets the user rename the two sides for decisions (for example Yes/No or two team names), tracks a session score, runs a best-of race to a configurable target, performs batch flips of 10, 100 or 1,000 with heads/tails percentages, and keeps a persistent flip history in the browser's local storage with copy support. Randomness comes from the Web Crypto API, giving an unbiased 50/50 — unlike a physical coin, which research (Diaconis, Holmes & Montgomery) shows lands on its starting face about 51% of the time.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Coin Flip", item: "https://frinjo.me/coin-flip" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Is an online coin flip really 50/50?",
    "This one is: the result comes from your browser's cryptographic random source, which produces an unbiased 50% for each side. A physical coin is very slightly biased — Stanford's Persi Diaconis and colleagues showed a vigorously flipped coin lands on the same face it started on about 51% of the time — so the digital version is, if anything, fairer than the real thing.",
  ],
  [
    "Why flip more than one coin?",
    "Three fair coins give 8 equally likely outcomes — a ready-made way to pick among up to 8 options, run double-or-nothing calls, or settle best-of formats without re-flipping. With custom labels, two coins also settle 'which two of these four' questions. Most online flippers only show one coin; this one shows up to three, each visually distinct.",
  ],
  [
    "How does the best-of race work?",
    "Set a target (first to 3 by default) and keep flipping: each flip's winner — with multiple coins, the majority face — scores a point, and the race ends with a declared winner at the target. It is the digital version of 'best of five' without the tally-keeping.",
  ],
  [
    "Can I use this to make a decision?",
    "That is what the custom labels are for: type the two options (Pizza / Burgers, Yes / No, Team A / Team B) and the coin decides with your labels on it. Psychologists note a side benefit — while the coin is in the air, you often realise which result you are hoping for, which is information too.",
  ],
  [
    "What happens if I flip 1,000 times?",
    "You will get close to, but almost never exactly, 500 heads. The batch tool shows the real percentage — typically within a percent or two of 50 — which is the law of large numbers doing its quiet work. Exactly 500 has only about a 2.5% chance.",
  ],
  [
    "Is the Coin Flip free?",
    "Yes, completely free with no sign-up. Your flip history is saved only in your own browser.",
  ],
  [
    "What are the odds of getting heads five times in a row?",
    "Each flip is independent at 1 in 2, so five in a row is (1/2)⁵ — 1 in 32, about 3.1%. The same applies to any exact sequence of five, including HTHTH. A specific streak is rare, but some streak or pattern is guaranteed in every long run of flips.",
  ],
  [
    "How can I fairly pick between three options with a coin?",
    "Flip two coins: they give four equally likely outcomes — HH, HT, TH, TT. Assign one outcome to each of your three options and treat the fourth as 'flip again'. Ignoring and reflipping the spare outcome keeps the three real options exactly equally likely, with no maths fudging.",
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

export default function CoinFlipPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Up to 3 coins · Fair 50/50
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Coin <span className="text-gold-gradient">Flip</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Heads or Tails — With Superpowers
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Flip up to <strong>three real coins at once</strong>, name the sides to settle any decision,
            race to a best-of target, or flip a thousand times and watch fairness happen — your history
            stays saved for next time.
          </p>
        </div>
      </section>

      <CoinFlip />

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
            {" "}· Also: <Link href="/dice-roller" className="font-semibold text-orange-700 hover:text-orange-800">Dice Roller</Link> and <Link href="/random-number-generator" className="font-semibold text-orange-700 hover:text-orange-800">Random Number Generator</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="How it works" title="How the flip stays fair — and how to count the odds" />
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              Every flip asks the Web Crypto API for a 32-bit random value and maps it to 0 or 1 with
              rejection sampling — values in the tiny uneven remainder at the top of the range are discarded
              and redrawn, so heads and tails are exactly equally likely. Each coin in a multi-coin flip is
              drawn independently, which is why three coins produce 8 combinations.
            </p>
            <p>
              <strong className="text-stone-900">Worked example:</strong> with three coins there are
              2 × 2 × 2 = 8 equally likely outcomes. All three heads is one of them — a 1 in 8 chance
              (12.5%). Exactly two heads can happen three ways (HHT, HTH, THH), so it is three times as
              likely: 3 in 8, or 37.5%. That counting is also how you can pick fairly between up to 8
              options: give each option one combination and flip three coins.
            </p>
            <p>
              The common trap is the gambler&apos;s fallacy: five heads in a row feels &apos;due&apos; to
              break, but each flip is independent — the next flip is still 50/50, and a streak changes
              nothing. In a best-of race with two coins, a 1–1 flip is a tie and scores no point. Custom
              labels change what a result means, never its odds.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Coin flip questions, answered" />
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
              Flip a coin <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
