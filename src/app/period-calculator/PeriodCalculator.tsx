"use client";

import { useMemo, useState } from "react";
import { forecastCycles, cycleDayInfo, formatISO } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

export default function PeriodCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [last, setLast] = useState(() => {
    const d = new Date(Date.now() - 20 * 86_400_000);
    return d.toISOString().slice(0, 10);
  });
  const [cycleLen, setCycleLen] = useState("28");
  const [periodLen, setPeriodLen] = useState("5");

  const cycles = useMemo(
    () => (last ? forecastCycles(last, Number(cycleLen) || 28, Number(periodLen) || 5, 3) : []),
    [last, cycleLen, periodLen],
  );
  const info = useMemo(
    () => (last ? cycleDayInfo(last, Number(cycleLen) || 28, Number(periodLen) || 5, today) : null),
    [last, cycleLen, periodLen, today],
  );
  const upcoming = cycles.find((c) => c.periodStart >= today) ?? cycles[cycles.length - 1];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <div className={cardCls}>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="pd-last">First day of your last period</label>
              <input id="pd-last" type="date" className={inputCls} value={last} onChange={(e) => setLast(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pd-cycle">Cycle length (days)</label>
              <input id="pd-cycle" type="number" min={20} max={45} className={inputCls} value={cycleLen} onChange={(e) => setCycleLen(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pd-len">Period length (days)</label>
              <input id="pd-len" type="number" min={1} max={10} className={inputCls} value={periodLen} onChange={(e) => setPeriodLen(e.target.value)} />
            </div>
          </div>

          {info && upcoming && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-orange-600 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-100">Next period expected</p>
                <p className="mt-1 font-display text-2xl font-bold">{formatISO(upcoming.periodStart)}</p>
                <p className="mt-1 text-xs text-orange-100">±2 days is normal: {upcoming.periodWindowNote}</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Today</p>
                <p className="mt-1 font-display text-2xl font-bold text-stone-900">Day {info.cycleDay} of your cycle</p>
                <p className="mt-1 text-xs text-stone-500">{info.phase} · next period in ~{info.daysUntilNextPeriod} days</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Fertile window (next cycle)</p>
                <p className="mt-1 font-display text-2xl font-bold text-stone-900">
                  {formatISO(upcoming.fertileStart).replace(/, \d{4}$/, "")} – {formatISO(upcoming.fertileEnd).replace(/, \d{4}$/, "")}
                </p>
                <p className="mt-1 text-xs text-stone-500">Estimated ovulation: {formatISO(upcoming.ovulation)}</p>
              </div>
            </div>
          )}
        </div>

        {cycles.length > 0 && (
          <div className={cardCls}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Forecast</p>
            <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Your next 3 cycles</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-200">
                    <th className="py-2 pr-4 font-semibold">Cycle</th>
                    <th className="py-2 pr-4 font-semibold">Period</th>
                    <th className="py-2 pr-4 font-semibold">Fertile window</th>
                    <th className="py-2 font-semibold">Ovulation</th>
                  </tr>
                </thead>
                <tbody>
                  {cycles.map((c) => (
                    <tr key={c.cycle} className="border-b border-stone-100 last:border-0">
                      <td className="py-2.5 pr-4 font-bold text-stone-800">{c.cycle}</td>
                      <td className="py-2.5 pr-4 text-stone-700">{formatISO(c.periodStart)} – {formatISO(c.periodEnd)}</td>
                      <td className="py-2.5 pr-4 text-stone-700">{formatISO(c.fertileStart)} – {formatISO(c.fertileEnd)}</td>
                      <td className="py-2.5 font-bold text-stone-900">{formatISO(c.ovulation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Estimates only — real cycles vary by a few days, and this calculator is not a contraception or medical tool.
              For pregnancy planning detail, see the Ovulation Calculator.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
