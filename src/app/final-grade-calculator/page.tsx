import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import FinalGrade from "./FinalGrade";

export const metadata = {
  title: "Final Grade Calculator — Score You Need",
  description:
    "Free final grade calculator: enter your current grade, target grade and final exam weight to see exactly what you need to score. Honest verdicts.",
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
  [
    "What score do I need just to keep my current grade?",
    "Exactly your current average. Setting the desired grade equal to your current grade makes the formula return that same number: with a current grade of 85% and a final worth 30%, you need (85 − 85 × 0.7) ÷ 0.3 = 85%. Score above your average and the grade rises; below it, it falls.",
  ],
  [
    "Does a heavily weighted final help me or hurt me?",
    "It amplifies whichever way your final score compares with your current average. If you expect to score above your average, a heavier final pulls your grade up more; if you expect to score below it, the same weight drags it down more. The weight itself is neutral — the gap between the two numbers decides.",
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

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="How it works" title="The maths behind the number you need" />
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              Your course grade is a weighted average of two parts: the work already done, worth
              (1 − weight), and the final exam, worth its weight. The calculator solves that average
              backwards. To find the score you need it uses: needed = (desired − current × (1 − weight))
              ÷ weight. The second box runs the same average forwards — current × (1 − weight) + your
              expected final score × weight — and converts the result to a letter grade on the common US
              scale.
            </p>
            <p>
              <strong className="text-stone-900">Worked example:</strong> you are on 78%, you want 85%, and
              the final is worth 40%. Needed = (85 − 78 × 0.6) ÷ 0.4 = (85 − 46.8) ÷ 0.4 = 38.2 ÷ 0.4 =
              95.5% — a near-perfect paper, which is how the calculator labels it. The forwards check shows
              the cost of falling short: score 80% instead and your course grade is 78 × 0.6 + 80 × 0.4 =
              78.8%, a C+.
            </p>
            <p>
              Three input mistakes explain most surprising results. Using a current grade that already
              includes the final — it must be your average before the final. Entering the final&apos;s
              points instead of its percentage weight (200 of 1,000 points is 20%, not 200). And trusting
              the percentage while ignoring your school&apos;s letter cut-offs, which vary — the percentage
              maths is exact either way.
            </p>
          </div>
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
