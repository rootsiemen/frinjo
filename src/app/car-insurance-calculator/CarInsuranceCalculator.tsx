"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { STATE_MINIMUMS } from "./states";
import { recommendCoverage, limitsLabel, NATIONAL_AVG_FULL_COVERAGE } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const fmtK = (n: number) => (n === 0 ? "not required" : `$${(n / 1000).toLocaleString("en-US")}k`);

export default function CarInsuranceCalculator() {
  const [stateCode, setStateCode] = useState("TX");
  const [netWorth, setNetWorth] = useState("120000");
  const [income, setIncome] = useState("80000");
  const [carValue, setCarValue] = useState("22000");
  const [financed, setFinanced] = useState(false);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    [],
  );

  const res = useMemo(
    () =>
      recommendCoverage({
        stateCode,
        netWorth: num(netWorth),
        annualIncome: num(income),
        carValue: num(carValue),
        financed,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stateCode, netWorth, income, carValue, financed],
  );
  const st = res.state;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="ci-state">Your state</label>
              <select id="ci-state" className={inputCls} value={stateCode} onChange={(e) => setStateCode(e.target.value)}>
                {STATE_MINIMUMS.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
              <p className="mt-2 text-xs text-stone-400">Sets the legal floor your recommendation is checked against.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ci-networth">Net worth ($)</label>
              <input id="ci-networth" type="number" min="0" step="1000" className={inputCls} value={netWorth} onChange={(e) => setNetWorth(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Home equity, savings, investments, cars — everything, minus debts. This is what a judgment comes after.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ci-income">Annual income ($)</label>
              <input id="ci-income" type="number" min="0" step="1000" className={inputCls} value={income} onChange={(e) => setIncome(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Wages can be garnished in most states — income is exposure too.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ci-car">Your car&apos;s value ($)</label>
              <input id="ci-car" type="number" min="0" step="500" className={inputCls} value={carValue} onChange={(e) => setCarValue(e.target.value)} />
            </div>
          </div>
          <label className="mt-5 flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={financed} onChange={(e) => setFinanced(e.target.checked)} className="mt-1 w-5 h-5 accent-orange-600" />
            <span className="text-sm text-stone-700">I have a loan or lease on the car (my lender requires collision &amp; comprehensive)</span>
          </label>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Recommended liability limits for you</p>
            <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{limitsLabel(res.recommended)}</p>
            <p className="mt-2 text-stone-500">
              bodily injury {fmtK(res.recommended.biPerson)} per person / {fmtK(res.recommended.biAccident)} per accident ·
              property damage {fmtK(res.recommended.pd)}
            </p>
            <p className="mt-3 text-sm text-stone-500 max-w-2xl mx-auto">
              Sized to your exposure of <strong className="text-stone-800">{fmt.format(res.exposure)}</strong>{" "}
              (net worth + one year of income).
              {res.recommended.tier === "umbrella" &&
                " At this level, add a $1M personal umbrella policy — it is the cheapest liability insurance sold, typically $150–$300 a year."}
              {" "}Match your uninsured/underinsured motorist (UM/UIM) limits to these — UM/UIM is the
              coverage that pays when the other driver has none.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{st.name} legal minimum</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">
                {st.biPerson === 0 ? "No BI mandate" : limitsLabel(st)}
              </p>
              <p className="mt-1 text-sm text-stone-500">
                {st.pip ? "No-fault state: PIP is part of the mandatory package. " : ""}
                {st.note ?? "The floor keeps you legal, not protected — a single serious crash routinely exceeds it."}
              </p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Collision &amp; comprehensive</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">
                {res.fullCoverage === "required" ? "Required" : res.fullCoverage === "worth-it" ? "Worth it" : "Optional"}
              </p>
              <p className="mt-1 text-sm text-stone-500">{res.fullCoverageReason}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">What it typically costs</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">
                {fmt.format(res.costRange.low)}–{fmt.format(res.costRange.high)}<span className="text-sm text-stone-500"> / yr</span>
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Rough national orientation anchored on the {fmt.format(NATIONAL_AVG_FULL_COVERAGE)} average
                full-coverage premium (Insure.com, 2025) — not a quote. Your state, car, record and
                credit-based score move it a lot. For prices in Pakistan, see our{" "}
                <Link href="/blog/car-insurance-cost-in-pakistan-2026-real-prices-by-car" className="font-semibold text-orange-700 hover:text-orange-800">
                  car insurance cost guide
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
