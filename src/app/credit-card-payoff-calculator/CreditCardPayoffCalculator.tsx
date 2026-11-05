"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MIN_RULES, simulatePayoff, type CardInput, type MinRule } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

interface CardRow {
  name: string;
  balance: string;
  apr: string;
  rule: MinRule;
  fixed: string;
}

const DEFAULT_CARDS: CardRow[] = [
  { name: "Store card", balance: "2400", apr: "29.99", rule: "interestPlus1", fixed: "75" },
  { name: "Bank card", balance: "5600", apr: "22.99", rule: "interestPlus1", fixed: "150" },
];

function monthsText(m: number): string {
  const y = Math.floor(m / 12);
  const r = m % 12;
  return `${y > 0 ? `${y} yr ` : ""}${r} mo`;
}

export default function CreditCardPayoffCalculator() {
  const [rows, setRows] = useState<CardRow[]>(DEFAULT_CARDS);
  const [extra, setExtra] = useState("100");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const cards: CardInput[] = rows.map((r) => ({
    name: r.name || "Card",
    balance: num(r.balance),
    aprPct: num(r.apr),
    rule: r.rule,
    fixedPayment: num(r.fixed),
  }));

  const avalanche = useMemo(() => simulatePayoff(cards, num(extra), "avalanche"), // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, extra]);
  const snowball = useMemo(() => simulatePayoff(cards, num(extra), "snowball"), // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, extra]);
  const minimums = useMemo(() => simulatePayoff(cards, 0, "minimums"), // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows]);

  const setRow = (i: number, patch: Partial<CardRow>) =>
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const strategyCard = (
    title: string,
    sub: string,
    res: typeof avalanche,
    best: boolean,
  ) => (
    <div className={`rounded-3xl border p-6 ${best ? "border-orange-300 bg-orange-50 shadow-md" : "border-stone-200 bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">{title}</p>
      <p className="mt-1 text-xs text-stone-400">{sub}</p>
      {best && <p className="mt-1 text-xs font-bold text-green-700">★ Cheaper on your numbers</p>}
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-stone-500">Debt-free in</span><span className="font-bold text-stone-900">{res.neverPaysOff ? "Never at this budget" : monthsText(res.months)}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Total interest</span><span className="font-bold text-stone-900">{res.neverPaysOff ? "—" : fmt.format(res.totalInterest)}</span></div>
        <div className="flex justify-between"><span className="text-stone-500">Monthly budget</span><span className="font-bold text-stone-900">{fmt.format(res.monthlyBudget)}</span></div>
      </div>
      {res.order.length > 0 && (
        <div className="mt-4 border-t border-stone-200/70 pt-3">
          <p className="text-xs font-bold uppercase tracking-wide text-stone-400 mb-2">Payoff order</p>
          <ol className="space-y-1 text-sm text-stone-600">
            {res.order.map((o, i) => (
              <li key={i}>{i + 1}. {o.name} — month {o.month}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );

  const cheaper =
    !avalanche.neverPaysOff && (snowball.neverPaysOff || avalanche.totalInterest <= snowball.totalInterest)
      ? "avalanche"
      : "snowball";

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <span className={labelCls}>Your cards</span>
          <div className="space-y-4">
            {rows.map((r, i) => (
              <div key={i} className="rounded-2xl bg-white border border-stone-200 p-4">
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_120px_100px_44px] gap-3">
                  <input type="text" placeholder="Card name" aria-label="Card name" className={inputCls} value={r.name} onChange={(e) => setRow(i, { name: e.target.value })} />
                  <input type="number" min="0" step="50" placeholder="Balance $" aria-label="Balance" className={inputCls} value={r.balance} onChange={(e) => setRow(i, { balance: e.target.value })} />
                  <input type="number" min="0" step="0.1" placeholder="APR %" aria-label="APR" className={inputCls} value={r.apr} onChange={(e) => setRow(i, { apr: e.target.value })} />
                  <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} aria-label="Remove card"
                    className="w-11 rounded-2xl border border-stone-300 bg-white text-stone-500 font-bold hover:border-red-300 hover:text-red-600 transition">×</button>
                </div>
                <div className="mt-3 grid sm:grid-cols-[1fr_auto] gap-3 items-end">
                  <div>
                    <label className={labelCls} htmlFor={`rule-${i}`}>Minimum payment formula</label>
                    <select id={`rule-${i}`} className={inputCls} value={r.rule} onChange={(e) => setRow(i, { rule: e.target.value as MinRule })}>
                      {MIN_RULES.map((m) => (
                        <option key={m.key} value={m.key}>{m.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-stone-400">{MIN_RULES.find((m) => m.key === r.rule)?.detail} Check your card agreement for yours.</p>
                  </div>
                  {r.rule === "fixed" && (
                    <div>
                      <label className={labelCls} htmlFor={`fixed-${i}`}>Fixed payment $</label>
                      <input id={`fixed-${i}`} type="number" min="0" step="5" className={`${inputCls} w-32`} value={r.fixed} onChange={(e) => setRow(i, { fixed: e.target.value })} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <button type="button" onClick={() => setRows((rs) => [...rs, { name: "", balance: "", apr: "", rule: "interestPlus1", fixed: "" }])}
              className="rounded-full px-4 py-2 font-bold text-sm bg-white border border-stone-300 text-stone-700 hover:border-orange-400 transition">
              + Add a card
            </button>
            <div className="flex-1 min-w-[200px]">
              <label className={labelCls} htmlFor="cp-extra">Extra money for cards each month ($)</label>
              <input id="cp-extra" type="number" min="0" step="10" className={inputCls} value={extra} onChange={(e) => setExtra(e.target.value)} />
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-400">
            Both strategies pay every minimum, then throw the same constant budget at one target card —
            the only difference is which card. When a card dies, its payment rolls into the next target.
          </p>
        </div>

        {!minimums.neverPaysOff && (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">If you pay only the minimums</p>
            <p className="mt-2 font-display text-2xl font-bold text-stone-900">
              {monthsText(minimums.months)} and {fmt.format(minimums.totalInterest)} of interest
            </p>
            <p className="mt-1 text-sm text-stone-500">That is the path the minimum-payment formula is designed to sell you. Compare:</p>
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {strategyCard("Avalanche", "Highest APR first — the mathematically cheapest order", avalanche, cheaper === "avalanche")}
          {strategyCard("Snowball", "Smallest balance first — the fastest early wins", snowball, cheaper === "snowball")}
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">
          Avalanche wins the math; snowball wins some people&apos;s motivation. If neither fits, see
          whether rolling the balances into one loan beats both in the{" "}
          <Link href="/debt-consolidation-calculator" className="font-semibold text-orange-700 hover:text-orange-800">
            debt consolidation calculator
          </Link>.
        </p>
      </div>
    </section>
  );
}
