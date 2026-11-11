import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import LowValueChecker from "./LowValueChecker";

export const metadata = {
  title: "AdSense Low Value Content Checker — Free, No Sign-Up",
  description:
    "Free AdSense low value content checker: paste any article and get a Low Value Risk Score out of 100 with the exact gaps to fix — plus a guided 1,600-word article creator. In-browser.",
  keywords: [
    "adsense low value content",
    "low value content checker",
    "adsense low value content fix",
    "low value content adsense rejection",
    "adsense approval checker",
    "thin content checker",
    "adsense site not ready",
    "content quality checker",
  ],
  alternates: { canonical: "https://frinjo.me/adsense-low-value-content-checker" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "AdSense Low Value Content Checker — Fix Low Value Rejections | WebStore Pro",
    description:
      "Paste an article, get a Low Value Risk Score with every gap named — word count, sections, FAQ, images, internal links, duplicate similarity — then rebuild it with the guided article creator.",
    url: "https://frinjo.me/adsense-low-value-content-checker",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AdSense Low Value Content Checker",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/adsense-low-value-content-checker",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free in-browser checker for Google AdSense 'low value content' rejections. Paste an article as text, Markdown or HTML and it measures word count against the 1,500-word thin-content line, section/heading count against 6, FAQ presence, image count against 3, internal vs external link counts with 3 internal links as the target, list and table presence, and target keyword density. An optional second pasted article enables a duplicate-similarity check using 3-word shingle Jaccard overlap, the classic near-duplicate template trigger. Results are a Low Value Risk Score out of 100 (0-25 low risk, 26-55 medium, 56+ high) with a fix checklist naming the exact gap for every failing item, plus an unscored site-level checklist. The built-in article creator turns a keyword into a scaffold: 3 title options, an introduction prompt, 6 guided H2 sections with writing prompts and per-section word counts, a comparison-table template exported as a real HTML table, 5 FAQ question templates with answer prompts, and a conclusion prompt, with a live total word counter and progress bar to 1,600 words and one-click export as HTML or Markdown. All analysis runs client-side; pasted text is never uploaded or stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "AdSense Low Value Content Checker", item: "https://frinjo.me/adsense-low-value-content-checker" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What does “low value content” mean in an AdSense rejection?",
    "It is Google's catch-all reason for sites whose pages look thin, copied or made mainly to carry ads: short articles with little original information, near-duplicate pages built from one template with the keyword or city swapped, scraped or auto-generated text, and pages with no supporting structure — no sections, no images, no links into the rest of the site. The rejection email never names the exact page or the exact gap, which is why this checker measures the gaps directly.",
  ],
  [
    "Can this checker guarantee AdSense approval?",
    "No — and distrust any tool that promises it. Approval is Google's own review of your whole site, including things no article checker can see: navigation, policy pages, traffic sources and whether content is copied from elsewhere on the web. What this tool does guarantee is that the measurable on-page signals behind most low value rejections — word depth, section structure, FAQ, images, internal links and duplicate similarity — are checked and fixed before you request another review.",
  ],
  [
    "How long should an article be to avoid low value content?",
    "Google publishes no official word minimum, and a sharp 900-word answer can be worth more than 3,000 words of filler. In practice, though, rejected sites almost always have the same shape: most articles under 1,000–1,500 words with few sections. This checker uses 1,500 words as the minimum line and 1,600 as the working target, because at that depth — with 6+ real sections, examples and an FAQ — an article can genuinely cover a topic instead of restating its title.",
  ],
  [
    "Does duplicate content trigger a low value content rejection?",
    "Yes — it is one of the most common triggers. The classic pattern is one template published dozens of times with only the keyword, product or city changed. Google reads that as many pages but one piece of content. Paste your article and a second article from your site into the checker: the similarity score uses 3-word-phrase overlap, and anything above roughly 30% means the two share enough wording and structure to be risky.",
  ],
  [
    "What else does Google check besides my articles?",
    "The whole site. Working navigation, an About page, a Privacy Policy and a Contact page are baseline expectations; broken links, pages copied from other websites, content hidden behind confusing menus, and applying with only 2–3 published posts all feed the same rejection. Fix the site-level items, publish a solid base of complete articles, and only then request a new review — repeated requests on an unchanged site do not help.",
  ],
  [
    "Is my article text uploaded or stored?",
    "No. The auditor, the similarity check and the article creator all run in your browser with JavaScript — the text you paste never leaves your device, and nothing is saved when you close the page. That also means the creator cannot keep a draft for you, so export your article with the copy buttons before you leave.",
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

export default function LowValueCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Runs in your browser
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            AdSense <span className="text-gold-gradient">Low Value Content</span> Checker
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Find the exact gaps behind a “low value content” rejection
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Google&apos;s rejection email never says which page failed or why. Paste your article here and get a{" "}
            <strong>Low Value Risk Score out of 100</strong> with every measured gap named — word count, sections,
            FAQ, images, internal links and duplicate similarity — then rebuild the article with the guided{" "}
            <strong>1,600-word creator</strong> until the checklist is green.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600">
            {["Risk score /100", "Fix checklist with exact numbers", "Duplicate similarity check", "Guided article creator"].map((chip) => (
              <span key={chip} className="rounded-full bg-white border border-stone-200 px-4 py-2">{chip}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL */}
      <LowValueChecker />

      {/* WHAT IT CHECKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The audit"
            title="What does the Low Value Content Checker measure?"
            sub="Three groups of signals decide whether a page looks like real, original content or like filler built to carry ads. The auditor measures all three from the text you paste."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Depth &amp; structure</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Is there enough article here?</h3>
              <p className="text-stone-600 leading-relaxed">
                Word count against the 1,500-word thin-content line, section and heading count against 6,
                and paragraph structure. Short, single-block articles are the single most common shape on
                rejected sites — this is the first thing the score weighs.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Originality</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Is it one article — or a template?</h3>
              <p className="text-stone-600 leading-relaxed">
                Paste a second article from your site and the checker compares 3-word-phrase overlap
                (shingle similarity) between the two. Template pages with the keyword or city swapped are
                a textbook low value trigger, and overlap above ~30% is flagged with the exact figure.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Usefulness signals</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Does the page actually help a reader?</h3>
              <p className="text-stone-600 leading-relaxed">
                FAQ section, images, internal links into the rest of the site, external references, lists
                and comparison tables — the elements a real answer has and spun filler never does. Each one
                is checked and, when missing, the checklist names exactly how many to add.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT LOW VALUE CONTENT MEANS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The honest picture
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            What “low value content” actually means
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Google&apos;s AdSense policies require sites to offer “unique and relevant content” — and
            “low value content” is the label used when a review finds pages that add little beyond what
            already exists: thin articles, scraped or spun text, doorway pages built for search engines
            instead of readers, and template duplicates. There is no published word-count rule and no
            tool — including this one — can guarantee approval, because the review covers the whole
            site. What you can do is remove every measurable reason for the label: complete articles
            with real depth and structure, original wording, and a site that holds together. That is
            exactly the checklist above, and exactly what the creator below the audit is built to produce.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">1,500+</div>
              <p className="mt-2 text-stone-400 text-sm">
                Words per article as the working minimum — the depth at which a topic can be covered
                properly instead of restated.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">6+</div>
              <p className="mt-2 text-stone-400 text-sm">
                Real sections per article, plus an FAQ, images and internal links — the structure thin
                content never has.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Approval guarantees any honest tool can offer you. Anyone selling one is selling the
                guarantee, not the fix.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Pair this with{" "}
            <Link href="/botview" className="font-semibold text-orange-400 hover:text-orange-300">
              BotView
            </Link>{" "}
            for the site-level audit and the{" "}
            <Link href="/word-counter" className="font-semibold text-orange-400 hover:text-orange-300">
              Word Counter
            </Link>{" "}
            while you draft. All three live in our{" "}
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
            title="Want the low value fixes done for you?"
            sub="This checker is the same audit WebStore Pro runs before re-applying a rejected site. Our Full Stack Web Development and content services take it from audit to a site that is ready for review."
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
          <SectionHead eyebrow="FAQ" title="Low value content questions, answered" />
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
              Check an article <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
