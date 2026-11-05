"use client";

import { useMemo, useState } from "react";
import { addMonthsIso } from "@/lib/amort";
import { amortizationSummary, scheduleCsv } from "./calc";

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

export default function AmortizationCalculator() {
  const [amount, setAmount] = useState("320000");
  const [rate, setRate] = useState("6.25");
  const [years, setYears] = useState("30");
  const [monthsPart, setMonthsPart] = useState("0");
  const [start, setStart] = useState(() => new Date().toISOString().slice(0, 10));
  const [extraMonthly, setExtraMonthly] = useState("0");
  const [annualLump, setAnnualLump] = useState("0");
  const [lump, setLump] = useState("0");
  const [lumpMonth, setLumpMonth] = useState("12");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const totalMonths = Math.max(1, Math.round(num(years) * 12 + num(monthsPart)));
  const summary = useMemo(
    () =>
      amortizationSummary({
        principal: num(amount),
        annualRatePct: num(rate),
        months: totalMonths,
        startDateIso: start,
        extraMonthly: num(extraMonthly),
        annualLump: num(annualLump),
        lumpSums: num(lump) > 0 ? [{ month: Math.max(1, Math.round(num(lumpMonth))), amount: num(lump) }] : [],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, rate, totalMonths, start, extraMonthly, annualLump, lump, lumpMonth],
  );
  const { result, byYear } = summary;

  const downloadCsv = () => {
    const blob = new Blob([scheduleCsv(result.rows)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <label className={labelCls} htmlFor="am-amount">Loan amount ($)</label>
              <input id="am-amount" type="number" min="0" step="500" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="am-rate">Interest rate (% APR)</label>
              <input id="am-rate" type="number" min="0" step="0.05" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="am-years">Term (years)</label>
                <input id="am-years" type="number" min="0" step="1" className={inputCls} value={years} onChange={(e) => setYears(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="am-months">+ months</label>
                <input id="am-months" type="number" min="0" max="11" step="1" className={inputCls} value={monthsPart} onChange={(e) => setMonthsPart(e.target.value)} />
              </div>
            </div>
            <div>
              <label className={labelCls} htmlFor="am-start">First payment month</label>
              <input id="am-start" type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="am-extra">Extra principal ($ / month)</label>
              <input id="am-extra" type="number" min="0" step="10" className={inputCls} value={extraMonthly} onChange={(e) => setExtraMonthly(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="am-annual">Extra lump sum every year ($)</label>
              <input id="am-annual" type="number" min="0" step="50" className={inputCls} value={annualLump} onChange={(e) => setAnnualLump(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Paid each December (months 12, 24, 36…) — the bonus/refund pattern.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls} htmlFor="am-lump">One-time lump ($)</label>
                <input id="am-lump" type="number" min="0" step="50" className={inputCls} value={lump} onChange={(e) => setLump(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="am-lumpmonth">In month #</label>
                <input id="am-lumpmonth" type="number" min="1" step="1" className={inputCls} value={lumpMonth} onChange={(e) => setLumpMonth(e.target.value)} />
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Fixed-rate, monthly payments, extras applied to principal. Taxes, insurance and fees are
            not part of an amortization schedule — they sit on top of it.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Monthly payment</p>
            <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{fmt.format(result.payment)}</p>
            <p className="mt-2 text-stone-500">
              first payment {fmtDate(summary.firstPaymentDate)} · paid off {fmtDate(summary.payoffDate)} · {result.payoffMonths} payments
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            {stat("Total interest", fmt.format(result.totalInterest))}
            {stat("Total of all payments", fmt.format(result.totalPaid))}
            {stat("Interest share of payments", `${summary.interestSharePct}%`, true)}
          </div>
          {result.crossoverMonth !== null && (
            <p className="mt-6 text-center text-sm text-stone-500 max-w-2xl mx-auto">
              <strong className="text-stone-800">Crossover point:</strong> from payment #
              {result.crossoverMonth} ({fmtDate(addMonthsIso(start, result.crossoverMonth))}) onward,
              more of each payment cuts principal than pays interest — the loan&apos;s downhill half.
            </p>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={downloadCsv}
              className="rounded-full px-5 py-2.5 font-bold text-sm bg-orange-600 text-white hover:bg-orange-700 transition">
              Download schedule (CSV)
            </button>
            <button type="button" onClick={() => window.print()}
              className="rounded-full px-5 py-2.5 font-bold text-sm bg-white border border-stone-300 text-stone-700 hover:border-orange-400 transition">
              Print schedule
            </button>
          </div>

          <div className="mt-10 overflow-x-auto">
            <h3 className="font-display text-lg font-bold text-stone-900 mb-4">Schedule by year</h3>
            <table className="w-full text-sm min-w-[520px]">
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

          <details className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/60 transition group">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
              Full monthly schedule ({result.rows.length} payments)
              <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
            </summary>
            <div className="px-6 pb-5 max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                    <th className="py-2 pr-3">#</th>
                    <th className="py-2 pr-3 text-right">Payment</th>
                    <th className="py-2 pr-3 text-right">Principal</th>
                    <th className="py-2 pr-3 text-right">Interest</th>
                    <th className="py-2 pr-3 text-right">Extra</th>
                    <th className="py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r) => (
                    <tr key={r.month} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-3 font-bold text-stone-800">{r.month}</td>
                      <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.payment)}</td>
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
        </div>
      </div>
    </section>
  );
}
