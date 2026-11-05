"use client";

import { useState } from "react";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export function randomDie(sides: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(4294967296 / sides) * sides;
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return (buf[0] % sides) + 1;
  }
}

const PIP_MAP: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function DieFace({ value, sides, rolling }: { value: number; sides: number; rolling: boolean }) {
  if (sides !== 6) {
    return (
      <div className={`w-20 h-20 rounded-2xl bg-stone-950 grid place-items-center shadow-lg ${rolling ? "animate-bounce" : ""}`}>
        <span className="font-display text-3xl font-bold text-orange-400">{value}</span>
      </div>
    );
  }
  const pips = PIP_MAP[value] ?? PIP_MAP[1];
  return (
    <div className={`w-20 h-20 rounded-2xl bg-white border-2 border-stone-900 grid grid-cols-3 grid-rows-3 p-2.5 shadow-lg ${rolling ? "animate-bounce" : ""}`}>
      {Array.from({ length: 9 }, (_, i) => {
        const r = Math.floor(i / 3), c = i % 3;
        const on = pips.some(([pr, pc]) => pr === r && pc === c);
        return <span key={i} className={`w-3.5 h-3.5 rounded-full place-self-center ${on ? "bg-stone-900" : "bg-transparent"}`} />;
      })}
    </div>
  );
}

interface RollRecord { id: number; label: string; values: number[]; total: number }

export default function DiceRoller() {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [values, setValues] = useState<number[]>([3, 5]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<RollRecord[]>([]);

  function roll() {
    setRolling(true);
    const final = Array.from({ length: count }, () => randomDie(sides));
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      setValues(Array.from({ length: count }, () => randomDie(sides)));
      if (ticks >= 6) {
        clearInterval(iv);
        setValues(final);
        setRolling(false);
        setHistory((h) => [
          { id: Date.now(), label: `${count}d${sides}`, values: final, total: final.reduce((a, b) => a + b, 0) },
          ...h,
        ].slice(0, 12));
      }
    }, 70);
  }

  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / Math.max(1, values.length);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="dr-count">Number of dice: {count}</label>
              <input id="dr-count" type="range" min="1" max="10" value={count}
                onChange={(e) => { const n = Number(e.target.value); setCount(n); setValues(Array.from({ length: n }, () => 1)); }}
                className="w-full accent-orange-600" />
            </div>
            <div>
              <span className={labelCls}>Die type</span>
              <div className="flex flex-wrap gap-2">
                {[4, 6, 8, 10, 12, 20, 100].map((s) => (
                  <button key={s} type="button" onClick={() => setSides(s)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${sides === s ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                    d{s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3.5 min-h-20">
            {values.map((v, i) => (<DieFace key={i} value={v} sides={sides} rolling={rolling} />))}
          </div>

          <p className="mt-8 text-center">
            <span className="font-display text-6xl font-bold text-stone-900">{total}</span>
            <span className="block mt-1 text-sm text-stone-500">
              Total of {count}d{sides} · average {avg.toFixed(1)} per die · expected average for a d{sides} is {((sides + 1) / 2).toFixed(1)}
            </span>
          </p>

          <div className="mt-6 text-center">
            <button type="button" onClick={roll} disabled={rolling}
              className="rounded-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-display font-bold text-xl px-10 py-3.5 shadow-warm transition">
              {rolling ? "Rolling…" : "🎲 Roll the Dice"}
            </button>
          </div>

          {history.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-3">Recent rolls</p>
              <div className="space-y-1.5">
                {history.map((h) => (
                  <p key={h.id} className="text-sm text-stone-600 bg-white border border-stone-100 rounded-xl px-4 py-2">
                    <strong className="text-stone-900">{h.label}</strong> → {h.values.join(" + ")} = <strong className="text-orange-700">{h.total}</strong>
                  </p>
                ))}
              </div>
            </div>
          )}
          <p className="mt-6 text-xs text-stone-400 text-center">
            Rolls use your browser&apos;s cryptographic random source — the same grade of randomness as a
            fair physical die, with no server involved.
          </p>
        </div>
      </div>
    </section>
  );
}
