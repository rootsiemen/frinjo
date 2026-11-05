import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import Ovulation from "./Ovulation";

export const metadata = {
  title: "Ovulation Calculator — Fertile Window",
  description:
    "Free ovulation calculator: your ovulation date, fertile window, next period, earliest test day and estimated due date from your last period.",
  keywords: [
    "ovulation calculator",
    "fertile window calculator",
    "when do i ovulate",
    "ovulation date calculator",
    "fertility calculator",
    "period calculator",
  ],
  alternates: { canonical: "https://frinjo.me/ovulation-calculator" },
  openGraph: {
    title: "Ovulation Calculator — Fertile Window & Ovulation Date | WebStore Pro",
    description:
      "Your ovulation date and fertile window from your last period — plus next period, test day and due date. Free and honest about the limits.",
    url: "https://frinjo.me/ovulation-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ovulation Calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/ovulation-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free ovulation and fertile-window calculator. From the first day of the last menstrual period and the average cycle length (21–40 days), it estimates ovulation as cycle length minus a typical 14-day luteal phase, the fertile window as five days before ovulation through the day after, the next period, the earliest sensible pregnancy-test day, and an estimated due date 280 days from the last period. The page states the evidence-based limits of calendar estimation and that it must not be used as contraception. General information, not medical advice.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Ovulation Calculator", item: "https://frinjo.me/ovulation-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does an ovulation calculator work?",
    "Ovulation usually happens about 14 days before the next period — the luteal phase is fairly constant even when the whole cycle varies. So estimated ovulation = last period + (cycle length − 14) days. The fertile window is then the five days before it plus the day itself and the day after, because sperm can survive up to about five days in fertile mucus while the egg lives roughly 24 hours.",
  ],
  [
    "How accurate is a calendar-based fertile window?",
    "It is a useful estimate, not a measurement. In a landmark study (Wilcox, Dunson & Baird, BMJ 2000), the fertile window fell entirely within cycle days 6–21 in only about 30% of women, even among those with regular cycles — ovulation day varies more than the calendar assumes. Ovulation predictor kits (LH tests) and basal body temperature tracking pin the day down far better; use this page for planning, and those for precision.",
  ],
  [
    "What cycle length should I enter?",
    "Your average over your last few cycles: count from the first day of one period to the first day of the next. 28 days is the textbook average, but anything from about 21 to 35 days is common. If your cycles vary by more than a few days, expect the estimate to vary too — and if cycles are very irregular, a clinician can help more than a calculator.",
  ],
  [
    "When should I take a pregnancy test?",
    "From the day of your missed period at the earliest for a standard home test — this calculator shows the day after your expected period as a sensible earliest date, when hCG is most likely high enough. Testing earlier often produces false negatives; if the test is negative but the period has not come, retest in a few days.",
  ],
  [
    "Can I use this calculator to avoid pregnancy?",
    "No. Calendar methods have high typical-use failure rates precisely because ovulation shifts; this calculator is an estimate for planning conception and understanding your cycle. For contraception, use a proven method and clinician guidance.",
  ],
  [
    "Is the Ovulation Calculator free, and is my data stored?",
    "Yes, free with no sign-up — and nothing is stored. Your dates are processed in your browser only.",
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

export default function OvulationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Nothing stored · Limits stated honestly
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Ovulation <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Your Fertile Window &amp; Ovulation Date
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            From the first day of your last period: your estimated ovulation day, the full fertile
            window, your next period, the earliest sensible test day — and an estimated due date if this
            is the cycle. With the <strong>real-world limits</strong> of calendar maths printed on the
            page, not buried.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <Ovulation />

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
          <SectionHead eyebrow="FAQ" title="Ovulation questions, answered" />
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
              Find your fertile window <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
