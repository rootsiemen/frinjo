import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Gpa from "./Gpa";

export const metadata = {
  title: "GPA Calculator — Semester & Cumulative",
  description:
    "Free GPA calculator: letter or % grades, 4.0 and weighted 5.0 scales, courses that auto-save, CSV export and a target-GPA planner. No sign-up.",
  keywords: ["gpa calculator", "college gpa calculator", "semester gpa calculator", "cumulative gpa calculator", "weighted gpa calculator", "target gpa calculator"],
  alternates: { canonical: "https://frinjo.me/gpa-calculator" },
  openGraph: {
    title: "GPA Calculator — With Planner, Persistence & Export | WebStore Pro",
    description: "Semester and cumulative GPA, Honors/AP weighting, % or letter input, auto-save, CSV export and a target planner. Free.",
    url: "https://frinjo.me/gpa-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "GPA Calculator",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/gpa-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free GPA calculator that computes credit-weighted grade point average (sum of grade points × credits, divided by total credits) using the standard 4.0 letter scale (A 4.0, A− 3.7, B+ 3.3, B 3.0, B− 2.7, C+ 2.3, C 2.0, C− 1.7, D+ 1.3, D 1.0, D− 0.7, F 0). It accepts letter grades or percentage grades, supports an unweighted 4.0 scale and a weighted 5.0 scale with Honors (+0.5) and AP/IB (+1.0) bonuses, saves courses in the browser for return visits, exports the course list as CSV, labels the result with common academic-standing thresholds, and includes a target-GPA planner that computes the average needed over planned credits to reach a cumulative target, flagging unreachable targets.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "GPA Calculator", item: "https://frinjo.me/gpa-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How is GPA calculated?",
    "Each course's grade is converted to grade points (A = 4.0, B = 3.0, and so on), multiplied by the course's credits, summed across all courses, and divided by the total credits. A 4-credit A therefore pulls your GPA up more than a 1-credit A — which is why credit-weighting matters and why this calculator asks for credits per course.",
  ],
  [
    "What is the difference between weighted and unweighted GPA?",
    "Unweighted GPA uses the plain 4.0 scale for every course. Weighted GPA, common in US high schools, adds a bonus for harder courses — typically +0.5 for Honors and +1.0 for AP/IB — allowing totals up to 5.0. Colleges often recalculate unweighted; this calculator offers both so you can match what your school reports.",
  ],
  [
    "How do percentage grades convert to GPA?",
    "On the common 4.0 scale used here: 93–100% = 4.0, 90–92 = 3.7, 87–89 = 3.3, 83–86 = 3.0, 80–82 = 2.7, 77–79 = 2.3, 73–76 = 2.0, 70–72 = 1.7, 67–69 = 1.3, 63–66 = 1.0, 60–62 = 0.7, below 60 = 0. Switch the input mode to '% grades' and enter percentages directly. Individual schools vary slightly.",
  ],
  [
    "What GPA do I need this semester to reach my target?",
    "That is what the Target GPA planner computes: needed average = (target × (credits done + planned) − current × credits done) ÷ planned credits. If the answer is above 4.0, the target cannot be reached in that many credits — the planner says so instead of pretending. As a rule, the more credits you already have, the harder a cumulative GPA is to move.",
  ],
  [
    "What is a good GPA?",
    "Context decides: 3.0 is the common 'good standing with room' line, 3.5+ typically makes Dean's List, and many graduate programs and employers screen at 3.0–3.5. Below 2.0 most colleges place students on academic probation. The standing label under your result uses these common thresholds — your school's exact rules govern.",
  ],
  [
    "Is the GPA Calculator free, and are my courses stored?",
    "Yes, free with no sign-up. Courses auto-save only in your own browser's local storage so you can continue later; nothing is sent to a server.",
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

export default function GpaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Auto-saves · Target planner included
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            GPA <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Semester &amp; Cumulative GPA — Done Properly
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Letter or percentage grades, Honors/AP weighting, a planner for the GPA you are chasing —
            and your courses <strong>stay saved</strong> when you come back, instead of vanishing like on
            other calculators. Export to CSV whenever you like.
          </p>
        </div>
      </section>

      <Gpa />

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
            {" "}· Students also use the <Link href="/final-grade-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Final Grade Calculator</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">all free tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="GPA questions, answered" />
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
              Calculate your GPA <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
