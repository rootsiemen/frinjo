import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import VisaBulletinChecker from "./VisaBulletinChecker";

export const metadata = {
  title: "Visa Bulletin October 2026 — Priority Date Checker (EB-1, EB-2, EB-3)",
  description:
    "Free visa bulletin priority date checker with the October 2026 final action dates for EB-1, EB-2 and EB-3 (India, China, Rest of World). Enter your priority date to see instantly whether your category is current.",
  keywords: [
    "visa bulletin",
    "visa bulletin october 2026",
    "priority date checker",
    "eb2 india current date",
    "final action dates",
    "green card priority date current",
  ],
  alternates: { canonical: "https://frinjo.me/visa-bulletin" },
  openGraph: {
    title: "Visa Bulletin Oct 2026 — Priority Date Checker | WebStore Pro",
    description:
      "October 2026 final action dates for EB-1/EB-2/EB-3 — enter your priority date and check if you are current. Free.",
    url: "https://frinjo.me/visa-bulletin",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Visa Bulletin Priority Date Checker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/visa-bulletin",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free priority date checker using the October 2026 US Visa Bulletin employment-based Final Action Dates. Choose EB-1, EB-2 or EB-3 and your country of chargeability (Rest of World, China or India), enter your priority date, and the tool compares it against the bulletin's cutoff date for that cell and reports CURRENT or NOT YET CURRENT, with the full final action dates table below. Source: US Department of State visa bulletin. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Visa Bulletin Priority Date Checker", item: "https://frinjo.me/visa-bulletin" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is a final action date in the visa bulletin?",
    "The final action date is the cutoff in the monthly visa bulletin. Your priority date must be earlier than the listed date for your category and country before USCIS can approve your green card.",
  ],
  [
    "What does 'Current' mean in the visa bulletin?",
    "Current means immigrant visa numbers are available with no cutoff date — applicants in that category and country can move forward regardless of priority date.",
  ],
  [
    "What are the India final action dates in the October 2026 visa bulletin?",
    "EB-1 India: February 1, 2023. EB-2 India: November 1, 2013. EB-3 India: January 1, 2014. If your priority date is earlier than the date for your category, you are current for October 2026.",
  ],
  [
    "How often do visa bulletin dates change?",
    "Every month. The State Department publishes a new bulletin monthly, and final action dates can move forward, stay flat or retrogress — always confirm your month against the official bulletin at travel.state.gov before filing anything time-sensitive.",
  ],
  [
    "Is the Visa Bulletin Checker free?",
    "Yes, completely free with no sign-up. Everything runs in your browser; nothing is stored. General information only — not legal advice.",
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

export default function VisaBulletinPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · October 2026 bulletin · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Visa Bulletin <span className="text-gold-gradient">October 2026</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Priority Date Checker · EB-1 / EB-2 / EB-3
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Employment-based final action dates from the October 2026 bulletin (FY2027). Pick your
            category and country, enter your priority date, and see instantly whether you are
            <strong> current</strong>. Official source:{" "}
            <a
              href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-orange-700 hover:text-orange-800 underline"
            >
              travel.state.gov
            </a>
            .
          </p>
        </div>
      </section>

      {/* CHECKER */}
      <VisaBulletinChecker />

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
          <SectionHead eyebrow="FAQ" title="Visa bulletin questions, answered" />
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
              Check your priority date <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
