import Link from "next/link";
import { BRAND, PACKAGES } from "@/lib/content";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `About — ${BRAND.name}`,
  description: `About ${BRAND.name}: I build complete ecommerce websites and business websites for clients worldwide — mobile-friendly, with admin panels and ordering built in.`,
};

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
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-3">About</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">Websites that sell.</h1>
          <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-3xl">
            I'm Raza, a web developer behind {BRAND.name}. I build complete, mobile-friendly
            ecommerce websites and business sites for clients around the world — with product
            catalogs, shopping carts, Cash on Delivery, WhatsApp ordering, JazzCash/Easypaisa
            payments and easy admin panels, all included.
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
              <div key={v.title} className="rounded-3xl border border-stone-200 p-7 hover:shadow-xl hover:border-emerald-200 transition">
                <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center mb-4">
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
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center shrink-0">
                  <Icon name="check" className="w-4 h-4" />
                </span>
                <p className="font-semibold text-stone-800 text-sm">{f}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-emerald-950 text-white font-bold px-8 py-3.5 hover:bg-emerald-900 transition">
              Start Your Project <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Packages" title="Our packages" sub="Pick what fits — every package is a complete, working website." />
          <div className="grid gap-5 md:grid-cols-3">
            {PACKAGES.map((p) => {
              const pkgWaHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                `Hi, I'm interested in the ${p.name} package for my website. Please share pricing details.`
              )}`;
              return (
                <div key={p.name} className="rounded-3xl border border-stone-200 p-7 text-center hover:shadow-xl transition">
                  <h3 className="font-display text-xl font-bold text-stone-900">{p.name}</h3>
                  <p className="text-sm text-stone-500 mt-3">{p.delivery} · {p.pages}</p>
                  <a href={pkgWaHref} target="_blank" rel="noopener noreferrer" className="inline-block mt-5 rounded-full bg-green-600 text-white text-sm font-bold px-6 py-2.5 hover:bg-green-700 transition">
                    Contact for Pricing
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
