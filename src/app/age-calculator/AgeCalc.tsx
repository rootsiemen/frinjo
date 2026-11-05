"use client";

import { useEffect, useMemo, useState } from "react";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/** Chinese New Year dates (month-day) by year — standard published calendar values. */
const LNY: Record<number, [number, number]> = {
  1980: [2, 16], 1981: [2, 5], 1982: [1, 25], 1983: [2, 13], 1984: [2, 2], 1985: [2, 20],
  1986: [2, 9], 1987: [1, 29], 1988: [2, 17], 1989: [2, 6], 1990: [1, 27], 1991: [2, 15],
  1992: [2, 4], 1993: [1, 23], 1994: [2, 10], 1995: [1, 31], 1996: [2, 19], 1997: [2, 7],
  1998: [1, 28], 1999: [2, 16], 2000: [2, 5], 2001: [1, 24], 2002: [2, 12], 2003: [2, 1],
  2004: [1, 22], 2005: [2, 9], 2006: [1, 29], 2007: [2, 18], 2008: [2, 7], 2009: [1, 26],
  2010: [2, 14], 2011: [2, 3], 2012: [1, 23], 2013: [2, 10], 2014: [1, 31], 2015: [2, 19],
  2016: [2, 8], 2017: [1, 28], 2018: [2, 16], 2019: [2, 5], 2020: [1, 25], 2021: [2, 12],
  2022: [2, 1], 2023: [1, 22], 2024: [2, 10], 2025: [1, 29], 2026: [2, 17], 2027: [2, 6],
  2028: [1, 26], 2029: [2, 13], 2030: [2, 3], 2031: [1, 23],
};
const ANIMALS = ["Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit"];

export function chineseZodiac(birth: Date): string | null {
  const y = birth.getFullYear();
  const lny = LNY[y];
  if (!lny) return null;
  const lnyDate = new Date(y, lny[0] - 1, lny[1]);
  const zodiacYear = birth >= lnyDate ? y : y - 1;
  return ANIMALS[(((zodiacYear - 2024) % 12) + 12) % 12];
}

export function generation(birthYear: number): string {
  if (birthYear >= 2025) return "Generation Beta (2025–)";
  if (birthYear >= 2013) return "Generation Alpha (2013–2024)";
  if (birthYear >= 1997) return "Generation Z (1997–2012)";
  if (birthYear >= 1981) return "Millennial / Gen Y (1981–1996)";
  if (birthYear >= 1965) return "Generation X (1965–1980)";
  if (birthYear >= 1946) return "Baby Boomer (1946–1964)";
  if (birthYear >= 1928) return "Silent Generation (1928–1945)";
  return "Greatest Generation (before 1928)";
}

export function exactAge(dob: Date, now: Date) {
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  if (days < 0) {
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000);
  return { years, months, days, totalDays };
}

export default function AgeCalc() {
  const [dob, setDob] = useState("1995-06-15");
  const [tob, setTob] = useState("");
  const [dob2, setDob2] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const birth = useMemo(() => {
    if (!dob) return null;
    const [y, m, d] = dob.split("-").map(Number);
    if (!y) return null;
    let hh = 0, mm = 0;
    if (tob) { const [H, M] = tob.split(":").map(Number); hh = H || 0; mm = M || 0; }
    return new Date(y, m - 1, d, hh, mm);
  }, [dob, tob]);

  const info = useMemo(() => {
    if (!birth || birth > now) return null;
    const age = exactAge(birth, now);
    const totalSeconds = Math.floor((now.getTime() - birth.getTime()) / 1000);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor(totalSeconds / 60);
    // next birthday
    let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (birth.getMonth() === 1 && birth.getDate() === 29 && next.getDate() !== 29) next = new Date(now.getFullYear(), 2, 1);
    if (next <= now) {
      next = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
      if (birth.getMonth() === 1 && birth.getDate() === 29 && next.getDate() !== 29) next = new Date(now.getFullYear() + 1, 2, 1);
    }
    const daysToNext = Math.ceil((next.getTime() - now.getTime()) / 86400000);
    // half birthday: +6 months from last birthday
    const lastBday = new Date(next.getFullYear() - (daysToNext > 0 && next.getFullYear() === now.getFullYear() + 1 ? 1 : 0), birth.getMonth(), birth.getDate());
    const half = new Date(lastBday); half.setMonth(half.getMonth() + 6);
    const cz = chineseZodiac(birth);
    return {
      age, totalSeconds, totalHours, totalMinutes, next, daysToNext, half,
      gen: generation(birth.getFullYear()),
      weekday: birth.toLocaleDateString("en-US", { weekday: "long" }),
      cz,
      turnsAge: next.getFullYear() - birth.getFullYear(),
    };
  }, [birth, now]);

  const diff = useMemo(() => {
    if (!birth || !dob2) return null;
    const [y, m, d] = dob2.split("-").map(Number);
    if (!y) return null;
    const other = new Date(y, m - 1, d);
    const days = Math.abs(Math.round((other.getTime() - birth.getTime()) / 86400000));
    const yrs = Math.floor(days / 365.2425);
    const mos = Math.floor((days - yrs * 365.2425) / 30.4369);
    return { days, yrs, mos, older: other < birth ? "Person 1" : "Person 2" };
  }, [birth, dob2]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="age-dob">Date of birth</label>
              <input id="age-dob" type="date" className={inputCls} value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="age-tob">Time of birth (optional — for exact age)</label>
              <input id="age-tob" type="time" className={inputCls} value={tob} onChange={(e) => setTob(e.target.value)} />
            </div>
          </div>

          {info ? (
            <div className="mt-8">
              <p className="text-center text-stone-500">Your exact age, ticking live:</p>
              <p className="mt-1 text-center font-display text-5xl sm:text-6xl font-bold text-stone-900">
                {info.age.years}y {info.age.months}m {info.age.days}d
              </p>
              <p className="mt-1 text-center font-mono text-lg text-orange-700 font-bold">
                {Math.floor(info.totalSeconds / 3600).toLocaleString()}h : {pad(Math.floor((info.totalSeconds % 3600) / 60))}m : {pad(info.totalSeconds % 60)}s total lived
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-center">
                {[
                  [info.age.totalDays.toLocaleString(), "Total days"],
                  [info.totalHours.toLocaleString(), "Total hours"],
                  [info.totalMinutes.toLocaleString(), "Total minutes"],
                  [info.weekday, "Day of the week you were born"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-2xl bg-white border border-stone-200 p-4">
                    <p className="font-display text-xl font-bold text-stone-900">{v}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 text-left">
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-bold text-stone-900">Next birthday</p>
                  <p className="mt-1 text-stone-600">{info.next.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} — in <strong>{info.daysToNext} days</strong>, you turn {info.turnsAge}.</p>
                  <p className="mt-2 font-bold text-stone-900">Half birthday</p>
                  <p className="mt-1 text-stone-600">{info.half.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} — the halfway point, celebrated by many Feb-29 babies and half-birthday fans.</p>
                </div>
                <div className="rounded-2xl bg-white border border-stone-200 p-5">
                  <p className="font-bold text-stone-900">Generation</p>
                  <p className="mt-1 text-stone-600">{info.gen} <span className="text-stone-400">(ranges as commonly used by Pew Research Center; exact cut-offs vary by source)</span></p>
                  {info.cz && (<>
                    <p className="mt-2 font-bold text-stone-900">Chinese zodiac</p>
                    <p className="mt-1 text-stone-600">Year of the {info.cz} — by the actual Lunar New Year date, not January 1, so January/February birthdays get the correct sign.</p>
                  </>)}
                </div>
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                Leap-day convention used here: a February 29 birthday is observed on March 1 in non-leap years
                (the rule used in several jurisdictions; some use February 28 — the one-day difference is
                stated openly rather than hidden).
              </p>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 text-center">Enter a date of birth in the past.</p>
          )}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-stone-900">Age difference between two people</h2>
          <div className="mt-4 max-w-sm">
            <label className={labelCls} htmlFor="age-dob2">Second person&apos;s date of birth</label>
            <input id="age-dob2" type="date" className={inputCls} value={dob2} onChange={(e) => setDob2(e.target.value)} />
          </div>
          {diff ? (
            <p className="mt-4 text-lg text-stone-700">
              {diff.older} is older by <strong className="text-stone-900">{diff.yrs > 0 ? `${diff.yrs} years ` : ""}{diff.mos > 0 ? `${diff.mos} months ` : ""}({diff.days.toLocaleString()} days)</strong>.
            </p>
          ) : (
            <p className="mt-3 text-sm text-stone-400">Enter a second date of birth to compare — siblings, partners, parent and child.</p>
          )}
        </div>
      </div>
    </section>
  );
}
