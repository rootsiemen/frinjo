"use client";

import { useState } from "react";
import { computeTip } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PRESETS = [10, 15, 18, 20, 22, 25];

export default function TipCalculator() {
  const [bill, setBill] = useState("86.40");
  const [tipPct, setTipPct] = useState(20);
  const [customTip, setCustomTip] = useState("");
  const [taxPct, setTaxPct] = useState("");
  const [people, setPeople] = useState("2");
  const [tipOnTax, setTipOnTax] = useState(false);
  const [roundUp, setRoundUp] = useState(false);

  const effectiveTip = customTip.trim() !== "" && Number.isFinite(Number(customTip)) ? Number(customTip) : tipPct;
  const r = computeTip({
    bill: Number(bill) || 0,
    tipPct: effectiveTip,
    taxPct: Number(taxPct) || 0,
    people: Number(people) || 1,
    tipOnTax,
    roundUpTotal: roundUp,
  });

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className={cardCls}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="tip-bill">Bill amount (before tax) $</label>
              <input id="tip-bill" type="number" step="any" min="0" className={inputCls} value={bill} onChange={(e) => setBill(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="tip-tax">Sales tax % (optional)</label>
              <input id="tip-tax" type="number" step="any" min="0" className={inputCls} value={taxPct} onChange={(e) => setTaxPct(e.target.value)} placeholder="e.g. 8.25" />
            </div>
          </div>

          <div className="mt-5">
            <span className={labelCls}>Tip %</span>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p} type="button"
                  onClick={() => { setTipPct(p); setCustomTip(""); }}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${effectiveTip === p && customTip === "" ? "bg-orange-600 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-700"}`}>
                  {p}%
                </button>
              ))}
              <input type="number" step="any" min="0" aria-label="Custom tip percent" placeholder="Custom %"
                className="w-28 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                value={customTip} onChange={(e) => setCustomTip(e.target.value)} />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="tip-people">Split between (people)</label>
              <input id="tip-people" type="number" min="1" max="50" className={inputCls} value={people} onChange={(e) => setPeople(e.target.value)} />
            </div>
            <label className="flex items-end gap-2 pb-3 text-sm font-semibold text-stone-700 cursor-pointer">
              <input type="checkbox" checked={tipOnTax} onChange={(e) => setTipOnTax(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              Tip on total incl. tax
            </label>
            <label className="flex items-end gap-2 pb-3 text-sm font-semibold text-stone-700 cursor-pointer">
              <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} className="h-4 w-4 accent-orange-600" />
              Round total up to whole $
            </label>
          </div>

          {r && (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Tip</p>
                <p className="mt-1 font-display text-3xl font-bold text-stone-900">{money(r.tipAmount)}</p>
                <p className="mt-1 text-xs text-stone-500">{r.effectiveTipPct}% of {money(r.tipBase)}{r.taxAmount > 0 && <> · tax {money(r.taxAmount)}</>}</p>
              </div>
              <div className="rounded-2xl bg-orange-600 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-100">Total to pay</p>
                <p className="mt-1 font-display text-3xl font-bold">{money(r.total)}</p>
                <p className="mt-1 text-xs text-orange-100">Bill + tax + tip</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Each person pays</p>
                <p className="mt-1 font-display text-3xl font-bold text-stone-900">{money(r.perPersonTotal)}</p>
                <p className="mt-1 text-xs text-stone-500">{money(r.perPersonShare)} share + {money(r.perPersonTip)} tip</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
