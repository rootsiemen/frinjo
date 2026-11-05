import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import WeightedGrade from "./WeightedGrade";

export const metadata = {
  title: "Weighted Grade Calculator — Points or %",
  description:
    "Free weighted grade calculator: grades as % or raw points (45/50), extra credit, and the average you still need for 90, 80, 70 or 60%. No sign-up.",
  keywords: ["weighted grade calculator", "grade calculator weighted", "calculate weighted grade", "category grade calculator", "weighted average grade"],
  alternates: { canonical: "https://frinjo.me/weighted-grade-calculator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Weighted Grade Calculator — Points Welcome | WebStore Pro",
    description:
      "Weighted course grade from % or points, with extra credit and a what-you-still-need table. Free.",
    url: "https://frinjo.me/weighted-grade-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Weighted Grade Calculator",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/weighted-grade-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free weighted grade calculator for courses graded by weighted categories (homework, quizzes, exams). Each category accepts either a percentage grade or raw points earned/possible, which it converts itself — unlike calculators that require users to convert points to percentages by hand. It computes the weighted average over graded categories, the course points already secured out of 100 (with an optional extra-credit addition), warns when weights do not total 100%, and shows the average required on the remaining weight to finish at 90, 80, 70 or 60 percent, flagging targets already secured or mathematically impossible. The result summary can be copied. Runs in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Weighted Grade Calculator", item: "https://frinjo.me/weighted-grade-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate a weighted grade?",
    "For each category, multiply the category average (as a percent) by its weight, add those products, and divide by the total weight graded. Example: homework 90% at weight 20, quizzes 85% at 20, midterm 78% at 25 gives (90×20 + 85×20 + 78×25) ÷ 65 = 83.8% across the graded 65% of the course. This calculator does the arithmetic and also tracks how many of the 100 course points you have already secured.",
  ],
  [
    "Can I enter points instead of percentages?",
    "Yes — set a category to 'Points' and enter earned/possible (for example 180 out of 200). The calculator converts it to a percentage itself. Many weighted-grade calculators make you convert by hand first; this one was built specifically to remove that step.",
  ],
  [
    "What does 'secured points' mean?",
    "If categories worth 65% of the course are graded and your weighted contribution from them is 54.5, you have banked 54.5 of the 100 points that decide your final grade. Even a zero on everything remaining cannot take those away — and the table under the result shows exactly what average the remaining weight must produce for each target grade.",
  ],
  [
    "My weights don't add up to 100%. Is that a problem?",
    "Usually it means a category is missing (participation and a final exam are the usual suspects) or one weight was mistyped — the calculator flags the total so you notice. Some syllabi genuinely use weights summing to something else; the weighted average is still computed correctly over the graded weight, but the secured-points figure assumes a 100-point course.",
  ],
  [
    "How does extra credit fit in?",
    "Enter extra credit as course points (for example 2 if it is worth 2 points toward the final grade) in the extra-credit field. It is added to your secured points, which is how most syllabi apply it. If your class applies extra credit inside one category instead, add it to that category's earned points.",
  ],
  [
    "Is the Weighted Grade Calculator free?",
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

export default function WeightedGradePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Points or % · Extra credit built in
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Weighted Grade <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Course Grade, Category by Category
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Enter homework as <strong>180/200 points</strong> if that is what you have — no converting to
            percentages on paper first. Plus the answer students actually want: what you still need on the
            rest of the course to finish with the grade you want.
          </p>
        </div>
      </section>

      <WeightedGrade />

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
            {" "}· Pairs with the <Link href="/final-grade-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Final Grade Calculator</Link>, <Link href="/gpa-calculator" className="font-semibold text-orange-700 hover:text-orange-800">GPA Calculator</Link> and <Link href="/test-score-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Test Score Calculator</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Weighted grade questions, answered" />
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
              Calculate your grade <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
