"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Typical bulk weights (lb per cubic yard) — mid-range published values; moisture varies. */
export const MULCH_TYPES: Record<string, { label: string; lbPerYard: number }> = {
  hardwood: { label: "Shredded hardwood bark", lbPerYard: 450 },
  pinebark: { label: "Pine bark nuggets", lbPerYard: 400 },
  cypress: { label: "Cypress mulch", lbPerYard: 420 },
  cedar: { label: "Cedar mulch", lbPerYard: 380 },
  rubber: { label: "Rubber mulch", lbPerYard: 550 },
  compost: { label: "Compost / leaf mulch", lbPerYard: 650 },
};

export const BAG_SIZES_CUFT = [1.5, 2, 3];

interface Bed {
  id: number;
  name: string;
  shape: "rectangle" | "circle" | "triangle";
  a: string; b: string;
}
let nid = 100;

export function bedAreaSqFt(bed: Bed): number {
  const a = Number(bed.a) || 0, b = Number(bed.b) || 0;
  if (bed.shape === "rectangle") return a * b;
  if (bed.shape === "triangle") return (a * b) / 2;
  return Math.PI * a * a; // circle: a = radius
}

export default function Mulch() {
  const [beds, setBeds] = useState<Bed[]>([{ id: 1, name: "Bed 1", shape: "rectangle", a: "20", b: "4" }]);
  const [depthIn, setDepthIn] = useState("3");
  const [type, setType] = useState("hardwood");
  const [bagSize, setBagSize] = useState(2);
  const [bagPrice, setBagPrice] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const totals = useMemo(() => {
    const area = beds.reduce((s, b) => s + bedAreaSqFt(b), 0);
    const depthFt = (Number(depthIn) || 0) / 12;
    const cuft = area * depthFt;
    const cuyd = cuft / 27;
    const bags = cuft > 0 ? Math.ceil(cuft / bagSize) : 0;
    const weightLb = cuyd * (MULCH_TYPES[type]?.lbPerYard ?? 450);
    return { area, cuft, cuyd, bags, weightLb };
  }, [beds, depthIn, bagSize, type]);

  const bagCost = Number(bagPrice) > 0 ? totals.bags * Number(bagPrice) : null;
  const bulkCost = Number(bulkPrice) > 0 ? Math.max(0, totals.cuyd) * Number(bulkPrice) : null;

  function update(id: number, patch: Partial<Bed>) {
    setBeds((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  function copyList() {
    const text = `Mulch shopping list: ${totals.cuyd.toFixed(2)} cubic yards (${MULCH_TYPES[type].label}, ${depthIn} in deep over ${totals.area.toFixed(0)} sq ft) = ${totals.bags} × ${bagSize} cu ft bags, approx. ${Math.round(totals.weightLb).toLocaleString()} lb total.`;
    navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => {});
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* AEO QUICK ANSWER */}
        <div className="rounded-3xl bg-stone-950 p-6 sm:p-8 mb-8">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-[0.2em]">Quick answer</p>
          <p className="mt-2 text-white text-lg leading-relaxed">
            One cubic yard of mulch covers <strong>108 sq ft at 3 inches deep</strong> (162 sq ft at 2″,
            81 at 4″). A standard 2 cu ft bag covers 8 sq ft at 3″ — so most beds need about{" "}
            <strong>13–14 bags per cubic yard</strong> they replace.
          </p>
        </div>

        <div className="space-y-5">
          {beds.map((bed) => (
            <div key={bed.id} className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <input value={bed.name} onChange={(e) => update(bed.id, { name: e.target.value })}
                  className="font-display text-xl font-bold text-stone-900 bg-transparent border-b border-transparent focus:border-orange-400 focus:outline-none w-40" aria-label="Bed name" />
                <div className="flex items-center gap-3">
                  <select value={bed.shape} onChange={(e) => update(bed.id, { shape: e.target.value as Bed["shape"] })}
                    className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 focus:border-orange-500 focus:outline-none" aria-label="Bed shape">
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                    <option value="triangle">Triangle</option>
                  </select>
                  {beds.length > 1 && (
                    <button type="button" onClick={() => setBeds((bs) => bs.filter((b) => b.id !== bed.id))} className="text-sm font-semibold text-red-600">Remove</button>
                  )}
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>{bed.shape === "circle" ? "Radius (ft)" : bed.shape === "triangle" ? "Base (ft)" : "Length (ft)"}</label>
                  <input type="number" step="any" className={inputCls} value={bed.a} onChange={(e) => update(bed.id, { a: e.target.value })} />
                </div>
                {bed.shape !== "circle" && (
                  <div>
                    <label className={labelCls}>{bed.shape === "triangle" ? "Height (ft)" : "Width (ft)"}</label>
                    <input type="number" step="any" className={inputCls} value={bed.b} onChange={(e) => update(bed.id, { b: e.target.value })} />
                  </div>
                )}
              </div>
              <p className="mt-3 text-sm text-stone-500">Area: <strong className="text-stone-900">{bedAreaSqFt(bed).toFixed(1)} sq ft</strong></p>
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setBeds((bs) => [...bs, { id: nid++, name: `Bed ${bs.length + 1}`, shape: "rectangle", a: "", b: "" }])}
          className="mt-5 rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:bg-orange-50 transition">
          + Add another bed (any shape)
        </button>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelCls} htmlFor="mc-depth">Depth (inches)</label>
              <select id="mc-depth" className={inputCls} value={depthIn} onChange={(e) => setDepthIn(e.target.value)}>
                {[1, 2, 3, 4, 5, 6].map((d) => (<option key={d} value={d}>{d} in{d === 3 ? " (recommended for beds)" : d === 4 ? " (new beds / weed suppression)" : d === 2 ? " (top-up refresh)" : ""}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="mc-type">Mulch type (for weight)</label>
              <select id="mc-type" className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
                {Object.entries(MULCH_TYPES).map(([k, v]) => (<option key={k} value={k}>{v.label}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="mc-bag">Bag size</label>
              <select id="mc-bag" className={inputCls} value={bagSize} onChange={(e) => setBagSize(Number(e.target.value))}>
                {BAG_SIZES_CUFT.map((s) => (<option key={s} value={s}>{s} cu ft bag</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Prices (optional)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="any" className={inputCls} value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} placeholder="$ / bag" aria-label="Price per bag" />
                <input type="number" step="any" className={inputCls} value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} placeholder="$ / yd³ bulk" aria-label="Bulk price per cubic yard" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4 text-center">
            {[
              [`${totals.cuyd.toFixed(2)} yd³`, "Mulch needed"],
              [`${totals.bags}`, `${bagSize} cu ft bags`],
              [`${totals.cuft.toFixed(1)} cu ft`, `Over ${totals.area.toFixed(0)} sq ft`],
              [`≈ ${Math.round(totals.weightLb).toLocaleString()} lb`, "Total weight (plan the truck)"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
                <p className="font-display text-2xl sm:text-3xl font-bold text-stone-900">{v}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
              </div>
            ))}
          </div>

          {bagCost !== null && bulkCost !== null && (
            <p className="mt-5 rounded-2xl bg-orange-50 border border-orange-200 px-5 py-4 text-stone-800">
              <strong>Bags vs bulk:</strong> bags ≈ <strong>${bagCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> vs bulk ≈{" "}
              <strong>${bulkCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> (before any delivery fee).
              {totals.cuyd >= 3
                ? " At 3+ yards, bulk almost always wins even with delivery — and it is one pile, not dozens of bags to haul."
                : bagCost <= bulkCost
                  ? " Bags are competitive at this size and win on convenience — no pile on the driveway."
                  : " Bulk is cheaper per yard even here, if a delivery minimum doesn't spoil it — check the yard's minimum before ordering."}
            </p>
          )}

          <div className="mt-6 text-center">
            <button type="button" onClick={copyList} className="rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 text-sm hover:bg-stone-800 transition">
              {copied ? "Copied ✓" : "📋 Copy shopping list"}
            </button>
          </div>
          <p className="mt-4 text-xs text-stone-400 text-center">
            Weights are mid-range published values per mulch type and swing with moisture — a rain-soaked
            yard of hardwood can weigh noticeably more. Depth guidance: 3 in for established beds, 4 in for
            new beds and weed suppression, 2 in for a colour refresh.
          </p>
        </div>
      </div>
    </section>
  );
}
