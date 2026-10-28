import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import KeywordChecker from "./KeywordChecker";

export const metadata = {
  title: "Keyword Traffic Checker — Free Keyword Difficulty & Competition Checker",
  description:
    "Free keyword traffic checker by country: pick any country, enter a keyword and get that market's live SERP competition report, a difficulty score out of 100 with its full breakdown, Google demand signals, search intent and related long-tail keywords. No fake search-volume numbers.",
  keywords: [
    "keyword traffic checker",
    "keyword difficulty checker",
    "keyword competition checker",
    "free keyword research tool",
    "keyword search volume checker",
    "serp competition checker",
    "long tail keyword finder",
  ],
  alternates: { canonical: "https://frinjo.me/keyword-traffic-checker" },
  openGraph: {
    title: "Keyword Traffic Checker — Free Keyword Difficulty Checker | WebStore Pro",
    description:
      "Check any keyword free: live SERP competition, a difficulty score with every factor shown, demand signals and related keywords — no invented volume numbers.",
    url: "https://frinjo.me/keyword-traffic-checker",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Keyword Traffic Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/keyword-traffic-checker",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free keyword traffic checker for any country. Fetches a live, country-targeted SERP sample for any keyword, scores its ranking difficulty out of 100 from that sample with a visible per-factor breakdown, classifies search intent, and shows Google Autocomplete demand signals and related long-tail keywords for the selected market. It does not invent monthly search volume.",
};

const FAQS: [string, string][] = [
  [
    "Is the Keyword Traffic Checker free?",
    "Yes — completely free, with no sign-up. Enter a keyword and the report is generated live from a real search-results sample and Google's own suggestion data.",
  ],
  [
    "Can I check keywords for different countries?",
    "Yes — pick any country from the dropdown (Pakistan is the default) and the whole report is fetched for that market: the SERP sample, the difficulty score, the Google suggestions and the Trends data are all targeted to the country you selected, and the report header names that country. The same keyword can be easy in one country and brutal in another, so always check the market you actually want to rank in.",
  ],
  [
    "Where does the data come from?",
    "Three live sources, all targeted to the country you selected: a SERP sample fetched at check time (DuckDuckGo, with Bing as fallback — the report names the source and country it used), Google Autocomplete suggestions for that country, and Google Trends for that country when Google does not rate-limit the request. If a source fails, the report says so instead of filling the gap with an estimate.",
  ],
  [
    "Why doesn't it show an exact monthly search volume?",
    "Exact monthly volume is paid-database data — it lives inside Google Keyword Planner (Google Ads), Ahrefs and Semrush, and no free source publishes it. Tools that show a precise volume for free are usually estimating or reselling old data. This checker shows what can be verified live: SERP competition, a difficulty score with its breakdown, and demand signals.",
  ],
  [
    "How is the difficulty score calculated?",
    "Only from the SERP sample on the report. Points are added for authority domains (Wikipedia, YouTube, .gov, .edu, big brands) in the results and in the top 3, for titles and URLs that target the exact keyword, for one domain dominating the page, for keyword breadth (a 1-word head term scores harder than a long-tail phrase), for keyword saturation in snippets, and for the total competing-page count when the source reports one. Every factor's points are printed next to the score.",
  ],
  [
    "What difficulty score should a small site target?",
    "Under 40 is the sweet spot: page 1 is realistic with one strong, well-targeted page. Between 40 and 60 you need a page that is clearly better than the current results. Above 60, established sites hold the SERP — target a longer-tail version of the keyword first.",
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

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition";

export default async function KeywordCheckerPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const { keyword } = await searchParams;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Live data
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Keyword <span className="text-gold-gradient">Traffic</span> Checker
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Free Keyword Difficulty &amp; Competition Checker
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Pick any country, enter a keyword and see who you would actually have to beat in that
            market: a live SERP sample, a{" "}
            <strong>difficulty score out of 100 with every factor shown</strong>, real Google demand
            signals, search intent and related long-tail keywords — with{" "}
            <strong>no invented search-volume numbers</strong>.
          </p>
        </div>
      </section>

      {/* CHECKER */}
      <KeywordChecker initialKeyword={keyword ?? ""} />

      {/* WHAT IT CHECKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The report"
            title="What does the Keyword Traffic Checker show?"
            sub="Traffic potential is really two questions — can you rank, and does anyone search? This tool answers both with data it fetched live, and labels every source."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Competition</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Who holds page 1 right now?</h3>
              <p className="text-stone-600 leading-relaxed">
                The top results for your keyword, fetched live from DuckDuckGo (Bing as fallback), turned into a
                difficulty score — authority sites, exact-match titles, keyword URLs and SERP domination, each
                factor printed with its points.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Demand</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Are people actually searching?</h3>
              <p className="text-stone-600 leading-relaxed">
                Google Autocomplete suggestions for your exact keyword — real queries Google completes because
                people type them — plus a Google Trends interest index when Google serves it. No suggestion data,
                no demand claim.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Intent &amp; ideas</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">What does the searcher want?</h3>
              <p className="text-stone-600 leading-relaxed">
                A rule-based intent classification (transactional, informational, local or navigational) that
                names the exact words that triggered it — and a list of related long-tail keywords pulled from
                real autocomplete expansions, each one checkable with a click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HONESTY / HOW SCORING WORKS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            No fake numbers
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Why is there no exact search volume?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Exact monthly search volume is paid-database data. It lives inside Google Keyword Planner
            (Google Ads), Ahrefs and Semrush — there is no free public source for it, and any free tool
            showing a precise number like “12,100 searches a month” is estimating or reselling old data.
            This checker refuses to do that. Instead it shows the two things that decide whether a keyword
            is worth your time and that <em>can</em> be verified live: how strong the current page-1
            competition is, and whether Google&apos;s own suggestion data shows real demand.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">100</div>
              <p className="mt-2 text-stone-400 text-sm">
                Difficulty is scored out of 100, and every factor&apos;s points are printed next to the
                score on your report — check the maths yourself.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">10</div>
              <p className="mt-2 text-stone-400 text-sm">
                Live results in the SERP sample behind each report — the actual titles, domains and snippets
                the score was built from.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Invented volume numbers, sign-ups or paywalls. If a data source fails, the report says so.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Pair this with{" "}
            <Link href="/botview" className="font-semibold text-orange-400 hover:text-orange-300">
              BotView
            </Link>{" "}
            — check the keyword here, then check whether your page is built to win it. Both live in our{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              tools hub
            </Link>
            .
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want keywords researched and ranked for you?"
            sub="This checker is the same first step WebStore Pro runs before writing any page. Our Full Stack Web Development and SEO services take it from keyword to a page that ranks."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a Free SEO Audit <Icon name="arrow" className="w-5 h-5" />
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
          <SectionHead eyebrow="FAQ" title="Keyword checker questions, answered" />
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
              Check a keyword <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
