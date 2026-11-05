"use client";

import { useMemo, useState } from "react";
import { computeZakat, DEFAULT_GOLD_TOLA, DEFAULT_SILVER_TOLA } from "./calc";
import { pkr } from "../salary-tax-calculator-pakistan/calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

export default function ZakatCalculator() {
  const [cash, setCash] = useState("500000");
  const [goldTola, setGoldTola] = useState("2");
  const [silverTola, setSilverTola] = useState("0");
  const [assets, setAssets] = useState("0");
  const [debts, setDebts] = useState("0");
  const [goldRate, setGoldRate] = useState(String(DEFAULT_GOLD_TOLA));
  const [silverRate, setSilverRate] = useState(String(DEFAULT_SILVER_TOLA));

  const r = useMemo(
    () =>
      computeZakat({
        cash: num(cash),
        goldTola: num(goldTola),
        silverTola: num(silverTola),
        assets: num(assets),
        debts: num(debts),
        goldRate: num(goldRate),
        silverRate: num(silverRate),
      }),
    [cash, goldTola, silverTola, assets, debts, goldRate, silverRate],
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelCls}>Cash in hand &amp; bank (Rs)</label>
              <input value={cash} onChange={(e) => setCash(e.target.value)} inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Gold owned (tola)</label>
              <input value={goldTola} onChange={(e) => setGoldTola(e.target.value)} inputMode="decimal" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Silver owned (tola)</label>
              <input value={silverTola} onChange={(e) => setSilverTola(e.target.value)} inputMode="decimal" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Investments / business stock (Rs)</label>
              <input value={assets} onChange={(e) => setAssets(e.target.value)} inputMode="numeric" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Debts you owe (Rs)</label>
              <input value={debts} onChange={(e) => setDebts(e.target.value)} inputMode="numeric" className={inputCls} />
            </div>
          </div>

          <div className="mt-6 border-t border-stone-200 pt-5">
            <p className="text-sm font-bold text-stone-800">Bullion rates used for nisab (editable)</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <label className={labelCls}>Gold per tola (Rs)</label>
                <input value={goldRate} onChange={(e) => setGoldRate(e.target.value)} inputMode="numeric" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Silver per tola (Rs)</label>
                <input value={silverRate} onChange={(e) => setSilverRate(e.target.value)} inputMode="numeric" className={inputCls} />
              </div>
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Nisab: lower of 7.5 tola gold ({pkr(r.nisabGold)}) and 52.5 tola silver ({pkr(r.nisabSilver)}) = <strong>{pkr(r.nisab)}</strong>
            </p>
          </div>

          <div className={`mt-6 rounded-2xl p-5 ${r.liable ? "bg-orange-50 border border-orange-100" : "bg-white border border-stone-200"}`}>
            <p className={`text-sm font-bold ${r.liable ? "text-orange-700" : "text-stone-500"}`}>
              {r.liable ? "Zakat due (2.5%)" : "No zakat due"}
            </p>
            <p className="font-display text-3xl font-extrabold text-stone-900">
              {r.liable ? pkr(r.zakat) : "—"}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              Net zakatable wealth: {pkr(Math.max(r.total, 0))} · Nisab: {pkr(r.nisab)}
              {!r.liable && r.total > 0 && " (below nisab)"}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-stone-500">
          Zakat is due when zakatable wealth held for one lunar year meets or
          exceeds nisab. Default bullion rates are the October 2026 Pakistan
          rates carried over from our Pakistan calculators — update them above
          if today&apos;s rate differs. This is a general estimate — consult a
          scholar for specific rulings.
        </p>
      </div>
    </section>
  );
}
