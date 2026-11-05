"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export function neededOnFinal(current: number, desired: number, weightPct: number): number {
  const w = weightPct / 100;
  if (w <= 0) return NaN;
  return (desired - current * (1 - w)) / w;
}

export function gradeWithFinalScore(current: number, finalScore: number, weightPct: number): number {
  const w = weightPct / 100;
  return current * (1 - w) + finalScore * w;
}

export function letterFor(pct: number): string {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A−";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B−";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C−";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D−";
  return "F";
}

function verdict(needed: number): { title: string; text: string; color: string } {
  if (needed <= 0)
    return { title: "Already locked in 🎉", text: "Your desired grade is secured even with a zero on the final — your current average carries it. Sit the exam calmly; anything you score is a bonus.", color: "#22c55e" };
  if (needed <= 60)
    return { title: "Very comfortable", text: "You need a score well below your current average. A normal revision pass should get you there with room to spare.", color: "#22c55e" };
  if (needed <= 80)
    return { title: "Achievable with steady prep", text: "The score you need is at or below what you have been averaging. Prepare the way you have all term and this is yours.", color: "#84cc16" };
  if (needed <= 90)
    return { title: "A stretch — but a real one", text: "You need to beat your term average on the final. Focus revision on the highest-weight topics and past papers; this gap closes with targeted work.", color: "#f59e0b" };
  if (needed <= 100)
    return { title: "Near-perfect needed", text: "Possible, but there is almost no slack. Prioritise the topics most likely to be examined, sleep the night before, and treat every mark as load-bearing.", color: "#f97316" };
  return { title: "Mathematically out of reach", text: "Even a perfect 100% on the final cannot reach that target with this weighting. Pick the next grade down as your goal instead — the calculator below shows what each final score actually gives you — and talk to your instructor about extra credit or retake options early, not after results.", color: "#ef4444" };
}

export default function FinalGrade() {
  const [current, setCurrent] = useState("85");
  const [desired, setDesired] = useState("90");
  const [weight, setWeight] = useState("30");
  const [myScore, setMyScore] = useState("80");

  const num = (s: string) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isFinite(v) ? v : null;
  };
  const c = num(current), d = num(desired), w = num(weight), ms = num(myScore);
  const needed = c !== null && d !== null && w !== null && w > 0 ? neededOnFinal(c, d, w) : null;
  const v = needed !== null ? verdict(needed) : null;
  const outcome = c !== null && ms !== null && w !== null ? gradeWithFinalScore(c, ms, w) : null;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">What do I need on the final?</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="fg-current">Current grade %</label>
              <input id="fg-current" type="number" step="any" min="0" max="100" className={inputCls} value={current} onChange={(e) => setCurrent(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="fg-desired">Grade I want %</label>
              <input id="fg-desired" type="number" step="any" min="0" max="100" className={inputCls} value={desired} onChange={(e) => setDesired(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="fg-weight">Final is worth %</label>
              <input id="fg-weight" type="number" step="any" min="1" max="100" className={inputCls} value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          {needed !== null && v ? (
            <div className="mt-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">You need to score</p>
              <p className="mt-2 font-display text-7xl font-bold text-stone-900">
                {needed <= 0 ? "0" : needed.toFixed(1)}<span className="text-orange-500">%</span>
              </p>
              <p className="mt-3 font-display text-2xl font-bold" style={{ color: v.color }}>{v.title}</p>
              <p className="mt-2 text-stone-600 leading-relaxed max-w-2xl mx-auto">{v.text}</p>
              <p className="mt-4 text-sm text-stone-500">
                Formula: ({desired || "desired"} − {current || "current"} × {(1 - (w ?? 0) / 100).toFixed(2)}) ÷ {((w ?? 0) / 100).toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Enter your current grade, target grade and the final&apos;s weight (1–100%).
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">And if I score this much?</h2>
          <div className="mt-5 max-w-sm">
            <label className={labelCls} htmlFor="fg-score">My expected final score %</label>
            <input id="fg-score" type="number" step="any" min="0" max="110" className={inputCls} value={myScore} onChange={(e) => setMyScore(e.target.value)} />
          </div>
          {outcome !== null ? (
            <p className="mt-6 text-center font-display text-4xl font-bold text-stone-900">
              Final grade: {outcome.toFixed(1)}% <span className="text-orange-500">({letterFor(outcome)})</span>
            </p>
          ) : (
            <p className="mt-6 text-center text-stone-400">Enter a score to see the outcome.</p>
          )}
          <p className="mt-3 text-xs text-stone-400 text-center">
            Letter grades use the common US scale (A ≥ 93, A− ≥ 90, B+ ≥ 87…). Your school&apos;s cut-offs may differ — the percentage is exact either way.
          </p>
        </div>
      </div>
    </section>
  );
}
