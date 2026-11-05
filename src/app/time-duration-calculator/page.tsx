import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import TimeDuration from "./TimeDuration";

export const metadata = {
  title: "Time Duration Calculator — Hours Between Two Times (+ Decimal Hours)",
  description:
    "Free time duration calculator: the exact time between two dates and times in hours, minutes and seconds — including decimal hours for timesheets and payroll — plus add or subtract hours and minutes from any time. No sign-up.",
  keywords: [
    "time duration calculator",
    "hours between two times",
    "time between dates calculator",
    "decimal hours calculator",
    "duration calculator",
    "how many hours between",
  ],
  alternates: { canonical: "https://frinjo.me/time-duration-calculator" },
  openGraph: {
    title: "Time Duration Calculator — Between Two Times | WebStore Pro",
    description:
      "Exact duration in h:m:s, decimal hours, total minutes and seconds — plus add/subtract time. Free.",
    url: "https://frinjo.me/time-duration-calculator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Time Duration Calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/time-duration-calculator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free time duration calculator with two tools: (1) the duration between two date-times, reported as days plus hours:minutes:seconds and as totals in decimal hours, minutes, seconds and decimal days — decimal hours being the format payroll and timesheets require; (2) adding or subtracting a number of hours and minutes to or from a date-time. Durations spanning multiple days and overnight shifts are handled; an end earlier than the start is counted backwards and flagged. Runs in the visitor's browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Time Duration Calculator", item: "https://frinjo.me/time-duration-calculator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I calculate the duration between two times?",
    "Subtract the start time from the end time. From 09:15 to 17:45 is 8 hours 30 minutes. When the period crosses midnight or spans days, date-plus-time inputs (as used here) keep it exact — this calculator accepts full dates with times for both ends.",
  ],
  [
    "What are decimal hours, and how do I convert minutes to them?",
    "Decimal hours express a duration as a single number: divide the minutes by 60. So 30 minutes = 0.5 hours, 15 minutes = 0.25, 45 minutes = 0.75, and 1h 30m = 1.5 hours — not 1.3. Payroll, billing and timesheet systems use decimal hours because pay is rate × hours.",
  ],
  [
    "How do I calculate hours worked for a shift?",
    "Enter clock-in as the start and clock-out as the end, then subtract any unpaid break from the decimal-hours result. Example: 08:00 to 16:30 is 8.5 hours; minus a 30-minute unpaid lunch gives 8.0 paid hours. Overnight shifts work the same way as long as the end date is the next day.",
  ],
  [
    "How many minutes are in an hour, and seconds in a day?",
    "60 minutes in an hour, 3,600 seconds in an hour, and 86,400 seconds in a full day. The totals row of this calculator shows your duration in all of these units at once.",
  ],
  [
    "What time will it be in X hours?",
    "Use the second tool on this page: enter the starting date and time, the hours and minutes to add, and read the result — it handles crossing midnight and month boundaries automatically. Subtracting works the same way for 'what time was it X hours ago'.",
  ],
  [
    "Is the Time Duration Calculator free?",
    "Yes, completely free with no sign-up. Times are processed in your browser and never stored.",
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

export default function TimeDurationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Decimal hours included
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Time Duration <span className="text-gold-gradient">Calculator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Exactly How Long Between Two Times
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Shift lengths, flight durations, project hours: the exact span in hours, minutes and seconds —
            and in <strong>decimal hours</strong>, the format your timesheet actually wants.
          </p>
        </div>
      </section>

      <TimeDuration />

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

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Time duration questions, answered" />
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
              Measure a duration <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
