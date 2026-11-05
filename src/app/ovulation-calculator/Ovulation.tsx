"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const DAY = 86400000;

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * DAY);
}
function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
function parseDate(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}
function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export interface OvulationResult {
  ovulation: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  dueDate: Date;
  testDay: Date;
}

export function computeOvulation(lmp: Date, cycleLength: number): OvulationResult {
  const ovulation = addDays(lmp, cycleLength - 14);
  return {
    ovulation,
    fertileStart: addDays(ovulation, -5),
    fertileEnd: addDays(ovulation, 1),
    nextPeriod: addDays(lmp, cycleLength),
    dueDate: addDays(lmp, 280),
    testDay: addDays(lmp, cycleLength + 1),
  };
}

export default function Ovulation() {
  const [lmp, setLmp] = useState(todayStr());
  const [cycle, setCycle] = useState("28");

  const start = parseDate(lmp);
  const len = Number(cycle);
  const valid = start && Number.isFinite(len) && len >= 21 && len <= 40;
  const r = valid ? computeOvulation(start, len) : null;

  const rows: [string, Date | [Date, Date], string][] = r
    ? [
        ["Fertile window", [r.fertileStart, r.fertileEnd], "The days conception is possible — sperm survive up to ~5 days, the egg ~24 hours"],
        ["Ovulation day", r.ovulation, "The most likely release day; peak of the fertile window"],
        ["Next period expected", r.nextPeriod, "If it does not arrive, that is the first missed day"],
        ["Earliest sensible pregnancy test", r.testDay, "Testing from the day after the missed period avoids most false negatives"],
        ["Estimated due date (if conceived)", r.dueDate, "Standard 280 days (40 weeks) from the first day of the last period"],
      ]
    : [];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="ov-lmp">First day of your last period</label>
              <input id="ov-lmp" type="date" className={inputCls} value={lmp} onChange={(e) => setLmp(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ov-cycle">Average cycle length (days)</label>
              <input id="ov-cycle" type="number" min="21" max="40" className={inputCls} value={cycle} onChange={(e) => setCycle(e.target.value)} />
              <p className="mt-1.5 text-xs text-stone-400">Count from the first day of one period to the first day of the next. 28 is the textbook average; 21–35 is common. Not sure? Track 2–3 cycles — an average of your real cycles beats the textbook.</p>
            </div>
          </div>

          {r ? (
            <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
              {rows.map(([label, val, hint], i) => (
                <div key={label} className={`px-6 py-5 ${i % 2 ? "bg-stone-50" : ""}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-stone-900">{label}</span>
                    <span className="font-display text-lg sm:text-xl font-bold text-orange-700">
                      {Array.isArray(val) ? `${fmt(val[0])} — ${fmt(val[1])}` : fmt(val)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{hint}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Enter the first day of your last period and a cycle length between 21 and 40 days.
            </p>
          )}

          <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 px-5 py-4 text-sm text-rose-900 leading-relaxed">
            <strong>Read this honestly:</strong> calendar estimates assume a textbook cycle. The research is
            clear that the fertile window moves — in a well-known study (Wilcox et al., BMJ 2000) it fell
            entirely within days 6–21 in only about 30% of cycles, even in women with regular periods.
            Use this calculator to plan — with ovulation test kits or basal body temperature if timing
            really matters — and never as contraception. It is general information, not medical advice;
            for fertility treatment or irregular cycles, see your clinician.
          </div>
        </div>
      </div>
    </section>
  );
}
