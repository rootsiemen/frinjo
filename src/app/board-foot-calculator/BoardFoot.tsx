"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export function boardFeet(thicknessIn: number, widthIn: number, lengthIn: number): number {
  return (thicknessIn * widthIn * lengthIn) / 144;
}

const NOMINAL: [string, number, number][] = [
  ["1×2", 0.75, 1.5], ["1×3", 0.75, 2.5], ["1×4", 0.75, 3.5], ["1×6", 0.75, 5.5],
  ["1×8", 0.75, 7.25], ["1×10", 0.75, 9.25], ["1×12", 0.75, 11.25],
  ["2×2", 1.5, 1.5], ["2×3", 1.5, 2.5], ["2×4", 1.5, 3.5], ["2×6", 1.5, 5.5],
  ["2×8", 1.5, 7.25], ["2×10", 1.5, 9.25], ["2×12", 1.5, 11.25], ["4×4", 3.5, 3.5],
];

export default function BoardFoot() {
  const [thickness, setThickness] = useState("1");
  const [width, setWidth] = useState("6");
  const [lenFt, setLenFt] = useState("8");
  const [lenIn, setLenIn] = useState("0");
  const [qty, setQty] = useState("10");
  const [price, setPrice] = useState("");

  const num = (s: string) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isFinite(v) && v > 0 ? v : null;
  };
  const t = num(thickness), w = num(width), q = num(qty);
  const totalLenIn = (Number(lenFt) || 0) * 12 + (Number(lenIn) || 0);
  const perBoard = t && w && totalLenIn > 0 ? boardFeet(t, w, totalLenIn) : null;
  const totalBf = perBoard !== null && q ? perBoard * q : null;
  const p = Number(price);
  const cost = totalBf !== null && p > 0 ? totalBf * p : null;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls} htmlFor="bf-t">Thickness (in)</label>
              <input id="bf-t" type="number" step="any" className={inputCls} value={thickness} onChange={(e) => setThickness(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="bf-w">Width (in)</label>
              <input id="bf-w" type="number" step="any" className={inputCls} value={width} onChange={(e) => setWidth(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="bf-lf">Length</label>
              <div className="grid grid-cols-2 gap-2">
                <input id="bf-lf" type="number" step="any" className={inputCls} value={lenFt} onChange={(e) => setLenFt(e.target.value)} aria-label="Length feet" placeholder="ft" />
                <input type="number" step="any" className={inputCls} value={lenIn} onChange={(e) => setLenIn(e.target.value)} aria-label="Length inches" placeholder="in" />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="bf-q">Number of boards</label>
              <input id="bf-q" type="number" step="1" className={inputCls} value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          </div>
          <div className="mt-5 max-w-xs">
            <label className={labelCls} htmlFor="bf-price">Price per board foot $ (optional)</label>
            <input id="bf-price" type="number" step="any" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 6.50" />
          </div>

          {totalBf !== null ? (
            <div className="mt-8 text-center">
              <p className="font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {totalBf.toLocaleString("en-US", { maximumFractionDigits: 2 })}<span className="text-orange-500 text-3xl sm:text-4xl"> board ft</span>
              </p>
              <p className="mt-2 text-stone-500">
                {perBoard!.toFixed(3)} BF per board × {qty} boards
                {cost !== null && <> · <strong className="text-stone-900">≈ ${cost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> at ${p}/BF</>}
              </p>
              <p className="mt-3 text-xs text-stone-400">
                Formula: thickness (in) × width (in) × length (in) ÷ 144. One board foot = 144 cubic inches.
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Enter thickness, width, length and quantity.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Nominal vs actual lumber sizes</h2>
          <p className="mt-2 text-stone-600 leading-relaxed">
            Lumber is sold by its <strong>nominal</strong> size but milled smaller — a &quot;2×4&quot; really
            measures 1.5″ × 3.5″. Rough-sawn hardwood at a lumberyard is usually sold by actual size;
            softwood from a big-box store is nominal. Tap a size to fill in the actual dimensions so your
            board-foot count (and your bill) are honest:
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {NOMINAL.map(([label, at, aw]) => (
              <button key={label} type="button"
                onClick={() => { setThickness(String(at)); setWidth(String(aw)); }}
                className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition">
                {label} <span className="text-stone-400">→ {at}″×{aw}″</span>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Hardwood thickness is also sold in quarters: 4/4 = 1″ rough, 5/4 = 1.25″, 8/4 = 2″ — it surfaces
            thinner after planing (4/4 S2S ≈ 13/16″). Ask the yard which size their board-foot price assumes.
          </p>
        </div>
      </div>
    </section>
  );
}
