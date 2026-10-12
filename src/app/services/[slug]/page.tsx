import Link from "next/link";
import { notFound } from "next/navigation";
import { SERVICES, BRAND } from "@/lib/content";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const idx = SERVICES.indexOf(service);
  const prev = SERVICES[(idx - 1 + SERVICES.length) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  const others = SERVICES.filter((s) => s.slug !== slug).slice(0, 3);

  const waHref = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
    `Hi! I'm interested in your ${service.title} service.`
  )}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-emerald-50 dot-grid py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-600 transition mb-6"
          >
            ← All services
          </Link>
          <div className="flex items-start gap-5">
            <span className="w-16 h-16 rounded-2xl bg-amber-400 text-emerald-950 grid place-items-center shrink-0">
              <Icon name={service.icon} className="w-8 h-8" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700 mb-2">
                Service {String(idx + 1).padStart(2, "0")} of {String(SERVICES.length).padStart(2, "0")}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-900">
                {service.title}
              </h1>
            </div>
          </div>
          <p className="mt-6 text-lg text-stone-600 max-w-3xl leading-relaxed">
            {service.longDesc}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get This Service <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={btnOutline}
            >
              <Icon name="chat" className="w-5 h-5" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="What's included"
            title={`Everything in ${service.title}`}
            center={false}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.features.map((f, i) => (
              <div
                key={f}
                className="rounded-2xl border border-stone-200 p-6 hover:shadow-lg hover:border-emerald-200 transition"
              >
                <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-display font-bold grid place-items-center mb-3 text-sm">
                  {i + 1}
                </span>
                <p className="font-semibold text-stone-900 leading-relaxed">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best for */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead eyebrow="Perfect for" title="Is this right for you?" />
          <p className="text-lg text-stone-600 leading-relaxed -mt-6">{service.bestFor}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/pricing" className={btnPrimary}>
              See Packages <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-950 text-white font-bold px-7 py-3.5 hover:bg-emerald-900 transition"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Keep exploring" title="Other services" />
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="rounded-3xl border border-stone-200 p-7 hover:shadow-xl hover:border-emerald-200 transition group"
              >
                <span className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 grid place-items-center mb-4">
                  <Icon name={s.icon} className="w-6 h-6" />
                </span>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-800 transition">
                  {s.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-emerald-800">
                  Learn more <Icon name="arrow" className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
          <div className="flex justify-between mt-10 text-sm font-semibold">
            <Link href={`/services/${prev.slug}`} className="text-stone-500 hover:text-emerald-800 transition">
              ← {prev.title}
            </Link>
            <Link href={`/services/${next.slug}`} className="text-stone-500 hover:text-emerald-800 transition">
              {next.title} →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
