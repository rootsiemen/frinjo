import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHead, Icon, btnPrimary } from "@/components/ui";
import CountdownTimer from "../CountdownTimer";
import { TIMER_PRESETS, presetBySlug } from "../presets";

export function generateStaticParams() {
  return TIMER_PRESETS.map((p) => ({ preset: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ preset: string }> }) {
  const { preset } = await params;
  const p = presetBySlug(preset);
  if (!p) return {};
  return {
    title: `${p.label} — Free Online Countdown Timer with Alarm`,
    description: `Free ${p.minutes}-minute countdown timer with an alarm. Already set to ${p.minutes} minutes — just press Start. Runs in the background tab, shows the time left in the tab title, and rings at zero. No sign-up.`,
    keywords: [
      `${p.minutes} minute timer`,
      p.slug.replace(/-/g, " "),
      "countdown timer",
      "online timer",
    ],
    alternates: { canonical: `https://frinjo.me/countdown-timer/${p.slug}` },
    openGraph: {
      title: `${p.label} | WebStore Pro`,
      description: `A ${p.minutes}-minute timer, already set — press Start. Alarm at zero, free.`,
      url: `https://frinjo.me/countdown-timer/${p.slug}`,
      type: "website",
    },
  };
}

export default async function PresetTimerPage({ params }: { params: Promise<{ preset: string }> }) {
  const { preset } = await params;
  const p = presetBySlug(preset);
  if (!p) notFound();

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: p.label,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: `https://frinjo.me/countdown-timer/${p.slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
    description: `A free ${p.minutes}-minute countdown timer with an alarm, pre-set to ${p.minutes} minutes. It tracks the target end time so it stays accurate in background tabs, shows the remaining time in the browser tab title, and signals completion with sound and a title change.`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
      { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
      { "@type": "ListItem", position: 3, name: "Countdown Timer", item: "https://frinjo.me/countdown-timer" },
      { "@type": "ListItem", position: 4, name: p.label, item: `https://frinjo.me/countdown-timer/${p.slug}` },
    ],
  };

  const others = TIMER_PRESETS.filter((x) => x.slug !== p.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · Already set to {p.minutes} minutes
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            {p.minutes} Minute <span className="text-gold-gradient">Timer</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">{p.use}</p>
          <p className="mt-3 text-stone-600">
            Press <strong>Start</strong> — the countdown runs in your tab title and the alarm rings at zero.
          </p>
        </div>
      </section>

      <CountdownTimer initialMinutes={p.minutes} />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="More timers"
            title="Need a different length?"
            sub="Every preset is its own page — or set any custom duration on the main countdown timer."
          />
          <div className="flex flex-wrap justify-center gap-2.5">
            {others.map((o) => (
              <Link key={o.slug} href={`/countdown-timer/${o.slug}`}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition">
                {o.label}
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/countdown-timer" className={btnPrimary}>
              Open the full Countdown Timer <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
