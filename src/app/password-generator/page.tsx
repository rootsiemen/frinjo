import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import PasswordGen from "./PasswordGen";

export const metadata = {
  title: "Password Generator — Strong Random Passwords (CSPRNG, Nothing Stored)",
  description:
    "Free password generator using your browser's cryptographic random source — no bias, nothing sent or stored. Choose length and character sets, exclude look-alike characters, and see the real entropy in bits. Unique passwords, generated locally.",
  keywords: [
    "password generator",
    "strong password generator",
    "random password generator",
    "secure password generator",
    "generate password",
  ],
  alternates: { canonical: "https://frinjo.me/password-generator" },
  openGraph: {
    title: "Password Generator — Cryptographically Random | WebStore Pro",
    description:
      "Strong passwords from a real CSPRNG, generated in your browser. Entropy shown in bits. Nothing stored, ever.",
    url: "https://frinjo.me/password-generator",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Password Generator",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/password-generator",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free strong password generator that runs entirely in the visitor's browser using the Web Crypto API (crypto.getRandomValues) with rejection sampling to avoid modulo bias. Options include length from 8 to 64 characters, lowercase, uppercase, digit and symbol sets, a no-ambiguous-characters mode that excludes look-alikes such as 0/O and 1/l/I, and a guaranteed character from each selected set. It displays the password's entropy in bits (length × log2 of charset size). Generated passwords are never transmitted or stored.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Password Generator", item: "https://frinjo.me/password-generator" },
  ],
};

const FAQS: [string, string][] = [
  [
    "What makes a password strong?",
    "Entropy — the number of guesses an attacker must try. Entropy grows with length (each character multiplies the possibilities) and with the size of the character set. A 20-character password drawn from letters, digits and symbols carries about 128 bits of entropy, which is beyond brute-force reach; a clever 8-character one has under 50 bits and falls to a GPU rig quickly. This generator shows the exact entropy of your settings.",
  ],
  [
    "Is it safe to generate passwords on a website?",
    "On this one, the password is created locally in your browser with the Web Crypto API and is never sent over the network or stored — the page would work the same offline once loaded. That is the property to demand of any generator: generation must be client-side with a cryptographic random source, not Math.random and not a server round-trip.",
  ],
  [
    "How long should my passwords be?",
    "At least 16 characters for important accounts (email, banking, password manager itself) — this generator's default of 20 with all character sets is a good standard. Shorter (12) is acceptable only for low-value accounts you could afford to lose.",
  ],
  [
    "Why exclude ambiguous characters?",
    "Characters like 0 and O, 1, l and I are easy to misread when you must type a password by hand (on a TV, a console, or from a printout) and cause pointless lockouts. Excluding them costs a little entropy per character, which the generator's bit counter accounts for honestly — make the password a couple of characters longer and you come out ahead.",
  ],
  [
    "Should I use a different password for every account?",
    "Yes — this is the single highest-value habit. Breaches are routine; a reused password turns one site's leak into access everywhere (credential stuffing). A password manager makes unique passwords effortless, and a generator like this one supplies them.",
  ],
  [
    "Is the Password Generator free?",
    "Yes, completely free with no sign-up. Nothing you generate is stored, sent, or logged.",
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

export default function PasswordGenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Real cryptographic randomness · Nothing stored
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Password <span className="text-gold-gradient">Generator</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Strong Passwords, Generated in Your Browser
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Real randomness from your browser&apos;s crypto engine — not a server, not a weak pseudo-random
            trick — with the <strong>actual entropy in bits</strong> printed next to every password, so
            &quot;strong&quot; is a number, not a promise.
          </p>
        </div>
      </section>

      <PasswordGen />

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
          <SectionHead eyebrow="FAQ" title="Password questions, answered" />
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
              Generate a password <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
