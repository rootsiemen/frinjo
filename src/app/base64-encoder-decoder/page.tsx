import type { Metadata } from "next";
import Link from "next/link";
import Base64Tool from "./Base64Tool";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

const TITLE = "Base64 Encoder/Decoder — Text & Files, UTF-8 Safe";
const DESCRIPTION =
  "Free Base64 encoder and decoder: encode text or files to Base64 and decode back, UTF-8 safe (emoji work), URL-safe alphabet option, runs 100% in your browser.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["base64 encoder", "base64 decoder", "base64 encode online", "decode base64", "base64 to text", "text to base64", "base64 file encoder"],
  alternates: { canonical: "https://frinjo.me/base64-encoder-decoder" },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Base64 Encoder/Decoder — WebStore Pro" }],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://frinjo.me/base64-encoder-decoder",
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
  name: "Base64 Encoder/Decoder — Text & Files",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/base64-encoder-decoder",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Encode text and files to Base64 and decode Base64 back to text, fully UTF-8 safe so accents, CJK characters and emoji survive the round trip, with a URL-safe alphabet option, decoded-size preview, clear error messages for malformed input, and a swap button to reverse a conversion. Runs entirely in the browser.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Base64 Encoder/Decoder", item: "https://frinjo.me/base64-encoder-decoder" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What is Base64 used for?",
    "Base64 turns binary data into plain ASCII text so it can travel through systems built for text: embedding images in HTML/CSS (data URIs), sending attachments in email (MIME), putting binary in JSON or XML, basic-auth headers, JWT tokens, and storing blobs in databases or config files. It is an encoding, not encryption — anyone can decode it.",
  ],
  [
    "Why does Base64 make data about 33% bigger?",
    "Base64 represents every 3 bytes of input as 4 characters from a 64-character alphabet. 4 ÷ 3 = 1.333, so the output is roughly 33% larger than the input, plus occasional '=' padding to round the length up to a multiple of 4. That overhead is the price of text-safe transport.",
  ],
  [
    "Why do emoji and accented characters break some Base64 tools?",
    "JavaScript's built-in btoa() only accepts Latin-1 characters, so it throws on emoji, accents beyond Latin-1, Chinese or Arabic text. This tool first converts your text to UTF-8 bytes (TextEncoder) and only then to Base64 — and reverses the process with TextDecoder — so any Unicode text round-trips exactly.",
  ],
  [
    "What is URL-safe Base64?",
    "Standard Base64 uses '+' and '/', which mean other things in URLs, and '=' padding. The URL-safe variant (RFC 4648 §5) swaps '+' for '-' and '/' for '_', and usually drops the padding. Use it for tokens in links, filenames and JWTs. Toggle it above the tool — decoding accepts it too.",
  ],
  [
    "Why won't my Base64 decode?",
    "Usually one of three things: characters outside the Base64 alphabet got mixed in (spaces are forgiven here, other symbols are not), the string was truncated when copied, or it is URL-safe Base64 being decoded as standard. This tool validates the input and tells you plainly instead of printing garbage.",
  ],
  [
    "Is it safe to paste secrets here?",
    "The conversion runs 100% in your browser — nothing is uploaded or stored. That said, remember Base64 is not encryption: never treat a Base64 string as protected, and never use it to 'hide' passwords or keys in code or URLs.",
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

export default function Base64Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 pb-10 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Developers · Data · APIs
          </span>
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-stone-900 leading-tight">
            Base64 <span className="text-gold-gradient">Encoder / Decoder</span>
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-bold text-stone-900">
            Encode text or files to Base64 — and decode back — without breaking on emoji.
          </p>
          <p className="mt-4 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Full UTF-8 support (the thing plain btoa() chokes on), a URL-safe alphabet option, file-to-Base64 encoding,
            and honest error messages when a string is not valid Base64. Everything happens locally in your browser.
          </p>
        </div>
      </section>

      <Base64Tool />

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
            <Link href="/epoch-converter" className="text-orange-400 font-semibold hover:underline">Epoch Converter</Link> and{" "}
            <Link href="/case-converter" className="text-orange-400 font-semibold hover:underline">Case Converter</Link> — plus 100+ more free tools on the{" "}
            <Link href="/tools" className="text-orange-400 font-semibold hover:underline">tools hub</Link>.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="The method" title="How Base64 encoding works" />
          <div className="-mt-4 space-y-5 text-stone-600 leading-relaxed">
            <p>
              <strong className="text-stone-900">Three bytes in, four characters out.</strong> Base64 takes binary data
              three bytes at a time (24 bits), splits it into four 6-bit groups, and maps each group to a character from a
              64-character alphabet (A–Z, a–z, 0–9, + and /). If the input does not divide evenly by 3, the final group is
              padded with '=' signs. Decoding runs the exact same mapping backwards.
            </p>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <p className="font-bold text-stone-900 mb-2">Worked example</p>
              <p>
                The text <strong className="text-stone-900">&quot;Hi!&quot;</strong> is the three bytes 72, 105, 33.
                Split into 6-bit groups and mapped through the alphabet, it becomes{" "}
                <strong className="text-stone-900">SGkh</strong>. And &quot;Hello, World! 👋&quot; encodes to{" "}
                <strong className="text-stone-900">SGVsbG8sIFdvcmxkISDwn5GL</strong> — the emoji works here because the
                text is converted to UTF-8 bytes first.
              </p>
            </div>
            <ul className="space-y-2.5">
              {[
                "Base64 is encoding, not encryption — never use it to protect secrets.",
                "Expect output ≈ 4/3 the input size; add line breaks every 76 chars for email (MIME).",
                "Use the URL-safe variant inside links, filenames and JWTs.",
                "A valid string's length is a multiple of 4, with '=' only at the very end.",
                "Data URIs (data:image/png;base64,…) embed small images directly in HTML and CSS.",
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
          <SectionHead eyebrow="FAQ" title="Base64 questions, answered" />
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
              ↑ Back to the tool
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
