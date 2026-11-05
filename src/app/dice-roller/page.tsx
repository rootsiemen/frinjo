import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import DiceRoller from "./DiceRoller";

export const metadata = {
  title: "Dice Roller — Roll d4 to d100 Online",
  description:
    "Free dice roller: roll up to 10 dice at once — d4, d6, d8, d10, d12, d20, d100 — with totals, averages and history. Crypto-fair randomness.",
  keywords: ["dice roller", "roll dice online", "d20 roller", "virtual dice", "dice roller 2 dice", "online dice"],
  alternates: { canonical: "https://frinjo.me/dice-roller" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Dice Roller — Fair Online Dice, d4–d100 | WebStore Pro",
    description: "Roll up to 10 dice with totals, averages and history. Crypto-grade randomness, free.",
    url: "https://frinjo.me/dice-roller",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Dice Roller",
  applicationCategory: "GameApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/dice-roller",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free online dice roller that rolls 1 to 10 dice with 4, 6, 8, 10, 12, 20 or 100 sides (d4–d100). Six-sided dice are shown with standard pip faces; polyhedral dice show numbered faces. It reports the total, the average per die and the mathematically expected average for the selected die, and keeps a history of recent rolls. Random values come from the browser's cryptographic random source (crypto.getRandomValues) with rejection sampling, making rolls uniformly distributed.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Dice Roller", item: "https://frinjo.me/dice-roller" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I roll multiple dice at once?",
    "Set the 'Number of dice' slider (1 to 10), pick a die type, and press Roll. The total and the per-die average are shown under the dice, and each roll is saved to the history list on the page.",
  ],
  [
    "What does 2d6 or 1d20 mean?",
    "It is dice notation from tabletop games: the number before the 'd' is how many dice, the number after is the sides. 2d6 means roll two six-sided dice and add them; 1d20 is a single twenty-sided die. This roller shows your current setup in exactly that notation.",
  ],
  [
    "Is an online dice roller really random?",
    "This one draws from your browser's cryptographic random source with rejection sampling, which produces uniformly distributed results — every face exactly as likely as the others, with no server able to influence the outcome. That is at least as fair as a physical die, which can be slightly biased by manufacturing.",
  ],
  [
    "What is the average roll of a die?",
    "For a fair die, the expected average is (sides + 1) ÷ 2: 3.5 for a d6, 10.5 for a d20, 50.5 for a d100. Two six-sided dice therefore average 7 in total. The roller displays the expected average next to your actual one so long streaks of luck stand out.",
  ],
  [
    "What are the odds of rolling a specific total with two dice?",
    "With 2d6 there are 36 equally likely combinations. 7 is the most likely total (6 combinations, 16.7%), followed by 6 and 8 (5 each, 13.9%). The extremes are rare: 2 and 12 each have exactly one combination (2.8%).",
  ],
  [
    "Is the Dice Roller free?",
    "Yes, completely free with no sign-up. Rolls happen in your browser; nothing is stored on a server.",
  ],
  [
    "What are the odds of rolling doubles with two dice?",
    "With two six-sided dice, six of the 36 equally likely combinations are doubles — 1-1 through 6-6 — so the chance is 6 ÷ 36 = 16.7%, or one roll in six. The same logic works for any die size: doubles are always 1 in the number of sides, so 1 in 20 on two d20s.",
  ],
  [
    "What is a d100 or percentile roll used for?",
    "A d100 rolls a number from 1 to 100, so the result reads directly as a percentage — roll 37 and you have landed the 37% outcome. RPG systems use it for percentile skills ('roll under your 65% chance'), and teachers use it for probability demonstrations. Its expected average is 50.5, exactly halfway.",
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

export default function DiceRollerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · d4–d100 · Up to 10 dice
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Dice <span className="text-gold-gradient">Roller</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Fair Dice for Games, RPGs &amp; Classrooms
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Lost the dice again? Roll up to ten at once — standard six-siders with real pip faces, or any
            polyhedral die from d4 to d100 — with totals, averages and a roll history.
          </p>
        </div>
      </section>

      <DiceRoller />

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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="Crypto-grade randomness, checked against the maths"
            sub="Every face exactly as likely as the others — and a way to prove a roll was good, bad or ordinary."
          />
          <div className="text-left">
            <p className="text-stone-600 leading-relaxed">
              Each die is drawn from your browser&apos;s cryptographic random source,
              crypto.getRandomValues — not the ordinary Math.random. The roller fills a 32-bit unsigned
              integer, rejects any value at or above the largest multiple of the die size that fits in
              32 bits, then takes the remainder modulo the sides and adds one. That rejection step
              matters: without it, low faces would be very slightly more likely than high ones. With
              it, every face of a d6 has exactly a 1-in-6 chance, every face of a d20 exactly 1-in-20,
              and no die influences the next.
            </p>
            <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Worked example: reading a roll, and pricing a target</h3>
              <p className="text-stone-600 leading-relaxed">
                Roll 3d6 and land on 4, 2 and 6: the total is 12 and the average is 12 ÷ 3 = 4.0 per die
                — above the d6 expected average of 3.5, so a good roll, not a suspicious one. Targets
                price the same way, by counting combinations. Needing 11 or more on 2d6: a total of 11
                comes from 5-6 and 6-5 (2 combinations) and 12 from 6-6 alone (1) — so 3 of the 36
                combinations succeed, an 8.3% chance however confident the player feels.
              </p>
            </div>
            <h3 className="mt-8 font-display text-xl font-bold text-stone-900 mb-3">Three ways players misread the dice</h3>
            <ul className="space-y-2 text-stone-600 leading-relaxed list-disc pl-5">
              <li>The gambler&apos;s fallacy. Five low rolls in a row do not make a high roll due — each roll is independent, and the history list here is a record, not a pattern.</li>
              <li>Comparing totals across different dice. A total of 12 is strong on 3d6 but poor on 3d20; judge every roll against its own expected average, printed under the dice.</li>
              <li>Expecting the average every time. 2d6 averages 7 over many rolls, yet a single roll lands exactly 7 only 16.7% of the time — the average describes the long run, not the next throw.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Dice questions, answered" />
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
              Roll the dice <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
