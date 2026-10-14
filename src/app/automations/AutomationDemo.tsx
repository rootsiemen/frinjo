"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui";

type NodeState = "idle" | "running" | "done";

const NODES = [
  {
    icon: "globe",
    title: "Lead Capture",
    desc: "New lead arrives from your website, Facebook ad or WhatsApp — picked up instantly, 24/7.",
  },
  {
    icon: "star",
    title: "Lead Scoring",
    desc: "The system scores the lead automatically — hot, warm or cold — based on your rules.",
  },
  {
    icon: "chat",
    title: "Auto Follow-up",
    desc: "A personal follow-up message goes out in seconds on WhatsApp, SMS or email.",
  },
  {
    icon: "dashboard",
    title: "CRM Update",
    desc: "Lead details, score and conversation are logged in your CRM — no copy-paste.",
  },
  {
    icon: "bolt",
    title: "Team Alert",
    desc: "Hot leads ping your team immediately so nobody slips through the cracks.",
  },
];

const SAMPLE_LEADS = [
  { name: "Ahmed K.", source: "Website form", score: 92, tag: "Hot" },
  { name: "Fatima R.", source: "Facebook ad", score: 78, tag: "Warm" },
  { name: "Bilal S.", source: "WhatsApp", score: 95, tag: "Hot" },
];

const LOG_LINES = [
  "Lead captured from Website form",
  "Scoring lead… score 92/100 — HOT",
  "Follow-up sent via WhatsApp ✓",
  "CRM updated — pipeline: New Lead",
  "Team alert sent — respond within 5 min",
];

export default function AutomationDemo() {
  const [nodeStates, setNodeStates] = useState<NodeState[]>(NODES.map(() => "idle"));
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState(0);
  const [leadIdx, setLeadIdx] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const run = () => {
    if (running) return;
    clearTimers();
    setRunning(true);
    setNodeStates(NODES.map(() => "idle"));
    setLog([]);
    const lead = SAMPLE_LEADS[leadIdx % SAMPLE_LEADS.length];

    NODES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setNodeStates((prev) => prev.map((s, j) => (j === i ? "running" : j < i ? "done" : s)));
        }, 400 + i * 900)
      );
      timers.current.push(
        setTimeout(() => {
          setLog((prev) => [
            ...prev,
            i === 0
              ? `Lead captured from ${lead.source} — ${lead.name}`
              : i === 1
                ? `Scoring lead… ${lead.score}/100 — ${lead.tag.toUpperCase()}`
                : LOG_LINES[i],
          ]);
          setNodeStates((prev) => prev.map((s, j) => (j <= i ? "done" : s)));
        }, 400 + i * 900 + 700)
      );
    });

    timers.current.push(
      setTimeout(() => {
        setRunning(false);
        setRuns((r) => r + 1);
        setLeadIdx((v) => v + 1);
      }, 400 + NODES.length * 900 + 500)
    );
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 overflow-hidden">
      {/* Demo header */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center">
            <Icon name="bolt" className="w-5 h-5" />
          </span>
          <div>
            <p className="font-bold text-stone-900 text-sm sm:text-base">Lead Automation — Live Demo</p>
            <p className="text-xs text-stone-500">Watch a lead move through the full workflow</p>
          </div>
        </div>
        <button
          onClick={run}
          disabled={running}
          className={`shrink-0 inline-flex items-center gap-2 rounded-full font-bold text-sm px-5 py-2.5 transition ${
            running
              ? "bg-stone-200 text-stone-500 cursor-wait"
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/25"
          }`}
        >
          {running ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-stone-400 border-t-transparent animate-spin" />
              Running…
            </>
          ) : (
            <>
              <Icon name="bolt" className="w-4 h-4" />
              Run automation
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100 bg-stone-50/60">
        {[
          { v: String(127 + runs), l: "Leads processed" },
          { v: String(342 + runs * 3), l: "Follow-ups sent" },
          { v: `${6 + runs}h`, l: "Saved this week" },
        ].map((s) => (
          <div key={s.l} className="px-4 py-4 text-center">
            <p className="font-display text-2xl sm:text-3xl font-bold text-stone-900">{s.v}</p>
            <p className="text-[11px] sm:text-xs uppercase tracking-wider text-stone-500 mt-1">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Workflow nodes */}
      <div className="p-5 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-5">
          {NODES.map((n, i) => {
            const st = nodeStates[i];
            return (
              <div key={n.title} className="relative">
                <div
                  className={`rounded-2xl border-2 p-4 h-full transition-all duration-300 ${
                    st === "done"
                      ? "border-orange-400 bg-orange-50"
                      : st === "running"
                        ? "border-orange-600 bg-orange-100/60 shadow-lg shadow-orange-200 scale-[1.02]"
                        : "border-stone-200 bg-white"
                  }`}
                >
                  <span
                    className={`w-9 h-9 rounded-lg grid place-items-center mb-2.5 transition ${
                      st === "idle" ? "bg-stone-100 text-stone-500" : "bg-orange-600 text-white"
                    }`}
                  >
                    {st === "running" ? (
                      <span className="w-4 h-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                    ) : st === "done" ? (
                      <Icon name="check" className="w-4 h-4" />
                    ) : (
                      <Icon name={n.icon} className="w-4 h-4" />
                    )}
                  </span>
                  <p className="text-[11px] font-bold text-stone-400 mb-0.5">STEP {i + 1}</p>
                  <p className="font-bold text-stone-900 text-sm">{n.title}</p>
                </div>
                {i < NODES.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-[14px] -translate-y-1/2 text-stone-300 z-10">
                    <Icon name="arrow" className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-stone-500 leading-relaxed">
          {NODES[Math.max(0, nodeStates.findIndex((s) => s === "running"))]?.desc ??
            "Press “Run automation” to watch each step fire in order — exactly how it works for your business."}
        </p>

        {/* Activity log */}
        <div className="mt-5 rounded-2xl bg-stone-950 text-stone-200 p-5 min-h-[132px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">
            Activity log
          </p>
          {log.length === 0 ? (
            <p className="text-sm text-stone-500">Waiting for automation to run…</p>
          ) : (
            <ul className="space-y-1.5 text-sm font-mono">
              {log.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-orange-400 shrink-0">›</span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
