import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import BotViewChecker from "./BotViewChecker";

export const metadata = {
  title: "BotView — Free SEO, AEO & GEO Checker",
  description:
    "BotView is a free SEO, AEO & GEO checker: paste any URL and get three scores out of 100 — SEO, AEO and AI visibility — with every failing check and its fix.",
  keywords: [
    "botview",
    "seo checker",
    "aeo checker",
    "geo checker",
    "ai visibility checker",
    "llms.txt checker",
    "free seo audit tool",
    "ai crawler checker",
  ],
  alternates: { canonical: "https://frinjo.me/botview" },
  openGraph: {
    title: "BotView — Free SEO, AEO & GEO Checker | WebStore Pro",
    description:
      "Paste any URL and get SEO, AEO and GEO (AI visibility) scores out of 100 — every check, every fix, free and with no sign-up.",
    url: "https://frinjo.me/botview",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BotView",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/botview",
  codeRepository: "https://github.com/rootsiemen/botview-web",
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free SEO, AEO and GEO checker. Audits any public URL for technical SEO, answer-engine readiness and AI visibility — llms.txt, AI-crawler access in robots.txt, structured data and readable text — and scores each out of 100 with a fix for every failing check.",
};

const FAQS: [string, string][] = [
  [
    "What is a GEO checker?",
    "A GEO (Generative Engine Optimization) checker audits whether AI search engines can crawl, read and cite your site. It checks llms.txt, AI-crawler rules in robots.txt, structured data and readable text, and scores them out of 100.",
  ],
  [
    "What is the difference between SEO, AEO and GEO?",
    "SEO is visibility in classic search results. AEO is being the direct answer (featured snippets, FAQ schema, answer-shaped content). GEO is visibility inside AI-generated answers. BotView scores all three separately because a site can be strong in one and invisible in another.",
  ],
  [
    "Is BotView free?",
    "Yes — the web checker is free, and the original command-line BotView auditor is open source (MIT) on GitHub.",
  ],
  [
    "What is llms.txt?",
    "A Markdown file at your site root that gives AI crawlers a clean map of your key pages and facts. BotView checks that it exists, starts with a heading, and links to at least three key pages.",
  ],
  [
    "How do I fix a low score?",
    "Every failing check in a BotView report comes with a one-line fix. Work from the top: red (fail) items first, then amber (warn). Most sites gain the most from three fixes — unblocking AI crawlers, adding an llms.txt, and adding entity (Organization/WebSite) schema.",
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

export default async function BotViewPage({
  searchParams,
}: {
  searchParams: Promise<{ url?: string }>;
}) {
  const { url } = await searchParams;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Instant report
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Bot<span className="text-gold-gradient">View</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Free SEO, AEO &amp; GEO Checker
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            See your site the way Google &amp; AI see it. Paste any URL and get three scores
            out of 100 — <strong>SEO</strong>, <strong>AEO</strong> and{" "}
            <strong>GEO (AI visibility)</strong> — with every failing check and the fix for
            each one.
          </p>
        </div>
      </section>

      {/* CHECKER (form + report, client) */}
      <BotViewChecker initialUrl={url ?? ""} />

      {/* WHAT IT CHECKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The audit"
            title="What does BotView check?"
            sub="Three visibilities, scored separately — because a site can rank on Google and still be invisible to AI."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">SEO</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">
                Can Google find and rank it?
              </h3>
              <p className="text-stone-600 leading-relaxed">
                HTTPS and status codes, title and meta description, canonical, exactly one
                H1 and a sane heading order, image alt text, internal links, robots.txt,
                sitemap, OpenGraph tags and content depth.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">AEO</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">
                Will it be the answer?
              </h3>
              <p className="text-stone-600 leading-relaxed">
                Answer Engine Optimization: FAQ/HowTo schema, question-style headings,
                short answer-shaped paragraphs right under them, and lists or tables that
                are easy for an engine to lift and quote.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">GEO</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">
                Can AI read and cite it?
              </h3>
              <p className="text-stone-600 leading-relaxed">
                The BotView original: llms.txt, whether GPTBot, ClaudeBot and PerplexityBot
                are allowed in robots.txt, JSON-LD entity schema, and how much readable
                text an LLM actually gets from the raw HTML.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY AI CRAWLERS MATTER */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Why it matters
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Why do AI crawlers matter for my website?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            More searches now end inside an AI answer than on a results page. When
            ChatGPT, Claude or Perplexity answers a question about your niche, it cites
            the sites its crawlers could actually read. A site that blocks GPTBot in
            robots.txt, hides its content behind JavaScript, or ships no structured data
            is invisible in those answers — no matter how well it ranks on Google.
            BotView puts all three visibilities side by side so you fix the weakest one
            first.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">8</div>
              <p className="mt-2 text-stone-400 text-sm">
                AI crawlers checked in your robots.txt — GPTBot, ClaudeBot, PerplexityBot
                and more.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">25+</div>
              <p className="mt-2 text-stone-400 text-sm">
                Individual checks across SEO, AEO and GEO — each with a one-line fix.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Sign-ups, paywalls or tracking. Paste a URL, get a report, share the link.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            BotView is also part of the open-source{" "}
            <Link href="/seo-agent-kit" className="font-semibold text-orange-400 hover:text-orange-300">
              SEO Agent Kit
            </Link>{" "}
            — the same workflows WebStore Pro runs on production sites.
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want the fixes done for you?"
            sub="BotView shows you exactly what is holding your site back. WebStore Pro can implement the fixes — with our Full Stack Web Development and SEO services, the same ones behind this site."
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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> and <Link href="/automations" className="font-semibold text-orange-700 hover:text-orange-800">automations</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="BotView questions, answered" />
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
              Run a free check <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
