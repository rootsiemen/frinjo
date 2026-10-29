import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import IpTracker from "./IpTracker";

export const metadata = {
  title: "IP Address Tracker — What Is My IP? Free IP Location Lookup",
  description:
    "Free IP address tracker: see your own IP address, location, ISP and timezone instantly, run six live anonymity and leak checks (WebRTC, DNS, timezone, language), and track any IPv4 or IPv6 address to its approximate location on a map. No sign-up.",
  keywords: [
    "ip address tracker",
    "what is my ip",
    "ip location lookup",
    "track ip address",
    "ip geolocation",
    "webrtc leak test",
    "dns leak test",
    "anonymity checker",
  ],
  alternates: { canonical: "https://frinjo.me/ip-address-tracker" },
  openGraph: {
    title: "IP Address Tracker — What Is My IP? | WebStore Pro",
    description:
      "Your IP, location and ISP, an anonymity score from six live leak checks, and a tracker for any other IP address — free, no sign-up.",
    url: "https://frinjo.me/ip-address-tracker",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IP Address Tracker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/ip-address-tracker",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Free IP address tracker. Detects the visitor's own IP address with its city, region, country, ISP, ASN, postal code, timezone and live local time, scores the connection's anonymity from six live checks (WebRTC leak, DNS resolver leak, timezone match, language match, Do Not Track, JavaScript), shows what the browser and device reveal, and looks up any other public IPv4 or IPv6 address with a map pin. Checks that cannot run are reported as N/A and excluded from the score.",
};

const FAQS: [string, string][] = [
  [
    "What is my IP address?",
    "It is the address at the top of this page — detected live when the page loaded. That is the public IP address every website you visit can see, along with the approximate location and internet provider attached to it.",
  ],
  [
    "How accurate is an IP location?",
    "Usually accurate to the city or region, not to a street address. IP geolocation databases map address ranges to the provider's network locations, so treat the pin as approximate — it shows the area your provider routes that address through.",
  ],
  [
    "Can I track someone else's IP address?",
    "You can look up any public IP address — its country, city area, provider and network. An IP address alone does not reveal a person's name, home address or phone number; only their internet provider holds that, and it is not public data.",
  ],
  [
    "What does the anonymity score measure?",
    "Six live checks on your own connection: whether WebRTC leaks a different address than the one sites see, whether your DNS resolver sits in a different country than your IP, whether your browser timezone and language match your IP's country, whether Do Not Track is on, and that JavaScript is running. Each check that finishes moves the score; checks that cannot run are marked N/A and left out — the score is never padded.",
  ],
  [
    "What is a DNS or WebRTC leak?",
    "A leak is when part of your traffic bypasses the protection you set up. If you use a VPN but your DNS requests still go to a resolver in your real country, sites and providers can infer where you really are — that is a DNS leak. WebRTC can similarly expose your real IP address to any website, even while a VPN is on.",
  ],
  [
    "Is the IP Address Tracker free?",
    "Yes — completely free, with no sign-up. Lookups run live from your browser against free geolocation services (ipwho.is, with ipapi.co and freeipapi.com as fallbacks), and nothing you type is stored.",
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

export default function IpTrackerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Live data
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            IP Address <span className="text-gold-gradient">Tracker</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            What Is My IP? Find Out — and Track Any Other IP
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            See exactly what your connection reveals about you: your IP address, location, provider, and
            the leaks that give you away — scored by <strong>six live anonymity checks</strong> — then
            track any other IPv4 or IPv6 address the same way, with a map pin.
          </p>
        </div>
      </section>

      {/* TRACKER */}
      <IpTracker />

      {/* WHAT IS AN IP ADDRESS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="The basics"
            title="What is an IP address?"
            sub="Every device on the internet needs an address so data knows where to go. Yours is public — and it says more about you than most people realise."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Your public address</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">The number every website sees</h3>
              <p className="text-stone-600 leading-relaxed">
                When you open any website, your public IP address arrives with the request. It identifies
                your connection — usually your home or office router, or your mobile network — in one of
                two formats: IPv4 (like 8.8.8.8) or the longer IPv6 (like 2606:4700:4700::1111).
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Location &amp; provider</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Where it points, who issued it</h3>
              <p className="text-stone-600 leading-relaxed">
                Address ranges belong to internet providers, so an IP lookup can show the city area, the
                ISP or organisation behind the connection, its network number (ASN), postal area, timezone
                and currency. That is how streaming services, shops and banks guess where you are.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">Private vs public</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Some addresses never leave home</h3>
              <p className="text-stone-600 leading-relaxed">
                Addresses like 192.168.x.x or 10.x.x.x are private — they exist only inside your local
                network, so they have no public location to track. This tracker tells you honestly when an
                address is private instead of inventing a result for it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ANONYMITY CHECKS EXPLAINED */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            The anonymity score
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            What do the six checks actually mean?
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            A VPN or a careful setup can still leak. The score on this page is built from six live tests on
            the connection you are browsing from: a <strong className="text-white">WebRTC leak test</strong>,
            which asks your browser (via Google&apos;s STUN servers) which addresses it exposes and compares
            them with the IP websites see; a <strong className="text-white">DNS resolver check</strong>, which
            finds where your DNS requests are answered and warns when that country differs from your
            IP&apos;s; <strong className="text-white">timezone and language matches</strong>, because a browser
            set to one country while its IP sits in another is a classic fingerprint;{" "}
            <strong className="text-white">Do Not Track</strong>; and{" "}
            <strong className="text-white">JavaScript</strong>, which sites need but also use to measure your
            browser in detail.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">6</div>
              <p className="mt-2 text-stone-400 text-sm">
                Live checks behind the anonymity score — each one shows its own pass, warning or fail with
                the reason printed next to it.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">0</div>
              <p className="mt-2 text-stone-400 text-sm">
                Faked points. A check that cannot run is marked N/A and excluded from the score — it never
                silently counts as a pass.
              </p>
            </div>
            <div className="rounded-3xl border border-stone-800 bg-stone-900 p-8">
              <div className="font-display text-4xl font-bold text-orange-400">100%</div>
              <p className="mt-2 text-stone-400 text-sm">
                Of the lookups run in your own browser. Nothing you type into the tracker is stored on our
                servers or sent anywhere else.
              </p>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-stone-400">
            Checking a website instead of a connection? Run it through{" "}
            <Link href="/botview" className="font-semibold text-orange-400 hover:text-orange-300">
              BotView
            </Link>{" "}
            for SEO, AEO and AI-visibility scores — or browse the full{" "}
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
            title="Want a website that protects your visitors — and ranks?"
            sub="WebStore Pro builds fast, secure Full Stack websites with the privacy and SEO details handled properly from day one."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a Free SEO Audit <Icon name="arrow" className="w-5 h-5" />
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
          <SectionHead eyebrow="FAQ" title="IP tracker questions, answered" />
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
              Check your IP <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
