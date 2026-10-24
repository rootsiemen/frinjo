import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "SEO Agent Kit — Open-Source SEO Toolkit for AI Agents",
  description:
    "Free open-source SEO toolkit for AI agents: 8 production SEO skills + BotView, the AI-visibility auditor. MIT licensed — get it on GitHub.",
  keywords: [
    "seo agent kit",
    "open source seo toolkit",
    "seo tools for ai agents",
    "ai visibility audit",
    "botview",
    "llms.txt generator",
    "technical seo audit skill",
  ],
  alternates: { canonical: "https://frinjo.me/seo-agent-kit" },
  openGraph: {
    title: "SEO Agent Kit — Open-Source SEO Toolkit | WebStore Pro",
    description:
      "8 production SEO skills for AI agents + BotView, the zero-dependency AI-visibility auditor. Free and MIT licensed on GitHub.",
    url: "https://frinjo.me/seo-agent-kit",
    type: "website",
  },
};

const GITHUB_URL = "https://github.com/rootsiemen/seo-agent-kit";

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SEO Agent Kit",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any (Python 3.8+ for BotView; skills are plain Markdown)",
  url: "https://frinjo.me/seo-agent-kit",
  codeRepository: GITHUB_URL,
  license: "https://opensource.org/licenses/MIT",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Open-source SEO toolkit for AI agents: 8 production SEO skill workflows (technical audit, AI visibility, llms.txt, schema gaps, local SEO, content clusters, GSC regex, brand mentions) plus BotView, a zero-dependency AI-visibility auditor.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SEO Agent Kit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "SEO Agent Kit is a free, open-source toolkit that packages real production SEO workflows as skills an AI agent can execute: eight step-by-step SKILL.md workflows — technical audit, AI visibility (GEO/AEO), llms.txt, schema gaps, local SEO, content clusters, GSC regex filtering and brand mentions — plus BotView, a zero-dependency Python auditor for AI visibility.",
      },
    },
    {
      "@type": "Question",
      name: "Is SEO Agent Kit free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. SEO Agent Kit is released under the MIT license on GitHub. You can clone it, point your AI agent at any skill, and run BotView on your own sites at no cost.",
      },
    },
    {
      "@type": "Question",
      name: "What does BotView check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BotView scores a site out of 100 for AI visibility: llms.txt presence and link quality, AI-crawler access in robots.txt (GPTBot, ClaudeBot, PerplexityBot and others), structured data (JSON-LD), and readable-text ratio. It also has a view command (see a page the way an LLM reads it) and a generate command (draft an llms.txt from a sitemap).",
      },
    },
    {
      "@type": "Question",
      name: "Which AI agents can use the SEO skills?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any agent that reads Markdown instructions — Claude Code and similar agentic tools. Each skill is a plain SKILL.md file with a concrete, step-by-step workflow, so there is no framework lock-in.",
      },
    },
    {
      "@type": "Question",
      name: "Can WebStore Pro run an SEO or AI-visibility audit on my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. These are the same workflows WebStore Pro runs in production on client and in-house sites. Email neilsonsmarry@gmail.com or message WhatsApp +92 325 8774221 for an audit, or see our Full Stack Web Development and SEO services.",
      },
    },
  ],
};

const MODULES = [
  {
    icon: "search",
    name: "technical-audit",
    desc: "Crawl health: status codes, titles/meta/canonical, sitemap, robots, HTTPS and redirect chains.",
  },
  {
    icon: "globe",
    name: "ai-visibility",
    desc: "GEO/AEO audit — can ChatGPT, Claude and Perplexity actually read and cite your site?",
  },
  {
    icon: "chat",
    name: "llms-txt",
    desc: "Write an llms.txt AI tools will actually use — real links, key facts, no bare paths.",
  },
  {
    icon: "dashboard",
    name: "schema-gaps",
    desc: "Find missing JSON-LD by site type and validate the structured data you ship.",
  },
  {
    icon: "star",
    name: "local-seo",
    desc: "Google Business Profile + citation consistency checklist (legal-directory edition included).",
  },
  {
    icon: "rocket",
    name: "content-clusters",
    desc: "Validate a topic cluster from your own Search Console data before writing a word.",
  },
  {
    icon: "bolt",
    name: "gsc-regex",
    desc: "Filter GSC Performance to buyer-intent queries with one regex.",
  },
  {
    icon: "quote",
    name: "brand-mentions",
    desc: "Build the third-party footprint that AI answers are assembled from.",
  },
];

const SCORES = [
  { site: "frinjo.me", label: "This site — WebStore Pro studio site", score: 90 },
  { site: "igaf.me", label: "Roman-Urdu government-services guides", score: 90 },
  { site: "usaattorneys.company", label: "US attorney directory, 760+ listings", score: 78 },
];

const STEPS = [
  {
    t: "Clone the kit",
    d: "One git clone from GitHub. The skills are plain Markdown — no framework, no lock-in, nothing to install.",
  },
  {
    t: "Point your agent at a skill",
    d: "Tell your AI agent: \u201cfollow skills/technical-audit/SKILL.md for this domain\u201d — it executes the workflow end-to-end.",
  },
  {
    t: "Run BotView",
    d: "One command scores your site's AI visibility out of 100 and shows exactly what AI crawlers can and cannot read.",
  },
  {
    t: "Ship the fixes",
    d: "Work through the findings: repair crawl issues, publish a real llms.txt, close schema gaps, then re-audit to prove the lift.",
  },
];

const FAQS: [string, string][] = [
  [
    "What is SEO Agent Kit?",
    "A free, open-source toolkit that packages real production SEO workflows as skills an AI agent can execute: eight step-by-step SKILL.md workflows — technical audit, AI visibility (GEO/AEO), llms.txt, schema gaps, local SEO, content clusters, GSC regex filtering and brand mentions — plus BotView, a zero-dependency Python auditor for AI visibility.",
  ],
  [
    "Is SEO Agent Kit free to use?",
    "Yes. It is released under the MIT license on GitHub. Clone it, point your AI agent at any skill, and run BotView on your own sites at no cost.",
  ],
  [
    "What does BotView check?",
    "BotView scores a site out of 100 for AI visibility: llms.txt presence and link quality, AI-crawler access in robots.txt (GPTBot, ClaudeBot, PerplexityBot and others), structured data (JSON-LD) and readable-text ratio. It also has a view command — see a page the way an LLM reads it — and a generate command that drafts an llms.txt from a sitemap.",
  ],
  [
    "Which AI agents can use the SEO skills?",
    "Any agent that reads Markdown instructions — Claude Code and similar agentic tools. Each skill is a plain SKILL.md file with a concrete, step-by-step workflow, so there is no framework lock-in.",
  ],
  [
    "Can WebStore Pro run an SEO or AI-visibility audit on my website?",
    "Yes — these are the same workflows WebStore Pro runs in production on client and in-house sites. Email neilsonsmarry@gmail.com or message WhatsApp +92 325 8774221 for an audit, or see our Full Stack Web Development and SEO services.",
  ],
];

export default function SeoAgentKitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="bg-orange-50 dot-grid py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-4">
            Open Source · By WebStore Pro
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-stone-900 leading-tight max-w-3xl">
            SEO Agent Kit: the <span className="text-gold-gradient">open-source SEO toolkit</span> for AI agents
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl leading-relaxed">
            Most SEO checklists are written by people who sell checklists. This kit is different: eight
            production SEO workflows your AI agent can execute end-to-end, plus BotView — the
            zero-dependency auditor that scores how visible your site is to ChatGPT, Claude and
            Perplexity. Free, MIT licensed, built from real client work.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              Get it on GitHub <Icon name="arrow" className="w-5 h-5" />
            </a>
            <a href="#botview" className={btnOutline}>
              See real BotView scores <Icon name="search" className="w-5 h-5" />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
            {["MIT licensed & free", "No framework lock-in", "Runs in production on real sites"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-orange-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS IT */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Overview"
            title="What is SEO Agent Kit?"
            sub="Every skill in the kit is a workflow that runs in production — on this site, on a government-services guides site, and on a 760+ listing US attorney directory. No hype, no \u201cguaranteed #1 ranking\u201d nonsense. Just the work, in a form your agent can execute."
          />
          <div className="grid gap-5 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-stone-200 p-7 bg-white hover:border-orange-300 transition">
                <span className="w-11 h-11 rounded-full bg-orange-600 text-white font-display font-bold grid place-items-center mb-4 text-lg">
                  {i + 1}
                </span>
                <h3 className="font-bold text-stone-900 mb-2">{s.t}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.d}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-orange-300">
                    <Icon name="arrow" className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The 8 skills"
            title="What's inside the kit?"
            sub="Each folder holds a SKILL.md — a concrete, step-by-step workflow an AI agent (Claude Code, or any agent that reads Markdown instructions) can follow end-to-end."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m, i) => (
              <div
                key={m.name}
                className="rounded-3xl border border-stone-200 bg-white p-7 hover:shadow-xl hover:border-orange-200 transition group"
              >
                <span className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Icon name={m.icon} className="w-6 h-6" />
                </span>
                <p className="font-display font-bold text-stone-300 text-base mb-1">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{m.name}</h3>
                <p className="text-stone-600 leading-relaxed text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTVIEW */}
      <section id="botview" className="py-16 sm:py-20 bg-stone-950 text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Included tool · BotView</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">How visible is your site to AI search?</h2>
            <p className="mt-4 text-stone-400">
              BotView is a zero-dependency Python auditor for AI visibility. It scores any site out of
              100 — llms.txt presence and link quality, AI-crawler access in robots.txt, structured
              data and readable-text ratio — and can show you a page the way an LLM reads it, or draft
              an llms.txt from your sitemap.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3 mb-10">
            {SCORES.map((s) => (
              <div key={s.site} className="rounded-3xl border border-stone-800 bg-stone-900 p-8 hover:border-orange-700 transition text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-5xl font-bold text-orange-400">{s.score}</span>
                  <span className="text-stone-500 font-display text-xl">/100</span>
                </div>
                <h3 className="font-display text-lg font-bold mt-3">{s.site}</h3>
                <p className="text-sm text-stone-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-stone-900 border border-stone-800 px-6 py-5 font-mono text-sm text-orange-200 overflow-x-auto">
              python3 tools/botview.py audit https://your-site.com
            </div>
            <p className="mt-5 text-sm text-stone-500 leading-relaxed text-center">
              Real audits run on 24 October 2026 on sites maintained with these workflows. The 78 is
              honest — a Cloudflare managed robots block was overriding that site's own crawler rules.
              That trap is documented in the ai-visibility skill because it cost real time to find.
            </p>
            <div className="mt-8 text-center">
              <Link href="/botview" className={btnPrimary}>
                Run BotView free in your browser <Icon name="arrow" className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Who it's for"
            title="Who should use SEO Agent Kit?"
            sub="If your site needs to be found — by Google and by AI answers — and you work with an AI agent, this kit was built for you."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "bolt",
                title: "Developers using AI agents",
                desc: "You ship with Claude Code or a similar agent. Hand it a SKILL.md and get a real technical audit, an llms.txt or a schema pass — executed, not just advised.",
              },
              {
                icon: "globe",
                title: "Site owners & businesses",
                desc: "Run BotView on your own site in one command and see your AI Visibility Score. Then let your agent — or WebStore Pro — work through the findings.",
              },
              {
                icon: "shield",
                title: "Agencies & freelancers",
                desc: "The same workflows used to prepare client reports for real sites. MIT licensed, so you can use them in your own practice and contribute improvements back.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-3xl border border-stone-200 bg-stone-50/60 p-8 hover:shadow-xl hover:border-orange-200 transition group">
                <span className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center mb-5 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Icon name={c.icon} className="w-7 h-7" />
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{c.title}</h3>
                <p className="text-stone-600 leading-relaxed text-[15px]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want this run on your website?"
            sub="SEO Agent Kit is free to run yourself. If you'd rather have it done for you, WebStore Pro runs these exact audits — and builds the fixes into your site with our Full Stack Web Development and SEO services."
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
          <SectionHead eyebrow="FAQ" title="SEO Agent Kit questions, answered" />
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
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={btnOutline}>
              Star it on GitHub <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
