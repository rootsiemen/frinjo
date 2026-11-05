"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Cubic feet yielded per pre-mix bag (industry standard figures). */
export const BAG_YIELD_CUFT: Record<number, number> = { 40: 0.30, 50: 0.375, 60: 0.45, 80: 0.60 };
export const BAGS_PER_PALLET: Record<number, number> = { 40: 80, 50: 56, 60: 56, 80: 42 };

export function slabCuFt(l: number, w: number, tIn: number): number {
  return l * w * (tIn / 12);
}
export function roundCuFt(diameterFt: number, depthFt: number): number {
  const r = diameterFt / 2;
  return Math.PI * r * r * depthFt;
}

interface Section {
  id: number;
  kind: "slab" | "round" | "holes";
  l: string; w: string; t: string;
  dia: string; depth: string; count: string;
}
let nid = 100;

export function sectionCuFt(s: Section): number {
  const n = (v: string) => Number(v) || 0;
  if (s.kind === "slab") return slabCuFt(n(s.l), n(s.w), n(s.t));
  if (s.kind === "round") return roundCuFt(n(s.dia), n(s.depth));
  return roundCuFt(n(s.dia), n(s.depth)) * n(s.count);
}

export default function Concrete() {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, kind: "slab", l: "10", w: "10", t: "4", dia: "", depth: "", count: "" },
  ]);
  const [bagSize, setBagSize] = useState(80);
  const [waste, setWaste] = useState("10");
  const [bagPrice, setBagPrice] = useState("");
  const [mixPrice, setMixPrice] = useState("");
  const [copied, setCopied] = useState(false);

  const totals = useMemo(() => {
    const cuft = sections.reduce((s, x) => s + sectionCuFt(x), 0);
    const w = Math.max(0, Number(waste) || 0) / 100;
    const withWaste = cuft * (1 + w);
    const bags = withWaste > 0 ? Math.ceil(withWaste / BAG_YIELD_CUFT[bagSize]) : 0;
    return {
      cuft, withWaste,
      cuyd: withWaste / 27,
      bags,
      pallets: bags > 0 ? Math.ceil(bags / BAGS_PER_PALLET[bagSize]) : 0,
      waterGal: bags * (bagSize === 80 ? 1 : bagSize === 60 ? 0.75 : bagSize === 50 ? 0.6 : 0.5),
    };
  }, [sections, bagSize, waste]);

  const bagCost = Number(bagPrice) > 0 ? totals.bags * Number(bagPrice) : null;
  const mixCost = Number(mixPrice) > 0 ? Math.max(1, totals.cuyd) * Number(mixPrice) : null;

  function update(id: number, patch: Partial<Section>) {
    setSections((ss) => ss.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }
  function addSection(kind: Section["kind"]) {
    setSections((ss) => [...ss, { id: nid++, kind, l: "", w: "", t: "4", dia: "", depth: "", count: "4" }]);
  }
  function copyList() {
    const text = `Concrete shopping list: ${totals.cuyd.toFixed(2)} cubic yards (${totals.withWaste.toFixed(1)} cu ft incl. ${waste}% waste) = ${totals.bags} × ${bagSize} lb bags (${totals.pallets} pallet${totals.pallets === 1 ? "" : "s"}), approx. ${totals.waterGal.toFixed(0)} gal water for mixing.`;
    navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => {});
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-5">
          {sections.map((s) => (
            <div key={s.id} className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex gap-2">
                  {(["slab", "round", "holes"] as const).map((k) => (
                    <button key={k} type="button" onClick={() => update(s.id, { kind: k })}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${s.kind === k ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                      {k === "slab" ? "Slab / rectangle" : k === "round" ? "Round slab" : "Post holes"}
                    </button>
                  ))}
                </div>
                {sections.length > 1 && (
                  <button type="button" onClick={() => setSections((ss) => ss.filter((x) => x.id !== s.id))} className="text-sm font-semibold text-red-600">Remove</button>
                )}
              </div>
              {s.kind === "slab" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div><label className={labelCls}>Length (ft)</label><input type="number" step="any" className={inputCls} value={s.l} onChange={(e) => update(s.id, { l: e.target.value })} /></div>
                  <div><label className={labelCls}>Width (ft)</label><input type="number" step="any" className={inputCls} value={s.w} onChange={(e) => update(s.id, { w: e.target.value })} /></div>
                  <div><label className={labelCls}>Thickness (in)</label><input type="number" step="any" className={inputCls} value={s.t} onChange={(e) => update(s.id, { t: e.target.value })} /></div>
                </div>
              )}
              {s.kind !== "slab" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div><label className={labelCls}>Diameter (ft)</label><input type="number" step="any" className={inputCls} value={s.dia} onChange={(e) => update(s.id, { dia: e.target.value })} placeholder={s.kind === "holes" ? "e.g. 1 (12 in)" : "e.g. 8"} /></div>
                  <div><label className={labelCls}>Depth {s.kind === "holes" ? "(ft)" : "(ft)"}</label><input type="number" step="any" className={inputCls} value={s.depth} onChange={(e) => update(s.id, { depth: e.target.value })} placeholder={s.kind === "holes" ? "e.g. 2.5" : "e.g. 0.33 (4 in)"} /></div>
                  {s.kind === "holes" && (
                    <div><label className={labelCls}>Number of holes</label><input type="number" step="1" className={inputCls} value={s.count} onChange={(e) => update(s.id, { count: e.target.value })} /></div>
                  )}
                </div>
              )}
              <p className="mt-3 text-sm text-stone-500">This section: <strong className="text-stone-900">{sectionCuFt(s).toFixed(2)} cu ft</strong> ({(sectionCuFt(s) / 27).toFixed(3)} yd³)</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => addSection("slab")} className="rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-5 py-2 hover:bg-orange-50 transition">+ Slab</button>
          <button type="button" onClick={() => addSection("round")} className="rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-5 py-2 hover:bg-orange-50 transition">+ Round</button>
          <button type="button" onClick={() => addSection("holes")} className="rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-5 py-2 hover:bg-orange-50 transition">+ Post holes</button>
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-4">
            <div>
              <label className={labelCls} htmlFor="cc-bag">Bag size</label>
              <select id="cc-bag" className={inputCls} value={bagSize} onChange={(e) => setBagSize(Number(e.target.value))}>
                {[40, 50, 60, 80].map((b) => (<option key={b} value={b}>{b} lb bag ({BAG_YIELD_CUFT[b]} cu ft)</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="cc-waste">Waste %</label>
              <input id="cc-waste" type="number" min="0" max="50" className={inputCls} value={waste} onChange={(e) => setWaste(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="cc-bp">Price per bag $ (optional)</label>
              <input id="cc-bp" type="number" step="any" className={inputCls} value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} placeholder="5.50" />
            </div>
            <div>
              <label className={labelCls} htmlFor="cc-mp">Ready-mix $ per yd³ (optional)</label>
              <input id="cc-mp" type="number" step="any" className={inputCls} value={mixPrice} onChange={(e) => setMixPrice(e.target.value)} placeholder="165" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4 text-center">
            {[
              [`${totals.cuyd.toFixed(2)} yd³`, "Concrete needed"],
              [`${totals.bags}`, `${bagSize} lb bags`],
              [`${totals.pallets}`, `Pallet${totals.pallets === 1 ? "" : "s"} (${BAGS_PER_PALLET[bagSize]}/pallet)`],
              [`≈ ${totals.waterGal.toFixed(0)} gal`, "Mixing water (guide)"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
                <p className="font-display text-2xl sm:text-3xl font-bold text-stone-900">{v}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
              </div>
            ))}
          </div>

          {bagCost !== null && mixCost !== null && (
            <p className="mt-5 rounded-2xl bg-orange-50 border border-orange-200 px-5 py-4 text-stone-800">
              <strong>Bagged vs ready-mix:</strong> bags ≈ <strong>${bagCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>;
              ready-mix ≈ <strong>${mixCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong> (at 1 yd³ minimum, before delivery fees).
              {bagCost <= mixCost ? " Bags come out cheaper on price — but above ~1 yd³, ready-mix usually wins on time and consistency once delivery is added." : " Ready-mix is cheaper on price at this volume — bags only win below its minimum order or where a truck cannot reach."}
            </p>
          )}
          {bagCost !== null && mixCost === null && (
            <p className="mt-5 text-center text-stone-600">Bag cost ≈ <strong className="text-stone-900">${bagCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</strong>. Add a ready-mix price to compare.</p>
          )}

          <div className="mt-6 text-center">
            <button type="button" onClick={copyList} className="rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 text-sm hover:bg-stone-800 transition">
              {copied ? "Copied ✓" : "📋 Copy shopping list"}
            </button>
          </div>
          <p className="mt-4 text-xs text-stone-400 text-center">
            Yields per bag are the standard published figures (an 80 lb bag makes ≈ 0.60 cu ft — about 45 bags per
            cubic yard, a figure some calculators online get wrong). Pallet counts are typical US retail counts;
            water is a starting guide — follow the bag&apos;s instructions and never add extra water to make
            mixing easier: it weakens the concrete.
          </p>
        </div>
      </div>
    </section>
  );
}
