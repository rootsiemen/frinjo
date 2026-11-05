"use client";

import { useMemo, useState } from "react";
import {
  incomeTax,
  employeeNI,
  employerNI,
  LEVY_RATE,
  gbp,
  TAX_YEAR,
  type Region,
} from "../uk-take-home-pay-calculator/calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const seg = (active: boolean) =>
  `flex-1 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`;

const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

export default function Ir35Calculator() {
  const [dayRate, setDayRate] = useState("500");
  const [daysWeek, setDaysWeek] = useState("5");
  const [weeks, setWeeks] = useState("46");
  const [region, setRegion] = useState<Region>("ruk");
  const [status, setStatus] = useState<"inside" | "outside">("inside");

  const r = useMemo(() => {
    const contract = num(dayRate) * num(daysWeek) * num(weeks);
    // Inside IR35 — deemed employment (Chapter 10 ITEPA / off-payroll rules)
    const erNI = employerNI(contract);
    const levy = Math.round(contract * LEVY_RATE); // may apply; labelled below
    const deemed = contract - erNI - levy;
    const tax = incomeTax(deemed, region);
    const ni = employeeNI(deemed);
    const takeHome = deemed - tax - ni;
    return {
      contract,
      erNI,
      levy,
      deemed,
      tax,
      ni,
      takeHome,
      retention: contract > 0 ? (takeHome / contract) * 100 : 0,
      effDay: num(daysWeek) * num(weeks) > 0 ? takeHome / (num(daysWeek) * num(weeks)) : 0,
    };
  }, [dayRate, daysWeek, weeks, region]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className={labelCls}>Day rate (£)</label>
              <input value={dayRate} onChange={(e) => setDayRate(e.target.value)} inputMode="decimal" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Days / week</label>
              <input value={daysWeek} onChange={(e) => setDaysWeek(e.target.value)} inputMode="decimal" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Weeks / year</label>
              <input value={weeks} onChange={(e) => setWeeks(e.target.value)} inputMode="decimal" className={inputCls} />
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Your IR35 status</label>
              <div className="flex gap-2">
                <button className={seg(status === "inside")} onClick={() => setStatus("inside")}>Inside IR35</button>
                <button className={seg(status === "outside")} onClick={() => setStatus("outside")}>Outside IR35</button>
              </div>
            </div>
            <div>
              <label className={labelCls}>Tax region</label>
              <div className="flex gap-2">
                <button className={seg(region === "ruk")} onClick={() => setRegion("ruk")}>England / Wales / NI</button>
                <button className={seg(region === "scotland")} onClick={() => setRegion("scotland")}>Scotland</button>
              </div>
            </div>
          </div>

          {status === "inside" ? (
            <>
              <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
                <p className="text-sm font-bold text-orange-700">Take-home (inside IR35)</p>
                <p className="font-display text-3xl font-extrabold text-stone-900">
                  {gbp(r.takeHome)} <span className="text-base font-semibold text-stone-500">/ year</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {r.retention.toFixed(1)}% of contract value · effective {gbp(r.effDay)} / day
                </p>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ["Contract value (assignment rate)", gbp(r.contract)],
                      ["Employer NI — 15% above £5,000 (from your rate)", "− " + gbp(r.erNI)],
                      ["Apprenticeship / skills levy — 0.5% (often applies)", "− " + gbp(r.levy)],
                      ["Deemed salary (taxable)", gbp(r.deemed)],
                      ["Income tax (PAYE)", "− " + gbp(r.tax)],
                      ["Employee NI (PAYE)", "− " + gbp(r.ni)],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-b border-stone-100">
                        <td className="py-2 text-stone-600">{k}</td>
                        <td className="py-2 text-right font-semibold text-stone-900">{v}</td>
                      </tr>
                    ))}
                    <tr className="font-extrabold text-stone-900">
                      <td className="py-2">Take-home pay</td>
                      <td className="py-2 text-right">{gbp(r.takeHome)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-stone-500">
                Deemed-employment model (off-payroll rules): the fee payer meets employer NI
                out of the assignment rate, then deducts PAYE tax and employee NI. You get no
                employment rights in return. Estimates only.
              </p>
            </>
          ) : (
            <>
              <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5">
                <p className="text-sm font-bold text-orange-700">Contract value (outside IR35)</p>
                <p className="font-display text-3xl font-extrabold text-stone-900">
                  {gbp(r.contract)} <span className="text-base font-semibold text-stone-500">/ year</span>
                </p>
                <p className="mt-1 text-sm text-stone-600">Paid gross to your limited company — no PAYE at source</p>
              </div>
              <div className="mt-4 text-stone-600 space-y-2 leading-relaxed">
                <p>
                  Outside IR35 the fee payer deducts nothing. Your limited company receives
                  the full {gbp(r.contract)} and you decide how to take it — typically a
                  small director&apos;s salary plus dividends after corporation tax, with
                  legitimate business expenses deductible.
                </p>
                <p>
                  As a rough illustration, industry calculators put take-home on a £100,000
                  contract at around <strong>£65,000–£68,000 outside IR35</strong> versus
                  roughly <strong>£56,000–£59,000 inside</strong> — the gap is mostly the
                  employer NI that comes out of your rate inside IR35. Your exact figure
                  depends on salary/dividend split, expenses and pension contributions.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-stone-900">Inside vs outside — the key difference</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200">
                  <th className="py-2 pr-4"></th>
                  <th className="py-2 pr-4">Inside IR35</th>
                  <th className="py-2">Outside IR35</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Who deducts tax", "Fee payer (agency/client)", "Your own company"],
                  ["Employer NI", "Comes out of YOUR rate", "Only on salary you pay yourself"],
                  ["Expenses", "Very limited", "Deductible against profit"],
                  ["Employment rights", "None", "None — but better tax efficiency"],
                ].map(([k, a, b]) => (
                  <tr key={k} className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-semibold text-stone-900">{k}</td>
                    <td className="py-2 pr-4 text-stone-600">{a}</td>
                    <td className="py-2 text-stone-600">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">Figures use the {TAX_YEAR} UK rates.</p>
        </div>
      </div>
    </section>
  );
}
