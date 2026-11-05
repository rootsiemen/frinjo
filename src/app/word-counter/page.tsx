import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import WordCounter from "./WordCounter";

export const metadata = {
  title: "Word Counter — Characters & Reading Time",
  description:
    "Free word counter: words, characters, sentences, reading and speaking time, Flesch readability and top-word density with CSV export. Nothing uploaded.",
  keywords: ["word counter", "character counter", "word count", "reading time calculator", "readability checker", "keyword density checker"],
  alternates: { canonical: "https://frinjo.me/word-counter" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Word Counter — More Than a Count | WebStore Pro",
    description:
      "Words, characters, selection counts, adjustable reading/speaking time, Flesch scores and density with CSV export. Free, private.",
    url: "https://frinjo.me/word-counter",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Word Counter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/word-counter",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free online word counter that also counts characters with and without spaces, sentences, paragraphs and unique words; counts a highlighted selection separately; loads plain-text files; estimates reading time and speaking time with user-adjustable speeds (defaults 238 wpm reading, based on Brysbaert 2019, and 130 wpm speaking); computes Flesch Reading Ease and Flesch-Kincaid Grade Level readability with the formulas named; and lists the top 10 words with keyword-density percentages exportable as CSV. All processing is client-side; text is never uploaded or stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Word Counter", item: "https://frinjo.me/word-counter" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does the word counter count words?",
    "It splits your text on whitespace, so any run of characters separated by spaces counts as one word — the same convention as Microsoft Word and Google Docs. Hyphenated words (well-known) count as one word; numbers count as words.",
  ],
  [
    "How is reading time calculated?",
    "Words divided by reading speed. The default 238 words per minute is the average silent reading speed for English non-fiction found in Brysbaert's 2019 meta-analysis (Journal of Memory and Language). Unlike most counters, this one lets you change the speed — a fast reader at 300 wpm and a careful reader at 180 wpm should not get the same number.",
  ],
  [
    "How long does it take to speak 1,000 words?",
    "At the default presentation pace of 130 wpm, about 7 minutes 42 seconds. Conversational speech runs 120–150 wpm; audiobook narration is typically 150–160 wpm. The speaking-speed setting on this page adjusts to your delivery.",
  ],
  [
    "What is a good Flesch Reading Ease score?",
    "60–70 is plain English that most adults read comfortably (and what most web writing should aim for). 70–80 is fairly easy, 50–60 is fairly difficult, and below 30 is dense academic or legal prose. The score comes from average sentence length and syllables per word (Flesch, 1948); the companion Flesch-Kincaid grade (Kincaid et al., 1975) converts it to a US school grade level.",
  ],
  [
    "What keyword density should I aim for?",
    "There is no magic number — search engines denied a target density long ago. Use the density table diagnostically: if your main keyword is under ~0.5% it may be under-used, and if a single word (beyond stopwords like 'the') pushes past 3–4%, the text may read as stuffed. Natural coverage of the topic beats a percentage.",
  ],
  [
    "Is my text private?",
    "Yes. Counting runs entirely in your browser with JavaScript — the text is never sent to a server, stored, or logged. Closing the tab erases it.",
  ],
  [
    "Why does my word count differ slightly from Microsoft Word or Google Docs?",
    "Usually at the edges: how a tool treats hyphenated words, numbers, markers and text in tables or text boxes. This counter splits on whitespace and counts what you paste, headings included, while Word can exclude text boxes and footnotes. On long documents the two totals normally land very close.",
  ],
  [
    "How many words should a blog post, essay or speech be?",
    "There is no universal right length — match the format instead. A spoken minute is about 130 words at presentation pace, so a 10-minute talk is roughly 1,300 words. For essays and articles, the assignment brief or the publication's guidelines set the target; this counter's job is to measure your draft against it.",
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

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Private · More than a count
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Word <span className="text-gold-gradient">Counter</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Words, Reading Time, Readability &amp; Keyword Density
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            The things other counters split across five pages or leave out: highlight-to-count selections,
            reading speeds <strong>you</strong> can adjust, readability from the actual named formulas, and
            a density table you can export.
          </p>
        </div>
      </section>

      <WordCounter />

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
            {" "}· Or browse our <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link>, <Link href="/case-converter" className="font-semibold text-orange-700 hover:text-orange-800">case converter</Link> and <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">free tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="How it works" title="How the counts and scores are calculated" />
          <div className="space-y-5 text-stone-600 leading-relaxed">
            <p>
              Words are counted by splitting on whitespace. Sentences are counted from terminal punctuation
              (. ! ?), paragraphs from blank lines, and syllables with a vowel-group heuristic: count the
              groups of vowels in each word, with a silent trailing &apos;e&apos; removed. Those numbers feed
              the named formulas — Flesch Reading Ease = 206.835 − 1.015 × (words ÷ sentences) − 84.6 ×
              (syllables ÷ words), and Flesch-Kincaid Grade = 0.39 × (words ÷ sentences) + 11.8 × (syllables
              ÷ words) − 15.59. Reading time is simply words ÷ speed.
            </p>
            <p>
              <strong className="text-stone-900">Worked example:</strong> take the 20-word text &apos;Good
              writing helps busy readers grasp new ideas quickly. Short lines and plain words make each point
              easy to follow.&apos; That is 2 sentences and 27 syllables by the counter&apos;s heuristic, so
              average sentence length is 10 and syllables per word are 1.35. Flesch Reading Ease =
              206.835 − 10.15 − 114.21 ≈ 82 — &apos;easy&apos; — and the Flesch-Kincaid grade comes out at
              about 4.2.
            </p>
            <p>
              Common mistakes: judging a heading by its readability score — the formulas only switch on at
              10+ words and stay rough on short samples. Treating density as a target to hit rather than a
              check for accidental repetition. And pasting text with references or footnotes attached, which
              inflates the count — use the selection counter to count the body on its own.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Word counting questions, answered" />
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
              Count some words <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
