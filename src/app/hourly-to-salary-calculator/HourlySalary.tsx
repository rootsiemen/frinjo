"use client";

import { useState } from "react";
import Link from "next/link";
import { breakdown, money, POPULAR_RATES, rateSlug } from "./rates";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export default function HourlySalary({ initialRate = 25 }: { initialRate?: number }) {
  const [rate, setRate] = useState(String(initialRate));
  const [hours, setHours] = useState("40");
  const [weeks, setWeeks] = useState("52");
  const [salary, setSalary] = useState("52000");

  const num = (s: string) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isFinite(v) && v >= 0 ? v : null;
  };
  const r = num(rate), h = num(hours), wk = num(weeks);
  const b = r !== null && h !== null && h > 0 && wk !== null && wk > 0 ? breakdown(r, h, wk) : null;

  const sal = num(salary);
  const reverseHourly = sal !== null && h !== null && h > 0 && wk !== null && wk > 0 ? sal / (h * wk) : null;

  const rows: [string, number][] = b
    ? [
        ["Per day (8h day)", b.daily],
        ["Per week", b.weekly],
        ["Every two weeks", b.biweekly],
        ["Per month", b.monthly],
        ["Per year", b.annual],
      ]
    : [];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="hs-rate">Hourly rate $</label>
              <input id="hs-rate" type="number" step="any" min="0" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="hs-hours">Hours per week</label>
              <input id="hs-hours" type="number" step="any" min="1" max="168" className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="hs-weeks">Weeks per year</label>
              <input id="hs-weeks" type="number" step="any" min="1" max="52" className={inputCls} value={weeks} onChange={(e) => setWeeks(e.target.value)} />
              <p className="mt-1.5 text-xs text-stone-400">52 = no unpaid time off. 50 ≈ two unpaid weeks.</p>
            </div>
          </div>

          {b ? (
            <div className="mt-8">
              <p className="text-center text-stone-500">
                <strong className="text-stone-900">{money(b.hourly)}/hour</strong> at {hours} hrs/week × {weeks} weeks is
              </p>
              <p className="mt-2 text-center font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {money(b.annual)}<span className="text-orange-500 text-3xl sm:text-4xl"> / year</span>
              </p>
              <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                {rows.map(([label, val], i) => (
                  <div key={label} className={`flex items-center justify-between px-6 py-4 ${i % 2 ? "bg-stone-50" : ""}`}>
                    <span className="font-semibold text-stone-600">{label}</span>
                    <span className="font-display text-xl font-bold text-stone-900">{money(val)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                Gross pay before taxes and deductions — what a salary offer should be compared against.
                Monthly is annual ÷ 12; biweekly is the common US pay period (26 per year).
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Enter an hourly rate, hours per week and weeks per year.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Reverse: salary to hourly</h2>
          <div className="mt-5 max-w-sm">
            <label className={labelCls} htmlFor="hs-salary">Annual salary $</label>
            <input id="hs-salary" type="number" step="any" min="0" className={inputCls} value={salary} onChange={(e) => setSalary(e.target.value)} />
          </div>
          {reverseHourly !== null ? (
            <p className="mt-5 font-display text-4xl font-bold text-stone-900">
              = {money(reverseHourly)}<span className="text-orange-500 text-2xl"> / hour</span>
            </p>
          ) : (
            <p className="mt-5 text-stone-400">Enter a salary to see its hourly equivalent.</p>
          )}
          <p className="mt-2 text-sm text-stone-500">
            Uses the same hours/week and weeks/year as above — the honest comparison when a salaried job
            expects 50-hour weeks.
          </p>
        </div>

        <div>
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-4">
            Popular rates — full breakdowns
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {POPULAR_RATES.map((x) => (
              <Link key={x} href={`/hourly-to-salary-calculator/${rateSlug(x)}`}
                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition">
                ${x}/hour
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
