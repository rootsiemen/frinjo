import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import DiceRoller from "./DiceRoller";

export const metadata = {
  title: "Dice Roller — Roll d4 to d100 Online (Up to 10 Dice, Fair Random)",
  description:
    "Free online dice roller: roll up to 10 dice at once — d4, d6, d8, d10, d12, d20 and d100 — with visual dice, totals, averages and roll history. Randomness from your browser's crypto engine. For board games, RPGs and classrooms.",
  keywords: ["dice roller", "roll dice online", "d20 roller", "virtual dice", "dice roller 2 dice", "online dice"],
  alternates: { canonical: "https://frinjo.me/dice-roller" },
  openGraph: {
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
