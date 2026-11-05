import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import TestScore from "./TestScore";

export const metadata = {
  title: "Test Score Calculator — EZ Grader with Class Mode & CSV Export",
  description:
    "Free test score calculator / EZ grader: enter total questions and number wrong (half-points allowed) for an instant percentage and letter grade on standard or plus/minus scales — plus a class mode that grades a whole roster at once with average, median, distribution and CSV export.",
  keywords: ["test score calculator", "ez grader", "grade calculator test", "test grade calculator", "how many wrong for an a", "grading chart"],
  alternates: { canonical: "https://frinjo.me/test-score-calculator" },
  openGraph: {
    title: "Test Score Calculator — EZ Grader + Class Mode | WebStore Pro",
    description:
      "One paper or the whole class: percent, letter, full grading chart, averages and CSV export. Free.",
    url: "https://frinjo.me/test-score-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Test Score Calculator",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/test-score-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free test score calculator (EZ grader) that converts total questions and number wrong — including half-point deductions — into a percentage and letter grade on a standard scale (A at 90) or a plus/minus scale (A at 93), and shows the full grading chart for every possible wrong count. Its class mode grades a pasted roster in three formats (name with number wrong, name with score/total, or name with a percentage) and reports class average, median, letter distribution and per-student results with CSV export. All processing is client-side; student names never leave the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Test Score Calculator", item: "https://frinjo.me/test-score-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate a test score as a percentage?",
    "Divide the number correct by the total and multiply by 100. If 3 of 25 questions are wrong, 22 are correct: 22 ÷ 25 × 100 = 88%. That is the whole EZ-grader idea — this page does it instantly, allows half-point deductions, and shows the letter grade on your scale.",
  ],
  [
    "How many questions can I get wrong and still get an A?",
    "It depends on the test length and your scale. On the standard scale (A from 90%), a 25-question test allows 2 wrong (92%); 3 wrong is 88%, a B. A 50-question test allows 5 wrong. The full grading chart under the calculator lists every wrong count for your test size so you can see the exact boundary.",
  ],
  [
    "What is an EZ grader?",
    "A teacher's sliding chart (originally a physical cardboard slide rule) that converts 'number wrong out of total' into a percentage and grade without arithmetic. Online versions do the same job; this one adds the things the cardboard never had: half-points, two grading scales, and a class mode with statistics and export.",
  ],
  [
    "How does class mode work, and is student data safe?",
    "Paste one line per student: 'Name, 3' means 3 wrong out of the test total you set; 'Name, 22/25' is a raw score; 'Name, 88%' is a percentage. You get each student's grade plus class average, median and the letter distribution, exportable as CSV. Everything is computed in your browser — names are never uploaded, stored or logged, which is how a roster tool should behave.",
  ],
  [
    "Which grading scale should I use?",
    "The standard scale (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60) is the most common in US schools; the plus/minus scale (A from 93, with +/− bands) is used by many districts and colleges. Match your school's published scale — if letter boundaries matter officially, the syllabus or handbook is the authority.",
  ],
  [
    "Is the Test Score Calculator free?",
    "Yes, completely free with no sign-up, for one test or a whole class.",
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

export default function TestScorePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Teachers &amp; students · Privacy-first
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Test Score <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            The EZ Grader — For One Paper or the Whole Class
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Number wrong in, percentage and letter out — with half-points, two scales and the full grading
            chart. And when it is a whole stack of papers: paste the roster and grade <strong>everyone at
            once</strong>, with class average, median, distribution and a CSV export.
          </p>
        </div>
      </section>

      <TestScore />

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
            {" "}· Also: <Link href="/weighted-grade-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Weighted Grade</Link>, <Link href="/gpa-calculator" className="font-semibold text-orange-700 hover:text-orange-800">GPA Calculator</Link>, <Link href="/final-grade-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Final Grade</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Test score questions, answered" />
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
              Grade a test <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
