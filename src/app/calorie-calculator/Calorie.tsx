"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Mifflin-St Jeor BMR */
export function bmr(sex: "male" | "female", weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? base + 5 : base - 161;
}

export const ACTIVITY: { key: string; label: string; factor: number; hint: string }[] = [
  { key: "sedentary", label: "Sedentary", factor: 1.2, hint: "Desk job, little or no exercise" },
  { key: "light", label: "Lightly active", factor: 1.375, hint: "Light exercise 1–3 days/week" },
  { key: "moderate", label: "Moderately active", factor: 1.55, hint: "Exercise 3–5 days/week" },
  { key: "very", label: "Very active", factor: 1.725, hint: "Hard exercise 6–7 days/week" },
  { key: "extra", label: "Extra active", factor: 1.9, hint: "Physical job + training, or twice-daily training" },
];

export type GoalKey = "lose-fast" | "lose" | "maintain" | "gain" | "gain-fast";

export function goalCalories(tdee: number, goal: GoalKey): number {
  switch (goal) {
    case "lose-fast": return Math.max(1200, Math.round(tdee - 1000));
    case "lose": return Math.max(1200, Math.round(tdee - 500));
    case "maintain": return Math.round(tdee);
    case "gain": return Math.round(tdee + 250);
    case "gain-fast": return Math.round(tdee + 500);
  }
}

export default function Calorie() {
  const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [weightKg, setWeightKg] = useState("80");
  const [heightCm, setHeightCm] = useState("178");
  const [weightLb, setWeightLb] = useState("176");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState<GoalKey>("maintain");

  const num = (s: string) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isFinite(v) && v > 0 ? v : null;
  };

  const kg = unit === "metric" ? num(weightKg) : (() => { const lb = num(weightLb); return lb ? lb * 0.453592 : null; })();
  const cm = unit === "metric" ? num(heightCm) : (() => {
    const ft = num(heightFt), inch = Number(heightIn);
    return ft ? (ft * 12 + (Number.isFinite(inch) ? inch : 0)) * 2.54 : null;
  })();
  const a = num(age);
  const act = ACTIVITY.find((x) => x.key === activity) ?? ACTIVITY[2];

  const b = kg && cm && a ? bmr(sex, kg, cm, a) : null;
  const tdee = b ? b * act.factor : null;
  const target = tdee ? goalCalories(tdee, goal) : null;

  const GOAL_LABELS: Record<GoalKey, string> = {
    "lose-fast": "Lose 2 lb/week (−1,000)",
    "lose": "Lose 1 lb/week (−500)",
    "maintain": "Maintain weight",
    "gain": "Gain 0.5 lb/week (+250)",
    "gain-fast": "Gain 1 lb/week (+500)",
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap gap-3 mb-6">
            {(["imperial", "metric"] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${unit === u ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                {u === "imperial" ? "Imperial (lb, ft/in)" : "Metric (kg, cm)"}
              </button>
            ))}
            {(["male", "female"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSex(s)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition capitalize ${sex === s ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="cc-age">Age</label>
              <input id="cc-age" type="number" min="10" max="100" className={inputCls} value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            {unit === "metric" ? (
              <>
                <div>
                  <label className={labelCls} htmlFor="cc-wkg">Weight (kg)</label>
                  <input id="cc-wkg" type="number" step="any" className={inputCls} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="cc-hcm">Height (cm)</label>
                  <input id="cc-hcm" type="number" step="any" className={inputCls} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={labelCls} htmlFor="cc-wlb">Weight (lb)</label>
                  <input id="cc-wlb" type="number" step="any" className={inputCls} value={weightLb} onChange={(e) => setWeightLb(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Height (ft / in)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" min="0" className={inputCls} value={heightFt} onChange={(e) => setHeightFt(e.target.value)} aria-label="Height feet" placeholder="ft" />
                    <input type="number" min="0" max="11" className={inputCls} value={heightIn} onChange={(e) => setHeightIn(e.target.value)} aria-label="Height inches" placeholder="in" />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="cc-activity">Activity level</label>
              <select id="cc-activity" className={inputCls} value={activity} onChange={(e) => setActivity(e.target.value)}>
                {ACTIVITY.map((x) => (<option key={x.key} value={x.key}>{x.label} — {x.hint}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="cc-goal">Goal</label>
              <select id="cc-goal" className={inputCls} value={goal} onChange={(e) => setGoal(e.target.value as GoalKey)}>
                {(Object.keys(GOAL_LABELS) as GoalKey[]).map((g) => (<option key={g} value={g}>{GOAL_LABELS[g]}</option>))}
              </select>
            </div>
          </div>

          {b && tdee && target ? (
            <div className="mt-8">
              <div className="grid gap-4 sm:grid-cols-3 text-center">
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-display text-3xl font-bold text-stone-900">{Math.round(b).toLocaleString()}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">BMR — calories at complete rest</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-display text-3xl font-bold text-stone-900">{Math.round(tdee).toLocaleString()}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Maintenance (TDEE)</p>
                </div>
                <div className="rounded-2xl bg-stone-950 border border-stone-900 p-5">
                  <p className="font-display text-3xl font-bold text-orange-400">{target.toLocaleString()}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-400">Eat this for your goal</p>
                </div>
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                <p className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-50">At your target: {target.toLocaleString()} kcal/day, one common macro split</p>
                {[
                  ["Protein (30%)", `${Math.round((target * 0.3) / 4)} g`],
                  ["Carbohydrates (40%)", `${Math.round((target * 0.4) / 4)} g`],
                  ["Fat (30%)", `${Math.round((target * 0.3) / 9)} g`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
                    <span className="font-semibold text-stone-600">{label}</span>
                    <span className="font-display text-lg font-bold text-stone-900">{val}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center leading-relaxed">
                Formula: Mifflin-St Jeor (the equation a 2005 review in the Journal of the American Dietetic
                Association found most accurate for most adults). Real maintenance varies ±10–15% between
                individuals — treat the number as a starting point, track 2–3 weeks, then adjust by
                100–200 kcal. Targets are never set below 1,200 kcal here; sustained very-low-calorie diets
                need medical supervision. This is general information, not medical advice.
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Enter age, weight and height to see your numbers.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
