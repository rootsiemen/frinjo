"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LOAN_PROGRAMS, dtiRatios, maxAdditionalDebtPayment, maxHousingPayment } from "@/lib/dti";
import { backEndVerdict } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

interface DebtRow {
  name: string;
  payment: string;
}

const DEFAULT_DEBTS: DebtRow[] = [
  { name: "Car loan", payment: "450" },
  { name: "Credit cards (minimums)", payment: "120" },
  { name: "Student loan", payment: "0" },
];

export default function DtiCalculator() {
  const [income, setIncome] = useState("6800");
  const [housing, setHousing] = useState("1950");
  const [debts, setDebts] = useState<DebtRow[]>(DEFAULT_DEBTS);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    [],
  );

  const totalDebts = debts.reduce((s, d) => s + num(d.payment), 0);
  const inc = num(income);
  const house = num(housing);
  const ratios = dtiRatios(inc, house, totalDebts);
  const verdict = backEndVerdict(ratios.backPct);
  const extra36 = maxAdditionalDebtPayment(inc, house, totalDebts, 36);
  const extra43 = maxAdditionalDebtPayment(inc, house, totalDebts, 43);

  const setDebt = (i: number, patch: Partial<DebtRow>) =>
    setDebts((ds) => ds.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  const addDebt = () => setDebts((ds) => [...ds, { name: "", payment: "" }]);
  const removeDebt = (i: number) => setDebts((ds) => ds.filter((_, j) => j !== i));

  const bar = (pct: number, cap: number, color: string) => (
    <div className="h-4 rounded-full bg-stone-100 overflow-hidden relative">
      <div className={`h-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
      <div className="absolute top-0 bottom-0 w-0.5 bg-stone-800" style={{ left: `${cap}%` }} title={`cap ${cap}%`} />
    </div>
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="dti-income">Gross monthly income ($)</label>
              <input id="dti-income" type="number" min="0" step="50" className={inputCls} value={income} onChange={(e) => setIncome(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Before taxes — {fmt.format(inc * 12)} a year at this rate.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="dti-housing">Monthly housing cost ($)</label>
              <input id="dti-housing" type="number" min="0" step="10" className={inputCls} value={housing} onChange={(e) => setHousing(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Rent, or mortgage principal + interest + tax + insurance + HOA.</p>
            </div>
          </div>

          <div className="mt-6">
            <span className={labelCls}>Monthly debt payments (not balances)</span>
            <div className="space-y-3">
              {debts.map((d, i) => (
                <div key={i} className="flex gap-3">
                  <input type="text" placeholder="Debt name" aria-label="Debt name"
                    className={`${inputCls} flex-1`} value={d.name}
                    onChange={(e) => setDebt(i, { name: e.target.value })} />
                  <input type="number" min="0" step="5" placeholder="$ / month" aria-label="Monthly payment"
                    className={`${inputCls} w-36`} value={d.payment}
                    onChange={(e) => setDebt(i, { payment: e.target.value })} />
                  <button type="button" onClick={() => removeDebt(i)} aria-label="Remove debt"
                    className="shrink-0 w-11 rounded-2xl border border-stone-300 bg-white text-stone-500 font-bold hover:border-red-300 hover:text-red-600 transition">
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDebt}
              className="mt-3 rounded-full px-4 py-2 font-bold text-sm bg-white border border-stone-300 text-stone-700 hover:border-orange-400 transition">
              + Add a debt
            </button>
            <p className="mt-3 text-xs text-stone-400">
              Groceries, utilities, insurance premiums and subscriptions are not debts for DTI —
              only payments that appear as obligations: loans, card minimums, child support, alimony.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-2 text-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Front-end (housing) ratio</p>
              <p className="mt-2 font-display text-5xl font-bold text-stone-900">{ratios.frontPct.toFixed(2)}%</p>
              <div className="mt-3">{bar(ratios.frontPct, 28, "bg-sky-500")}</div>
              <p className="mt-2 text-xs text-stone-400">Black mark: the classic 28% guideline</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Back-end (total debt) ratio</p>
              <p className="mt-2 font-display text-5xl font-bold text-stone-900">{ratios.backPct.toFixed(2)}%</p>
              <div className="mt-3">{bar(ratios.backPct, 36, "bg-orange-500")}</div>
              <p className="mt-2 text-xs text-stone-400">Black mark: the classic 36% guideline</p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6 text-center">
            <p className="font-display text-xl font-bold text-stone-900">{verdict.label}</p>
            <p className="mt-2 text-stone-600 leading-relaxed max-w-2xl mx-auto">{verdict.detail}</p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                  <th className="py-2 pr-3">Program</th>
                  <th className="py-2 pr-3">Guideline</th>
                  <th className="py-2 pr-3 text-right">Max housing payment for you</th>
                  <th className="py-2 text-right">Your housing</th>
                </tr>
              </thead>
              <tbody>
                {LOAN_PROGRAMS.map((p) => {
                  const maxHouse = maxHousingPayment(inc, totalDebts, p);
                  const fits = house <= maxHouse;
                  return (
                    <tr key={p.key} className="border-b border-stone-100 last:border-0">
                      <td className="py-3 pr-3 font-bold text-stone-800">{p.label}</td>
                      <td className="py-3 pr-3 text-stone-600">
                        {p.frontCapPct === null ? "—" : `${p.frontCapPct}%`} / {p.backCapPct}%
                      </td>
                      <td className="py-3 pr-3 text-right text-stone-600">{fmt.format(maxHouse)}</td>
                      <td className={`py-3 text-right font-bold ${fits ? "text-green-700" : "text-red-600"}`}>
                        {fits ? "Fits" : "Over"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Room for more debt at 36%</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(extra36)} / month</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Room for more debt at 43%</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(extra43)} / month</p>
            </div>
          </div>

          <p className="mt-8 text-center">
            <Link
              href={`/home-affordability-calculator?income=${Math.round(inc * 12)}&debts=${Math.round(totalDebts)}`}
              className="font-semibold text-orange-700 hover:text-orange-800">
              See the home price these numbers support →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
