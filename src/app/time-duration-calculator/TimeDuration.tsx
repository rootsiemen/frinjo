"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

export interface DurationParts {
  sign: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export function durationBetween(startMs: number, endMs: number): DurationParts {
  let diff = Math.round((endMs - startMs) / 1000);
  const sign = diff < 0 ? -1 : 1;
  diff = Math.abs(diff);
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;
  return { sign, days, hours, minutes, seconds, totalSeconds: diff };
}

function nowLocal(offsetMin = 0): string {
  const d = new Date(Date.now() + offsetMin * 60000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TimeDuration() {
  const [start, setStart] = useState(nowLocal(0));
  const [end, setEnd] = useState(nowLocal(60));
  const [addBase, setAddBase] = useState(nowLocal(0));
  const [addH, setAddH] = useState("8");
  const [addM, setAddM] = useState("30");
  const [dir, setDir] = useState<"after" | "before">("after");

  const parts = useMemo(() => {
    const s = Date.parse(start), e = Date.parse(end);
    if (!Number.isFinite(s) || !Number.isFinite(e)) return null;
    return durationBetween(s, e);
  }, [start, end]);

  const shifted = useMemo(() => {
    const base = Date.parse(addBase);
    const totalMin = (Number(addH) || 0) * 60 + (Number(addM) || 0);
    if (!Number.isFinite(base)) return null;
    const out = new Date(base + (dir === "after" ? 1 : -1) * totalMin * 60000);
    return out.toLocaleString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
  }, [addBase, addH, addM, dir]);

  const pad2 = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Duration between two times</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="td-start">Start date &amp; time</label>
              <input id="td-start" type="datetime-local" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="td-end">End date &amp; time</label>
              <input id="td-end" type="datetime-local" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>
          {parts ? (
            <div className="mt-7">
              <p className="text-center font-display text-5xl sm:text-6xl font-bold text-stone-900">
                {parts.days > 0 && <>{parts.days}d </>}{pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
              </p>
              {parts.sign < 0 && <p className="mt-1 text-center text-sm text-amber-700 font-semibold">End is before start — duration counted backwards.</p>}
              <div className="mt-6 grid gap-4 sm:grid-cols-4 text-center">
                {[
                  [`${(parts.totalSeconds / 3600).toLocaleString("en-US", { maximumFractionDigits: 2 })}`, "Total hours (decimal)"],
                  [`${(parts.totalSeconds / 60).toLocaleString("en-US", { maximumFractionDigits: 1 })}`, "Total minutes"],
                  [`${parts.totalSeconds.toLocaleString()}`, "Total seconds"],
                  [`${(parts.totalSeconds / 86400).toLocaleString("en-US", { maximumFractionDigits: 3 })}`, "Total days (decimal)"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl bg-white border border-stone-200 p-4">
                    <p className="font-display text-xl font-bold text-stone-900">{v}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                Decimal hours are what payroll and timesheets need: 1h 30m = 1.5 hours, not 1.3.
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">Pick both a start and an end.</p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Add or subtract time</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="td-base">From this date &amp; time</label>
              <input id="td-base" type="datetime-local" className={inputCls} value={addBase} onChange={(e) => setAddBase(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="td-h">Hours</label>
              <input id="td-h" type="number" min="0" className={inputCls} value={addH} onChange={(e) => setAddH(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="td-m">Minutes</label>
              <input id="td-m" type="number" min="0" max="59" className={inputCls} value={addM} onChange={(e) => setAddM(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            {(["after", "before"] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDir(d)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${dir === d ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                {d === "after" ? "Add (later)" : "Subtract (earlier)"}
              </button>
            ))}
          </div>
          {shifted && (
            <p className="mt-6 text-center font-display text-3xl font-bold text-stone-900">{shifted}</p>
          )}
        </div>
      </div>
    </section>
  );
}
