"use client";

import { useEffect, useState } from "react";
import { cryptoInt } from "../random-number-generator/Rng";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

type Face = "heads" | "tails";

function Coin({ face, label, flipping }: { face: Face; label: string; flipping: boolean }) {
  const isHeads = face === "heads";
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`w-24 h-24 rounded-full grid place-items-center shadow-xl border-4 ${flipping ? "animate-spin" : ""}`}
        style={{
          background: isHeads
            ? "radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 60%, #b45309)"
            : "radial-gradient(circle at 35% 30%, #e7e5e4, #a8a29e 60%, #78716c)",
          borderColor: isHeads ? "#b45309" : "#78716c",
        }}
      >
        <span className="font-display font-bold text-3xl text-stone-950/70">{isHeads ? "H" : "T"}</span>
      </div>
      <span className="text-sm font-bold text-stone-700">{label}</span>
    </div>
  );
}

export default function CoinFlip() {
  const [coins, setCoins] = useState(1);
  const [faces, setFaces] = useState<Face[]>(["heads"]);
  const [flipping, setFlipping] = useState(false);
  const [headsLabel, setHeadsLabel] = useState("Heads");
  const [tailsLabel, setTailsLabel] = useState("Tails");
  const [total, setTotal] = useState({ h: 0, t: 0 });
  const [batch, setBatch] = useState<{ h: number; t: number; n: number } | null>(null);
  const [bestOfTarget, setBestOfTarget] = useState(3);
  const [race, setRace] = useState({ h: 0, t: 0, winner: null as string | null });
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("frinjo-coin-history");
      if (saved) setHistory(JSON.parse(saved).slice(0, 10));
    } catch { /* ignore */ }
  }, []);

  function flipOnce(): Face {
    return cryptoInt(0, 1) === 0 ? "heads" : "tails";
  }

  function flip() {
    setFlipping(true);
    setTimeout(() => {
      const out = Array.from({ length: coins }, flipOnce);
      setFaces(out);
      setFlipping(false);
      const h = out.filter((f) => f === "heads").length;
      setTotal((t) => ({ h: t.h + h, t: t.t + (out.length - h) }));
      const entry = out.map((f) => (f === "heads" ? headsLabel : tailsLabel)).join(" · ");
      setHistory((hist) => {
        const next = [entry, ...hist].slice(0, 10);
        try { localStorage.setItem("frinjo-coin-history", JSON.stringify(next)); } catch { /* ignore */ }
        return next;
      });
      // best-of race uses the first coin when 1 coin, or majority of flips
      setRace((r) => {
        if (r.winner) return r;
        const winnerFace = h * 2 > out.length ? "heads" : h * 2 < out.length ? "tails" : null;
        if (!winnerFace) return r;
        const nh = r.h + (winnerFace === "heads" ? 1 : 0);
        const nt = r.t + (winnerFace === "tails" ? 1 : 0);
        const winner = nh >= bestOfTarget ? headsLabel : nt >= bestOfTarget ? tailsLabel : null;
        return { h: nh, t: nt, winner };
      });
    }, 450);
  }

  function runBatch(n: number) {
    let h = 0;
    for (let i = 0; i < n; i++) if (flipOnce() === "heads") h++;
    setBatch({ h, t: n - h, n });
  }

  function resetAll() {
    setTotal({ h: 0, t: 0 });
    setBatch(null);
    setRace({ h: 0, t: 0, winner: null });
    setHistory([]);
    try { localStorage.removeItem("frinjo-coin-history"); } catch { /* ignore */ }
  }

  function copyHistory() {
    navigator.clipboard?.writeText(history.join("\n")).then(() => setCopied(true)).catch(() => {});
  }

  const flipsTotal = total.h + total.t;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 max-w-xl mx-auto">
            <div>
              <label className={labelCls} htmlFor="cf-h">Heads means…</label>
              <input id="cf-h" className={inputCls} value={headsLabel} onChange={(e) => setHeadsLabel(e.target.value)} placeholder="Heads (or: Yes, Pizza, Team A…)" />
            </div>
            <div>
              <label className={labelCls} htmlFor="cf-t">Tails means…</label>
              <input id="cf-t" className={inputCls} value={tailsLabel} onChange={(e) => setTailsLabel(e.target.value)} placeholder="Tails (or: No, Burgers, Team B…)" />
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" onClick={() => { setCoins(n); setFaces(Array.from({ length: n }, () => "heads" as Face)); }}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${coins === n ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                {n} coin{n > 1 ? "s" : ""} at once
              </button>
            ))}
          </div>

          <div className="mt-9 flex justify-center gap-6 min-h-32">
            {faces.map((f, i) => (
              <Coin key={i} face={f} flipping={flipping} label={f === "heads" ? headsLabel : tailsLabel} />
            ))}
          </div>

          <div className="mt-7 text-center">
            <button type="button" onClick={flip} disabled={flipping}
              className="rounded-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-display font-bold text-xl px-10 py-3.5 shadow-warm transition">
              {flipping ? "Flipping…" : "🪙 Flip the Coin"}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 text-center">
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="font-display text-2xl font-bold text-stone-900">{total.h} – {total.t}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mt-1">Session score ({flipsTotal} flips)</p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="font-display text-2xl font-bold text-stone-900">
                {race.winner ? `🏆 ${race.winner}` : `${race.h} – ${race.t}`}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mt-1">
                Best-of race — first to {bestOfTarget}
                <input type="number" min="1" max="25" value={bestOfTarget}
                  onChange={(e) => { setBestOfTarget(Math.max(1, Number(e.target.value) || 3)); setRace({ h: 0, t: 0, winner: null }); }}
                  className="ml-2 w-14 rounded-lg border border-stone-300 px-2 py-0.5 text-sm text-stone-900" aria-label="Race target" />
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-stone-200 p-4">
              <p className="font-display text-2xl font-bold text-stone-900">
                {batch ? `${batch.h} / ${batch.n}` : "—"}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mt-1">Last batch (heads / flips)</p>
              <div className="mt-2 flex justify-center gap-1.5">
                {[10, 100, 1000].map((n) => (
                  <button key={n} type="button" onClick={() => runBatch(n)} className="rounded-full border border-stone-300 px-3 py-1 text-xs font-bold text-stone-600 hover:border-orange-400">×{n}</button>
                ))}
              </div>
            </div>
          </div>
          {batch && (
            <p className="mt-3 text-center text-sm text-stone-500">
              Batch of {batch.n}: {batch.h} heads ({((batch.h / batch.n) * 100).toFixed(1)}%) · {batch.t} tails — close to 50/50 is exactly what fairness looks like at scale.
            </p>
          )}

          {history.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">History (saved in your browser)</p>
                <div className="flex gap-2">
                  <button type="button" onClick={copyHistory} className="text-xs font-bold text-orange-700 hover:text-orange-800">{copied ? "Copied ✓" : "Copy"}</button>
                  <button type="button" onClick={resetAll} className="text-xs font-bold text-stone-400 hover:text-red-600">Reset all</button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {history.map((h, i) => (
                  <span key={i} className="text-xs font-semibold bg-white border border-stone-200 rounded-full px-3 py-1 text-stone-600">{h}</span>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-xs text-stone-400 text-center">
            Flips use your browser&apos;s cryptographic random source — a fair 50/50 with no server and
            nothing weighted. A real coin, by contrast, lands on its starting face about 51% of the time
            (the Diaconis finding) — this one does not.
          </p>
        </div>
      </div>
    </section>
  );
}
