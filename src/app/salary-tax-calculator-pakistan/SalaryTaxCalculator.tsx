"use client";

import { useMemo, useState } from "react";
import { PK_SLABS, pkTaxOn, pkSlabIndex, pkr } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-2xl font-bold text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export default function SalaryTaxCalculator() {
  const [monthly, setMonthly] = useState<string>("100000");

  const annual = useMemo(() => {
    const m = parseFloat(monthly.replace(/,/g, "")) || 0;
    return m * 12;
  }, [monthly]);

  const tax = useMemo(() => pkTaxOn(annual), [annual]);
  const monthlyTax = tax / 12;
  const takeHome = annual / 12 - monthlyTax;
  const eff = annual > 0 ? (tax / annual) * 100 : 0;
  const activeIdx = pkSlabIndex(annual);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <label className={labelCls}>Monthly gross salary (Rs)</label>
          <input
            type="text"
            inputMode="numeric"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className={inputCls}
            placeholder="100,000"
          />

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-4">
              <p className="text-xs font-bold text-orange-700">Annual tax</p>
              <p className="text-xl font-extrabold text-stone-900">{pkr(tax)}</p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="text-xs font-bold text-stone-500">Monthly tax</p>
              <p className="text-xl font-extrabold text-stone-900">{pkr(monthlyTax)}</p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="text-xs font-bold text-stone-500">Take-home / month</p>
              <p className="text-xl font-extrabold text-stone-900">{pkr(takeHome)}</p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="text-xs font-bold text-stone-500">Effective rate</p>
              <p className="text-xl font-extrabold text-stone-900">{eff.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-stone-900">2026-27 salaried slabs (FBR)</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200">
                  <th className="py-2 pr-4">Annual income</th>
                  <th className="py-2">Tax</th>
                </tr>
              </thead>
              <tbody>
                {PK_SLABS.map((s, i) => (
                  <tr
                    key={s.label}
                    className={`border-b border-stone-100 ${i === activeIdx && annual > 0 ? "bg-orange-50 font-semibold" : ""}`}
                  >
                    <td className="py-2 pr-4">{s.label}</td>
                    <td className="py-2">
                      {s.rate === 0
                        ? "0% (exempt)"
                        : `${pkr(s.base)} + ${Math.round(s.rate * 100)}% above Rs ${s.over.toLocaleString("en-PK")}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            The 9% surcharge on income above Rs 10 million has been abolished for
            2026-27. Estimate only — not official tax advice.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl font-bold text-stone-900">How the calculation works</h2>
          <p className="mt-2 text-stone-600 leading-relaxed">
            Pakistan taxes salaried income in progressive slabs — each rate
            applies only to the income inside that band. The fixed amounts (Rs
            6,000, Rs 116,000, etc.) are the cumulative tax on everything below
            the band. Your employer deducts this monthly from your payslip.
          </p>
        </div>
      </div>
    </section>
  );
}
