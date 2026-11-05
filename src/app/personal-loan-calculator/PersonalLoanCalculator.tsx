"use client";

import { useMemo, useState } from "react";
import { scheduleByYear } from "@/lib/amort";
import { dtiRatios } from "@/lib/dti";
import { computePersonalLoan, type FeeMode } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

export default function PersonalLoanCalculator() {
  const [amount, setAmount] = useState("15000");
  const [rate, setRate] = useState("11.5");
  const [term, setTerm] = useState("48");
  const [fee, setFee] = useState("6");
  const [feeMode, setFeeMode] = useState<FeeMode>("deducted");
  const [income, setIncome] = useState("5200");
  const [debts, setDebts] = useState("650");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const res = useMemo(
    () =>
      computePersonalLoan({
        loanAmount: num(amount),
        noteRatePct: num(rate),
        termMonths: Math.max(1, Math.round(num(term))),
        feePct: num(fee),
        feeMode,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, rate, term, fee, feeMode],
  );
  const byYear = scheduleByYear(res.schedule.rows);
  const dti = dtiRatios(num(income), 0, num(debts) + res.payment);

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
              <label className={labelCls} htmlFor="pl-amount">Loan amount ($)</label>
              <input id="pl-amount" type="number" min="0" step="100" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pl-rate">Quoted rate (% — the note rate)</label>
              <input id="pl-rate" type="number" min="0" step="0.05" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">The Federal Reserve put the average 24-month personal loan rate at about 11.9% — a fair yardstick for offers.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="pl-term">Term (months)</label>
              <input id="pl-term" type="number" min="1" step="1" className={inputCls} value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pl-fee">Origination fee (% of the loan)</label>
              <input id="pl-fee" type="number" min="0" step="0.25" className={inputCls} value={fee} onChange={(e) => setFee(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Typically 1–8% when one is charged. Zero is a valid — and telling — answer.</p>
            </div>
          </div>
          <div className="mt-5">
            <span className={labelCls}>How is the fee taken?</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setFeeMode("deducted")}
                className={`rounded-full px-4 py-2 font-bold text-sm transition ${feeMode === "deducted" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                Deducted from my money
              </button>
              <button type="button" onClick={() => setFeeMode("financed")}
                className={`rounded-full px-4 py-2 font-bold text-sm transition ${feeMode === "financed" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                Added to the balance
              </button>
            </div>
            <p className="mt-2 text-xs text-stone-400">
              {feeMode === "deducted"
                ? "You ask for the full amount but receive less — the most common arrangement, and the one that quietly raises the true APR most."
                : "You receive the full amount and repay the fee with interest on top."}
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-white border border-stone-200 p-5">
            <p className="font-display font-bold text-stone-900">Affordability check (optional)</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="pl-income">Gross monthly income ($)</label>
                <input id="pl-income" type="number" min="0" step="50" className={inputCls} value={income} onChange={(e) => setIncome(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="pl-debts">Other monthly debt payments ($)</label>
                <input id="pl-debts" type="number" min="0" step="10" className={inputCls} value={debts} onChange={(e) => setDebts(e.target.value)} />
              </div>
            </div>
            <p className="mt-3 text-sm text-stone-600">
              With this loan, your back-end debt-to-income ratio is{" "}
              <strong className="text-stone-900">{dti.backPct.toFixed(1)}%</strong> — lenders start
              getting cautious past 36–43%, whatever the loan is for.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Your true APR (with the fee counted)</p>
            <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{res.aprPct.toFixed(2)}%</p>
            <p className="mt-2 text-stone-500">
              against a quoted note rate of {num(rate).toFixed(2)}% — the fee is the difference
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {stat("Monthly payment", fmt.format(res.payment))}
            {stat("Cash you actually receive", fmt.format(res.netReceived), true)}
            {stat("Origination fee", fmt.format(res.feeAmount))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
            {stat("Total interest", fmt.format(res.totalInterest))}
            {stat("Total cost of the loan", fmt.format(res.totalCost), true)}
          </div>
          <p className="mt-6 text-center text-sm text-stone-500 max-w-2xl mx-auto">
            Total cost = everything you hand over minus the cash you actually received. It is the only
            number that lets two offers with different fees be compared fairly.
          </p>

          {byYear.length > 0 && (
            <details className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/60 transition group">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                Repayment schedule by year
                <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <div className="px-6 pb-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                      <th className="py-2 pr-3">Year</th>
                      <th className="py-2 pr-3 text-right">Principal</th>
                      <th className="py-2 pr-3 text-right">Interest</th>
                      <th className="py-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byYear.map((r) => (
                      <tr key={r.year} className="border-b border-stone-100 last:border-0">
                        <td className="py-2 pr-3 font-bold text-stone-800">{r.year}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.principal)}</td>
                        <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.interest)}</td>
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
