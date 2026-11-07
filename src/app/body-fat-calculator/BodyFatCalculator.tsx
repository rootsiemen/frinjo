"use client";

import { useState } from "react";
import { navyBodyFat, bodyFatCategory, fatMass, leanMass, weightAtTargetBf, CM_PER_INCH, type Sex } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

const num = (s: string) => {
  const v = Number(s);
  return s.trim() !== "" && Number.isFinite(v) && v > 0 ? v : null;
};
const r1 = (n: number) => Math.round(n * 10) / 10;

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [units, setUnits] = useState<"in" | "cm">("in");
  const [height, setHeight] = useState("70");
  const [neck, setNeck] = useState("15");
  const [waist, setWaist] = useState("34");
  const [hip, setHip] = useState("38");
  const [weight, setWeight] = useState("180");
  const [weightUnit, setWeightUnit] = useState<"lb" | "kg">("lb");

  const conv = units === "cm" ? (v: number) => v / CM_PER_INCH : (v: number) => v;
  const h = num(height), n = num(neck), w = num(waist), hp = num(hip), wt = num(weight);
  const bf = h && n && w ? navyBodyFat(sex, conv(h), conv(n), conv(w), hp ? conv(hp) : 0) : null;
  const cat = bf !== null ? bodyFatCategory(sex, bf) : null;
  const wtVal = wt ?? 0;
  const targetBf = sex === "male" ? 15 : 23;
  const targetWeight = bf !== null && wt ? weightAtTargetBf(wt, bf, targetBf) : null;

  const uLabel = units === "cm" ? "cm" : "in";

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className={cardCls}>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-1">
              {(["male", "female"] as Sex[]).map((s) => (
                <button key={s} type="button" onClick={() => setSex(s)}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${sex === s ? "bg-orange-600 text-white" : "text-stone-600 hover:text-orange-700"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-1">
              {(["in", "cm"] as const).map((u) => (
                <button key={u} type="button" onClick={() => setUnits(u)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${units === u ? "bg-stone-900 text-white" : "text-stone-600 hover:text-orange-700"}`}>
                  {u === "in" ? "Inches" : "Centimetres"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="bf-height">Height ({uLabel})</label>
              <input id="bf-height" type="number" step="any" className={inputCls} value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="bf-neck">Neck ({uLabel}) — narrowest, below the Adam&apos;s apple</label>
              <input id="bf-neck" type="number" step="any" className={inputCls} value={neck} onChange={(e) => setNeck(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="bf-waist">Waist ({uLabel}) — at the navel, relaxed</label>
              <input id="bf-waist" type="number" step="any" className={inputCls} value={waist} onChange={(e) => setWaist(e.target.value)} />
            </div>
            {sex === "female" && (
              <div>
                <label className={labelCls} htmlFor="bf-hip">Hip ({uLabel}) — widest point</label>
                <input id="bf-hip" type="number" step="any" className={inputCls} value={hip} onChange={(e) => setHip(e.target.value)} />
              </div>
            )}
            <div>
              <label className={labelCls} htmlFor="bf-weight">Weight (optional, for fat/lean mass)</label>
              <div className="flex gap-2">
                <input id="bf-weight" type="number" step="any" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} />
                <select aria-label="Weight unit" className="rounded-2xl border border-stone-300 bg-white px-3 text-sm font-bold text-stone-700"
                  value={weightUnit} onChange={(e) => setWeightUnit(e.target.value as "lb" | "kg")}>
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
          </div>

          {bf !== null && cat ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-orange-600 p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-100">Body fat</p>
                <p className="mt-1 font-display text-4xl font-bold">{bf}%</p>
                <p className="mt-1 text-xs text-orange-100">US Navy method estimate (±3–4%)</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Category (ACE)</p>
                <p className="mt-1 font-display text-2xl font-bold text-stone-900">{cat.label}</p>
                <p className="mt-1 text-xs text-stone-500">{sex === "male" ? "Men" : "Women"}: {cat.range}</p>
              </div>
              {wt ? (
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-stone-500">Fat / lean mass</p>
                  <p className="mt-1 font-display text-2xl font-bold text-stone-900">
                    {r1(fatMass(wtVal, bf))} / {r1(leanMass(wtVal, bf))} {weightUnit}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    At {targetBf}% body fat with the same lean mass you&apos;d weigh ≈{r1(targetWeight ?? 0)} {weightUnit}.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="text-sm text-stone-500">Add your weight to see fat mass, lean mass and a target weight.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-stone-500">
              Enter your measurements — waist must be larger than neck{sex === "female" ? ", and hip is required for women" : ""} for the Navy formula to work.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
