"use client";

import { useMemo, useState } from "react";
import { incomeTax, employeeNI, personalAllowance, gbp, TAX_YEAR, type Region } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const seg = (active: boolean) =>
  `flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`;

const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

export default function UkTakeHomeCalculator() {
  const [mode, setMode] = useState<"salary" | "hourly">("salary");
  const [salary, setSalary] = useState("50000");
  const [hourly, setHourly] = useState("35");
  const [hours, setHours] = useState("37.5");
  const [region, setRegion] = useState<Region>("ruk");

  const gross = useMemo(() => {
    if (mode === "salary") return num(salary);
    return num(hourly) * num(hours) * 52;
  }, [mode, salary, hourly, hours]);

  const r = useMemo(() => {
    const tax = incomeTax(gross, region);
    const ni = employeeNI(gross);
    const net = gross - tax - ni;
    return {
      pa: personalAllowance(gross),
      tax,
      ni,
      net,
      monthly: net / 12,
      weekly: net / 52,
      eff: gross > 0 ? ((tax + ni) / gross) * 100 : 0,
    };
  }, [gross, region]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <div className="flex gap-2">
            <button className={seg(mode === "salary")} onClick={() => setMode("salary")}>
              Annual salary
            </button>
            <button className={seg(mode === "hourly")} onClick={() => setMode("hourly")}>
              Hourly rate
            </button>
          </div>

          {mode === "salary" ? (
            <div className="mt-5">
              <label className={labelCls}>Gross annual salary (£)</label>
              <input value={salary} onChange={(e) => setSalary(e.target.value)} inputMode="numeric" className={inputCls} />
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Hourly rate (£)</label>
                <input value={hourly} onChange={(e) => setHourly(e.target.value)} inputMode="decimal" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hours per week</label>
                <input value={hours} onChange={(e) => setHours(e.target.value)} inputMode="decimal" className={inputCls} />
              </div>
            </div>
          )}

          <div className="mt-5">
            <label className={labelCls}>Tax region</label>
            <div className="flex gap-2">
              <button className={seg(region === "ruk")} onClick={() => setRegion("ruk")}>
                England / Wales / NI
              </button>
              <button className={seg(region === "scotland")} onClick={() => setRegion("scotland")}>
                Scotland
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
            <p className="text-sm font-bold text-orange-700">Take-home pay</p>
            <p className="font-display text-3xl font-extrabold text-stone-900">
              {gbp(r.net)} <span className="text-base font-semibold text-stone-500">/ year</span>
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {gbp(r.monthly)} / month · {gbp(r.weekly)} / week
            </p>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Gross pay", gbp(gross)],
                  ["Personal allowance", gbp(r.pa)],
                  ["Income tax", "− " + gbp(r.tax)],
                  ["Employee National Insurance", "− " + gbp(r.ni)],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-stone-100">
                    <td className="py-2 text-stone-600">{k}</td>
                    <td className="py-2 text-right font-semibold text-stone-900">{v}</td>
                  </tr>
                ))}
                <tr className="font-extrabold text-stone-900">
                  <td className="py-2">Net take-home</td>
                  <td className="py-2 text-right">{gbp(r.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Effective deduction rate: {r.eff.toFixed(1)}%. Assumes a standard 1257L
            tax code, no pension contributions, no student loan, under State Pension age.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-stone-900">How the maths works ({TAX_YEAR})</h2>
          <ul className="mt-3 space-y-2 text-stone-600 list-disc pl-5">
            <li>Income tax is progressive — each rate applies only to the slice of income in that band.</li>
            <li>Personal allowance £12,570 tapers by £1 for every £2 over £100,000 (gone at £125,140).</li>
            <li>Employee NI: 8% between £12,570 and £50,270, then 2% above.</li>
            <li>Scotland uses six bands (19%–48%) on the same £12,570 allowance.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
