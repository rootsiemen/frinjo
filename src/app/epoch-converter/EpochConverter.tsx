"use client";

import { useEffect, useMemo, useState } from "react";
import {
  detectUnit,
  epochToMs,
  msToEpoch,
  formatRelative,
  dateParts,
  UNIT_LABELS,
  type EpochUnit,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const cardCls = "rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm";

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="shrink-0 rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:border-orange-400 hover:text-orange-700 transition"
    >
      {done ? "Copied ✓" : "Copy"}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-200/70 py-2.5 last:border-0">
      <span className="text-sm text-stone-500">{k}</span>
      <span className="flex items-center gap-2 text-right">
        <span className="font-mono text-sm font-bold text-stone-900 break-all">{v}</span>
        <CopyBtn text={v} />
      </span>
    </div>
  );
}

export default function EpochConverter() {
  const [nowMs, setNowMs] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date(nowMs);
  const nowParts = dateParts(now);

  // Epoch -> date
  const [epochInput, setEpochInput] = useState("1762300800");
  const [unitChoice, setUnitChoice] = useState<"auto" | EpochUnit>("auto");
  const parsed = useMemo(() => {
    const v = Number(epochInput.trim());
    if (epochInput.trim() === "" || !Number.isFinite(v)) return null;
    const unit = unitChoice === "auto" ? detectUnit(v) : unitChoice;
    const ms = epochToMs(v, unit);
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return null;
    return { unit, ms, d, parts: dateParts(d) };
  }, [epochInput, unitChoice, nowMs]);

  // Date -> epoch
  const [dtLocal, setDtLocal] = useState("2026-11-05T12:00");
  const dateResult = useMemo(() => {
    if (!dtLocal) return null;
    const d = new Date(dtLocal);
    if (Number.isNaN(d.getTime())) return null;
    const ms = d.getTime();
    return {
      s: String(msToEpoch(ms, "s")),
      ms: String(ms),
      us: String(msToEpoch(ms, "us")),
      ns: String(msToEpoch(ms, "ns")),
    };
  }, [dtLocal]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 grid gap-6">
        {/* Live clock */}
        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Right now · live</p>
          <p className="mt-3 font-mono font-display text-4xl sm:text-5xl font-bold text-stone-900 tabular-nums">
            {Math.floor(nowMs / 1000)}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Current Unix timestamp in seconds — {nowParts.utc} · {nowParts.iso} · updates every second.
          </p>
          <div className="mt-4">
            <Row k="Milliseconds" v={String(nowMs)} />
            <Row k="Microseconds" v={String(msToEpoch(nowMs, "us"))} />
          </div>
        </div>

        {/* Epoch -> date */}
        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Timestamp → date</p>
          <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Convert an epoch timestamp to a human date</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_220px]">
            <div>
              <label className={labelCls} htmlFor="ep-in">Epoch timestamp</label>
              <input id="ep-in" inputMode="numeric" className={`${inputCls} font-mono`} value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)} placeholder="e.g. 1762300800" />
            </div>
            <div>
              <label className={labelCls} htmlFor="ep-unit">Unit</label>
              <select id="ep-unit" className={inputCls} value={unitChoice} onChange={(e) => setUnitChoice(e.target.value as "auto" | EpochUnit)}>
                <option value="auto">Auto-detect</option>
                {(Object.keys(UNIT_LABELS) as EpochUnit[]).map((u) => (
                  <option key={u} value={u}>{UNIT_LABELS[u]}</option>
                ))}
              </select>
            </div>
          </div>
          {parsed ? (
            <div className="mt-5">
              <Row k="Detected unit" v={UNIT_LABELS[parsed.unit]} />
              <Row k="UTC (GMT)" v={parsed.parts.utc} />
              <Row k="ISO 8601" v={parsed.parts.iso} />
              <Row k="Your local time" v={parsed.d.toLocaleString("en-US")} />
              <Row k="Relative" v={formatRelative(parsed.ms, nowMs)} />
              <Row k="Weekday (UTC)" v={parsed.parts.weekday} />
              <Row k="Day of year" v={String(parsed.parts.dayOfYear)} />
            </div>
          ) : (
            <p className="mt-5 text-sm text-stone-500">Enter a valid number — 10 digits is seconds, 13 is milliseconds, 16 is microseconds, 19 is nanoseconds.</p>
          )}
        </div>

        {/* Date -> epoch */}
        <div className={cardCls}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Date → timestamp</p>
          <h3 className="mt-2 font-display text-xl font-bold text-stone-900">Convert a date and time to epoch</h3>
          <div className="mt-4">
            <label className={labelCls} htmlFor="ep-dt">Date &amp; time (your local timezone)</label>
            <input id="ep-dt" type="datetime-local" className={inputCls} value={dtLocal} onChange={(e) => setDtLocal(e.target.value)} />
          </div>
          {dateResult && (
            <div className="mt-5">
              <Row k="Seconds" v={dateResult.s} />
              <Row k="Milliseconds" v={dateResult.ms} />
              <Row k="Microseconds" v={dateResult.us} />
              <Row k="Nanoseconds" v={dateResult.ns} />
            </div>
          )}
        </div>

        <p className="text-xs text-stone-400 text-center">
          Everything runs in your browser — timestamps you paste are never sent anywhere.
        </p>
      </div>
    </section>
  );
}
