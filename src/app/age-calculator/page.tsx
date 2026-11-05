import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import AgeCalc from "./AgeCalc";

export const metadata = {
  title: "Age Calculator — Exact Age with Live Seconds, Generation & Chinese Zodiac",
  description:
    "Free age calculator that does everything in one place: exact age in years, months, days — ticking live in hours, minutes and seconds — with time-of-birth support, next birthday countdown, half birthday, generation, correct Chinese zodiac (real Lunar New Year), and an age-difference tool. No sign-up.",
  keywords: ["age calculator", "how old am i", "exact age calculator", "age difference calculator", "birthday countdown", "chinese zodiac calculator"],
  alternates: { canonical: "https://frinjo.me/age-calculator" },
  openGraph: {
    title: "Age Calculator — Exact Age, Live | WebStore Pro",
    description:
      "Your exact age ticking by the second, generation, correct Chinese zodiac, half birthday and age difference. Free.",
    url: "https://frinjo.me/age-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Age Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/age-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free exact age calculator combining features other sites split across pages: age in years/months/days from a date of birth with optional time of birth; a live ticking total of hours, minutes and seconds lived; total days; weekday of birth; next-birthday date and countdown and the age being turned; half-birthday date; generation label using commonly published Pew Research Center ranges with the source noted; Chinese zodiac sign determined by the actual Lunar New Year date for the birth year (1980–2031 table) rather than January 1; and a two-person age-difference calculator. Leap-day birthdays are observed on March 1 in non-leap years, and that convention is stated on the page. Runs in the browser; dates are never stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Age Calculator", item: "https://frinjo.me/age-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate my exact age?",
    "Subtract your birth date from today, borrowing months and days as needed — or let this calculator do it: enter your date of birth and it returns years, months and days, plus totals in days, hours, minutes and a live-ticking seconds count. Adding your time of birth makes the totals exact to the minute instead of assuming midnight.",
  ],
  [
    "Why do some Chinese zodiac calculators give me a different sign?",
    "Because the Chinese year starts at Lunar New Year (late January to mid-February), not on January 1. Anyone born in January or February may belong to the previous year's sign. Many simple calculators skip this and use the calendar year, which is simply wrong for those birthdays; this page uses a Lunar New Year date table (1980–2031) and applies the real cut-off.",
  ],
  [
    "When is my half birthday?",
    "Six months after your birthday. If you were born on June 15, your half birthday is December 15. It is a real milestone for babies (age in months matters), a kind workaround for people whose birthday collides with holidays, and the traditional celebration date fix for some February 29 babies. Yours is shown automatically above.",
  ],
  [
    "What generation am I?",
    "By commonly used Pew Research Center ranges: Silent Generation 1928–1945, Baby Boomers 1946–1964, Generation X 1965–1980, Millennials 1981–1996, Generation Z 1997–2012, Generation Alpha 2013–2024, and Generation Beta from 2025. Cut-offs are conventions, not laws of nature — other sources shift some by a year or two.",
  ],
  [
    "How is a February 29 birthday handled in non-leap years?",
    "This calculator observes it on March 1, the convention used in several legal systems (some use February 28 instead — for example where statutes speak of attaining an age on the preceding day). The one-day ambiguity is real and is stated on the page rather than hidden; for legal purposes, your jurisdiction's rule governs.",
  ],
  [
    "Is the Age Calculator free, and is my birth date stored?",
    "Yes, free with no sign-up. Your dates are processed in your browser only and are never stored or sent anywhere.",
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

export default function AgeCalcPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Live ticking age · Nothing stored
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Age <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Exact Age — Down to the Second
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Every age tool in one place: exact age with time of birth, a <strong>live seconds ticker</strong>,
            next-birthday countdown, half birthday, generation, a <strong>correct</strong> Chinese zodiac,
            and the two-person age difference rival sites split across separate pages.
          </p>
        </div>
      </section>

      <AgeCalc />

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
            {" "}· Born under which stars? See the <Link href="/sun-moon-rising-calculator" className="font-semibold text-orange-700 hover:text-orange-800">Big Three Calculator</Link> and all <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Age questions, answered" />
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
              Calculate an age <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
