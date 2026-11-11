import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import SiteAuditTools from "./SiteAuditTools";
import MoreAdsenseTools from "./MoreAdsenseTools";

export const metadata = {
  title: "AdSense Tools — Free Site Checker, Approval, ads.txt & Earnings Tools",
  description:
    "Free all-in-one AdSense tools: site checker with a health score, approval and eligibility checkers, ban-risk signals, ads.txt checker and generator, publisher ID finder, low value content checker by URL, and an earnings calculator. Public signals only — no sign-up.",
  keywords: [
    "adsense site checker",
    "adsense approval checker",
    "adsense eligibility checker",
    "adsense ban checker",
    "ads.txt checker",
    "ads.txt generator",
    "adsense publisher id finder",
    "adsense earnings calculator",
    "adsense tools",
  ],
  alternates: { canonical: "https://frinjo.me/adsense" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "AdSense Tools — Site Checker, Approval, ads.txt & Earnings | WebStore Pro",
    description:
      "One free page, nine AdSense tools: audit any site by URL for approval readiness, check and generate ads.txt, find a publisher ID, score low value content risk and estimate earnings.",
    url: "https://frinjo.me/adsense",
    type: "website",
  },
};

const TOOL_LIST = [
  { name: "AdSense Site Checker", href: "https://frinjo.me/adsense#site-checker", desc: "Site Health Score /100 from public signals — HTTPS, crawlability, ads.txt, code, policy pages, content depth — with a prioritised fix list." },
  { name: "AdSense Approval Checker", href: "https://frinjo.me/adsense#approval-checker", desc: "The site audit read as a Ready / Almost ready / Not ready approval verdict with the failing items listed." },
  { name: "AdSense Eligibility Checker", href: "https://frinjo.me/adsense#eligibility-checker", desc: "Automatic site checks plus an honest self-checklist, combined into one eligibility verdict." },
  { name: "AdSense Ban Risk Checker", href: "https://frinjo.me/adsense#ban-risk-checker", desc: "Public risk signals only — ads.txt, crawler blocks, policy pages, thin or iframe-only pages. Cannot confirm an official ban." },
  { name: "ads.txt Checker", href: "https://frinjo.me/adsense#adstxt-checker", desc: "Fetches /ads.txt and validates every seller line's format, flagging the google.com line." },
  { name: "Publisher ID Finder (AdSense Code Checker)", href: "https://frinjo.me/adsense#code-checker", desc: "Detects AdSense code on a homepage and extracts the ca-pub publisher ID, Auto Ads and manual-unit signals." },
  { name: "ads.txt Generator", href: "https://frinjo.me/adsense#adstxt-generator", desc: "Publisher ID in, a correct ads.txt out — Google line with the right certification ID, copy or download." },
  { name: "Low Value Content Checker (by URL)", href: "https://frinjo.me/adsense#low-value-checker", desc: "Fetches any published article and scores its low value risk from real word, section, image and link counts." },
  { name: "AdSense Earnings Calculator", href: "https://frinjo.me/adsense#earnings-calculator", desc: "Pageviews × RPM (or CPC × CTR) earnings estimates with a niche RPM reference table." },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AdSense Tools",
  itemListElement: TOOL_LIST.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: t.href,
    description: t.desc,
  })),
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdSense Tools",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/adsense",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free suite of nine Google AdSense tools on one page. The Site Checker fetches a site once — homepage, robots.txt, sitemap.xml, ads.txt and policy pages — and scores public readiness signals out of 100 (access and HTTPS 15, crawlability 20, ads.txt 15, AdSense code 10, policy pages 20, content depth 20). The Approval Checker, Eligibility Checker and Ban Risk Checker are views over the same audit; the ads.txt Checker validates every seller line and the Generator produces a correct ads.txt from a publisher ID; the Code Checker extracts ca-pub publisher IDs from a homepage; the Low Value Content Checker scores a published article fetched by URL; the Earnings Calculator estimates revenue from pageviews and RPM or CPC and CTR. All checks use public signals only: no tool here can guarantee AdSense approval or confirm an official account ban.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "AdSense Tools", item: "https://frinjo.me/adsense" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Can any of these tools guarantee AdSense approval?",
    "No — and be suspicious of any tool that promises it. Approval is Google's own review of your whole site and account history. These tools check the public signals reviewers and crawlers can see — HTTPS, crawlability, ads.txt, policy pages, content depth — so you can remove every measurable reason for a rejection before you apply. That is the part you control.",
  ],
  [
    "Can the Ban Risk Checker tell me if my AdSense account is banned?",
    "No tool outside Google can. A ban, suspension or ad-serving limit lives inside your AdSense account, and only the Policy Centre there can confirm it. What the Ban Risk Checker does is read the public signals that typically surround those actions — a broken ads.txt, a robots.txt that blocks the AdSense crawler, missing policy pages, an iframe-only homepage — so you can fix the outside of the site while you check the inside.",
  ],
  [
    "How does the Site Checker fetch my website?",
    "Our server requests your homepage, robots.txt, sitemap.xml, ads.txt and the common policy-page addresses once, following redirects, exactly like a crawler would. It reads the public HTML and files, measures the signals, and stores nothing. If a page is behind a login, a firewall that blocks unknown crawlers, or a region wall, the fetch may fail or see a different page than you do.",
  ],
  [
    "What is ads.txt and why does every checker here care about it?",
    "ads.txt is a plain-text file at your domain root that declares which sellers are authorised to sell your ad inventory. For AdSense it should contain one line — google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0 — with your publisher ID. Missing or malformed ads.txt does not always block approval, but it triggers authorised-seller warnings and can stop ads serving on an approved site. The Checker validates a live file; the Generator writes a correct one.",
  ],
  [
    "My site has no AdSense code yet — is that a failure?",
    "No. Before approval there is nothing to place: you add the code during sign-up, when Google gives it to you, or right after approval for Auto Ads. The Code Checker flags missing code as a warning for that reason. It becomes a real problem only on a site that is already approved and supposed to be showing ads.",
  ],
  [
    "How accurate is the Earnings Calculator?",
    "It is arithmetic, not a forecast: pageviews × your RPM (or clicks × CPC) is exact, but the RPM you feed it is the variable. Real RPM swings with niche, the countries your traffic comes from, device mix and season — the niche table gives rough ranges to sanity-check your input. Treat the output as a planning estimate, and re-run it with your real RPM from AdSense reports once you have them.",
  ],
  [
    "Which tool should I run first?",
    "The Site Checker — one run also fills the Approval, Eligibility, Ban Risk, ads.txt and Code checkers, because they all read the same audit. Fix whatever it flags, then use the Low Value Content Checker on your weakest articles and the Generator if your ads.txt is missing. Finish with the Earnings Calculator to see what the traffic you are fixing is roughly worth.",
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

const NAV: [string, string][] = [
  ["Site Checker", "#site-checker"],
  ["Approval", "#approval-checker"],
  ["Eligibility", "#eligibility-checker"],
  ["Ban Risk", "#ban-risk-checker"],
  ["ads.txt Checker", "#adstxt-checker"],
  ["Code Checker", "#code-checker"],
  ["ads.txt Generator", "#adstxt-generator"],
  ["Low Value (URL)", "#low-value-checker"],
  ["Earnings", "#earnings-calculator"],
];

export default function AdsenseToolsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-14 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · 9 tools, one page
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            AdSense <span className="text-gold-gradient">Tools</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Every AdSense check that matters, in one place
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Audit any site by URL for approval readiness, check and generate ads.txt, find a publisher ID,
            score an article&apos;s low value risk and estimate earnings. One audit run fills six of the
            tools at once — and every result is honest about what public signals can and cannot prove.
          </p>
          <nav className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600" aria-label="AdSense tools">
            {NAV.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full bg-white border border-stone-200 px-4 py-2 hover:border-orange-300 hover:text-orange-700 transition">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* TOOLS 1–6 (shared site audit) */}
      <SiteAuditTools />

      {/* TOOLS 7–9 */}
      <MoreAdsenseTools />

      {/* HONEST LIMITS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The honest picture
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            What these tools can — and cannot — tell you
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            AdSense approval, bans and ad-serving limits are decided inside Google, on your whole site and
            account history. No outside tool can see that, guarantee an approval, or confirm a ban — anyone
            selling that certainty is selling the claim, not the check. What is visible from outside is the
            public footprint a reviewer and the AdSense crawler meet first: whether the site loads securely,
            whether crawlers may read it, whether ads.txt declares Google, whether trust pages exist, and
            whether the content has real depth. Those signals are exactly what this page measures — fix
            them all, and your application or appeal goes in with nothing measurable left against it.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">1 fetch</div>
              <p className="mt-2 text-stone-400 text-sm">
                Homepage, robots.txt, sitemap.xml, ads.txt and policy pages — one audit powers six tools, so
                every verdict on this page agrees with the others.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Data stored. Audits are measured live and forgotten; the generators and calculator run in
                your browser.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Approval guarantees or ban confirmations any honest tool can offer. Google decides; this
                page just removes your measurable obstacles.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Go deeper with the full{" "}
            <Link href="/adsense-low-value-content-checker" className="font-semibold text-orange-400 hover:text-orange-300">
              Low Value Content Checker
            </Link>{" "}
            (duplicate similarity + article creator) and{" "}
            <Link href="/botview" className="font-semibold text-orange-400 hover:text-orange-300">
              BotView
            </Link>{" "}
            for SEO/AEO/AI visibility — all in the{" "}
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
            title="Want the fixes done for you?"
            sub="These tools are the same checks WebStore Pro runs before applying or re-applying a site. Our Full Stack Web Development and content services take it from audit to a site that is ready for review."
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
          <SectionHead eyebrow="FAQ" title="AdSense tools questions, answered" />
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
            <a href="#site-checker" className={btnPrimary}>
              Run the Site Checker <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
