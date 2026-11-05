"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export interface BmiResult {
  bmi: number;
  category: string;
  categoryNote: string;
  healthyMinKg: number;
  healthyMaxKg: number;
  color: string;
  positionPct: number;
}

export function computeBmi(weightKg: number, heightCm: number): BmiResult {
  const m = heightCm / 100;
  const bmi = weightKg / (m * m);
  const healthyMinKg = 18.5 * m * m;
  const healthyMaxKg = 24.99 * m * m;
  let category = "";
  let categoryNote = "";
  let color = "";
  if (bmi < 18.5) {
    category = "Underweight";
    color = "#38bdf8";
    categoryNote =
      "Below the healthy range for your height. If this was not intentional, it is worth a conversation with a doctor — underweight carries its own risks, from nutrient deficiencies to weakened immunity.";
  } else if (bmi < 25) {
    category = "Healthy weight";
    color = "#22c55e";
    categoryNote =
      "Inside the healthy range for your height (18.5–24.9). BMI is a population guide, not a verdict — fitness, muscle and how you feel matter alongside the number.";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#f59e0b";
    categoryNote =
      "Above the healthy range for your height. Small, sustained changes move this number steadily — about 0.5–1 kg (1–2 lb) a month is a realistic, keepable pace for most people.";
  } else {
    category = "Obese";
    color = "#ef4444";
    categoryNote =
      "In the obese range for your height. This is health information, not a judgement — a doctor can check the things BMI cannot see (blood pressure, blood sugar, fitness) and help you plan from facts.";
  }
  // gauge spans BMI 14 → 40
  const positionPct = Math.max(0, Math.min(100, ((bmi - 14) / (40 - 14)) * 100));
  return { bmi, category, categoryNote, healthyMinKg, healthyMaxKg, color, positionPct };
}

export default function BmiCalculator() {
  const [units, setUnits] = useState<"imperial" | "metric">("imperial");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("9");
  const [cm, setCm] = useState("175");
  const [lb, setLb] = useState("160");
  const [kg, setKg] = useState("73");

  const parsed = useMemo(() => {
    if (units === "imperial") {
      const totalIn = Number(ft) * 12 + Number(inch);
      const w = Number(lb);
      if (!(totalIn > 0) || !(w > 0)) return null;
      return { weightKg: w * 0.45359237, heightCm: totalIn * 2.54 };
    }
    const h = Number(cm);
    const w = Number(kg);
    if (!(h > 0) || !(w > 0)) return null;
    return { weightKg: w, heightCm: h };
  }, [units, ft, inch, cm, lb, kg]);

  const result = parsed ? computeBmi(parsed.weightKg, parsed.heightCm) : null;
  const fmtWeight = (kgVal: number) =>
    units === "imperial" ? `${(kgVal / 0.45359237).toFixed(1)} lb` : `${kgVal.toFixed(1)} kg`;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex gap-2 mb-6">
            {(["imperial", "metric"] as const).map((u) => (
              <button key={u} type="button" onClick={() => setUnits(u)}
                className={`rounded-full px-5 py-2 font-bold text-sm transition ${
                  units === u ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"
                }`}>
                {u === "imperial" ? "ft / in · lb" : "cm · kg"}
              </button>
            ))}
          </div>

          {units === "imperial" ? (
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls} htmlFor="bmi-ft">Height — feet</label>
                <input id="bmi-ft" type="number" min="1" max="8" className={inputCls} value={ft} onChange={(e) => setFt(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="bmi-in">Height — inches</label>
                <input id="bmi-in" type="number" min="0" max="11" className={inputCls} value={inch} onChange={(e) => setInch(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="bmi-lb">Weight — pounds</label>
                <input id="bmi-lb" type="number" min="1" max="1500" className={inputCls} value={lb} onChange={(e) => setLb(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="bmi-cm">Height — cm</label>
                <input id="bmi-cm" type="number" min="50" max="280" className={inputCls} value={cm} onChange={(e) => setCm(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="bmi-kg">Weight — kg</label>
                <input id="bmi-kg" type="number" min="1" max="700" className={inputCls} value={kg} onChange={(e) => setKg(e.target.value)} />
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-stone-400">
            Your BMI updates as you type. Nothing is stored — the calculation runs in your browser.
            For adults 20+; children and teens use BMI percentiles instead.
          </p>
        </div>

        {result ? (
          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Your Body Mass Index</p>
              <p className="mt-3 font-display text-7xl sm:text-8xl font-bold text-stone-900">
                {result.bmi.toFixed(1)}
              </p>
              <p className="mt-2 font-display text-2xl font-bold" style={{ color: result.color }}>
                {result.category}
              </p>
            </div>
            {/* gauge */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative h-4 rounded-full overflow-hidden flex">
                <div style={{ width: "17.3%", background: "#38bdf8" }} />
                <div style={{ width: "24.6%", background: "#22c55e" }} />
                <div style={{ width: "19.2%", background: "#f59e0b" }} />
                <div style={{ width: "38.9%", background: "#ef4444" }} />
              </div>
              <div className="relative h-6">
                <div className="absolute -translate-x-1/2 text-xl leading-none" style={{ left: `${result.positionPct}%` }}>▲</div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide">
                <span>14</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>
            <p className="mt-6 text-stone-600 leading-relaxed max-w-2xl mx-auto text-center">{result.categoryNote}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Healthy range for your height</p>
                <p className="mt-2 font-display text-2xl font-bold text-stone-900">
                  {fmtWeight(result.healthyMinKg)} – {fmtWeight(result.healthyMaxKg)}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">The formula</p>
                <p className="mt-2 font-display text-lg font-bold text-stone-900">
                  BMI = weight (kg) ÷ height² (m)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
            Enter a valid height and weight to see your BMI.
          </p>
        )}
      </div>
    </section>
  );
}
