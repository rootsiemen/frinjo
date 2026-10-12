// Pricing cards shared by Home and Pricing pages.
import { PACKAGES, BRAND } from "@/lib/content";
import { Icon } from "@/components/ui";

export default function PricingCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3 items-stretch">
      {PACKAGES.map((p) => {
        const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
          `Hi, I'm interested in the ${p.name} package for my website. Please share pricing details.`
        )}`;
        return (
          <div
            key={p.name}
            className={`relative rounded-3xl p-8 flex flex-col transition hover:-translate-y-1 ${
              p.popular
                ? "bg-emerald-50 border border-emerald-200 text-stone-900 shadow-xl shadow-emerald-900/10 ring-2 ring-amber-400"
                : "bg-white border border-stone-200 shadow-sm"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 text-emerald-950 text-xs font-bold px-4 py-1.5 uppercase tracking-wider">
                ★ Most Popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold text-stone-900">{p.name}</h3>
            <p className="mt-1 text-sm text-stone-500">
              {p.pages} · {p.delivery}
            </p>
            <ul className="mt-6 space-y-3 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-stone-700">
                  <Icon name="check" className="w-5 h-5 shrink-0 text-emerald-600" />
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 text-center rounded-full font-bold py-3.5 transition w-full bg-green-600 text-white hover:bg-green-700"
            >
              Contact for Pricing
            </a>
          </div>
        );
      })}
    </div>
  );
}
