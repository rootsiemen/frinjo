"use client";

import { useMemo, useState } from "react";
import {
  computeCompound,
  realValue,
  effectiveApy,
  yearsToTarget,
  computeCd,
  type CompoundFreq,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const PRESETS: { label: string; rate: string }[] = [
  { label: "High-yield savings (example: 4%)", rate: "4" },
  { label: "Balanced portfolio (example: 6%)", rate: "6" },
  { label: "US stocks, long-run average (example: 7%)", rate: "7" },
  { label: "Custom rate", rate: "" },
];

export default function CompoundCalculator() {
  const [mode, setMode] = useState<"grow" | "goal" | "cd">("grow");
  const [initial, setInitial] = useState("10000");
  const [rate, setRate] = useState("5");
  const [preset, setPreset] = useState(3);
  const [years, setYears] = useState("20");
  const [monthly, setMonthly] = useState("200");
  const [freq, setFreq] = useState<CompoundFreq>(12);
  const [inflation, setInflation] = useState("2");
  const [tax, setTax] = useState("0");
  const [target, setTarget] = useState("250000");
  // CD mode
  const [cdPrincipal, setCdPrincipal] = useState("10000");
  const [cdApy, setCdApy] = useState("5");
  const [cdTerm, setCdTerm] = useState("12");
  const [cdWithdraw, setCdWithdraw] = useState("12");
  const [cdPenalty, setCdPenalty] = useState("3");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const yrs = Math.min(50, Math.max(0, Math.round(num(years))));
  const res = useMemo(
    () =>
      computeCompound({
        initial: num(initial),
        annualRatePct: num(rate),
        years: yrs,
        monthlyContribution: num(monthly),
        frequency: freq,
        taxPct: num(tax),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initial, rate, yrs, monthly, freq, tax],
  );
  const real = realValue(res.futureValue, num(inflation), yrs);
  const apy = effectiveApy(num(rate), freq);
  const goalYears = useMemo(
    () =>
      yearsToTarget(
        { initial: num(initial), annualRatePct: num(rate), monthlyContribution: num(monthly), frequency: freq, taxPct: num(tax) },
        num(target),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initial, rate, monthly, freq, tax, target],
  );
  const goalRes = useMemo(
    () =>
      goalYears !== null
        ? computeCompound({ initial: num(initial), annualRatePct: num(rate), years: goalYears, monthlyContribution: num(monthly), frequency: freq, taxPct: num(tax) })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [goalYears, initial, rate, monthly, freq, tax],
  );
  const cd = useMemo(
    () =>
      computeCd({
        principal: num(cdPrincipal),
        apyPct: num(cdApy),
        termMonths: Math.max(1, Math.round(num(cdTerm))),
        withdrawMonth: Math.max(0, Math.round(num(cdWithdraw))),
        penaltyMonths: num(cdPenalty),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cdPrincipal, cdApy, cdTerm, cdWithdraw, cdPenalty],
  );

  const maxValeur = Math.max(1, ...res.rows.map((r) => r.value));

  const applyPreset = (idx: number) => {
    setPreset(idx);
    if (PRESETS[idx].rate) setRate(PRESETS[idx].rate);
  };

  const modeBtn = (m: typeof mode, label: string) => (
    <button type="button" onClick={() => setMode(m)}
      className={`rounded-full px-4 py-2 font-bold text-sm transition ${mode === m ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
      {label}
    </button>
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-6">
            {modeBtn("grow", "Grow my savings")}
            {modeBtn("goal", "Time to reach a goal")}
            {modeBtn("cd", "CD calculator")}
          </div>

          {mode !== "cd" ? (
            <>
              <div>
                <span className={labelCls}>Reference investment (the rate stays editable)</span>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p, i) => (
                    <button key={p.label} type="button" onClick={() => applyPreset(i)}
                      className={`rounded-full px-4 py-2 font-bold text-sm transition ${preset === i ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-stone-400">Example rates are illustrations dated today, not promises — markets do not pay a fixed rate, and past averages are not future returns.</p>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="ci-initial">Initial amount ($)</label>
                  <input id="ci-initial" type="number" min="0" step="100" className={inputCls} value={initial} onChange={(e) => setInitial(e.target.value)} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="ci-rate">Annual return (%)</label>
                  <input id="ci-rate" type="number" min="0" step="0.1" className={inputCls} value={rate} onChange={(e) => { setRate(e.target.value); setPreset(3); }} />
                  <p className="mt-2 text-xs text-stone-400">Effective APY at this compounding: {apy.toFixed(2)}%</p>
                </div>
                {mode === "grow" ? (
                  <div>
                    <label className={labelCls} htmlFor="ci-years">Years</label>
                    <input id="ci-years" type="number" min="1" max="50" step="1" className={inputCls} value={years} onChange={(e) => setYears(e.target.value)} />
                    <input type="range" min="1" max="40" step="1" aria-label="Years" className="mt-3 w-full accent-orange-600" value={years} onChange={(e) => setYears(e.target.value)} />
                    <div className="flex justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wide"><span>1 yr</span><span>40 yrs</span></div>
                  </div>
                ) : (
                  <div>
                    <label className={labelCls} htmlFor="ci-target">Target amount ($)</label>
                    <input id="ci-target" type="number" min="0" step="1000" className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className={labelCls} htmlFor="ci-monthly">Monthly contribution ($)</label>
                  <input id="ci-monthly" type="number" min="0" step="10" className={inputCls} value={monthly} onChange={(e) => setMonthly(e.target.value)} />
                  <p className="mt-2 text-xs text-stone-400">Added at the end of each month, converted to the compounding frequency.</p>
                </div>
                <div>
                  <label className={labelCls} htmlFor="ci-freq">Compounding</label>
                  <select id="ci-freq" className={inputCls} value={String(freq)} onChange={(e) => setFreq(Number(e.target.value) as CompoundFreq)}>
                    <option value="12">Monthly</option>
                    <option value="4">Quarterly</option>
                    <option value="1">Annually</option>
                    <option value="365">Daily</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="ci-tax">Tax on interest each year (%)</label>
                  <input id="ci-tax" type="number" min="0" max="100" step="1" className={inputCls} value={tax} onChange={(e) => setTax(e.target.value)} />
                  <p className="mt-2 text-xs text-stone-400">The tax drag: your marginal rate on interest, for taxable accounts. 0 for IRAs/401(k)s and savings in tax-free wrappers.</p>
                </div>
                {mode === "grow" && (
                  <div>
                    <label className={labelCls} htmlFor="ci-infl">Assumed inflation (%)</label>
                    <input id="ci-infl" type="number" min="0" step="0.1" className={inputCls} value={inflation} onChange={(e) => setInflation(e.target.value)} />
                    <p className="mt-2 text-xs text-stone-400">For the &ldquo;in today&apos;s dollars&rdquo; value below.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="cd-principal">CD deposit ($)</label>
                <input id="cd-principal" type="number" min="0" step="100" className={inputCls} value={cdPrincipal} onChange={(e) => setCdPrincipal(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="cd-apy">APY (%)</label>
                <input id="cd-apy" type="number" min="0" step="0.05" className={inputCls} value={cdApy} onChange={(e) => setCdApy(e.target.value)} />
                <p className="mt-2 text-xs text-stone-400">CDs are quoted on APY — the effective yield — so no compounding setting is needed.</p>
              </div>
              <div>
                <label className={labelCls} htmlFor="cd-term">Term (months)</label>
                <input id="cd-term" type="number" min="1" step="1" className={inputCls} value={cdTerm} onChange={(e) => setCdTerm(e.target.value)} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {[6, 12, 18, 24, 36, 60].map((m) => (
                    <button key={m} type="button" onClick={() => setCdTerm(String(m))}
                      className={`rounded-full px-3 py-1 text-xs font-bold transition ${cdTerm === String(m) ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-600 hover:border-orange-400"}`}>
                      {m} mo
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls} htmlFor="cd-withdraw">Withdraw in month #</label>
                <input id="cd-withdraw" type="number" min="0" step="1" className={inputCls} value={cdWithdraw} onChange={(e) => setCdWithdraw(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="cd-penalty">Early-withdrawal penalty (months of interest)</label>
                <input id="cd-penalty" type="number" min="0" step="1" className={inputCls} value={cdPenalty} onChange={(e) => setCdPenalty(e.target.value)} />
                <p className="mt-2 text-xs text-stone-400">Typically 3 months of interest on terms under a year, 6–12 on longer CDs; your bank&apos;s disclosure states yours. Penalty is capped at the interest earned.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          {mode === "grow" && (
            <>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Value in {yrs} years</p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{fmt.format(res.futureValue)}</p>
                <p className="mt-2 text-stone-500">about {fmt.format(real)} in today&apos;s purchasing power (inflation counted)</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">You contribute</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(res.totalContributed)}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Interest earned</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(res.totalInterest)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">{res.totalTaxPaid > 0 ? "Tax paid on interest" : "Interest share of value"}</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">
                    {res.totalTaxPaid > 0 ? fmt.format(res.totalTaxPaid) : res.futureValue > 0 ? `${((res.netInterest / res.futureValue) * 100).toFixed(1)}%` : "—"}
                  </p>
                </div>
              </div>
              {res.rows.length > 0 && (
                <div className="mt-10">
                  <h3 className="font-display text-lg font-bold text-stone-900 mb-4">Growth year by year</h3>
                  <div className="space-y-2">
                    {res.rows.filter((_, i) => res.rows.length <= 20 || i % Math.ceil(res.rows.length / 20) === 0 || i === res.rows.length - 1).map((r) => (
                      <div key={r.year} className="flex items-center gap-3">
                        <span className="w-14 shrink-0 text-xs font-bold text-stone-500">Year {r.year}</span>
                        <div className="flex-1 h-6 rounded-lg bg-stone-100 overflow-hidden flex">
                          <div className="h-full bg-stone-400" style={{ width: `${(r.contributed / maxValeur) * 100}%` }} />
                          <div className="h-full bg-orange-500" style={{ width: `${(r.interestEarned / maxValeur) * 100}%` }} />
                        </div>
                        <span className="w-28 shrink-0 text-right text-sm font-bold text-stone-800">{fmt.format(r.value)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-stone-400">
                    <span className="inline-block w-3 h-3 rounded bg-stone-400 mr-1 align-middle" /> your contributions
                    {"  "}
                    <span className="inline-block w-3 h-3 rounded bg-orange-500 mr-1 align-middle" /> compound interest
                  </p>
                </div>
              )}
              <details className="mt-8 rounded-2xl border border-stone-200 bg-stone-50/60 transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-4 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  Full year-by-year table
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <div className="px-6 pb-5 max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-stone-400 border-b border-stone-200">
                        <th className="py-2 pr-3">Year</th>
                        <th className="py-2 pr-3 text-right">Contributed</th>
                        <th className="py-2 pr-3 text-right">Interest (cum.)</th>
                        <th className="py-2 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.rows.map((r) => (
                        <tr key={r.year} className="border-b border-stone-100 last:border-0">
                          <td className="py-2 pr-3 font-bold text-stone-800">{r.year}</td>
                          <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.contributed)}</td>
                          <td className="py-2 pr-3 text-right text-stone-600">{fmt.format(r.interestEarned)}</td>
                          <td className="py-2 text-right text-stone-600">{fmt.format(r.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </>
          )}

          {mode === "goal" && (
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Time to reach {fmt.format(num(target))}</p>
              {goalYears === null ? (
                <p className="mt-3 font-display text-3xl font-bold text-stone-900">Not within 100 years on these inputs — raise the contribution, the rate, or lower the target.</p>
              ) : goalYears === 0 ? (
                <p className="mt-3 font-display text-3xl font-bold text-stone-900">You are already there — the target is below your starting amount.</p>
              ) : (
                <>
                  <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{goalYears} years</p>
                  {goalRes && (
                    <p className="mt-2 text-stone-500">
                      ending at {fmt.format(goalRes.futureValue)} — {fmt.format(goalRes.totalContributed)} contributed and {fmt.format(goalRes.netInterest)} of interest
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {mode === "cd" && (
            <>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  {cd.isEarly ? `Value if you withdraw in month ${Math.round(num(cdWithdraw))}` : "Value at maturity"}
                </p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{fmt.format(cd.withdrawalValue)}</p>
                {cd.isEarly && <p className="mt-2 text-stone-500">at maturity it would have been {fmt.format(cd.valueAtMaturity)}</p>}
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Interest earned</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(cd.interestEarned)}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Early-withdrawal penalty</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(cd.penalty)}</p>
                </div>
                <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Interest at maturity</p>
                  <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(cd.interestAtMaturity)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
