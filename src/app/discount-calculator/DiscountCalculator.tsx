"use client";

import { useState } from "react";
import { computeDiscount, percentOff, originalPrice } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (s: string) => {
  const v = Number(s);
  return s.trim() !== "" && Number.isFinite(v) ? v : null;
};

export default function DiscountCalculator() {
  const [price, setPrice] = useState("120");
  const [pct1, setPct1] = useState("25");
  const [pct2, setPct2] = useState("");
  const [tax, setTax] = useState("");

  const p = num(price);
  const r = p !== null ? computeDiscount(p, num(pct1) ?? 0, num(pct2) ?? 0, num(tax) ?? 0) : null;

  const [orig, setOrig] = useState("200");
  const [sale, setSale] = useState("150");
  const revPct = (() => {
    const o = num(orig), s = num(sale);
    return o !== null && s !== null ? percentOff(o, s) : null;
  })();

  const [finalP, setFinalP] = useState("90");
  const [knownPct, setKnownPct] = useState("25");
  const revOrig = (() => {
    const f = num(finalP), k = num(knownPct);
    return f !== null && k !== null ? originalPrice(f, k) : null;
  })();

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Sale price</p>
          <h3 className="mt-2 font-display text-xl font-bold text-stone-900">What you pay after the discount</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls} htmlFor="dc-price">Original price $</label>
              <input id="dc-price" type="number" step="any" min="0" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="dc-p1">Discount % off</label>
              <input id="dc-p1" type="number" step="any" min="0" max="100" className={inputCls} value={pct1} onChange={(e) => setPct1(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="dc-p2">Extra % off (stacked)</label>
              <input id="dc-p2" type="number" step="any" min="0" max="100" className={inputCls} value={pct2} onChange={(e) => setPct2(e.target.value)} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls} htmlFor="dc-tax">Sales tax % (after discount)</label>
              <input id="dc-tax" type="number" step="any" min="0" className={inputCls} value={tax} onChange={(e) => setTax(e.target.value)} placeholder="Optional" />
            </div>
          </div>
          {r && (
            <>
              <div className="mt-6 flex flex-wrap items-end gap-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">You pay</p>
                  <p className="font-display text-4xl font-bold text-stone-900">{money(r.finalPrice)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">You save</p>
                  <p className="font-display text-4xl font-bold text-green-700">{money(r.saved)}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Total % off</p>
                  <p className="font-display text-4xl font-bold text-stone-900">{r.effectivePct}%</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl border border-stone-200 bg-white p-4">
                {r.steps.map((s, i) => (
                  <div key={i} className="flex justify-between border-b border-stone-100 py-2 text-sm last:border-0">
                    <span className="text-stone-500">{s.label}</span>
                    <span className="font-mono font-bold text-stone-900">{money(s.price)}</span>
                  </div>
                ))}
              </div>
              {(num(pct2) ?? 0) > 0 && (
                <p className="mt-3 text-sm text-stone-500">
                  Note: stacked discounts multiply, they don&apos;t add — {pct1}% then {pct2}% off is {r.effectivePct}% off in total, not {(num(pct1) ?? 0) + (num(pct2) ?? 0)}%.
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className={cardCls}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Reverse · find the %</p>
            <h3 className="mt-2 font-display text-lg font-bold text-stone-900">Was $X, now $Y — how much % off?</h3>
            <div className="mt-4 grid gap-4 grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="dc-orig">Was $</label>
                <input id="dc-orig" type="number" step="any" className={inputCls} value={orig} onChange={(e) => setOrig(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="dc-sale">Now $</label>
                <input id="dc-sale" type="number" step="any" className={inputCls} value={sale} onChange={(e) => setSale(e.target.value)} />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-stone-900">
              {revPct !== null ? `${revPct}% off` : <span className="text-stone-300">—</span>}
            </p>
          </div>

          <div className={cardCls}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Reverse · find the original</p>
            <h3 className="mt-2 font-display text-lg font-bold text-stone-900">Paid $Y after Z% off — original price?</h3>
            <div className="mt-4 grid gap-4 grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="dc-final">You paid $</label>
                <input id="dc-final" type="number" step="any" className={inputCls} value={finalP} onChange={(e) => setFinalP(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="dc-known">Discount %</label>
                <input id="dc-known" type="number" step="any" className={inputCls} value={knownPct} onChange={(e) => setKnownPct(e.target.value)} />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-stone-900">
              {revOrig !== null ? money(revOrig) : <span className="text-stone-300">—</span>}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
