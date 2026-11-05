"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

function fmt(n: number, maxFrac = 4): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: maxFrac });
}

function ModeCard({
  title,
  question,
  children,
  result,
  formula,
}: {
  title: string;
  question: string;
  children: React.ReactNode;
  result: string | null;
  formula: string;
}) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">{title}</p>
      <h3 className="mt-2 font-display text-xl font-bold text-stone-900">{question}</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
      <p className="mt-5 font-display text-3xl font-bold text-stone-900">
        {result ?? <span className="text-stone-300">—</span>}
      </p>
      <p className="mt-1.5 text-sm text-stone-500">{formula}</p>
    </div>
  );
}

export default function Percentage() {
  // Mode 1: X% of Y
  const [m1p, setM1p] = useState("20");
  const [m1v, setM1v] = useState("150");
  // Mode 2: X is what % of Y
  const [m2x, setM2x] = useState("45");
  const [m2y, setM2y] = useState("180");
  // Mode 3: change from A to B
  const [m3a, setM3a] = useState("80");
  const [m3b, setM3b] = useState("100");
  // Mode 4: increase/decrease number by %
  const [m4v, setM4v] = useState("250");
  const [m4p, setM4p] = useState("15");
  const [m4dir, setM4dir] = useState<"increase" | "decrease">("increase");
  // Mode 5: reverse — X is P% of what
  const [m5x, setM5x] = useState("30");
  const [m5p, setM5p] = useState("12");

  const n = (s: string) => {
    const v = Number(s);
    return s.trim() !== "" && Number.isFinite(v) ? v : null;
  };

  const r1 = (() => { const p = n(m1p), v = n(m1v); return p !== null && v !== null ? (p / 100) * v : null; })();
  const r2 = (() => { const x = n(m2x), y = n(m2y); return x !== null && y !== null && y !== 0 ? (x / y) * 100 : null; })();
  const r3 = (() => { const a = n(m3a), b = n(m3b); return a !== null && b !== null && a !== 0 ? ((b - a) / Math.abs(a)) * 100 : null; })();
  const r4 = (() => {
    const v = n(m4v), p = n(m4p);
    if (v === null || p === null) return null;
    return m4dir === "increase" ? v * (1 + p / 100) : v * (1 - p / 100);
  })();
  const r5 = (() => { const x = n(m5x), p = n(m5p); return x !== null && p !== null && p !== 0 ? x / (p / 100) : null; })();

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <ModeCard title="Mode 1 · Percent of a number" question="What is X% of Y?"
          result={r1 !== null ? fmt(r1) : null}
          formula="Result = (X ÷ 100) × Y — the everyday one: tips, discounts, tax, grades.">
          <div>
            <label className={labelCls} htmlFor="p1p">X — the percentage %</label>
            <input id="p1p" type="number" step="any" className={inputCls} value={m1p} onChange={(e) => setM1p(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="p1v">Y — the number</label>
            <input id="p1v" type="number" step="any" className={inputCls} value={m1v} onChange={(e) => setM1v(e.target.value)} />
          </div>
        </ModeCard>

        <ModeCard title="Mode 2 · Share of a total" question="X is what % of Y?"
          result={r2 !== null ? `${fmt(r2)}%` : null}
          formula="Result = (X ÷ Y) × 100 — scores ('45 out of 180'), completion rates, market share.">
          <div>
            <label className={labelCls} htmlFor="p2x">X — the part</label>
            <input id="p2x" type="number" step="any" className={inputCls} value={m2x} onChange={(e) => setM2x(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="p2y">Y — the total</label>
            <input id="p2y" type="number" step="any" className={inputCls} value={m2y} onChange={(e) => setM2y(e.target.value)} />
          </div>
        </ModeCard>

        <ModeCard title="Mode 3 · Percentage change" question="Percentage increase / decrease from A to B"
          result={r3 !== null ? `${r3 > 0 ? "▲ +" : r3 < 0 ? "▼ " : ""}${fmt(r3)}%` : null}
          formula="Result = ((B − A) ÷ |A|) × 100 — price rises, salary growth, weight change, stock moves.">
          <div>
            <label className={labelCls} htmlFor="p3a">A — from (original)</label>
            <input id="p3a" type="number" step="any" className={inputCls} value={m3a} onChange={(e) => setM3a(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="p3b">B — to (new)</label>
            <input id="p3b" type="number" step="any" className={inputCls} value={m3b} onChange={(e) => setM3b(e.target.value)} />
          </div>
        </ModeCard>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Mode 4 · Apply a percentage</p>
          <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Increase or decrease a number by X%</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="p4v">The number</label>
              <input id="p4v" type="number" step="any" className={inputCls} value={m4v} onChange={(e) => setM4v(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="p4p">By %</label>
              <input id="p4p" type="number" step="any" className={inputCls} value={m4p} onChange={(e) => setM4p(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="p4dir">Direction</label>
              <select id="p4dir" className={inputCls} value={m4dir} onChange={(e) => setM4dir(e.target.value as "increase" | "decrease")}>
                <option value="increase">Increase</option>
                <option value="decrease">Decrease (discount)</option>
              </select>
            </div>
          </div>
          <p className="mt-5 font-display text-3xl font-bold text-stone-900">{r4 !== null ? fmt(r4) : <span className="text-stone-300">—</span>}</p>
          <p className="mt-1.5 text-sm text-stone-500">
            {m4dir === "increase" ? "Result = number × (1 + X ÷ 100) — raises, markups, interest." : "Result = number × (1 − X ÷ 100) — sale prices, discounts, deductions."}
          </p>
        </div>

        <ModeCard title="Mode 5 · Reverse percentage" question="X is P% of what number?"
          result={r5 !== null ? fmt(r5) : null}
          formula="Result = X ÷ (P ÷ 100) — working backwards: '30 is 12% of what?' or finding the pre-tax price.">
          <div>
            <label className={labelCls} htmlFor="p5x">X — the known part</label>
            <input id="p5x" type="number" step="any" className={inputCls} value={m5x} onChange={(e) => setM5x(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="p5p">P — the percentage %</label>
            <input id="p5p" type="number" step="any" className={inputCls} value={m5p} onChange={(e) => setM5p(e.target.value)} />
          </div>
        </ModeCard>

        <p className="text-xs text-stone-400 text-center">
          All five modes update as you type and run entirely in your browser — nothing is stored.
        </p>
      </div>
    </section>
  );
}
