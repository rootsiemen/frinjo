import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const metadata = {
  title: "Free Tools — BotView, Keyword Traffic Checker, SEO Agent Kit & More",
  description:
    "All of WebStore Pro's free tools in one place: BotView (SEO, AEO & GEO checker), Keyword Traffic Checker (keyword difficulty & competition), IP Address Tracker (what is my IP, anonymity & leak checks), SEO Agent Kit, Temp Mail and PlayZone. Free, no sign-up.",
  keywords: [
    "free seo tools",
    "botview",
    "keyword traffic checker",
    "ip address tracker",
    "what is my ip",
    "seo agent kit",
    "free tools webstore pro",
    "temp mail",
    "playzone",
  ],
  alternates: { canonical: "https://frinjo.me/tools" },
  openGraph: {
    title: "Free Tools | WebStore Pro",
    description:
      "BotView, Keyword Traffic Checker, IP Address Tracker, SEO Agent Kit, Temp Mail and PlayZone — every free WebStore Pro tool, in one hub.",
    url: "https://frinjo.me/tools",
    type: "website",
  },
};

interface Tool {
  name: string;
  href: string;
  external?: boolean;
  tag: string;
  desc: string;
}

const TOOLS: Tool[] = [
  {
    name: "BotView",
    href: "/botview",
    tag: "SEO · AEO · GEO",
    desc: "Paste any URL and get SEO, AEO and GEO (AI visibility) scores out of 100 — every failing check and its fix, free.",
  },
  {
    name: "Keyword Traffic Checker",
    href: "/keyword-traffic-checker",
    tag: "Keyword research",
    desc: "Enter a keyword and get a live SERP competition report, a difficulty score with its full breakdown, demand signals and related long-tail keywords.",
  },
  {
    name: "IP Address Tracker",
    href: "/ip-address-tracker",
    tag: "Privacy · Network",
    desc: "See what your connection reveals: your IP address, location and ISP, plus an anonymity score from six live leak checks (WebRTC, DNS, timezone and more) — and track any other IP the same way.",
  },
  {
    name: "SEO Agent Kit",
    href: "/seo-agent-kit",
    tag: "Open source",
    desc: "The open-source SEO toolkit behind this site: 8 workflow modules for technical audits, AI visibility, schema, content clusters and more.",
  },
  {
    name: "Temp Mail",
    href: "https://tempmaill.tech",
    external: true,
    tag: "Disposable email",
    desc: "Free disposable email addresses — get an inbox in seconds for sign-ups and testing, and keep your real inbox spam-free.",
  },
  {
    name: "PlayZone",
    href: "https://games.tempmaill.tech",
    external: true,
    tag: "Browser games",
    desc: "Free browser games that run instantly with no download — plus guides and tips for classic card and puzzle games.",
  },
];

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free Tools — WebStore Pro",
  url: "https://frinjo.me/tools",
  description:
    "A hub of WebStore Pro's free tools: BotView, Keyword Traffic Checker, IP Address Tracker, SEO Agent Kit, Temp Mail and PlayZone.",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: t.href.startsWith("http") ? t.href : `https://frinjo.me${t.href}`,
    })),
  },
};

const FAQS: [string, string][] = [
  [
    "Are these tools really free?",
    "Yes. BotView, the Keyword Traffic Checker and the SEO Agent Kit are free with no sign-up, and Temp Mail and PlayZone are free to use. They are the same tools WebStore Pro uses on its own sites.",
  ],
  [
    "Which tool should I start with?",
    "Start with the Keyword Traffic Checker to pick a keyword you can actually win, write the page, then run it through BotView to check its SEO, AEO and AI visibility before you promote it.",
  ],
  [
    "Do the tools store my data?",
    "BotView and the Keyword Traffic Checker generate their reports live from public data and do not require an account. Temp Mail inboxes are disposable by design.",
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
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition flex flex-col";

export default function ToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-16 sm:pb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Our <span className="text-gold-gradient">Tools</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Every free tool WebStore Pro builds and uses — in one place. Check a site, research a
            keyword, grab a disposable inbox, or take a game break.
          </p>
        </div>
      </section>

      {/* TOOL CARDS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The toolbox"
            title="All tools"
            sub="Each tool lives on its own page — this hub just keeps them together."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 text-left">
            {TOOLS.map((t) =>
              t.external ? (
                <a key={t.name} href={t.href} target="_blank" rel="noopener noreferrer" className={card}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">{t.tag}</p>
                  <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h3>
                  <p className="text-stone-600 leading-relaxed flex-1">{t.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700">
                    Open tool <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </a>
              ) : (
                <Link key={t.name} href={t.href} className={card}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">{t.tag}</p>
                  <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h3>
                  <p className="text-stone-600 leading-relaxed flex-1">{t.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-orange-700">
                    Open tool <Icon name="arrow" className="w-4 h-4" />
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* HOW THEY FIT TOGETHER */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Workflow</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">How the SEO tools fit together</h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Pick a winnable keyword with the Keyword Traffic Checker, publish the page, then audit it with
            BotView for SEO, AEO and AI visibility. The SEO Agent Kit documents the full workflow behind
            both — the same process WebStore Pro runs for its own sites and clients.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/keyword-traffic-checker" className={btnPrimary}>
              Start with a keyword <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <Link href="/botview" className={btnOutline}>
              Then audit the page
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Tools questions, answered" />
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
        </div>
      </section>
    </>
  );
}
