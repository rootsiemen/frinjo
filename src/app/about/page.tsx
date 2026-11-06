import Link from "next/link";
import { BRAND, PACKAGES } from "@/lib/content";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

const ABOUT_DESC =
  "Meet Raza, the full stack web developer behind WebStore Pro. I build complete websites and web apps for small businesses worldwide with Next.js & React — admin panels, online stores, payments and WhatsApp ordering, from $80.";

export const metadata = {
  title: "About Raza — Full Stack Web Developer for Small Businesses",
  description: ABOUT_DESC,
  alternates: { canonical: "https://frinjo.me/about" },
  openGraph: {
    title: "About Raza — Full Stack Web Developer | WebStore Pro",
    description: ABOUT_DESC,
    url: "https://frinjo.me/about",
    type: "profile",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "About Raza — full stack web developer behind WebStore Pro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Raza — Full Stack Web Developer | WebStore Pro",
    description: ABOUT_DESC,
    images: ["/og-default.jpg"],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://frinjo.me/about#raza",
  name: "Muhamad Raza Haider",
  alternateName: "Raza",
  jobTitle: "Full Stack Web Developer",
  url: "https://frinjo.me/about",
  email: "neilsonsmarry@gmail.com",
  worksFor: { "@id": "https://frinjo.me/#organization" },
  knowsAbout: [
    "Full stack web development",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "PostgreSQL",
    "Online stores and admin panels",
    "WhatsApp ordering and payment integration",
    "SEO",
  ],
  sameAs: [
    "https://github.com/rootsiemen",
    "https://rootsiemen.github.io/Portfolio/",
    "https://www.linkedin.com/in/mrazahaider1215/",
    "https://www.fiverr.com/s/r3Ev2K0",
    "https://www.instagram.com/yours.raza/",
    "https://x.com/irazamirza",
  ],
};

const STACK = [
  ["Next.js & React", "Modern, fast frontends and full stack apps — the same stack behind every site I ship."],
  ["TypeScript & Tailwind CSS", "Clean, typed code and responsive designs that look right on every screen size."],
  ["PostgreSQL, Turso & Prisma-style data layers", "Real databases behind your products, orders, listings and accounts — no spreadsheet hacks."],
  ["Payments & ordering", "Stripe, PayPal, JazzCash/Easypaisa, Cash on Delivery and one-tap WhatsApp ordering."],
  ["SEO built in", "Proper titles, descriptions, schema and sitemaps from day one — plus 100+ free tools I built and rank on this very site."],
  ["Open source", "I maintain Loophole, an open-source security scanner, and BotView, an AI-visibility auditor — both free on GitHub."],
];

const SELECTED_WORK = [
  ["Qomash Wears", "A complete clothing store with product catalog, customer accounts, cart, checkout and a full admin dashboard.", "https://qomashwears.store"],
  ["USA Attorneys", "A US attorney directory with 833 verified listings across all 50 states, search, filters and legal calculators.", "https://usaattorneys.company"],
  ["Hakio Leads", "A lead-search platform with thousands of business leads, credits, checkout and an admin panel.", "https://frinjo.me/portfolio"],
  ["Temp Mail", "A disposable email service with instant inboxes, built with Next.js and Cloudflare Workers.", "https://frinjo.me/portfolio"],
];

const VALUES = [
  { icon: "bolt", title: "Fast delivery", text: "Starter sites in 5 days, pro stores in 10. You get clear timelines and I stick to them." },
  { icon: "shield", title: "You own everything", text: "Domain, hosting and code are 100% yours. No lock-in, no monthly ransom — your business, your assets." },
  { icon: "chat", title: "Human support", text: "Talk directly with the person building your site on WhatsApp. No tickets, no bots, no waiting days." },
  { icon: "star", title: "Built to sell", text: "Every site is designed around one goal: turning your visitors into paying customers." },
];

export default function AboutPage() {
  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hi! I'd like to discuss a website project.")}`;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <section className="bg-orange-50 dot-grid py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-3">About</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">About Raza — the developer behind WebStore Pro.</h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-3xl">
            I'm Raza, a full stack web developer and the person behind {BRAND.name}. I build complete, mobile-friendly
            websites and web applications for small businesses around the world — with product
            catalogs, shopping carts, Cash on Delivery, WhatsApp ordering, JazzCash/Easypaisa
            payments and easy admin panels, all included.
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed max-w-3xl">
            {BRAND.name} is not an agency with account managers and hand-offs. When you message me, you talk directly
            to the developer who will design, build and launch your site. I work remote-first, serving clients
            worldwide with a US focus, and every project is quoted personally before we start — packages begin
            at $80, one-time, and you own the domain, hosting and code outright.
          </p>
          <p className="mt-4 text-stone-600 leading-relaxed max-w-3xl">
            Alongside client work, I build and maintain my own products: a US attorney directory with 833 listings,
            a leads platform, a disposable email service, and 100+ free online calculators and tools on this site —
            plus open-source tools like the Loophole security scanner. That same production experience goes into
            every client website I deliver.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/pricing" className={btnPrimary}>
              See Packages <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href={waHref} target="_blank" rel="noopener noreferrer" className={btnOutline}>
              <Icon name="chat" className="w-5 h-5" /> WhatsApp Me
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="How I work" title="Simple, honest, fast" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-3xl border border-stone-200 p-7 hover:shadow-xl hover:border-orange-200 transition">
                <span className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center mb-4">
                  <Icon name={v.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{v.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="My stack & skills" title="What I build with" sub="The tools and experience behind every project — no hand-offs, one developer end to end." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {STACK.map(([t, d]) => (
              <div key={t} className="rounded-3xl bg-white border border-stone-200 p-7 hover:shadow-xl hover:border-orange-200 transition">
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{t}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Selected work" title="Real projects, live on the web" sub="A few of the sites and platforms I have built and maintain — open them and see the work for yourself." />
          <div className="grid gap-5 sm:grid-cols-2">
            {SELECTED_WORK.map(([t, d, href]) => (
              <a key={t} href={href} target="_blank" rel="noopener noreferrer" className="rounded-3xl border border-stone-200 p-7 hover:shadow-xl hover:border-orange-200 transition block">
                <h3 className="font-display text-lg font-bold text-stone-900 mb-2">{t}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{d}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-orange-800">
                  Visit live site <Icon name="arrow" className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
          <p className="text-center mt-8 text-sm text-stone-500">
            More on my <a href="https://rootsiemen.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" className="text-orange-700 font-semibold underline">portfolio</a> and{" "}
            <a href="https://github.com/rootsiemen" target="_blank" rel="noopener noreferrer" className="text-orange-700 font-semibold underline">GitHub</a> — and the full{" "}
            <Link href="/portfolio" className="text-orange-700 font-semibold underline">WebStore Pro portfolio page</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead eyebrow="What you get" title="Every project includes" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Mobile-first responsive design",
              "Shopping cart & checkout / contact forms",
              "Cash on Delivery + WhatsApp ordering",
              "Admin panel to manage it yourself",
              "SEO basics & fast loading",
              "Launch support & walkthrough",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-2xl bg-white border border-stone-200 p-5">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 grid place-items-center shrink-0">
                  <Icon name="check" className="w-4 h-4" />
                </span>
                <p className="font-semibold text-stone-800 text-sm">{f}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-orange-950 text-white font-bold px-8 py-3.5 hover:bg-orange-900 transition">
              Start Your Project <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Packages" title="My packages" sub="Pick what fits — every package is a complete, working website, at one transparent one-time price." />
          <div className="grid gap-5 md:grid-cols-3">
            {PACKAGES.map((p) => {
              const pkgWaHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                `Hi, I'm interested in the ${p.name} package ($${p.price}) for my website.`
              )}`;
              return (
                <div key={p.name} className="rounded-3xl border border-stone-200 p-7 text-center hover:shadow-xl transition">
                  <h3 className="font-display text-xl font-bold text-stone-900">{p.name}</h3>
                  <p className="mt-3 font-display text-3xl font-bold text-stone-900">${p.price} <span className="text-sm font-normal text-stone-500">one-time</span></p>
                  <p className="text-sm text-stone-500 mt-2">{p.delivery} · {p.pages}</p>
                  <a href={pkgWaHref} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 rounded-full bg-green-600 text-white text-sm font-bold px-6 py-2.5 hover:bg-green-700 transition">
                    Get Started — ${p.price}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
