import type { Metadata } from "next";
import Link from "next/link";
import UuidGenerator from "./UuidGenerator";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "UUID Generator — Bulk v4 & v7 UUIDs, Free Online";
const DESCRIPTION =
  "Free UUID generator: create bulk v4 (random) and v7 (time-ordered) UUIDs up to 500 at once, uppercase/no-hyphen options, plus a UUID validator. No sign-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["uuid generator", "guid generator", "uuid v4 generator", "uuid v7 generator", "bulk uuid generator", "generate uuid online", "uuid validator"],
  alternates: { canonical: "https://frinjo.me/uuid-generator" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "UUID Generator — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/uuid-generator",
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
  name: "UUID Generator — Bulk v4 & v7",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/uuid-generator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Generate up to 500 UUIDs at once in version 4 (random, RFC 4122) or version 7 (time-ordered, RFC 9562), with uppercase and no-hyphen formatting options, copy-all and .txt download, plus a built-in validator that reports a UUID's version and variant. Uses the Web Crypto API in the browser; nothing is uploaded.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "UUID Generator", item: "https://frinjo.me/uuid-generator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is a UUID and what is it used for?",
    "A UUID (Universally Unique Identifier, also called a GUID) is a 128-bit ID written as 32 hex digits in five groups: 8-4-4-4-12, like 550e8400-e29b-41d4-a716-446655440000. Software uses UUIDs as database primary keys, session and transaction IDs, file names and request IDs — anywhere you need an ID that is unique without asking a central authority.",
  ],
  [
    "What is the difference between UUID v4 and v7?",
    "Version 4 is pure randomness (122 random bits) — the classic UUID. Version 7 (RFC 9562, 2024) starts with a 48-bit millisecond timestamp, so v7 UUIDs sort in creation order. That ordering makes v7 far better as a database primary key: new rows append at the end of the index instead of scattering randomly, which keeps inserts fast and indexes compact.",
  ],
  [
    "Can two v4 UUIDs ever collide?",
    "In theory yes, in practice no. With 122 random bits, you would need to generate roughly 2.7 quintillion (2.7 × 10¹⁸) UUIDs before the chance of a single duplicate reaches about 50% — and a billion UUIDs per second for a century only gets you to around 3 × 10¹⁸. For real systems, collisions are treated as impossible.",
  ],
  [
    "Are the UUIDs generated here secure?",
    "They are generated with the Web Crypto API (crypto.getRandomValues), the same cryptographic random source your browser uses for security operations — not Math.random. Generation happens entirely on your device; no UUID is sent to or stored on any server, so they are safe to use as keys and tokens (though for passwords, use the Password Generator).",
  ],
  [
    "How many UUIDs can I generate at once?",
    "Up to 500 per batch, in v4 or v7, with lowercase/uppercase and with/without hyphens. Use Copy all to grab the batch or Download .txt to save it as a file — handy for seeding databases and test fixtures.",
  ],
  [
    "How do I check whether a UUID is valid?",
    "Paste it into the validator below the generator. It checks the 8-4-4-4-12 hex format and reports the version (the 13th hex digit) and variant. It also recognises the special Nil UUID (all zeros), which is valid by the spec but should never be used as a real ID.",
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

export default function UuidGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Developers · Databases · Testing
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            UUID <span className="text-gold-gradient">Generator</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Bulk v4 and v7 UUIDs — up to 500 at a time, generated in your browser.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Most generators stop at random v4. This one also does <strong>time-ordered v7</strong> UUIDs (the database-friendly
            kind), uppercase and no-hyphen formats, one-click copy, .txt download — and a validator that tells you the
            version and variant of any UUID you paste.
          </p>
        </div>
      </section>

      <UuidGenerator />

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
            explore the <Link href="/password-generator" className="text-orange-400 font-semibold hover:underline">Password Generator</Link>,{" "}
            <Link href="/epoch-converter" className="text-orange-400 font-semibold hover:underline">Epoch Converter</Link> and{" "}
            <Link href="/base64-encoder-decoder" className="text-orange-400 font-semibold hover:underline">Base64 Encoder/Decoder</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How UUIDs are built" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Anatomy of a UUID.</strong> A UUID is 128 bits shown as hex in the pattern
              8-4-4-4-12. Two spots are reserved: the first digit of the third group is the <em>version</em> (4 or 7), and
              the first digit of the fourth group encodes the <em>variant</em> (8, 9, a or b for the standard RFC variant).
              Everything else is random — except in v7, where the first 48 bits are a Unix millisecond timestamp.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                In <strong className="text-stone-900">550e8400-e29b-41d4-a716-446655440000</strong>, the third group starts
                with <strong className="text-stone-900">4</strong> → version 4 (random). The fourth group starts with{" "}
                <strong className="text-stone-900">a</strong> → standard RFC 4122 variant. A v7 UUID generated now starts
                with the hex of the current timestamp instead, so later UUIDs always sort after earlier ones.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Use v7 (or a time-ordered scheme) for database primary keys; v4 for opaque public IDs.",
                "Store UUIDs as BINARY(16) or the native uuid type — not as 36-char strings — to save space.",
                "Keep hyphens in displayed/stored text form; some APIs need the 32-char no-hyphen form instead.",
                "Never use a UUID as a password or secret token by itself — it is an identifier, not a credential.",
                "The Nil UUID (all zeros) is a sentinel value, not a real ID — reject it in validation.",
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
          <SectionHead eyebrow="FAQ" title="UUID generator questions, answered" />
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
              ↑ Back to the generator
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
