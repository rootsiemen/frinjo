import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import FakeName from "./FakeName";

export const metadata = {
  title: "Fake Name Generator — Full Fake Identities, Addresses & Emails",
  description:
    "Generate realistic fake names and complete test identities free: name, address, phone, email, username, password, birthday, job and company for the US, UK, Canada, Australia and Pakistan. Up to 100 at once, CSV/JSON export, no daily limit, generated privately in your browser.",
  keywords: ["fake name generator", "fake identity generator", "random name generator", "fake address generator", "fake person generator", "test data generator"],
  alternates: {
    canonical: "https://frinjo.me/fake-name-generator",
    languages: {
      en: "https://frinjo.me/fake-name-generator",
      es: "https://frinjo.me/es/generador-de-identidad-falsa",
      fr: "https://frinjo.me/fr/generateur-de-faux-nom",
    },
  },
  openGraph: {
    title: "Fake Name Generator — Full Identities for Testing | Frinjo",
    description:
      "Names plus matching address, phone, email, birthday and job — 5 countries, bulk export, no limits. By WebStore Pro.",
    url: "https://frinjo.me/fake-name-generator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Fake Name Generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fake-name-generator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Generates fictional identities for the United States, United Kingdom, Canada, Australia and Pakistan. Each full identity contains a culturally matched first and last name (SSA/Census-popular US pools, ONS-popular UK pools, dedicated Pakistani name pools), a street address in a real city with a correctly formatted postal code for that country (US ZIP, UK postcode, Canadian alternating postal code, Australian 4-digit, Pakistani 5-digit city ranges), a phone number in the national format with a region-matched area code, an email on one of WebStore Pro's own temporary-mail domains (abahi.tech, abahi.page, abahi.me — the domains of tempmaill.tech, whose inboxes can be opened on tempmaill.tech and auto-delete after one hour), a username, a 12-character cryptographically random password, a birthday between 1958 and 2005 with the computed current age, an occupation and a generated company name. Batch size 1-100 with no daily limit; randomness from crypto.getRandomValues; export to CSV, JSON or TXT; names-only modes (full, first or last) are also available. Nothing is transmitted or stored — generation happens entirely client-side. By design it never generates national ID numbers, SSNs or payment card numbers, and exports use example email domains so tests cannot reach real inboxes.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Fake Name Generator", item: "https://frinjo.me/fake-name-generator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Are the generated identities real people?",
    "No. Every identity is a random combination of common first names, surnames, streets and cities, so it does not correspond to any real person. A common name plus a real city can coincidentally resemble someone, which is exactly why the generated emails sit on disposable temp-mail domains whose inboxes are public and auto-delete within an hour, and no identity document numbers are ever generated.",
  ],
  [
    "Which countries are supported?",
    "Five, each with matched name pools, address formats, phone formats and postal codes: the United States, United Kingdom, Canada, Australia and Pakistan. Pakistani identities are a specialty most generators skip — local names, real city postal ranges (Karachi 74xxx, Lahore 54xxx, Faisalabad 38xxx) and the +92 3XX mobile format.",
  ],
  [
    "How many identities can I generate, and is there a limit?",
    "Up to 100 per click, as many clicks as you like — there is no daily limit and no sign-up, unlike popular generators that cap guests at 25 names a day. Export any batch as CSV, JSON or TXT for database seeding and test fixtures.",
  ],
  [
    "What can I use a fake identity for?",
    "Software and form testing, seeding development databases, design mockups and prototypes, documentation screenshots, classroom examples and creating fictional characters for writing. It must not be used to impersonate anyone, open real accounts, or submit false information to official systems — that is fraud.",
  ],
  [
    "Are the generated email addresses real inboxes?",
    "Yes — deliberately. Every email sits on one of our own Temp Mail domains (abahi.tech, abahi.page, abahi.me), so a verification code or test message sent to it really arrives: har identity card par Inbox button hai — email isi page par khul jati hai (ya tempmaill.tech par wohi address daal kar bhi parh sakte ho). Two cautions: those inboxes are public (anyone with the address can read them) and auto-delete after one hour, so never use a generated identity for anything private, financial or important.",
  ],
  [
    "Is anything stored or sent to a server?",
    "No. Generation runs entirely in your browser using the Web Crypto API (crypto.getRandomValues) — the same cryptographic randomness our Password Generator uses. Your generated identities never leave your device unless you download them yourself.",
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

export default function FakeNamePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free Tool · No daily limit · CSV / JSON export
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Fake Name <span className="text-gold-gradient">Generator</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Sirf naam nahi — <strong>poori test identity</strong>: name, address, phone, email, username, password, birthday,
            job aur company, 5 mulkon ke format me (US, UK, Canada, Australia, <strong>Pakistan bhi</strong>). Ek click me 100
            tak, koi daily limit nahi — form testing, database seeding aur design ke liye.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600">
            {["Full identity, not just names", "5 countries incl. Pakistan", "Up to 100 per batch", "No SSN / no card numbers — ever"].map((chip) => (
              <span key={chip} className="rounded-full bg-white border border-stone-200 px-4 py-2">{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <FakeName />

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="WebStore Pro"
            title="Test data chahiye — ya poori website?"
            sub="We build Full Stack websites and tools like this one for businesses and creators. Tell us what you are testing or launching."
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
            {" "}· More free tools: <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">all calculators &amp; tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Fake name questions, answered" />
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
              Generate identities <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
