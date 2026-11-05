"use client";

import { useMemo, useState } from "react";
import { addMonthsIso, scheduleByYear } from "@/lib/amort";
import { payoffScenario, extraNeededForTargetDate } from "./calc";

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

export default function LoanPayoffCalculator() {
  const [mode, setMode] = useState<"extra" | "date">("extra");
  const [balance, setBalance] = useState("28000");
  const [rate, setRate] = useState("8.9");
  const [years, setYears] = useState("5");
  const [extra, setExtra] = useState("150");
  const [lump, setLump] = useState("0");
  const [lumpMonth, setLumpMonth] = useState("6");
  const [targetMonths, setTargetMonths] = useState("36");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const remainingMonths = Math.max(1, Math.round(num(years) * 12));
  const scenario = useMemo(
    () =>
      payoffScenario({
        balance: num(balance),
        annualRatePct: num(rate),
        remainingMonths,
        extraMonthly: num(extra),
        lumpSums: num(lump) > 0 ? [{ month: Math.max(1, Math.round(num(lumpMonth))), amount: num(lump) }] : [],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, rate, remainingMonths, extra, lump, lumpMonth],
  );
  const target = useMemo(
    () =>
      extraNeededForTargetDate({
        balance: num(balance),
        annualRatePct: num(rate),
        remainingMonths,
        targetMonths: Math.max(1, Math.round(num(targetMonths))),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, rate, remainingMonths, targetMonths],
  );
  const byYear = scheduleByYear(scenario.accelerated.rows);

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
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="lp-balance">Loan balance ($)</label>
              <input id="lp-balance" type="number" min="0" step="100" className={inputCls} value={balance} onChange={(e) => setBalance(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="lp-rate">Interest rate (% APR)</label>
              <input id="lp-rate" type="number" min="0" step="0.05" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="lp-years">Time left on the loan (years)</label>
              <input id="lp-years" type="number" min="0.1" step="0.5" className={inputCls} value={years} onChange={(e) => setYears(e.target.value)} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode("extra")}
              className={`rounded-full px-4 py-2 font-bold text-sm transition ${mode === "extra" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              I&apos;ll add extra payments
            </button>
            <button type="button" onClick={() => setMode("date")}
              className={`rounded-full px-4 py-2 font-bold text-sm transition ${mode === "date" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              I want it gone by a date
            </button>
          </div>

          {mode === "extra" ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelCls} htmlFor="lp-extra">Extra payment ($ / month)</label>
                <input id="lp-extra" type="number" min="0" step="10" className={inputCls} value={extra} onChange={(e) => setExtra(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="lp-lump">One-time lump sum ($)</label>
                <input id="lp-lump" type="number" min="0" step="50" className={inputCls} value={lump} onChange={(e) => setLump(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="lp-lumpmonth">Paid in month #</label>
                <input id="lp-lumpmonth" type="number" min="1" step="1" className={inputCls} value={lumpMonth} onChange={(e) => setLumpMonth(e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="lp-target">Debt-free within (months)</label>
                <input id="lp-target" type="number" min="1" step="1" className={inputCls} value={targetMonths} onChange={(e) => setTargetMonths(e.target.value)} />
                <p className="mt-2 text-xs text-stone-400">That lands in {fmtDate(addMonthsIso(today, Math.max(1, Math.round(num(targetMonths)))))}.</p>
              </div>
              <div className="rounded-2xl bg-white border border-stone-200 p-4">
                <p className="text-sm text-stone-600">
                  Required payment: <strong className="text-stone-900">{fmt.format(target.requiredPayment)}/month</strong>
                  <br />
                  Current payment: {fmt.format(target.currentPayment)}/month
                  <br />
                  Extra needed: <strong className="text-orange-700">{fmt.format(target.extraNeeded)}/month</strong>
                </p>
              </div>
            </div>
          )}
          <p className="mt-4 text-xs text-stone-400">
            Assumes extra money goes to principal (tell your lender to apply it that way — some
            default to pre-paying next month&apos;s bill). No prepayment penalty is assumed; check yours.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">With your extra payments</p>
            <p className="mt-3 font-display text-5xl sm:text-6xl font-bold text-stone-900">
              Debt-free {fmtDate(addMonthsIso(today, scenario.accelerated.payoffMonths))}
            </p>
            <p className="mt-2 text-stone-500">
              {scenario.monthsSaved > 0
                ? `${scenario.monthsSaved} months sooner — and ${fmt.format(scenario.interestSaved)} of interest never paid`
                : "Add an extra payment above to move this date closer"}
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {stat("Monthly payment (contract)", fmt.format(scenario.baseline.payment))}
            {stat("Interest if you change nothing", fmt.format(scenario.baseline.totalInterest))}
            {stat("Interest with extras", fmt.format(scenario.accelerated.totalInterest), true)}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            {stat("Payoff date, no extras", fmtDate(addMonthsIso(today, scenario.baseline.payoffMonths)))}
            {stat("Total paid with extras", fmt.format(scenario.accelerated.totalPaid), true)}
          </div>

          {byYear.length > 0 && (
            <details className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/60 transition group" open={byYear.length <= 6}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Payoff schedule by year (with extras)
                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                      <th className="py-2 pr-3">Year</th>
                      <th className="py-2 pr-3 text-right">Principal</th>
                      <th className="py-2 pr-3 text-right">Interest</th>
                      <th className="py-2 pr-3 text-right">Extra</th>
                      <th className="py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byYear.map((r) => (
                      <tr key={r.year} className="border-b border-stone-100 last:border-0">
                        <td className="py-2 pr-3 font-bold text-stone-800">{r.year}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.principal)}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.interest)}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.extra)}</td>
                        <td className="py-2 text-right text-stone-600">{fmt.format(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </div>
      </div>
    </section>
  );
}
