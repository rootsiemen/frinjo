"use client";

import { useMemo, useState } from "react";
import { addMonthsIso } from "@/lib/amort";
import { mortgagePayoff, extraNeededForDebtFreeDate } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${y}`;
}
function monthsLabel(m: number): string {
  const y = Math.floor(m / 12);
  const r = m % 12;
  return `${y > 0 ? `${y} yr ` : ""}${r} mo`.trim();
}

export default function MortgagePayoffCalculator() {
  const [balance, setBalance] = useState("320000");
  const [rate, setRate] = useState("6.25");
  const [yearsLeft, setYearsLeft] = useState("25");
  const [origValue, setOrigValue] = useState("380000");
  const [pmi, setPmi] = useState("150");
  const [extra, setExtra] = useState("300");
  const [biweekly, setBiweekly] = useState(false);
  const [targetYears, setTargetYears] = useState("20");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const remainingMonths = Math.max(1, Math.round(num(yearsLeft) * 12));
  const res = useMemo(
    () =>
      mortgagePayoff({
        balance: num(balance),
        annualRatePct: num(rate),
        remainingMonths,
        originalValue: num(origValue),
        pmiMonthly: num(pmi),
        extraMonthly: num(extra),
        biweekly,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, rate, remainingMonths, origValue, pmi, extra, biweekly],
  );
  const target = useMemo(
    () =>
      extraNeededForDebtFreeDate({
        balance: num(balance),
        annualRatePct: num(rate),
        remainingMonths,
        targetMonths: Math.max(1, Math.round(num(targetYears) * 12)),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, rate, remainingMonths, targetYears],
  );

  const stat = (label: string, value: string, highlight = false) => (
    <div className={`rounded-2xl ${highlight ? "bg-orange-50 border-orange-100" : "bg-stone-50 border-stone-100"} border p-5 text-center`}>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${highlight ? "text-orange-700" : "text-stone-500"}`}>{label}</p>
      <p className="mt-2 font-display text-xl font-bold text-stone-900">{value}</p>
    </div>
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="mp-balance">Current mortgage balance ($)</label>
              <input id="mp-balance" type="number" min="0" step="500" className={inputCls} value={balance} onChange={(e) => setBalance(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="mp-rate">Interest rate (%)</label>
              <input id="mp-rate" type="number" min="0" step="0.05" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="mp-years">Years left on the mortgage</label>
              <input id="mp-years" type="number" min="0.5" step="0.5" className={inputCls} value={yearsLeft} onChange={(e) => setYearsLeft(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="mp-value">Home value when you bought it ($)</label>
              <input id="mp-value" type="number" min="0" step="1000" className={inputCls} value={origValue} onChange={(e) => setOrigValue(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">PMI thresholds are measured against the original value, not a new appraisal.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="mp-pmi">PMI you pay now ($ / month, 0 if none)</label>
              <input id="mp-pmi" type="number" min="0" step="5" className={inputCls} value={pmi} onChange={(e) => setPmi(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="mp-extra">Extra principal ($ / month)</label>
              <input id="mp-extra" type="number" min="0" step="10" className={inputCls} value={extra} onChange={(e) => setExtra(e.target.value)} />
            </div>
          </div>
          <label className="mt-5 flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={biweekly} onChange={(e) => setBiweekly(e.target.checked)}
              className="mt-1 w-5 h-5 accent-orange-600" />
            <span className="text-sm text-stone-700">
              <strong>Biweekly payments</strong> — pay half the monthly amount every two weeks.
              That is 26 half-payments = 13 full payments a year, quietly adding one extra payment
              annually (modeled here as an extra {fmt.format(res.biweeklyExtra)} a month).
            </span>
          </label>
          <div className="mt-6 rounded-2xl bg-white border border-stone-200 p-4 grid gap-3 sm:grid-cols-[1fr_auto] items-center">
            <div>
              <label className={labelCls} htmlFor="mp-target">Or solve it: debt-free in (years)</label>
              <input id="mp-target" type="number" min="1" step="1" className={inputCls} value={targetYears} onChange={(e) => setTargetYears(e.target.value)} />
            </div>
            <p className="text-sm text-stone-600 sm:text-right">
              Needs <strong className="text-stone-900">{fmt.format(target.requiredPayment)}/month</strong> of principal &amp; interest
              <br />= <strong className="text-orange-700">{fmt.format(target.extraNeeded)}/month extra</strong> over today&apos;s {fmt.format(target.currentPayment)}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Mortgage-free date with your plan</p>
            <p className="mt-3 font-display text-5xl sm:text-6xl font-bold text-stone-900">
              {fmtDate(addMonthsIso(today, res.accelerated.payoffMonths))}
            </p>
            <p className="mt-2 text-stone-500">
              {res.monthsSaved > 0
                ? `${monthsLabel(res.monthsSaved)} sooner than the ${fmtDate(addMonthsIso(today, res.baseline.payoffMonths))} date on your current path`
                : "Add an extra payment or biweekly above to pull this date closer"}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {stat("Interest saved", fmt.format(res.interestSaved), true)}
            {stat("Interest if nothing changes", fmt.format(res.baseline.totalInterest))}
            {stat("Monthly principal & interest", fmt.format(res.baseline.payment))}
          </div>

          {num(pmi) > 0 && (
            <div className="mt-8 rounded-2xl bg-orange-50 border border-orange-100 p-6">
              <h3 className="font-display text-lg font-bold text-stone-900 text-center">Your PMI drop-off</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">On the current path</p>
                  <p className="mt-1 font-bold text-stone-900">
                    {res.pmiDropMonthBaseline !== null ? fmtDate(addMonthsIso(today, res.pmiDropMonthBaseline)) : "Already below 80%"}
                  </p>
                  <p className="text-sm text-stone-500">{fmt.format(res.pmiPaidBaseline)} of PMI still to pay</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">With your extra payments</p>
                  <p className="mt-1 font-bold text-stone-900">
                    {res.pmiDropMonthAccelerated !== null ? fmtDate(addMonthsIso(today, res.pmiDropMonthAccelerated)) : "Already below 80%"}
                  </p>
                  <p className="text-sm text-stone-500">
                    {fmt.format(res.pmiPaidAccelerated)} of PMI still to pay
                    {res.pmiPaidBaseline - res.pmiPaidAccelerated > 0 && (
                      <> — <strong className="text-orange-700">{fmt.format(res.pmiPaidBaseline - res.pmiPaidAccelerated)} saved</strong></>
                    )}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-stone-400 text-center">
                At 80% of the original value you can request PMI removal; at 78% it must terminate
                automatically on a conventional loan. FHA mortgage insurance follows different rules.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
