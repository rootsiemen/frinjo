"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Unbiased crypto random integer in [min, max] via rejection sampling. */
export function cryptoInt(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;
  const buf = new Uint32Array(1);
  const limit = Math.floor(4294967296 / range) * range;
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return min + (buf[0] % range);
  }
}

export function drawSet(min: number, max: number, count: number, unique: boolean): number[] {
  if (unique) {
    const pool = new Set<number>();
    const guard = Math.min(count, max - min + 1);
    while (pool.size < guard) pool.add(cryptoInt(min, max));
    return [...pool];
  }
  return Array.from({ length: count }, () => cryptoInt(min, max));
}

interface LotteryPreset {
  key: string; label: string; main: [number, number, number]; bonus: [number, number, number] | null; note: string;
}
const LOTTERY: LotteryPreset[] = [
  { key: "powerball", label: "Powerball (US)", main: [5, 1, 69], bonus: [1, 1, 26], note: "5 numbers 1–69 + Powerball 1–26" },
  { key: "mega", label: "Mega Millions (US)", main: [5, 1, 70], bonus: [1, 1, 24], note: "5 numbers 1–70 + Mega Ball 1–24 (current format since April 2025)" },
  { key: "euro", label: "EuroMillions", main: [5, 1, 50], bonus: [2, 1, 12], note: "5 numbers 1–50 + 2 Lucky Stars 1–12" },
  { key: "uklotto", label: "UK Lotto", main: [6, 1, 59], bonus: null, note: "6 numbers 1–59" },
  { key: "cash4life", label: "Cash4Life (US)", main: [5, 1, 60], bonus: [1, 1, 4], note: "5 numbers 1–60 + Cash Ball 1–4" },
];

export default function Rng() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("6");
  const [unique, setUnique] = useState(true);
  const [sort, setSort] = useState(true);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<number[][]>([]);
  const [lottoLines, setLottoLines] = useState<{ main: number[]; bonus: number[] | null; label: string }[]>([]);
  const [preset, setPreset] = useState("powerball");
  const [lines, setLines] = useState("3");
  const [copied, setCopied] = useState(false);

  function generate() {
    const lo = Math.floor(Number(min)), hi = Math.floor(Number(max)), n = Math.min(1000, Math.max(1, Math.floor(Number(count) || 1)));
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi < lo) return;
    let out = drawSet(lo, hi, n, unique);
    if (sort) out = [...out].sort((a, b) => a - b);
    setResults(out);
    setHistory((h) => [out, ...h].slice(0, 8));
    setCopied(false);
  }

  function quickPick() {
    const p = LOTTERY.find((x) => x.key === preset)!;
    const n = Math.min(10, Math.max(1, Number(lines) || 1));
    const out = Array.from({ length: n }, () => ({
      main: drawSet(p.main[1], p.main[2], p.main[0], true).sort((a, b) => a - b),
      bonus: p.bonus ? drawSet(p.bonus[1], p.bonus[2], p.bonus[0], true).sort((a, b) => a - b) : null,
      label: p.label,
    }));
    setLottoLines(out);
  }

  function copyAll() {
    navigator.clipboard?.writeText(results.join(", ")).then(() => setCopied(true)).catch(() => {});
  }
  function downloadTxt() {
    const blob = new Blob([results.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "random-numbers.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-3">
            <div><label className={labelCls} htmlFor="rng-min">Min</label><input id="rng-min" type="number" className={inputCls} value={min} onChange={(e) => setMin(e.target.value)} /></div>
            <div><label className={labelCls} htmlFor="rng-max">Max</label><input id="rng-max" type="number" className={inputCls} value={max} onChange={(e) => setMax(e.target.value)} /></div>
            <div><label className={labelCls} htmlFor="rng-count">How many (up to 1,000)</label><input id="rng-count" type="number" min="1" max="1000" className={inputCls} value={count} onChange={(e) => setCount(e.target.value)} /></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm text-stone-600">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="w-4 h-4 accent-orange-600" /> No duplicates</label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} className="w-4 h-4 accent-orange-600" /> Sort ascending</label>
          </div>
          <div className="mt-6 text-center">
            <button type="button" onClick={generate} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-display font-bold text-xl px-10 py-3.5 shadow-warm transition">Generate</button>
          </div>
          {results.length > 0 && (
            <div className="mt-7">
              <div className="flex flex-wrap justify-center gap-2.5">
                {results.slice(0, 100).map((n, i) => (
                  <span key={i} className="min-w-12 text-center rounded-xl bg-stone-950 text-orange-300 font-display font-bold text-lg px-3 py-2">{n}</span>
                ))}
                {results.length > 100 && <span className="text-sm text-stone-400 self-center">…and {results.length - 100} more (all included in copy/download)</span>}
              </div>
              <div className="mt-5 flex justify-center gap-3">
                <button type="button" onClick={copyAll} className="rounded-full bg-stone-900 text-white font-bold px-6 py-2.5 text-sm hover:bg-stone-800 transition">{copied ? "Copied ✓" : "Copy all"}</button>
                <button type="button" onClick={downloadTxt} className="rounded-full border border-stone-300 bg-white font-bold px-6 py-2.5 text-sm text-stone-600 hover:border-orange-400 transition">⬇ Download .txt</button>
              </div>
            </div>
          )}
          {history.length > 1 && (
            <div className="mt-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">Previous draws this session</p>
              <div className="space-y-1.5">
                {history.slice(1).map((h, i) => (
                  <p key={i} className="text-sm text-stone-500 bg-white border border-stone-100 rounded-xl px-4 py-2 truncate">{h.join(", ")}</p>
                ))}
              </div>
            </div>
          )}
          <p className="mt-5 text-xs text-stone-400 text-center">
            Numbers come from your browser&apos;s cryptographic random source with rejection sampling —
            uniformly distributed, no server, nothing stored.
          </p>
        </div>

        <div className="rounded-3xl border border-stone-950 bg-stone-950 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-white">🎱 Lottery quick pick</h2>
          <p className="mt-1 text-sm text-stone-400">The feature the plain number generators skip: real game formats with bonus balls, multiple lines at once.</p>
          <div className="mt-5 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[220px]">
              <label className="block text-sm font-bold text-stone-300 mb-2" htmlFor="rng-preset">Game</label>
              <select id="rng-preset" className="w-full rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-white focus:border-orange-500 focus:outline-none" value={preset} onChange={(e) => setPreset(e.target.value)}>
                {LOTTERY.map((p) => (<option key={p.key} value={p.key}>{p.label}</option>))}
              </select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-bold text-stone-300 mb-2" htmlFor="rng-lines">Lines</label>
              <input id="rng-lines" type="number" min="1" max="10" className="w-full rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-white focus:border-orange-500 focus:outline-none" value={lines} onChange={(e) => setLines(e.target.value)} />
            </div>
            <button type="button" onClick={quickPick} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-7 py-3 transition">Quick pick</button>
          </div>
          <p className="mt-3 text-xs text-stone-500">{LOTTERY.find((p) => p.key === preset)?.note}. Every ticket has the same odds — a quick pick is exactly as likely to win as any hand-chosen line; no generator can improve your chances, and anyone who claims otherwise is selling something.</p>
          {lottoLines.length > 0 && (
            <div className="mt-5 space-y-3">
              {lottoLines.map((l, i) => (
                <div key={i} className="flex flex-wrap items-center gap-2">
                  {l.main.map((n, j) => (
                    <span key={j} className="w-11 h-11 rounded-full bg-white text-stone-950 font-display font-bold grid place-items-center">{n}</span>
                  ))}
                  {l.bonus && (<>
                    <span className="text-stone-500 font-bold mx-1">+</span>
                    {l.bonus.map((n, j) => (
                      <span key={j} className="w-11 h-11 rounded-full bg-orange-600 text-white font-display font-bold grid place-items-center">{n}</span>
                    ))}
                  </>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
