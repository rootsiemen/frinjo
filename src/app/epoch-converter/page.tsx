import type { Metadata } from "next";
import Link from "next/link";
import EpochConverter from "./EpochConverter";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Epoch Converter — Unix Timestamp to Date, Live Clock";
const DESCRIPTION =
  "Free epoch converter: convert Unix timestamps (seconds, ms, µs, ns) to human dates and back, with a live current-epoch clock and relative time. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["epoch converter", "unix timestamp converter", "epoch to date", "timestamp to date", "current epoch time", "unix time now", "date to epoch"],
  alternates: { canonical: "https://frinjo.me/epoch-converter" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Epoch Converter — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/epoch-converter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-default.jpg"],
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Epoch Converter — Unix Timestamp to Date",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/epoch-converter",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Convert Unix epoch timestamps to human-readable dates and dates back to epoch, in seconds, milliseconds, microseconds or nanoseconds, with auto unit detection, a live ticking current-epoch clock, UTC and local time, ISO 8601 output and relative time ('3 days ago'). Runs entirely in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Epoch Converter", item: "https://frinjo.me/epoch-converter" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is epoch time (Unix time)?",
    "Epoch time is the number of seconds that have elapsed since 00:00:00 UTC on 1 January 1970, not counting leap seconds. Computers store dates this way because a single number is easy to save, sort and compare. At the time of writing the epoch is around 1.76 billion — a 10-digit number in seconds, 13 digits in milliseconds.",
  ],
  [
    "How do I know if a timestamp is seconds, milliseconds or microseconds?",
    "Count the digits: 10 digits = seconds, 13 = milliseconds, 16 = microseconds, 19 = nanoseconds. This converter auto-detects the unit from the length of the number you paste (or you can force a unit in the dropdown) — mixing them up is the #1 cause of dates that land in the year 55,000 or 1970.",
  ],
  [
    "Why does my timestamp show 1 January 1970?",
    "A 1970 date almost always means a unit mismatch — most commonly a seconds value fed into a field expecting milliseconds (or a 0/null value). Check the digit count: if the value has 10 digits but the system expects 13, multiply by 1,000. This converter shows the detected unit next to every result so you can spot it immediately.",
  ],
  [
    "What is the current epoch time right now?",
    "The live clock at the top of this page shows it, ticking every second, in both seconds and milliseconds, along with the matching UTC and ISO 8601 date. Programmers grab it constantly for cache-busting, log checks and testing time-based code.",
  ],
  [
    "Is epoch time the same in every timezone?",
    "Yes — that is its main advantage. An epoch timestamp names one exact instant worldwide. It only becomes timezone-dependent when you display it as a local date and time, which is why this converter shows UTC and your local time side by side.",
  ],
  [
    "What happens in 2038 (the Year 2038 problem)?",
    "Systems that store epoch seconds in a signed 32-bit integer overflow at 03:14:07 UTC on 19 January 2038 and wrap to 1901. Modern systems use 64-bit integers, which push the limit to the year 292 billion — but plenty of embedded devices and old file formats still use 32 bits.",
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

export default function EpochConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Developers · Logs · Debugging
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Epoch <span className="text-gold-gradient">Converter</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Unix timestamps to dates — and dates back — in seconds, ms, µs and ns.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            That 10-digit number in your log file is a moment in time. Paste it here and see the exact date in UTC and your
            timezone, how long ago it was, and whether it is seconds or milliseconds — auto-detected. The live clock at the
            top always shows the current epoch.
          </p>
        </div>
      </section>

      <EpochConverter />

      {/* DONE-FOR-YOU CTA */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Done-for-you</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Need a tool like this on your own website?</h2>
          </div>
          <p className="-mt-6 text-stone-300 leading-relaxed max-w-2xl mx-auto">
            Every calculator on this site was built by WebStore Pro — the same work I do for clients: fast, accurate,
            mobile-friendly tools and full stack websites from $80. If your site needs a custom calculator, converter or
            internal tool, I can build it for you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Start a project <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              <Icon name="whatsapp" className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-stone-400">
            Prefer email?{" "}
            <a href="mailto:neilsonsmarry@gmail.com" className="text-orange-400 font-semibold hover:underline">
              neilsonsmarry@gmail.com
            </a>{" "}
            · See <Link href="/services" className="text-orange-400 font-semibold hover:underline">my services</Link> — or
            explore the <Link href="/uuid-generator" className="text-orange-400 font-semibold hover:underline">UUID Generator</Link>,{" "}
            <Link href="/base64-encoder-decoder" className="text-orange-400 font-semibold hover:underline">Base64 Encoder/Decoder</Link> and{" "}
            <Link href="/time-duration-calculator" className="text-orange-400 font-semibold hover:underline">Time Duration Calculator</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How epoch conversion works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">One number, one instant.</strong> Unix time counts seconds from
              1970-01-01 00:00:00 UTC. Converting to a date means adding that many seconds to the epoch start; converting
              back means counting the seconds between your date and the epoch start. Milliseconds, microseconds and
              nanoseconds are the same idea at finer resolutions — just multiply or divide by 1,000 per step.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                The timestamp <strong className="text-stone-900">1762300800</strong> has 10 digits → seconds. Adding it to
                the epoch gives <strong className="text-stone-900">Wednesday, 5 November 2025, 00:00:00 UTC</strong>
                (2025-11-05T00:00:00.000Z in ISO 8601). Written in milliseconds the same instant is 1762300800000, and in
                microseconds 1762300800000000.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Always check the digit count before trusting a converted date (10/13/16/19).",
                "Store timestamps in UTC; convert to local time only when displaying them.",
                "JavaScript's Date uses milliseconds; Python's time.time() returns seconds — the classic mix-up.",
                "For database created_at columns, seconds are plenty; use ms only for ordering fast events.",
                "Relative time ('3 days ago') is computed against your clock, so it stays live on this page.",
              ].map((tip) => (
                <li key={tip} className="flex gap-3">
                  <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-700 grid place-items-center">
                    <Icon name="check" className="w-3 h-3" />
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Epoch converter questions, answered" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="#top" className="inline-flex items-center gap-2 font-semibold text-orange-700 hover:underline">
              ↑ Back to the converter
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
