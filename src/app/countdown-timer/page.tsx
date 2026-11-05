import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import CountdownTimer from "./CountdownTimer";
import { TIMER_PRESETS } from "./presets";

export const metadata = {
  title: "Countdown Timer — Free Online Timer with Alarm (1–60 Minutes)",
  description:
    "Free online countdown timer with an alarm: set any duration or pick a preset — 1, 5, 10, 25 (Pomodoro) or 60 minutes. The countdown shows in the tab title, works in the background, and rings when time is up. No sign-up.",
  keywords: [
    "countdown timer",
    "online timer",
    "timer with alarm",
    "5 minute timer",
    "10 minute timer",
    "pomodoro timer",
    "minute timer",
  ],
  alternates: { canonical: "https://frinjo.me/countdown-timer" },
  openGraph: {
    title: "Countdown Timer — Free Online Timer with Alarm | WebStore Pro",
    description:
      "Set any countdown or tap a preset. Runs in the tab title, alarms at zero — free, no sign-up.",
    url: "https://frinjo.me/countdown-timer",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Countdown Timer",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/countdown-timer",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "A free online countdown timer with an audible alarm. It accepts any duration up to 999 minutes, offers one-tap preset pages (1, 2, 3, 5, 10, 15, 20, 25, 30, 45 and 60 minutes, including a 25-minute Pomodoro timer), keeps counting accurately in a background tab by tracking the target end time rather than counting ticks, displays the remaining time in the browser tab title, and signals completion with sound, vibration on supported phones and a title change. No account or download is required.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Free Tools", item: "https://frinjo.me/tools" },
    { "@type": "ListItem", position: 3, name: "Countdown Timer", item: "https://frinjo.me/countdown-timer" },
  ],
};

const FAQS: [string, string][] = [
  [
    "How do I set a countdown timer?",
    "Type the number of minutes and press Set & start — or tap one of the preset timers (1, 5, 10, 15, 20, 25, 30, 45 or 60 minutes) to open a page that is already set to that length. Press Start and the countdown begins; Pause and Resume work at any point, and Reset returns to the full duration.",
  ],
  [
    "Does the timer keep running if I switch tabs?",
    "Yes. The timer stores the exact end time and reads the clock against it, instead of counting screen refreshes — so it stays accurate in a background tab, and the remaining time is displayed in the tab title so you can check it without switching back. Browsers can throttle background tabs, but the end time itself never drifts.",
  ],
  [
    "What happens when the countdown reaches zero?",
    "You get three signals: an alarm sound (which you can switch off), a vibration on phones that support it, and the tab title changes to 'Time's up!'. The page also switches to a highlighted finished state, so a silent glance is enough.",
  ],
  [
    "Is there a Pomodoro timer?",
    "Yes — the 25-minute preset is one full Pomodoro focus block. A common rhythm is 25 minutes of single-task work, a 5-minute break (the 5-minute preset), repeated four times before a longer break.",
  ],
  [
    "What is the longest countdown I can set?",
    "999 minutes (about 16.6 hours). For multi-hour waits most people use the 60-minute preset repeatedly or set a custom duration — the timer only needs this tab to stay open, not active.",
  ],
  [
    "Is the Countdown Timer free?",
    "Yes, completely free with no sign-up and no download. It runs entirely in your browser.",
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

export default function CountdownTimerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Free · No sign-up · Works in background tabs
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Countdown <span className="text-gold-gradient">Timer</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Set It, Switch Tabs, Hear the Alarm
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Any duration up to 999 minutes, one-tap presets from{" "}
            <strong>1 minute to a full hour</strong>, a countdown that shows in your tab title, and an
            alarm that rings at zero. That is the whole job — done properly.
          </p>
        </div>
      </section>

      {/* TIMER */}
      <CountdownTimer initialMinutes={5} />

      {/* PRESETS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Presets"
            title="Every popular timer, one tap away"
            sub="Each preset is its own page, already set to that length — bookmark the ones you live by."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {TIMER_PRESETS.map((p) => (
              <Link key={p.slug} href={`/countdown-timer/${p.slug}`}
                className="rounded-3xl border border-stone-200 bg-white p-6 hover:shadow-xl hover:border-orange-200 transition group">
                <p className="font-display text-2xl font-bold text-stone-900 group-hover:text-orange-700 transition">
                  {p.label}
                </p>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">{p.use}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ACCURATE */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Built properly
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Why this timer doesn&apos;t drift
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Cheap web timers count screen ticks — and browsers deliberately slow background tabs down, so
            those timers finish late. This one stores the <strong className="text-white">exact end time</strong>{" "}
            when you press Start and reads the real clock against it on every check. Throttling can delay
            a repaint; it cannot move the deadline. The remaining time also mirrors into the{" "}
            <strong className="text-white">tab title</strong>, and at zero you get sound, vibration and a
            title change — three chances to notice.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            More free tools in the{" "}
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

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Countdown timer questions, answered" />
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
              Start a timer <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
