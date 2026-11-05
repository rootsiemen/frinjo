import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CaseConverter from "./CaseConverter";

export const metadata = {
  title: "Case Converter — Title, UPPER, camelCase, snake_case, Slugs & More",
  description:
    "Free case converter: instantly convert text to Title Case, UPPER CASE, lower case, Sentence case, camelCase, PascalCase, snake_case, kebab-case URL slugs, alternating case and more — with character and word counts. Runs in your browser, nothing uploaded.",
  keywords: ["case converter", "title case converter", "upper case converter", "camelcase converter", "snake case converter", "text case converter", "slug generator"],
  alternates: { canonical: "https://frinjo.me/case-converter" },
  openGraph: {
    title: "Case Converter — Every Text Case, Instantly | WebStore Pro",
    description: "Title, UPPER, camel, snake, kebab slugs and more — converted as you type, in your browser. Free.",
    url: "https://frinjo.me/case-converter",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Case Converter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/case-converter",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free online case converter with sixteen conversions: UPPER CASE, lower case, Title Case, Sentence case, Capitalized Words, alternating case, inverse case, reverse text, remove spaces, and the programming conventions camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case (also usable as a URL slug generator), Train-Case and dot.case. Code conversions split source text on spaces, hyphens, underscores and camelCase boundaries. Conversion is instant and entirely client-side; the tool also reports character and word counts.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Case Converter", item: "https://frinjo.me/case-converter" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is Title Case?",
    "Title Case capitalizes the first letter of every major word — used for headlines, book titles and video titles: 'The Quick Brown Fox Jumps Over'. This converter's Title Case capitalizes each word in place, preserving your spacing and punctuation; style guides (AP, Chicago) additionally keep small words like 'the' and 'of' lowercase mid-title, which you can adjust by hand for formal work.",
  ],
  [
    "What is the difference between camelCase, PascalCase, snake_case and kebab-case?",
    "They are naming conventions, mostly for code and URLs. camelCase joins words with capitals and a lowercase first word (myVariableName); PascalCase capitalizes the first word too (MyClassName); snake_case joins with underscores in lowercase (my_variable_name, SCREAMING_SNAKE for constants); kebab-case joins with hyphens (my-url-slug) and is the standard for web URLs because underscores can be hard to see in underlined links.",
  ],
  [
    "How do I turn a title into a URL slug?",
    "Use the kebab-case conversion: it lowercases the words and joins them with hyphens, removing punctuation — 'My Great Post: 10 Tips!' becomes 'my-great-post-10-tips'. Clean slugs are lowercase, hyphenated and free of special characters, which is what search engines and content systems expect.",
  ],
  [
    "What is Sentence case?",
    "Sentence case capitalizes only the first letter of each sentence and proper nouns: 'the meeting is at noon. bring the report.' becomes 'The meeting is at noon. Bring the report.' It is the default for most modern interfaces and documents because it reads fastest.",
  ],
  [
    "Is my text uploaded anywhere?",
    "No. The conversion runs entirely in your browser with JavaScript; nothing is sent to a server or stored. You can paste sensitive text safely — closing the tab clears everything.",
  ],
  [
    "Is the Case Converter free?",
    "Yes, completely free with no sign-up and no text length limits beyond your browser's memory.",
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

export default function CaseConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · 16 conversions · Nothing uploaded
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Case <span className="text-gold-gradient">Converter</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Title Case, UPPER, camelCase, snake_case &amp; Slugs
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Paste once, get every case instantly — headline styles for writers, naming conventions for
            developers, and a clean kebab-case <strong>URL slug</strong> for anything you publish.
          </p>
        </div>
      </section>

      <CaseConverter />

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Done-for-you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack websites and custom tools that rank — designed, built and SEO-ready from day one."
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
          <SectionHead eyebrow="FAQ" title="Case questions, answered" />
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
              Convert some text <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
