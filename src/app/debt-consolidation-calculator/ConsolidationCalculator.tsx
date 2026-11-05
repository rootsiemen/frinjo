"use client";

import { useMemo, useState } from "react";
import {
  currentPath,
  consolidationPath,
  balanceTransferPath,
  verdict,
  type DebtInput,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

interface DebtRow {
  name: string;
  balance: string;
  apr: string;
  payment: string;
}

const DEFAULT_DEBTS: DebtRow[] = [
  { name: "Card A", balance: "8000", apr: "24.99", payment: "250" },
  { name: "Card B", balance: "4000", apr: "19.99", payment: "150" },
];

export default function ConsolidationCalculator() {
  const [rows, setRows] = useState<DebtRow[]>(DEFAULT_DEBTS);
  const [consRate, setConsRate] = useState("11");
  const [consTerm, setConsTerm] = useState("48");
  const [consFee, setConsFee] = useState("3");
  const [feeFinanced, setFeeFinanced] = useState(true);
  const [useBt, setUseBt] = useState(true);
  const [btPromo, setBtPromo] = useState("0");
  const [btMonths, setBtMonths] = useState("12");
  const [btFee, setBtFee] = useState("3");
  const [btRegular, setBtRegular] = useState("22.99");
  const [btPayment, setBtPayment] = useState("400");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const debts: DebtInput[] = rows.map((r) => ({
    name: r.name || "Debt",
    balance: num(r.balance),
    aprPct: num(r.apr),
    monthlyPayment: num(r.payment),
  }));

  const current = useMemo(() => currentPath(debts), // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows]);
  const cons = useMemo(
    () =>
      consolidationPath(current.totalBalance, {
        ratePct: num(consRate),
        termMonths: Math.max(1, Math.round(num(consTerm))),
        feePct: num(consFee),
        feeFinanced,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current.totalBalance, consRate, consTerm, consFee, feeFinanced],
  );
  const bt = useMemo(
    () =>
      useBt
        ? balanceTransferPath(current.totalBalance, {
            promoAprPct: num(btPromo),
            promoMonths: Math.max(0, Math.round(num(btMonths))),
            transferFeePct: num(btFee),
            regularAprPct: num(btRegular),
            monthlyPayment: num(btPayment),
          })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [useBt, current.totalBalance, btPromo, btMonths, btFee, btRegular, btPayment],
  );
  const v = verdict(current, cons, bt);

  const setRow = (i: number, patch: Partial<DebtRow>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const pathCard = (
    title: string,
    best: boolean,
    lines: [string, string][],
  ) => (
    <div className={`rounded-3xl border p-6 ${best ? "border-orange-300 bg-orange-50 shadow-md" : "border-stone-200 bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">{title}</p>
      {best && <p className="mt-1 text-xs font-bold text-green-700">★ Cheapest path on your numbers</p>}
      <div className="mt-4 space-y-2">
        {lines.map(([k, val]) => (
          <div key={k} className="flex justify-between gap-3 text-sm">
            <span className="text-stone-500">{k}</span>
            <span className="font-bold text-stone-900">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const monthsText = (m: number, never: boolean) =>
    never ? "Never — payment misses interest" : `${m} months`;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <span className={labelCls}>Your debts — each one on its own terms</span>
          <div className="space-y-3">
            <div className="hidden sm:grid grid-cols-[1fr_110px_90px_110px_44px] gap-3 text-xs font-bold text-stone-400 uppercase tracking-wide">
              <span>Name</span><span>Balance $</span><span>APR %</span><span>Payment $/mo</span><span></span>
            </div>
            {rows.map((r, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-[1fr_110px_90px_110px_44px] gap-3">
                <input type="text" placeholder="Debt name" aria-label="Debt name" className={inputCls} value={r.name} onChange={(e) => setRow(i, { name: e.target.value })} />
                <input type="number" min="0" step="50" placeholder="Balance" aria-label="Balance" className={inputCls} value={r.balance} onChange={(e) => setRow(i, { balance: e.target.value })} />
                <input type="number" min="0" step="0.1" placeholder="APR" aria-label="APR" className={inputCls} value={r.apr} onChange={(e) => setRow(i, { apr: e.target.value })} />
                <input type="number" min="0" step="5" placeholder="$/mo" aria-label="Monthly payment" className={inputCls} value={r.payment} onChange={(e) => setRow(i, { payment: e.target.value })} />
                <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label="Remove debt"
                  className="w-11 rounded-2xl border border-stone-300 bg-white text-stone-500 font-bold hover:border-red-300 hover:text-red-600 transition">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setRows((rs) => [...rs, { name: "", balance: "", apr: "", payment: "" }])}
            className="mt-3 rounded-full px-4 py-2 font-bold text-sm bg-white border border-stone-300 text-stone-700 hover:border-orange-400 transition">
            + Add a debt
          </button>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <p className="font-display font-bold text-stone-900">The consolidation loan offer</p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <label className={labelCls} htmlFor="cc-rate">Rate %</label>
                  <input id="cc-rate" type="number" min="0" step="0.1" className={inputCls} value={consRate} onChange={(e) => setConsRate(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="cc-term">Term (mo)</label>
                  <input id="cc-term" type="number" min="1" step="1" className={inputCls} value={consTerm} onChange={(e) => setConsTerm(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="cc-fee">Fee %</label>
                  <input id="cc-fee" type="number" min="0" step="0.25" className={inputCls} value={consFee} onChange={(e) => setConsFee(e.target.value)} />
                </div>
              </div>
              <label className="mt-4 flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={feeFinanced} onChange={(e) => setFeeFinanced(e.target.checked)} className="mt-1 w-5 h-5 accent-orange-600" />
                <span className="text-sm text-stone-700">Fee is financed into the loan (unchecked = you pay it in cash up front)</span>
              </label>
            </div>

            <div className="rounded-2xl bg-white border border-stone-200 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={useBt} onChange={(e) => setUseBt(e.target.checked)} className="mt-1 w-5 h-5 accent-orange-600" />
                <span className="font-display font-bold text-stone-900">Compare a balance-transfer offer too</span>
              </label>
              {useBt && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls} htmlFor="bt-promo">Promo APR %</label>
                    <input id="bt-promo" type="number" min="0" step="0.1" className={inputCls} value={btPromo} onChange={(e) => setBtPromo(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="bt-months">Promo months</label>
                    <input id="bt-months" type="number" min="0" step="1" className={inputCls} value={btMonths} onChange={(e) => setBtMonths(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="bt-fee">Transfer fee %</label>
                    <input id="bt-fee" type="number" min="0" step="0.25" className={inputCls} value={btFee} onChange={(e) => setBtFee(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="bt-reg">Rate after promo %</label>
                    <input id="bt-reg" type="number" min="0" step="0.1" className={inputCls} value={btRegular} onChange={(e) => setBtRegular(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelCls} htmlFor="bt-pay">You&apos;d pay ($ / month)</label>
                    <input id="bt-pay" type="number" min="0" step="5" className={inputCls} value={btPayment} onChange={(e) => setBtPayment(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Every debt is modeled on its own balance, APR and payment — no blended averages. A path
            that never retires a debt is shown as such, not hidden.
          </p>
        </div>

        <div className="mt-10">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">The honest verdict</p>
            <p className="mt-3 text-lg text-stone-700 leading-relaxed max-w-3xl mx-auto">{v.message}</p>
            {v.savingVsCurrent > 0 && (
              <p className="mt-3 font-display text-3xl font-bold text-stone-900">
                Saving vs staying put: {fmt.format(v.savingVsCurrent)}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {pathCard("Stay the course", v.best === "current", [
              ["Total owed", fmt.format(current.totalBalance)],
              ["Payments now", `${fmt.format(current.totalMonthlyPayment)}/mo`],
              ["Time", monthsText(current.months, current.anyNeverPaysOff)],
              ["Interest", current.anyNeverPaysOff ? "Grows forever" : fmt.format(current.totalInterest)],
              ["Total cost", current.anyNeverPaysOff ? "—" : fmt.format(current.totalPaid)],
            ])}
            {pathCard("Consolidation loan", v.best === "consolidation", [
              ["New loan", fmt.format(cons.loanAmount)],
              ["Payment", `${fmt.format(cons.payment)}/mo`],
              ["Time", `${cons.months} months`],
              ["Interest", fmt.format(cons.totalInterest)],
              ["Total cost (incl. fee)", fmt.format(cons.totalCost)],
            ])}
            {bt &&
              pathCard("Balance transfer", v.best === "transfer", [
                ["Moved (incl. fee)", fmt.format(current.totalBalance + bt.feeAmount)],
                ["Payment", `${fmt.format(num(btPayment))}/mo`],
                ["Time", monthsText(bt.months, bt.neverPaysOff)],
                ["Interest", fmt.format(bt.totalInterest)],
                ["Total cost", bt.neverPaysOff ? "—" : fmt.format(bt.totalPaid)],
              ])}
          </div>

          <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm overflow-x-auto">
            <h3 className="font-display text-lg font-bold text-stone-900 mb-4">Each debt, on its own path</h3>
            <table className="w-full text-sm min-w-[520px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                  <th className="py-2 pr-3">Debt</th>
                  <th className="py-2 pr-3 text-right">Balance</th>
                  <th className="py-2 pr-3 text-right">APR</th>
                  <th className="py-2 pr-3 text-right">Months to clear</th>
                  <th className="py-2 text-right">Interest</th>
                </tr>
              </thead>
              <tbody>
                {current.perDebt.map((d, i) => (
                  <tr key={i} className="border-b border-stone-100 last:border-0">
                    <td className="py-2 pr-3 font-bold text-stone-800">{d.name}</td>
                    <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(d.balance)}</td>
                    <td className="py-2 pr-3 text-right text-stone-600">{d.aprPct}%</td>
                    <td className="py-2 pr-3 text-right text-stone-600">{d.neverPaysOff ? "Never at this payment" : d.months}</td>
                    <td className="py-2 text-right text-stone-600">{d.neverPaysOff ? "—" : fmt.format(d.totalInterest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
