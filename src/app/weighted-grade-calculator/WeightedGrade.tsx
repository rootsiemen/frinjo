"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

interface Cat {
  id: number;
  name: string;
  weight: string;
  mode: "percent" | "points";
  pct: string;
  earned: string;
  possible: string;
}
let nid = 100;

export function catPercent(c: Cat): number | null {
  if (c.mode === "percent") {
    const v = Number(c.pct);
    return c.pct.trim() !== "" && Number.isFinite(v) ? v : null;
  }
  const e = Number(c.earned), p = Number(c.possible);
  return p > 0 && Number.isFinite(e) ? (e / p) * 100 : null;
}

export function letterFor(pct: number): string {
  if (pct >= 93) return "A"; if (pct >= 90) return "A−";
  if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B−";
  if (pct >= 77) return "C+"; if (pct >= 73) return "C"; if (pct >= 70) return "C−";
  if (pct >= 67) return "D+"; if (pct >= 63) return "D"; if (pct >= 60) return "D−";
  return "F";
}

export default function WeightedGrade() {
  const [cats, setCats] = useState<Cat[]>([
    { id: 1, name: "Homework", weight: "20", mode: "points", pct: "", earned: "180", possible: "200" },
    { id: 2, name: "Quizzes", weight: "20", mode: "percent", pct: "85", earned: "", possible: "" },
    { id: 3, name: "Midterm", weight: "25", mode: "percent", pct: "78", earned: "", possible: "" },
    { id: 4, name: "Final exam (not taken yet)", weight: "35", mode: "percent", pct: "", earned: "", possible: "" },
  ]);
  const [extraCredit, setExtraCredit] = useState("");
  const [copied, setCopied] = useState(false);

  const calc = useMemo(() => {
    let weightedSum = 0, weightUsed = 0;
    const rows = cats.map((c) => {
      const w = Number(c.weight);
      const p = catPercent(c);
      if (p !== null && Number.isFinite(w) && w > 0) {
        weightedSum += p * w;
        weightUsed += w;
      }
      return { c, p, w };
    });
    const ec = Number(extraCredit) || 0;
    const currentAvg = weightUsed > 0 ? weightedSum / weightUsed : null; // average over graded weight
    const secured = weightedSum / 100 + ec; // points of the final 100 already banked
    const gradedWeight = weightUsed;
    const totalWeight = cats.reduce((s, c) => s + (Number(c.weight) || 0), 0);
    const remainingWeight = Math.max(0, totalWeight - gradedWeight);
    return { rows, currentAvg, secured, gradedWeight, totalWeight, remainingWeight };
  }, [cats, extraCredit]);

  function neededFor(target: number): number | null {
    if (calc.remainingWeight <= 0) return null;
    return ((target - calc.secured) / calc.remainingWeight) * 100;
  }

  function update(id: number, patch: Partial<Cat>) {
    setCats((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function addCat() {
    setCats((cs) => [...cs, { id: nid++, name: `Category ${cs.length + 1}`, weight: "10", mode: "percent", pct: "", earned: "", possible: "" }]);
  }
  function copyResult() {
    if (calc.currentAvg === null) return;
    const text = `Weighted grade so far: ${calc.currentAvg.toFixed(1)}% (${letterFor(calc.currentAvg)}) across ${calc.gradedWeight}% of the course. Secured: ${calc.secured.toFixed(1)} of 100 course points.`;
    navigator.clipboard?.writeText(text).then(() => setCopied(true)).catch(() => {});
  }

  const targets = [90, 80, 70, 60];

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <p className="text-sm text-stone-500 mb-5">
            Enter each category&apos;s weight and grade — <strong>as a percentage or as raw points</strong>
            (45/50 works as-is; no hand-converting). Leave a category&apos;s grade blank if it has not
            happened yet — it becomes part of the &quot;what do I still need?&quot; answer below.
          </p>
          <div className="space-y-3">
            {cats.map((c) => {
              const p = catPercent(c);
              return (
                <div key={c.id} className="bg-white border border-stone-200 rounded-2xl p-4">
                  <div className="grid gap-3 sm:grid-cols-[1fr_90px_1fr_40px] items-end">
                    <div>
                      <label className="sr-only">Category name</label>
                      <input className={inputCls} value={c.name} onChange={(e) => update(c.id, { name: e.target.value })} placeholder="Category (e.g. Homework)" />
                    </div>
                    <div>
                      <label className="sr-only">Weight %</label>
                      <input type="number" min="0" max="100" className={inputCls} value={c.weight} onChange={(e) => update(c.id, { weight: e.target.value })} placeholder="Weight %" />
                    </div>
                    <div className="flex gap-2 items-end">
                      <select className="rounded-xl border border-stone-300 bg-white px-2 py-2.5 text-sm font-semibold text-stone-600"
                        value={c.mode} onChange={(e) => update(c.id, { mode: e.target.value as Cat["mode"] })} aria-label="Input type">
                        <option value="percent">% grade</option>
                        <option value="points">Points</option>
                      </select>
                      {c.mode === "percent" ? (
                        <input type="number" min="0" max="150" step="any" className={inputCls} value={c.pct} onChange={(e) => update(c.id, { pct: e.target.value })} placeholder="Grade %" />
                      ) : (
                        <span className="flex gap-2 flex-1">
                          <input type="number" min="0" step="any" className={inputCls} value={c.earned} onChange={(e) => update(c.id, { earned: e.target.value })} placeholder="Earned" />
                          <input type="number" min="0" step="any" className={inputCls} value={c.possible} onChange={(e) => update(c.id, { possible: e.target.value })} placeholder="Possible" />
                        </span>
                      )}
                    </div>
                    <button type="button" aria-label="Remove category" onClick={() => setCats((cs) => cs.filter((x) => x.id !== c.id))}
                      className="w-10 h-10 rounded-full border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-300 font-bold">×</button>
                  </div>
                  {p !== null && <p className="mt-2 text-xs text-stone-400">{c.name || "Category"} counts as {p.toFixed(1)}% toward the weighted average.</p>}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-4">
            <button type="button" onClick={addCat} className="rounded-full border-2 border-orange-700 text-orange-800 font-semibold px-6 py-2.5 hover:bg-orange-50 transition">+ Add category</button>
            <div className="max-w-[220px] flex-1 min-w-[180px]">
              <label className={labelCls} htmlFor="wg-ec">Extra credit (course points, optional)</label>
              <input id="wg-ec" type="number" step="any" className={inputCls} value={extraCredit} onChange={(e) => setExtraCredit(e.target.value)} placeholder="e.g. 2" />
            </div>
            <p className={`text-sm font-semibold ${calc.totalWeight === 100 ? "text-green-700" : "text-amber-700"}`}>
              Weights total {calc.totalWeight}% {calc.totalWeight === 100 ? "✓" : "(most syllabi total 100%)"}
            </p>
          </div>

          {calc.currentAvg !== null ? (
            <div className="mt-8">
              <p className="text-center font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {calc.currentAvg.toFixed(1)}% <span className="text-orange-500 text-4xl">({letterFor(calc.currentAvg)})</span>
              </p>
              <p className="mt-2 text-center text-stone-500">
                Your weighted average across the {calc.gradedWeight}% of the course graded so far.
                You have <strong>secured {calc.secured.toFixed(1)} of the 100</strong> course points.
              </p>
              {calc.remainingWeight > 0 && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                  <p className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-stone-500 bg-stone-50">
                    To finish with… you need this average on the remaining {calc.remainingWeight}%
                  </p>
                  {targets.map((t) => {
                    const need = neededFor(t);
                    return (
                      <div key={t} className="flex items-center justify-between px-6 py-3 border-t border-stone-100">
                        <span className="font-semibold text-stone-600">{t}% overall</span>
                        <span className="font-display text-lg font-bold text-stone-900">
                          {need === null ? "—" : need <= 0 ? "Already secured ✓" : need > 100 ? `${need.toFixed(1)}% — not possible` : `${need.toFixed(1)}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-5 text-center">
                <button type="button" onClick={copyResult} className="rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 text-sm hover:bg-stone-800 transition">
                  {copied ? "Copied ✓" : "Copy result summary"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">Enter a grade for at least one category.</p>
          )}
        </div>
      </div>
    </section>
  );
}
