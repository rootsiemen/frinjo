import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import FinalGrade from "./FinalGrade";

export const metadata = {
  title: "Final Grade Calculator — What Do I Need on the Final Exam?",
  description:
    "Free final grade calculator: enter your current grade, the grade you want, and how much the final is worth to see exactly what you need to score — plus the reverse: what grade a given final score gives you. Honest verdicts, no sign-up.",
  keywords: [
    "final grade calculator",
    "what do i need on my final",
    "final exam calculator",
    "grade calculator final",
    "needed final score",
  ],
  alternates: { canonical: "https://frinjo.me/final-grade-calculator" },
  openGraph: {
    title: "Final Grade Calculator — What You Need on the Final | WebStore Pro",
    description:
      "The exact score you need on your final, and an honest verdict on whether it is reachable. Free, instant.",
    url: "https://frinjo.me/final-grade-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Final Grade Calculator",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/final-grade-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free final exam grade calculator. Given a current course grade, a desired final grade and the final exam's percentage weight, it computes the required final exam score as (desired − current × (1 − weight)) ÷ weight, and reports honestly when the target is already secured or mathematically unreachable. It also computes the reverse: the resulting course grade (with a US letter grade) for any given final exam score. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Final Grade Calculator", item: "https://frinjo.me/final-grade-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is the score I need on the final calculated?",
    "Your course grade is a weighted average: current grade × (1 − final weight) + final score × (final weight). Solving that equation for the final score gives: needed = (desired − current × (1 − weight)) ÷ weight. Example: with an 85% current grade, a 90% target and a final worth 30%, you need (90 − 85 × 0.7) ÷ 0.3 = 101.7% — just out of reach, which the calculator tells you plainly.",
  ],
  [
    "What if the calculator says I need more than 100%?",
    "Then the target cannot be reached through the final alone, no matter the score — unless your class allows extra credit on the final or your instructor scales. The useful moves are: aim for the next grade down (use the reverse calculator to find the best reachable grade), and ask your instructor about extra credit or retake policies before the exam, not after.",
  ],
  [
    "What if I need less than 0%?",
    "Your target is already secured by your current average alone. Congratulations — the final can only help. (It also means a disastrous final could still pull you below a higher grade, so check what a realistic score protects.)",
  ],
  [
    "Where do I find how much my final is worth?",
    "Your course syllabus lists the grading breakdown — look for the final exam's percentage weight. If it is given in points instead (e.g. final = 200 of 1,000 total points), the weight is 200 ÷ 1,000 = 20%, and your current grade is your earned points so far divided by the points possible so far.",
  ],
  [
    "Does this work for college and high school?",
    "Yes — the maths is the same anywhere a final exam carries a percentage weight. Letter-grade estimates use the common US scale; if your school uses different cut-offs, trust the percentage, which is exact.",
  ],
  [
    "Is the Final Grade Calculator free?",
    "Yes, completely free with no sign-up. Your grades are calculated in your browser and never stored.",
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

export default function FinalGradePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Honest verdicts
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Final Grade <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            What Do I Need on the Final?
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The exact score — and a straight answer about whether it is reachable. If the maths says a
            target is locked in, it says so. If it says <strong>impossible</strong>, it says that too, and
            shows you the best grade that is still real.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <FinalGrade />

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
          <SectionHead eyebrow="FAQ" title="Final grade questions, answered" />
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
              Find your number <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
