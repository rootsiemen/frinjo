"use client";

import { useMemo, useState } from "react";
import {
  FINAL_ACTION_DATES,
  EB_CATEGORIES,
  CHARGEABILITY_AREAS,
  checkPriorityDate,
  fmtBulletinDate,
  type EbCategory,
  type Chargeability,
} from "./calc";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";
const segBtn = (active: boolean) =>
  `rounded-xl px-3 py-2.5 text-sm font-bold transition ${active ? "bg-orange-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`;

export default function VisaBulletinChecker() {
  const [cat, setCat] = useState<EbCategory>("EB-2");
  const [country, setCountry] = useState<Chargeability>("India");
  const [pd, setPd] = useState("2014-06-01");

  const cutoff = FINAL_ACTION_DATES[cat][country];
  const result = useMemo(() => checkPriorityDate(cat, country, pd), [cat, country, pd]);

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-stone-900">Priority Date Checker</h2>
          <div className="mt-4">
            <label className={labelCls}>Category</label>
            <div className="flex gap-2">
              {EB_CATEGORIES.map((c) => (
                <button key={c} className={segBtn(cat === c)} onClick={() => setCat(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Country of chargeability</label>
            <div className="flex gap-2">
              {CHARGEABILITY_AREAS.map((c) => (
                <button key={c} className={segBtn(country === c)} onClick={() => setCountry(c)}>
                  {c === "ROW" ? "Rest of World" : c}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Your priority date</label>
            <input
              type="date"
              value={pd}
              onChange={(e) => setPd(e.target.value)}
              className="rounded-2xl border border-stone-300 bg-white px-4 py-3 font-semibold text-stone-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
            />
          </div>

          <div className={`mt-6 rounded-2xl p-5 ${result.current ? "bg-emerald-50 border border-emerald-100" : "bg-amber-50 border border-amber-100"}`}>
            <p className={`font-display text-2xl font-extrabold ${result.current ? "text-emerald-900" : "text-amber-900"}`}>
              {result.label}
            </p>
            <p className="mt-1 text-sm text-stone-600">{result.detail}</p>
            {cutoff && (
              <p className="mt-1 text-xs text-stone-500">
                Cutoff for {cat} / {country === "ROW" ? "Rest of World" : country}: {fmtBulletinDate(cutoff)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-stone-900">October 2026 — Final Action Dates</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200">
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Rest of World</th>
                  <th className="py-2 pr-4">China</th>
                  <th className="py-2">India</th>
                </tr>
              </thead>
              <tbody>
                {EB_CATEGORIES.map((c) => (
                  <tr key={c} className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-semibold text-stone-900">{c}</td>
                    {CHARGEABILITY_AREAS.map((k) => (
                      <td key={k} className="py-2 pr-4 text-stone-600">
                        {FINAL_ACTION_DATES[c][k] ? (
                          fmtBulletinDate(FINAL_ACTION_DATES[c][k]!)
                        ) : (
                          <span className="text-emerald-700 font-semibold">Current</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            EB-4: Dec 15, 2022 (all countries). EB-5 unreserved: ROW Current, China Dec 1, 2016, India Dec 1, 2023.
            Dates change monthly — always confirm with the official bulletin. Not legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}
