import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import QrGenerator from "./QrGenerator";

export const metadata = {
  title: "Free QR Code Generator — No Watermark, PNG & SVG",
  description:
    "Free QR code generator with no watermark: URL, text, WiFi, vCard, WhatsApp, email and phone. Download a 1024px PNG or an SVG. No sign-up.",
  keywords: [
    "QR code generator",
    "create QR code free",
    "WiFi QR code generator",
    "WhatsApp QR code",
    "vCard QR code",
    "QR code no watermark",
  ],
  alternates: {
    canonical: "https://frinjo.me/qr-code-generator",
    languages: {
      en: "https://frinjo.me/qr-code-generator",
      es: "https://frinjo.me/es/generador-de-codigos-qr",
      fr: "https://frinjo.me/fr/generateur-de-qr-code",
      "x-default": "https://frinjo.me/qr-code-generator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Free QR Code Generator — PNG & SVG, No Watermark | Frinjo",
    description:
      "Create QR codes for URLs, WiFi, vCard, WhatsApp, email and phone. Download a 1024px PNG or a vector SVG. Free, no sign-up, 100% in your browser.",
    url: "https://frinjo.me/qr-code-generator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "QR Code Generator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/qr-code-generator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free QR code generator that works entirely in the browser (qrcode library, local generation, no server). Types: URL (adds https:// when missing), free text, WiFi in the zxing standard format WIFI:T:WPA;S:ssid;P:password;; (WPA/WEP/open security and hidden networks), vCard 3.0 contact cards, wa.me WhatsApp links with a pre-filled message, mailto email with subject and body, and tel: phone calls. Custom code and background colours, instant preview and download as a 1024px PNG or vector SVG, with no watermark, no sign-up and no expiry: the QR is static and encodes the content directly.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "QR Code Generator", item: "https://frinjo.me/qr-code-generator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Does the QR code expire?",
    "No. This generator creates STATIC codes: the content (your URL, your WiFi network, your contact) is encoded directly in the squares of the QR, with no intermediary servers or redirects. As long as the content stays valid — your website online, your WiFi password unchanged — the code works forever. The codes that expire are the 'dynamic' ones from subscription services, which route through their server and switch off if you stop paying.",
  ],
  [
    "Can I use the QR for my business (menus, cards, shop windows)?",
    "Yes, with no restrictions and no watermark. Typical uses: a restaurant menu (QR to your menu page), a business card (a vCard that saves as a contact when scanned), shop WiFi (no more spelling out passwords), a shop window (QR to WhatsApp for enquiries) and parcels or invoices (QR to the order page). Download the SVG if you will print it large or send it to a print shop: it is vector and never loses quality.",
  ],
  [
    "What size and format should I download for printing?",
    "For small cards and flyers, the 1024px PNG is enough. For posters, vinyl or professional printing, download the SVG: it scales to any size without pixelating. When printing, always leave a white margin around the code (the 'quiet zone') and test the scan on the final material before printing in quantity: glossy paper and dark background colours are the two classic causes of failure.",
  ],
  [
    "Why won't my QR scan?",
    "Three main causes: (1) low contrast — a light code on a dark background or similar colours; this generator warns you, but the rule is a dark code on a light background; (2) content that is too long, which produces a very dense QR that is hard to read in small prints — shorten the URL if you can; (3) a printed size that is too small: a content-heavy QR needs at least 3–4 cm per side. Always test with two different phones before publishing.",
  ],
  [
    "What data of mine is stored when I create a QR?",
    "None. Generation happens 100% in your browser with a local library: the content (including your WiFi password or your phone number) is never sent to a server or logged. You can check by disconnecting from the internet: the generator keeps working.",
  ],
  [
    "How does the WiFi QR work exactly?",
    "It encodes the standard format that Android and iOS understand: WIFI:T:WPA;S:network-name;P:password;H:false;; When scanned, the phone offers to join the network without typing anything. If your network is open, choose 'No password'. Note: anyone who scans the code can see the password inside it, so only use it where you would give out the key anyway (your shop, your office, your home).",
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

export default function QrCodeGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No watermark · Never expires
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            QR Code <span className="text-gold-gradient">Generator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            URLs, WiFi, contacts, WhatsApp — in PNG or SVG
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Seven code types on a single page, with custom colours and download as a{" "}
            <strong>1024px PNG or a vector SVG</strong>. No sign-up, no watermark, and your data never
            leaves your browser.
          </p>
        </div>
      </section>

      <QrGenerator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="How it works"
            title="The types a business actually uses"
            sub="Each type encodes the standard format phones already understand: scan it and the action happens by itself."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">WiFi</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Guests connect without asking for the password</h3>
              <p className="text-stone-600 leading-relaxed">
                The QR stores the network and password in the standard format: scan it and the phone
                offers to join. Ideal for cafés, clinics, Airbnbs and offices.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">vCard</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Your card, saved as a contact</h3>
              <p className="text-stone-600 leading-relaxed">
                Name, company, phone, email and website in vCard 3.0 format: whoever scans it adds you to
                their address book with one tap — no typing, no paper to lose.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">WhatsApp</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">From the shop window straight to your chat</h3>
              <p className="text-stone-600 leading-relaxed">
                A wa.me link with your number and a message already written (&quot;Hi, I&apos;d like to know
                more about…&quot;): the customer just presses send. The favourite QR of local businesses.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">URL & text</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Menus, reviews, coupons, addresses</h3>
              <p className="text-stone-600 leading-relaxed">
                Any link or free text: your restaurant menu, your Google reviews page, a coupon or your
                shop&apos;s address. Shorter is better: less content = a QR that scans more easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            This tool in other languages
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Need the QR generator in French, with SEPA payments?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            The French version adds the <strong className="text-white">SEPA transfer QR</strong>: your
            customers scan it and their bank opens a payment already filled in with your IBAN. It is also
            available in Spanish, and for your test data the{" "}
            <strong className="text-white">fake name generator</strong> creates complete profiles.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/fr/generateur-de-qr-code" className="font-semibold text-orange-400 hover:text-orange-300">
              Générateur de QR code (FR)
            </Link>{" "}
            ·{" "}
            <Link href="/es/generador-de-codigos-qr" className="font-semibold text-orange-400 hover:text-orange-300">
              Generador de códigos QR (ES)
            </Link>{" "}
            ·{" "}
            <Link href="/fake-name-generator" className="font-semibold text-orange-400 hover:text-orange-300">
              Fake Name Generator
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Built for you"
            title="Want a tool like this on your own website?"
            sub="WebStore Pro builds fast Full Stack Web Development sites and custom calculators that rank: designed, coded and SEO-ready from day one."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a free quote <Icon name="arrow" className="w-5 h-5" />
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
          <SectionHead eyebrow="FAQ" title="QR code questions, answered" />
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
              Create my QR code <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
