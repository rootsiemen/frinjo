"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

type ScaleKey = "standard" | "plus";
export const SCALES: Record<ScaleKey, { label: string; cuts: [number, string][] }> = {
  standard: {
    label: "Standard (A ≥ 90, B ≥ 80, C ≥ 70, D ≥ 60)",
    cuts: [[90, "A"], [80, "B"], [70, "C"], [60, "D"], [0, "F"]],
  },
  plus: {
    label: "Plus/minus (A ≥ 93, A− ≥ 90, B+ ≥ 87…)",
    cuts: [[93, "A"], [90, "A−"], [87, "B+"], [83, "B"], [80, "B−"], [77, "C+"], [73, "C"], [70, "C−"], [67, "D+"], [63, "D"], [60, "D−"], [0, "F"]],
  },
};

export function letterFor(pct: number, scale: ScaleKey): string {
  for (const [cut, letter] of SCALES[scale].cuts) if (pct >= cut) return letter;
  return "F";
}

interface StudentRow { name: string; pct: number; letter: string }

export default function TestScore() {
  const [total, setTotal] = useState("25");
  const [wrong, setWrong] = useState("3");
  const [scale, setScale] = useState<ScaleKey>("standard");
  const [roster, setRoster] = useState("");
  const [rosterTotal, setRosterTotal] = useState("25");

  const single = useMemo(() => {
    const t = Number(total), w = Number(wrong);
    if (!(t > 0) || !(w >= 0)) return null;
    const right = t - w;
    const pct = (right / t) * 100;
    return { right, pct, letter: letterFor(pct, scale) };
  }, [total, wrong, scale]);

  const chart = useMemo(() => {
    const t = Number(total);
    if (!(t > 0) || t > 200) return [];
    return Array.from({ length: t + 1 }, (_, w) => {
      const pct = ((t - w) / t) * 100;
      return { wrong: w, pct, letter: letterFor(pct, scale) };
    });
  }, [total, scale]);

  const classStats = useMemo(() => {
    const t = Number(rosterTotal);
    if (!(t > 0) || !roster.trim()) return null;
    const rows: StudentRow[] = [];
    for (const line of roster.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      // formats: "Name, 3" (wrong) or "Name, 22/25" or "Name 88%"
      const m = trimmed.match(/^(.*?)[,:\t]\s*(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+(?:\.\d+)?)|%)?\s*$/);
      if (!m) continue;
      const name = m[1].trim() || "Student";
      let pct: number | null = null;
      if (trimmed.includes("%")) pct = Number(m[2]);
      else if (m[3]) pct = (Number(m[2]) / Number(m[3])) * 100;
      else pct = ((t - Number(m[2])) / t) * 100; // assume number wrong
      if (pct === null || !Number.isFinite(pct)) continue;
      rows.push({ name, pct, letter: letterFor(pct, scale) });
    }
    if (!rows.length) return null;
    const avg = rows.reduce((s, r) => s + r.pct, 0) / rows.length;
    const sorted = [...rows].sort((a, b) => a.pct - b.pct);
    const median = sorted[Math.floor(sorted.length / 2)].pct;
    const dist = new Map<string, number>();
    for (const r of rows) dist.set(r.letter, (dist.get(r.letter) ?? 0) + 1);
    return { rows, avg, median, dist, n: rows.length };
  }, [roster, rosterTotal, scale]);

  function exportClassCsv() {
    if (!classStats) return;
    const rows = ["name,percent,letter", ...classStats.rows.map((r) => `"${r.name}",${r.pct.toFixed(1)},${r.letter}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "class-grades.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="ts-total">Total questions / points</label>
              <input id="ts-total" type="number" min="1" step="any" className={inputCls} value={total} onChange={(e) => setTotal(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ts-wrong">Number wrong (halves allowed)</label>
              <input id="ts-wrong" type="number" min="0" step="0.5" className={inputCls} value={wrong} onChange={(e) => setWrong(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ts-scale">Grading scale</label>
              <select id="ts-scale" className={inputCls} value={scale} onChange={(e) => setScale(e.target.value as ScaleKey)}>
                {(Object.keys(SCALES) as ScaleKey[]).map((k) => (<option key={k} value={k}>{SCALES[k].label}</option>))}
              </select>
            </div>
          </div>

          {single ? (
            <p className="mt-7 text-center">
              <span className="font-display text-6xl sm:text-7xl font-bold text-stone-900">{single.pct.toFixed(1)}%</span>
              <span className="block mt-1 font-display text-3xl font-bold text-orange-600">{single.letter}</span>
              <span className="block mt-1 text-stone-500">{single.right} of {total} correct</span>
            </p>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">Enter the total and how many were wrong.</p>
          )}

          {chart.length > 0 && (
            <details className="mt-7 rounded-2xl border border-stone-200 bg-white">
              <summary className="cursor-pointer px-6 py-4 font-bold text-stone-900">Full grading chart for a {total}-question test (every wrong count)</summary>
              <div className="px-6 pb-5 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1 max-h-72 overflow-auto">
                {chart.map((r) => (
                  <p key={r.wrong} className={`text-sm py-1 border-b border-stone-50 ${single && Number(wrong) === r.wrong ? "font-bold text-orange-700" : "text-stone-600"}`}>
                    {r.wrong} wrong → {r.pct.toFixed(0)}% ({r.letter})
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Class mode — grade a whole roster at once</h2>
          <p className="mt-1 text-sm text-stone-500">
            One line per student: <code className="bg-stone-100 px-1 rounded">Name, 3</code> (3 wrong out of the total below),
            <code className="bg-stone-100 px-1 rounded"> Name, 22/25</code> (score), or <code className="bg-stone-100 px-1 rounded">Name, 88%</code>.
          </p>
          <div className="mt-4 max-w-xs">
            <label className={labelCls} htmlFor="ts-rtotal">Test total (for &quot;wrong&quot; entries)</label>
            <input id="ts-rtotal" type="number" min="1" step="any" className={inputCls} value={rosterTotal} onChange={(e) => setRosterTotal(e.target.value)} />
          </div>
          <textarea rows={6} value={roster} onChange={(e) => setRoster(e.target.value)}
            placeholder={"Ayesha, 2\nBilal, 5\nChen, 24/25\nDana, 76%"}
            className="mt-3 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition font-mono text-sm" />
          {classStats ? (
            <div className="mt-5">
              <div className="grid gap-4 sm:grid-cols-3 text-center">
                <div className="rounded-2xl bg-white border border-stone-200 p-4">
                  <p className="font-display text-2xl font-bold text-stone-900">{classStats.avg.toFixed(1)}%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-1">Class average</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-4">
                  <p className="font-display text-2xl font-bold text-stone-900">{classStats.median.toFixed(1)}%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-1">Median</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-4">
                  <p className="font-display text-2xl font-bold text-stone-900">{classStats.n}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mt-1">Students graded</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-stone-600">
                Distribution: {[...classStats.dist.entries()].map(([l, n]) => `${l}: ${n}`).join(" · ")}
              </p>
              <div className="mt-3 max-h-56 overflow-auto rounded-2xl border border-stone-200 bg-white">
                {classStats.rows.map((r, i) => (
                  <p key={i} className="flex justify-between px-5 py-2 text-sm border-b border-stone-50">
                    <span className="font-semibold text-stone-800">{r.name}</span>
                    <span className="text-stone-600">{r.pct.toFixed(1)}% · <strong className="text-orange-700">{r.letter}</strong></span>
                  </p>
                ))}
              </div>
              <button type="button" onClick={exportClassCsv} className="mt-4 rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 text-sm hover:bg-stone-800 transition">⬇ Export class grades CSV</button>
            </div>
          ) : (
            <p className="mt-3 text-sm text-stone-400">Paste a roster to grade the whole class at once — names stay in your browser, never uploaded.</p>
          )}
        </div>
      </div>
    </section>
  );
}
