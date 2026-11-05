"use client";

import { useState } from "react";
import { H1B_ODDS, H1B_LEVELS, h1bNote, type WageLevel } from "./calc";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const segBtn = (active: boolean) =>
  `rounded-xl px-4 py-2.5 text-sm font-bold transition ${active ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`;

export default function H1bLotteryCalculator() {
  const [level, setLevel] = useState<WageLevel>("II");
  const [advancedDegree, setAdvancedDegree] = useState(true);

  const o = H1B_ODDS[level];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <label className={labelCls}>Prevailing wage level (OEWS)</label>
          <div className="flex flex-wrap gap-2">
            {H1B_LEVELS.map((l) => (
              <button key={l} className={segBtn(level === l)} onClick={() => setLevel(l)}>
                Level {l}
              </button>
            ))}
          </div>

          <label className={`${labelCls} mt-6`}>US advanced degree (master&apos;s or higher)?</label>
          <div className="flex gap-2">
            <button className={segBtn(advancedDegree)} onClick={() => setAdvancedDegree(true)}>Yes</button>
            <button className={segBtn(!advancedDegree)} onClick={() => setAdvancedDegree(false)}>No</button>
          </div>

          <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <p className="text-sm font-bold text-orange-700">Estimated selection chance</p>
            <p className="font-display text-4xl font-extrabold text-stone-900">~{o.chance}%</p>
            <p className="mt-1 text-xs text-stone-500">
              Level {level} = {o.entries} {o.entries === 1 ? "entry" : "entries"} in the selection pool
            </p>
          </div>

          <p className="mt-3 text-xs text-stone-500">{h1bNote(advancedDegree)}</p>
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-stone-900">FY2027 lottery — official stats</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["Registrations", "211,600"],
              ["Overall selection", "~40%"],
              ["Advanced degree selected", "71.5%"],
              ["Level I selected", "17.7%"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
                <p className="text-xs font-bold text-stone-500">{k}</p>
                <p className="text-xl font-extrabold text-stone-900">{v}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-stone-600 list-disc pl-5">
            <li>Registrations fell 38.5% vs FY2026 (343,981 → 211,600) after the weighted system discouraged low-wage filings.</li>
            <li>Cap: 85,000 (including 20,000 reserved for US master&apos;s+). No second lottery was held for FY2027.</li>
            <li>Next registration window: <strong>March 2027</strong> (FY2028 cap).</li>
          </ul>
          <p className="mt-4 text-xs text-stone-500">
            Estimate based on DHS FY2027 projections — actual odds vary by year and
            registration volume. General information only, not legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}
