import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import SmmPanel from "./SmmPanel";

export const metadata = {
  title: "SMM Panel — Followers, Views & Likes",
  description:
    "SMM panel by WebStore Pro: Instagram, YouTube, TikTok and Facebook followers, views and likes at per-1,000 rates, with wallet and order tracking.",
  keywords: ["smm panel", "buy instagram followers", "buy youtube views", "buy tiktok followers", "smm panel pakistan", "cheapest smm panel", "social media panel"],
  alternates: { canonical: "https://frinjo.me/smm-panel" },
  openGraph: {
    title: "SMM Panel — Social Media Growth Services | WebStore Pro",
    description:
      "Followers, views, likes and subscribers for every major platform — wallet, live order status, transparent rates. By WebStore Pro.",
    url: "https://frinjo.me/smm-panel",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WebStore Pro SMM Panel",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/smm-panel",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "An SMM (social media marketing) reseller panel by WebStore Pro offering growth services across Instagram (followers, likes, views), YouTube (views, subscribers, likes), TikTok (followers, likes, views), Facebook (page followers, post likes), X/Twitter (followers), Telegram (channel members), Spotify (plays) and website traffic, priced transparently per 1,000 units with minimum and maximum quantities per service. Users register, add funds manually via Binance USDT, Payoneer, JazzCash or Easypaisa (receiving account Muhammadraza512512@gmail.com; JazzCash/Easypaisa 03360723375), place orders with a link and quantity, and track order status (Pending, In Progress, Completed, Cancelled with automatic refund on cancellation). The panel runs in manual fulfilment mode by default and supports connecting a third-party provider API (standard SMM API format) for automatic order forwarding. This demonstration build stores account and order data in the visitor's browser only.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "SMM Panel", item: "https://frinjo.me/smm-panel" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How does this SMM panel work?",
    "Create a free account, add funds using one of the payment methods (Binance USDT, Payoneer, JazzCash or Easypaisa), then place an order: choose a service, paste your profile or post link, enter the quantity, and the charge is deducted from your wallet at the published per-1,000 rate. You track every order in your dashboard as it moves from Pending to In Progress to Completed.",
  ],
  [
    "How do I add funds?",
    "Send the payment to the listed receiving details (Binance/Payoneer: Muhammadraza512512@gmail.com; JazzCash/Easypaisa: 03360723375) and submit the Add Funds request in your panel with the amount and transaction ID. An admin verifies and credits your balance. Minimum top-up is $1.",
  ],
  [
    "What are the prices based on?",
    "Every service shows a flat rate per 1,000 units, with a minimum and maximum quantity — the exact charge is shown before you confirm, calculated as rate × quantity ÷ 1,000. There are no hidden fees: if an order is cancelled, the charge is refunded to your wallet automatically.",
  ],
  [
    "How fast do orders start and complete?",
    "In manual mode, orders are processed in the order received, typically starting within a few hours. With a provider API connected, orders forward automatically and start within minutes. Delivery speed then depends on the service size — large orders are drip-fed for safety rather than delivered all at once.",
  ],
  [
    "Is it safe for my account?",
    "Use sensible quantities, keep your profile public while an order runs, and never order from several panels at the same time for the same link. Growth services are against some platforms' terms, so results and retention can vary — order gradually, especially on new accounts. We do not ask for your password, ever — anyone who does is not us.",
  ],
  [
    "Can I resell these services or get my own panel?",
    "Yes — this panel itself was built by WebStore Pro, and we build SMM panels and Full Stack web applications for clients. If you want your own branded panel with your provider API connected and your own profit margins, contact us for a quote.",
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

export default function SmmPanelPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            WebStore Pro · Wallet · Live order tracking
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            SMM <span className="text-gold-gradient">Panel</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Followers, Views, Likes &amp; Subscribers — Every Platform
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Ek hi panel se Instagram, YouTube, TikTok, Facebook, X aur Telegram ki growth services —
            shaffaf per-1,000 rates, wallet balance, aur har order ka live status. Funds Binance, Payoneer,
            JazzCash ya Easypaisa se add karo aur order lagao.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600">
            {["15 services", "7 platforms", "Auto-refund on cancel", "No password ever asked"].map((chip) => (
              <span key={chip} className="rounded-full bg-white border border-stone-200 px-4 py-2">{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <SmmPanel />

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Apna panel chahiye?"
            title="Want your own SMM panel like this one?"
            sub="WebStore Pro builds Full Stack web applications — SMM panels, dashboards and client portals — with your provider API connected and your own branding and profit margins."
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
            {" "}· Free tools bhi try karo: <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">all calculators &amp; tools</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="SMM panel questions, answered" />
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
              Open the panel <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
