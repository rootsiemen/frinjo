import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const metadata = {
  title: "F1 Visa Interview Questions & Guide 2026",
  description:
    "F1 visa interview questions for 2026: the 5 question groups officers use, sample answers, and 10 practical tips on finances and home ties. Free.",
  keywords: [
    "f1 visa interview questions",
    "f1 visa interview",
    "f1 visa interview tips",
    "us student visa interview",
    "f1 visa interview preparation",
  ],
  alternates: { canonical: "https://frinjo.me/f1-visa-interview-questions" },
  openGraph: {
    title: "F1 Visa Interview Guide — Questions & Tips (2026) | WebStore Pro",
    description:
      "Common F1 interview question groups with sample questions and 10 practical tips on finances, ties to home, and confidence. Free guide.",
    url: "https://frinjo.me/f1-visa-interview-questions",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "F1 Visa Interview Questions", item: "https://frinjo.me/f1-visa-interview-questions" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What questions are asked in an F1 visa interview?",
    "Almost every question falls into five groups: why you chose this university, your study plans, your finances and sponsor, your ties to your home country, and your post-graduation plans. The full sample question list for each group is on this page.",
  ],
  [
    "How long does an F1 visa interview last?",
    "Usually 2–4 minutes. That brevity is exactly why preparation matters: the officer is testing three things in that short window — you are a genuine student, you can afford the program, and you intend to return home.",
  ],
  [
    "What documents should I carry to the F1 interview?",
    "Originals plus one photocopy set: your I-20, passport, DS-160 confirmation, SEVIS fee receipt, financial documents (bank statements, sponsor income proof, loan sanction letter if any) and your admission letter.",
  ],
  [
    "What is the most common reason F1 visas are refused?",
    "Failing to convince the officer of non-immigrant intent — weak or vague ties to your home country — together with shaky finances. Concrete evidence beats claims: family business documents, property papers, a return job offer, and exact funding numbers you can state without hesitation.",
  ],
  [
    "How long should my F1 interview answers be?",
    "About 20–30 seconds per question: short, direct and confident. Long stories sound rehearsed or evasive, and guessing at an answer is far worse than honestly saying you don't know.",
  ],
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "F1 Visa Interview Questions & Guide 2026 — Questions, Tips & Answers",
  url: "https://frinjo.me/f1-visa-interview-questions",
  mainEntityOfPage: "https://frinjo.me/f1-visa-interview-questions",
  inLanguage: "en",
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  publisher: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Prepare for your F1 student visa interview: the five question groups consular officers actually use — university choice, study plans, finances, home ties, post-graduation plans — with sample questions and 10 practical tips.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const groups: { title: string; why: string; questions: string[] }[] = [
  {
    title: "Why this university?",
    why: "The officer checks you chose the school for academics, not as a visa route.",
    questions: [
      "Why did you choose this university over others?",
      "How many universities did you apply to, and which admitted you?",
      "What is special about your program at this university?",
      "Who is your program advisor or which professors interest you?",
    ],
  },
  {
    title: "Study plans",
    why: "They want a genuine student with a clear academic path.",
    questions: [
      "Why do you want to study in the US instead of your home country?",
      "What will you study, and why this major?",
      "How does this degree connect to your previous education?",
      "What is your GRE/TOEFL/IELTS score?",
      "How long is your program?",
    ],
  },
  {
    title: "Finances & sponsor",
    why: "You must show you can pay tuition and living costs without illegal work.",
    questions: [
      "Who is sponsoring your education?",
      "What does your sponsor do for a living?",
      "What is your sponsor's annual income?",
      "How will you fund your second year?",
      "Do you have an education loan? From which bank?",
    ],
  },
  {
    title: "Ties to your home country",
    why: "F1 is a non-immigrant visa — you must show intent to return.",
    questions: [
      "Do you have family back home?",
      "What will you do after completing your degree?",
      "Do you own property or have a job offer waiting at home?",
      "Why should I believe you will return after your studies?",
    ],
  },
  {
    title: "Post-graduation plans",
    why: "Vague 'I'll see' answers raise red flags — be specific and home-oriented.",
    questions: [
      "What are your career plans after graduation?",
      "Will you apply for OPT?",
      "How will this US degree help your career back home?",
      "Do you plan to settle in the US permanently?",
    ],
  },
];

const tips = [
  "Answer in 20–30 seconds per question — short, direct, confident. Long stories sound rehearsed or evasive.",
  "Know your numbers cold: tuition per year, living costs, sponsor income, loan amount, test scores.",
  "Carry originals plus one photocopy set: I-20, passport, DS-160 confirmation, SEVIS fee receipt, financial documents, admission letter.",
  "Dress neatly — formals or smart casual. First impressions form in seconds.",
  "Speak in English throughout, even if the officer switches to your language. It demonstrates you can handle US coursework.",
  "Never mention part-time jobs or working off-campus as a funding plan — it suggests immigrant intent and unauthorized work.",
  "If you don't know an answer, say so honestly. Guessing or bluffing is far worse.",
  "Show ties, don't just claim them: family business, property papers, a return job offer — concrete beats promises.",
  "Practice out loud with a friend, not just in your head. Record yourself once and fix filler words.",
  "Arrive early, stay calm, make eye contact, and smile. Nervous is normal — dishonest is fatal.",
];

export default function F1VisaInterviewPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free guide · F1 student visa · 2026
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            F1 Visa Interview <span className="text-gold-gradient">Questions</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The F1 interview usually lasts 2–4 minutes. The officer is testing three
            things: you are a genuine student, you can afford it, and you will
            return home. Prepare around those three pillars.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {groups.map((g) => (
            <div key={g.title} className="mt-8 first:mt-0 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="font-display text-xl font-bold text-stone-900">{g.title}</h2>
              <p className="mt-1 text-sm text-stone-500">{g.why}</p>
              <ul className="mt-3 space-y-2">
                {g.questions.map((q) => (
                  <li key={q} className="text-stone-700 bg-stone-50 rounded-xl px-4 py-2.5">
                    “{q}”
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-8 rounded-3xl bg-orange-50 border border-orange-100 p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-stone-900">10 practical tips</h2>
            <ol className="mt-3 space-y-2.5 list-decimal pl-5 text-stone-700">
              {tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>

          <p className="mt-6 text-xs text-stone-500">
            General preparation guidance based on commonly reported interview
            experiences — not legal advice. Requirements vary by consulate. Also
            useful: the <Link href="/visa-bulletin" className="font-semibold text-orange-700 hover:text-orange-800">Visa Bulletin Priority Date Checker</Link> and{" "}
            <Link href="/h1b-lottery-calculator" className="font-semibold text-orange-700 hover:text-orange-800">H-1B Lottery Calculator</Link>.
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a website like this on your own domain?"
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
          <SectionHead eyebrow="FAQ" title="F1 interview questions, answered" />
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
              Start preparing <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
