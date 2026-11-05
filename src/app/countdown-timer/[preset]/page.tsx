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
    title: `${p.label} — Free Online Countdown Timer`,
    description: `Free ${p.minutes}-minute countdown timer with alarm — pre-set and ready: press Start. Accurate in background tabs, time left in the tab title, rings at zero.`,
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

  const FAQS: [string, string][] = [
    [
      `How do I set a ${p.minutes}-minute timer?`,
      `You do not have to — this page loads with ${p.minutes} minutes already on the clock. Press Start and the countdown begins immediately. There is nothing to type, no app to install and no account to create. If you need a different length, pick another preset below or set any custom duration on the main Countdown Timer.`,
    ],
    [
      `Does this ${p.minutes}-minute timer keep working in a background tab?`,
      `Yes. The timer counts down to a target end time instead of ticking off seconds, so switching tabs, minimising the window or working in another app does not make it drift or pause. The time left is written into the browser tab title, so you can check it at a glance, and the alarm sounds when it reaches zero.`,
    ],
    [
      `What is a ${p.minutes}-minute timer used for?`,
      `${p.use} A dedicated ${p.minutes}-minute page exists because this is one of the lengths people search for directly — landing here with the timer pre-set saves the setup step entirely.`,
    ],
    [
      `Is this ${p.minutes}-minute timer free?`,
      `Yes — completely free, with no sign-up. It runs entirely in your browser: nothing is uploaded, stored or tracked. You can leave it open, reuse it all day, or bookmark this page so the ${p.minutes}-minute timer is always one click away.`,
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title={`${p.minutes}-minute timer questions, answered`} />
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
        </div>
      </section>

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
