"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/**
 * Common clinical rule of thumb: ~35 ml per kg body weight as a starting point
 * (roughly 0.5 oz per lb), plus ~355 ml (12 oz) per 30 minutes of exercise.
 * This estimates DRINKING water; total water intake guidance (EFSA/IOM) includes food moisture.
 */
export function dailyWaterMl(weightKg: number, exerciseMin: number, hotClimate: boolean, pregnant: boolean, breastfeeding: boolean): number {
  let ml = weightKg * 35;
  ml += (exerciseMin / 30) * 355;
  if (hotClimate) ml += 500;
  if (pregnant) ml += 300;
  if (breastfeeding) ml += 700;
  return Math.round(ml);
}

export default function WaterIntake() {
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [weight, setWeight] = useState("160");
  const [exercise, setExercise] = useState("30");
  const [hot, setHot] = useState(false);
  const [preg, setPreg] = useState(false);
  const [bf, setBf] = useState(false);

  const w = Number(weight);
  const kg = unit === "lb" ? w * 0.453592 : w;
  const ex = Math.max(0, Number(exercise) || 0);
  const ml = Number.isFinite(kg) && kg > 0 ? dailyWaterMl(kg, ex, hot, preg, bf) : null;

  const liters = ml ? ml / 1000 : 0;
  const oz = ml ? ml / 29.5735 : 0;
  const cups = ml ? ml / 236.588 : 0;
  const glasses = ml ? ml / 250 : 0; // ~8.5 oz glass

  const checkCls = "flex items-center gap-2 text-sm text-stone-600 cursor-pointer";

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="wi-w">Your weight</label>
              <div className="flex gap-2">
                <input id="wi-w" type="number" step="any" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} />
                <select className="rounded-2xl border border-stone-300 bg-white px-3 font-semibold text-stone-700 focus:border-orange-500 focus:outline-none"
                  value={unit} onChange={(e) => setUnit(e.target.value as "lb" | "kg")} aria-label="Weight unit">
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="wi-ex">Exercise per day (minutes)</label>
              <input id="wi-ex" type="number" min="0" max="600" className={inputCls} value={exercise} onChange={(e) => setExercise(e.target.value)} />
              <p className="mt-1.5 text-xs text-stone-400">Sweat losses add roughly 12 oz (355 ml) per 30 minutes of exercise.</p>
            </div>
            <div className="space-y-2.5 pt-1">
              <span className={labelCls}>Adjustments</span>
              <label className={checkCls}><input type="checkbox" checked={hot} onChange={(e) => setHot(e.target.checked)} className="w-4 h-4 accent-orange-600" /> Hot climate / heavy sweating (+500 ml)</label>
              <label className={checkCls}><input type="checkbox" checked={preg} onChange={(e) => { setPreg(e.target.checked); if (e.target.checked) setBf(false); }} className="w-4 h-4 accent-orange-600" /> Pregnant (+300 ml)</label>
              <label className={checkCls}><input type="checkbox" checked={bf} onChange={(e) => { setBf(e.target.checked); if (e.target.checked) setPreg(false); }} className="w-4 h-4 accent-orange-600" /> Breastfeeding (+700 ml)</label>
            </div>
          </div>

          {ml ? (
            <div className="mt-8">
              <p className="text-center text-stone-500">Aim for about</p>
              <p className="mt-1 text-center font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {liters.toFixed(2)}<span className="text-orange-500 text-3xl sm:text-4xl"> litres / day</span>
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3 text-center">
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-display text-2xl font-bold text-stone-900">{Math.round(oz)} oz</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Fluid ounces</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-display text-2xl font-bold text-stone-900">{cups.toFixed(1)} cups</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">8 oz cups</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-display text-2xl font-bold text-stone-900">≈ {glasses.toFixed(1)} glasses</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">250 ml glasses</p>
                </div>
              </div>
              <p className="mt-5 text-sm text-stone-500 leading-relaxed text-center max-w-2xl mx-auto">
                For comparison, reference intakes for <strong>total</strong> water — food included — are about
                2.5 L/day for men and 2.0 L/day for women (EFSA); food typically supplies 20–30% of it, so
                drinks cover the rest. Your number above is a drinking-water estimate from the standard
                weight-based rule of thumb. Thirst and pale-yellow urine remain the simplest everyday checks.
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">Enter your weight to calculate.</p>
          )}
        </div>
      </div>
    </section>
  );
}
