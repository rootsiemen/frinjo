"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const DAY = 86400000;

function parseDate(v: string): Date | null {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export function diffInfo(start: Date, end: Date) {
  const totalDays = Math.round((end.getTime() - start.getTime()) / DAY);
  const abs = Math.abs(totalDays);
  // business days counted in the direction start -> end (exclusive of start, inclusive of end)
  let business = 0;
  const step = totalDays >= 0 ? 1 : -1;
  const cur = new Date(start.getTime());
  for (let i = 0; i < abs; i++) {
    cur.setUTCDate(cur.getUTCDate() + step);
    const dow = cur.getUTCDay();
    if (dow !== 0 && dow !== 6) business++;
  }
  const weeks = Math.floor(abs / 7);
  const remDays = abs % 7;
  // calendar-style years/months/days on absolute span
  const a = totalDays >= 0 ? start : end;
  const b = totalDays >= 0 ? end : start;
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  let months = b.getUTCMonth() - a.getUTCMonth();
  let days = b.getUTCDate() - a.getUTCDate();
  if (days < 0) {
    months--;
    days += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { totalDays, abs, business, weeks, remDays, years, months, days };
}

export default function DaysBetween() {
  const [start, setStart] = useState(todayStr());
  const [end, setEnd] = useState("");
  const [baseDate, setBaseDate] = useState(todayStr());
  const [amount, setAmount] = useState("30");
  const [mode, setMode] = useState<"add" | "subtract">("add");
  const [businessOnly, setBusinessOnly] = useState(false);

  const s = parseDate(start);
  const e = parseDate(end);
  const info = s && e ? diffInfo(s, e) : null;

  const shifted = useMemo(() => {
    const base = parseDate(baseDate);
    const n = Number(amount);
    if (!base || !Number.isFinite(n)) return null;
    const dir = mode === "add" ? 1 : -1;
    const out = new Date(base.getTime());
    if (!businessOnly) {
      out.setUTCDate(out.getUTCDate() + dir * Math.trunc(n));
    } else {
      let left = Math.trunc(Math.abs(n));
      while (left > 0) {
        out.setUTCDate(out.getUTCDate() + dir);
        const dow = out.getUTCDay();
        if (dow !== 0 && dow !== 6) left--;
      }
    }
    return out;
  }, [baseDate, amount, mode, businessOnly]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* DIFFERENCE */}
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Days between two dates</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="db-start">Start date</label>
              <input id="db-start" type="date" className={inputCls} value={start} onChange={(ev) => setStart(ev.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="db-end">End date</label>
              <input id="db-end" type="date" className={inputCls} value={end} onChange={(ev) => setEnd(ev.target.value)} />
            </div>
          </div>
          <button type="button"
            onClick={() => { setStart(end); setEnd(start); }}
            className="mt-4 text-sm font-semibold text-orange-700 hover:text-orange-800">
            ⇄ Swap dates
          </button>

          {info && s && e ? (
            <div className="mt-6">
              <p className="text-center font-display text-6xl sm:text-7xl font-bold text-stone-900">
                {info.abs} <span className="text-orange-500 text-4xl sm:text-5xl">days</span>
              </p>
              <p className="mt-2 text-center text-stone-500">
                {fmtDate(info.totalDays >= 0 ? s : e)} → {fmtDate(info.totalDays >= 0 ? e : s)}
                {info.totalDays < 0 && " (end date is before start date — counted backwards)"}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white border border-stone-200 p-5 text-center">
                  <p className="font-display text-2xl font-bold text-stone-900">{info.business}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Business days (Mon–Fri)</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5 text-center">
                  <p className="font-display text-2xl font-bold text-stone-900">
                    {info.weeks} wk{info.remDays > 0 ? ` + ${info.remDays} d` : ""}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Weeks</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5 text-center">
                  <p className="font-display text-2xl font-bold text-stone-900">
                    {info.years > 0 ? `${info.years}y ` : ""}{info.months > 0 ? `${info.months}m ` : ""}{info.days}d
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">Years / months / days</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                Counting rule: the start date is not counted, the end date is — the standard for contracts,
                payroll and deadlines. Business days skip Saturdays and Sundays (public holidays are not included).
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">
              Pick both dates to see the count.
            </p>
          )}
        </div>

        {/* ADD / SUBTRACT */}
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Add or subtract days from a date</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="db-base">Start from</label>
              <input id="db-base" type="date" className={inputCls} value={baseDate} onChange={(ev) => setBaseDate(ev.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="db-amount">Days</label>
              <input id="db-amount" type="number" min="0" max="100000" className={inputCls} value={amount} onChange={(ev) => setAmount(ev.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="db-mode">Direction</label>
              <select id="db-mode" className={inputCls} value={mode} onChange={(ev) => setMode(ev.target.value as "add" | "subtract")}>
                <option value="add">Add days</option>
                <option value="subtract">Subtract days</option>
              </select>
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
            <input type="checkbox" checked={businessOnly} onChange={(ev) => setBusinessOnly(ev.target.checked)}
              className="w-4 h-4 accent-orange-600" />
            Count business days only (skip weekends)
          </label>
          {shifted && (
            <p className="mt-6 text-center">
              <span className="text-stone-500">{mode === "add" ? "Adding" : "Subtracting"} {amount} {businessOnly ? "business " : ""}days {mode === "add" ? "to" : "from"} {baseDate && fmtDate(parseDate(baseDate)!)} gives</span>
              <span className="block mt-2 font-display text-3xl sm:text-4xl font-bold text-stone-900">{fmtDate(shifted)}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
