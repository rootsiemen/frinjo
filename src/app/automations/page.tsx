import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import AutomationDemo from "./AutomationDemo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Business Automation Services — n8n Workflows, AI Chatbots & CRM Integration",
  description:
    "Business automation services: n8n workflows, AI chatbots, GoHighLevel CRM integration, WhatsApp automation and reporting dashboards. Save 10+ hours every week — see a live demo.",
  keywords: [
    "business automation services",
    "n8n workflow automation",
    "AI chatbot integration",
    "GoHighLevel CRM integration",
    "WhatsApp business automation",
    "lead follow-up automation",
    "automated reporting dashboard",
  ],
  alternates: { canonical: "https://frinjo.me/automations" },
  openGraph: {
    title: "Business Automations That Save You Hours | WebStore Pro",
    description:
      "n8n workflows, AI chatbots, CRM integrations and WhatsApp automation — watch a live automation demo.",
    url: "https://frinjo.me/automations",
    type: "website",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is business automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Business automation connects your tools — website, WhatsApp, CRM, email — so repetitive tasks happen on their own. New lead arrives? It gets scored, followed up and logged automatically, without anyone lifting a finger.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need any technical knowledge to use automations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Everything is set up for you and runs in the background. You get a simple dashboard to see what's happening, and I handle all the technical setup and maintenance.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to set up an automation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most automations are live within 3–7 days. Simple WhatsApp auto-replies can be ready in 48 hours; bigger CRM integrations take up to two weeks.",
      },
    },
    {
      "@type": "Question",
      name: "Which tools do you work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "n8n for workflow automation, GoHighLevel for CRM, plus WhatsApp Business API, Meta/Facebook lead ads, Google Sheets, email platforms and custom dashboards.",
      },
    },
    {
      "@type": "Question",
      name: "Will automation work with my existing CRM or WhatsApp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Almost certainly yes. I integrate with GoHighLevel, HubSpot, spreadsheets and most CRMs, plus WhatsApp Business — your current tools stay, automation sits on top.",
      },
    },
    {
      "@type": "Question",
      name: "How much does business automation cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Automation projects start from $150 for a single workflow (e.g. WhatsApp auto-replies). Full setups with CRM integration and dashboards are quoted per project after a free consultation.",
      },
    },
  ],
};

const SERVICES = [
  {
    icon: "bolt",
    title: "n8n Workflow Automation",
    desc: "Custom workflows that connect your apps and kill repetitive work — form to CRM, lead to follow-up, order to invoice. Built on n8n, the automation platform agencies trust.",
  },
  {
    icon: "chat",
    title: "AI Chatbots",
    desc: "Smart chatbots on your website and WhatsApp that answer questions, qualify leads and book appointments — even at 3 AM. Powered by modern AI, trained on your business.",
  },
  {
    icon: "dashboard",
    title: "CRM Integration (GoHighLevel)",
    desc: "Your leads flow straight into GoHighLevel — pipelines, tags, tasks and follow-up sequences set up properly, so no lead ever goes cold again.",
  },
  {
    icon: "globe",
    title: "WhatsApp Automation",
    desc: "Instant replies, order updates, appointment reminders and broadcast campaigns on WhatsApp — the app your customers actually read.",
  },
  {
    icon: "search",
    title: "Lead Follow-up Sequences",
    desc: "Facebook lead ads connected to automatic follow-ups. New leads get contacted in seconds, not hours — when they're hottest.",
  },
  {
    icon: "card",
    title: "Reporting Dashboards",
    desc: "One live dashboard for leads, sales and marketing numbers. No more opening five tools every morning to figure out how business is doing.",
  },
];

const COMPLEX_SYSTEMS = [
  {
    icon: "chat",
    title: "AI Email Inbox Manager",
    desc: "Your inbox triages itself: every incoming email is read by AI, sorted by intent and urgency, answered or drafted, and logged — so nothing important sits unread and nothing routine eats your morning.",
    flow: ["Email arrives (Gmail / Outlook)", "AI triage: lead · support · urgent · spam", "Auto-reply or AI-drafted reply for review", "Contact & thread updated in CRM", "Slack / Telegram alert for urgent items"],
    tools: ["n8n", "Gmail / Outlook", "AI (GPT / Gemini)", "CRM", "Slack / Telegram"],
    saves: "Automates: inbox sorting, first replies, CRM logging and urgent-mail alerts.",
  },
  {
    icon: "search",
    title: "Cold Outreach Machine",
    desc: "A full outreach pipeline in one workflow: a lead list goes in, and personalised, followed-up, CRM-synced email sequences come out — with replies detected automatically so follow-ups only go to people who haven't answered.",
    flow: ["Lead list import (CSV / Sheets / CRM)", "Data enrichment (company, role, website)", "AI-personalised email sequence", "Reply detection on every inbox", "Auto follow-up only for non-repliers", "Pipeline & replies synced to CRM"],
    tools: ["n8n", "Google Sheets", "AI (GPT / Gemini)", "Email / SMTP", "CRM"],
    saves: "Automates: enrichment, personalisation, sending schedules, reply tracking and follow-ups.",
  },
  {
    icon: "globe",
    title: "WhatsApp AI Sales Bot",
    desc: "A WhatsApp number that sells and supports on its own: the AI understands what the customer wants, answers from your business data, books and takes payment links — and hands over to a human the moment a conversation needs one.",
    flow: ["Customer messages on WhatsApp", "AI intent routing: sales · support · booking", "Answers, booking or payment link sent", "Order / booking logged to CRM or Sheets", "Human handoff with full chat context"],
    tools: ["WhatsApp Business API", "n8n", "AI (GPT / Gemini)", "CRM", "Payment links"],
    saves: "Automates: first response, common sales & support answers, bookings and payment collection.",
  },
  {
    icon: "cart",
    title: "Telegram E-Commerce Store Bot",
    desc: "A complete shop inside Telegram: customers browse a menu, fill a cart, get an invoice, pay, track their order and leave reviews — while an AI agent answers product questions. Google Sheets acts as the menu and order database, so the owner edits products in a spreadsheet, not a codebase.",
    flow: ["Customer opens the Telegram bot", "Menu & cart from Google Sheets catalogue", "Invoice generated & payment taken", "Order saved + tracking updates in chat", "Review requested after delivery", "AI agent answers product questions anytime"],
    tools: ["Telegram Bot API", "n8n", "Google Sheets", "AI agent (Gemini-style)", "Payments"],
    saves: "Automates: ordering, invoicing, order tracking, review collection and product Q&A.",
  },
  {
    icon: "dashboard",
    title: "AI Lead Enrichment & Research Agent",
    desc: "Give it a seed list or a keyword and the agent researches each lead on the web, enriches the record, scores it against your ideal customer, and delivers a clean, ready-to-use report — with memory, branching and error handling built in, so long research runs finish reliably instead of dying halfway.",
    flow: ["Seed list or keyword in", "AI agent researches the web per lead", "Enrichment: company, role, contact, signals", "Lead scoring against your criteria", "Clean report delivered to Sheets / CRM", "Memory + error handling across long runs"],
    tools: ["n8n", "AI agent + memory", "Web research APIs", "Google Sheets", "CRM"],
    saves: "Automates: lead research, data cleaning, scoring and report building.",
  },
];

const STEPS = [
  {
    t: "We map your bottlenecks",
    d: "A free 20-minute call. You tell me what eats your team's time — I spot what can be automated and what it'll save you.",
  },
  {
    t: "I design the workflow",
    d: "You get a clear visual plan: triggers, steps, tools involved and the exact outcome. No jargon, no surprises.",
  },
  {
    t: "I build & test it",
    d: "The automation is built, connected to your real tools and tested end-to-end with sample data before anything goes live.",
  },
  {
    t: "It runs, you watch",
    d: "Goes live with a dashboard so you can see every run. I monitor the first week and fix anything — free.",
  },
];

const USE_CASES = [
  {
    tag: "Real Estate",
    title: "Agency stopped losing hot leads",
    desc: "Every property inquiry now gets an instant WhatsApp reply with listings, and hot buyers alert the agent immediately.",
    stat: "15 hrs",
    statLabel: "saved per week",
  },
  {
    tag: "E-commerce",
    title: "Abandoned carts recover themselves",
    desc: "Shoppers who leave items in their cart get automatic WhatsApp reminders with their cart link — no staff needed.",
    stat: "23%",
    statLabel: "carts recovered",
  },
  {
    tag: "Clinic",
    title: "No-shows dropped sharply",
    desc: "Patients get automatic appointment reminders 24h and 2h before. Rescheduling happens over WhatsApp, not phone calls.",
    stat: "60%",
    statLabel: "fewer no-shows",
  },
  {
    tag: "Marketing Agency",
    title: "Client reporting on autopilot",
    desc: "Weekly performance reports pull from ad platforms automatically and land in the client's inbox every Monday.",
    stat: "8 hrs",
    statLabel: "saved per client/mo",
  },
];

const FAQS: [string, string][] = [
  [
    "What is business automation?",
    "Business automation connects your tools — website, WhatsApp, CRM, email — so repetitive tasks happen on their own. A new lead arrives? It gets scored, followed up and logged automatically, without anyone lifting a finger.",
  ],
  [
    "Do I need any technical knowledge?",
    "No. Everything is set up for you and runs in the background. You get a simple dashboard to see what's happening, and I handle all setup and maintenance.",
  ],
  [
    "How long does setup take?",
    "Most automations go live in 3–7 days. Simple WhatsApp auto-replies can be ready in 48 hours; full CRM integrations take up to two weeks.",
  ],
  [
    "Which tools do you work with?",
    "n8n for workflows, GoHighLevel for CRM, WhatsApp Business API, Meta/Facebook lead ads, Google Sheets, email platforms and custom dashboards.",
  ],
  [
    "Will it work with my existing tools?",
    "Almost certainly yes. I integrate with GoHighLevel, HubSpot, spreadsheets and most CRMs, plus WhatsApp Business — your current tools stay, automation sits on top.",
  ],
  [
    "How much does it cost?",
    "Automation projects start from $150 for a single workflow. Full setups with CRM integration and dashboards are quoted per project after a free consultation.",
  ],
];

export default function AutomationsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section className="bg-orange-50 dot-grid py-16 sm:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700 mb-4">
            Business Automations
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-stone-900 leading-tight max-w-3xl">
            Automations that save you <span className="text-gold-gradient">hours every week</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl leading-relaxed">
            I connect your website, WhatsApp, CRM and ads into workflows that run themselves —
            follow-ups, reminders, reports and lead handling, done automatically while you focus on customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className={btnPrimary}>
              Get a Free Automation Audit <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="#live-demo" className={btnOutline}>
              Watch it work <Icon name="bolt" className="w-5 h-5" />
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
            {["No technical skills needed", "Live in days, not months", "Works with your current tools"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Icon name="check" className="w-4 h-4 text-orange-600" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="live-demo" className="py-16 sm:py-20 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead
            eyebrow="Live demo"
            title="See an automation run, right now"
            sub="This is a real lead-handling workflow: capture, score, follow up, log, alert — in under 6 seconds. Press the button."
          />
          <AutomationDemo />
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="What I automate"
            title="Six ways automation pays for itself"
            sub="Pick one workflow or automate the whole business — every project starts with a free audit."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition group"
              >
                <span className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center mb-5 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Icon name={s.icon} className="w-7 h-7" />
                </span>
                <p className="font-display font-bold text-stone-300 text-lg mb-1">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-xl font-bold text-stone-900 mb-3">{s.title}</h3>
                <p className="text-stone-600 leading-relaxed text-[15px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPLEX AUTOMATION SYSTEMS */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Advanced n8n workflows"
            title="Complex Automation Systems"
            sub="Multi-step, AI-powered systems — not single zaps. Each one chains triggers, AI decisions, your business tools and human handoff into one workflow that runs end to end."
          />
          <div className="space-y-6">
            {COMPLEX_SYSTEMS.map((s, i) => (
              <div
                key={s.title}
                className="rounded-3xl border border-stone-200 bg-stone-50/60 p-8 hover:shadow-xl hover:border-orange-200 transition"
              >
                <div className="flex flex-wrap items-start gap-5">
                  <span className="w-14 h-14 shrink-0 rounded-2xl bg-orange-100 text-orange-800 grid place-items-center">
                    <Icon name={s.icon} className="w-7 h-7" />
                  </span>
                  <div className="flex-1 min-w-[240px]">
                    <p className="font-display font-bold text-stone-300 text-lg">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">{s.title}</h3>
                    <p className="text-stone-600 leading-relaxed max-w-3xl">{s.desc}</p>
                  </div>
                </div>
                {/* Flow chain */}
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {s.flow.map((step, j) => (
                    <span key={step} className="inline-flex items-center gap-2">
                      <span className="rounded-full bg-white border border-orange-200 px-3.5 py-1.5 text-[13px] font-semibold text-stone-800">
                        {step}
                      </span>
                      {j < s.flow.length - 1 && <Icon name="arrow" className="w-4 h-4 text-orange-400" />}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {s.tools.map((t) => (
                    <span key={t} className="rounded-full bg-orange-600/10 border border-orange-200 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-orange-800">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-semibold text-stone-700">{s.saves}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className={btnPrimary}>
              Discuss a complex workflow <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="How it works" title="From bottleneck to autopilot in 4 steps" />
          <div className="grid gap-5 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <div key={s.t} className="relative rounded-2xl border border-stone-200 p-7 bg-white hover:border-orange-300 transition">
                <span className="w-11 h-11 rounded-full bg-orange-600 text-white font-display font-bold grid place-items-center mb-4 text-lg">
                  {i + 1}
                </span>
                <h3 className="font-bold text-stone-900 mb-2">{s.t}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{s.d}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 text-orange-300">
                    <Icon name="arrow" className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">Real results</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Businesses already running on autopilot</h2>
            <p className="mt-4 text-stone-400">Typical outcomes from automation projects like these.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {USE_CASES.map((u) => (
              <div key={u.title} className="rounded-3xl border border-stone-800 bg-stone-900 p-8 hover:border-orange-700 transition">
                <span className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] text-orange-400 border border-orange-900 rounded-full px-3 py-1 mb-4">
                  {u.tag}
                </span>
                <h3 className="font-display text-2xl font-bold mb-3">{u.title}</h3>
                <p className="text-stone-400 leading-relaxed mb-6">{u.desc}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold text-orange-400">{u.stat}</span>
                  <span className="text-sm text-stone-500">{u.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER + CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Pricing"
            title="Start small, scale when it pays off"
            sub="Every project begins with a free automation audit — I'll tell you honestly what's worth automating and what isn't."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left mb-10">
            {[
              { n: "Single Workflow", p: "from $150", d: "One automation, e.g. WhatsApp auto-replies or lead notifications. Live in days." },
              { n: "Business Setup", p: "from $400", d: "Multiple workflows + CRM integration. Follow-ups, reminders, pipelines.", popular: true },
              { n: "Full Autopilot", p: "custom", d: "Complete automation suite: AI chatbot, dashboards, reporting, ongoing optimization." },
            ].map((t) => (
              <div
                key={t.n}
                className={`rounded-3xl p-8 border-2 bg-white ${t.popular ? "border-orange-500 shadow-xl shadow-orange-200/50" : "border-stone-200"}`}
              >
                {t.popular && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-stone-900">{t.n}</h3>
                <p className="font-display text-3xl font-bold text-orange-700 mt-2 mb-3">{t.p}</p>
                <p className="text-sm text-stone-600 leading-relaxed">{t.d}</p>
              </div>
            ))}
          </div>
          <Link href="/contact" className={btnPrimary}>
            Book My Free Automation Audit <Icon name="arrow" className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-stone-500">20 minutes, zero pressure — you'll leave with a clear automation plan either way.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Automation questions, answered" />
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
            <Link href="/contact" className={btnOutline}>
              Still have questions? Ask me <Icon name="arrow" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
