"use client";

import { useMemo, useState } from "react";
import {
  RACES, KM_PER_MILE, paceSeconds, timeSeconds, distanceKm,
  formatTime, parseTime, buildSplits, round2,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

type Mode = "pace" | "time" | "distance";

export default function PaceCalculator() {
  const [mode, setMode] = useState<Mode>("pace");
  const [unit, setUnit] = useState<"km" | "mi">("km");
  const perMile = unit === "mi";

  const [distInput, setDistInput] = useState("10"); // in selected unit
  const [timeInput, setTimeInput] = useState("50:00"); // hh:mm:ss or mm:ss
  const [paceInput, setPaceInput] = useState("5:00"); // mm:ss per unit

  const distKm = useMemo(() => {
    const d = Number(distInput);
    if (!Number.isFinite(d) || d <= 0) return null;
    return perMile ? d * KM_PER_MILE : d;
  }, [distInput, perMile]);

  const timeSec = parseTime(timeInput);
  const paceSec = parseTime(paceInput);

  const result = useMemo(() => {
    if (mode === "pace" && distKm && timeSec) {
      const p = paceSeconds(distKm, timeSec, perMile);
      return p ? { headline: `${formatTime(p)} /${unit}`, sub: `Average pace for ${distInput} ${unit} in ${formatTime(timeSec)}` } : null;
    }
    if (mode === "time" && distKm && paceSec) {
      const t = timeSeconds(distKm, paceSec, perMile);
      return t ? { headline: formatTime(t), sub: `Finish time for ${distInput} ${unit} at ${formatTime(paceSec)} /${unit}` } : null;
    }
    if (mode === "distance" && timeSec && paceSec) {
      const dkm = distanceKm(timeSec, paceSec, perMile);
      if (!dkm) return null;
      const d = perMile ? dkm / KM_PER_MILE : dkm;
      return { headline: `${round2(d)} ${unit}`, sub: `Distance covered in ${formatTime(timeSec)} at ${formatTime(paceSec)} /${unit}` };
    }
    return null;
  }, [mode, distKm, timeSec, paceSec, perMile, unit, distInput]);

  const splits = useMemo(() => {
    if (!distKm) return [];
    const p = mode === "pace" && timeSec ? paceSeconds(distKm, timeSec, perMile) : paceSec;
    return p ? buildSplits(distKm, p, perMile) : [];
  }, [distKm, mode, timeSec, paceSec, perMile]);

  const pickRace = (km: number) => {
    setDistInput(String(round2(perMile ? km / KM_PER_MILE : km)));
    if (mode === "distance") setMode("pace");
  };

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        <div className={cardCls}>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-1">
              {([["pace", "Find pace"], ["time", "Find finish time"], ["distance", "Find distance"]] as [Mode, string][]).map(([m, label]) => (
                <button key={m} type="button" onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${mode === m ? "bg-orange-600 text-white" : "text-stone-600 hover:text-orange-700"}`}>
                  {label}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-full border border-stone-300 bg-white p-1">
              {(["km", "mi"] as const).map((u) => (
                <button key={u} type="button" onClick={() => setUnit(u)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${unit === u ? "bg-stone-900 text-white" : "text-stone-600 hover:text-orange-700"}`}>
                  {u === "km" ? "Kilometres" : "Miles"}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {RACES.map((r) => (
              <button key={r.name} type="button" onClick={() => pickRace(r.km)}
                className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition">
                {r.name}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {mode !== "distance" && (
              <div>
                <label className={labelCls} htmlFor="pc-dist">Distance ({unit})</label>
                <input id="pc-dist" type="number" step="any" min="0" className={inputCls} value={distInput} onChange={(e) => setDistInput(e.target.value)} />
              </div>
            )}
            {mode !== "time" && (
              <div>
                <label className={labelCls} htmlFor="pc-time">{mode === "distance" ? "Time (h:mm:ss)" : "Finish time (h:mm:ss)"}</label>
                <input id="pc-time" className={`${inputCls} font-mono`} value={timeInput} onChange={(e) => setTimeInput(e.target.value)} placeholder="50:00 or 1:45:30" />
              </div>
            )}
            {mode !== "pace" && (
              <div>
                <label className={labelCls} htmlFor="pc-pace">Pace (min:sec per {unit})</label>
                <input id="pc-pace" className={`${inputCls} font-mono`} value={paceInput} onChange={(e) => setPaceInput(e.target.value)} placeholder="5:00" />
              </div>
            )}
          </div>

          {result ? (
            <div className="mt-6">
              <p className="font-display text-4xl sm:text-5xl font-bold text-stone-900">{result.headline}</p>
              <p className="mt-1.5 text-sm text-stone-500">{result.sub}</p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-stone-500">Fill in the fields — use mm:ss or h:mm:ss for times (e.g. a 5:30 pace, a 1:52:00 half marathon).</p>
          )}
        </div>

        {splits.length > 0 && mode !== "distance" && (
          <div className={cardCls}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Even splits</p>
            <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Split times at this pace</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-stone-500 border-b border-stone-200">
                    <th className="py-2 pr-4 font-semibold">Split</th>
                    <th className="py-2 pr-4 font-semibold">At</th>
                    <th className="py-2 pr-4 font-semibold">Split time</th>
                    <th className="py-2 font-semibold">Clock</th>
                  </tr>
                </thead>
                <tbody>
                  {splits.map((s) => (
                    <tr key={s.n} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-4 font-bold text-stone-800">{s.n}</td>
                      <td className="py-2 pr-4 text-stone-600">{s.distanceLabel}</td>
                      <td className="py-2 pr-4 font-mono text-stone-800">{s.splitTime}</td>
                      <td className="py-2 font-mono font-bold text-stone-900">{s.cumulative}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-stone-400">Even pacing assumed — most runners race slightly faster in the final stretch (negative split).</p>
          </div>
        )}
      </div>
    </section>
  );
}
