"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  PROGRAM_DEFAULTS,
  programAffordability,
  programIncomeNeeded,
  type ProgramKey,
} from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

const PROGRAM_KEYS: ProgramKey[] = ["conventional", "fha", "va"];

export default function AffordabilityCalculator() {
  const [mode, setMode] = useState<"afford" | "income">("afford");
  const [program, setProgram] = useState<ProgramKey>("conventional");
  const [income, setIncome] = useState("95000");
  const [price, setPrice] = useState("400000");
  const [debts, setDebts] = useState("400");
  const [down, setDown] = useState("60000");
  const [rate, setRate] = useState("6.75");
  const [term, setTerm] = useState("30");
  const [taxPct, setTaxPct] = useState("1.1");
  const [insurance, setInsurance] = useState("2400");
  const [hoa, setHoa] = useState("0");

  // Hand-off from the DTI calculator: /home-affordability-calculator?income=..&debts=..
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const inc = q.get("income");
    const dbt = q.get("debts");
    if (inc) setIncome(inc);
    if (dbt) setDebts(dbt);
  }, []);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    [],
  );
  const fmt2 = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    [],
  );

  const shared = {
    otherMonthlyDebts: num(debts),
    downPayment: num(down),
    annualRatePct: num(rate),
    termYears: num(term) || 30,
    propertyTaxPctOfPrice: num(taxPct),
    homeInsuranceAnnual: num(insurance),
    hoaMonthly: num(hoa),
  };

  const afford = useMemo(
    () => programAffordability(program, { ...shared, grossAnnualIncome: num(income) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [program, income, debts, down, rate, term, taxPct, insurance, hoa],
  );
  const needed = useMemo(
    () => programIncomeNeeded(program, { ...shared, price: num(price) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [program, price, debts, down, rate, term, taxPct, insurance, hoa],
  );

  const prog = PROGRAM_DEFAULTS[program].program;

  const row = (label: string, value: string, bold = false) => (
    <div className={`flex justify-between gap-4 py-2 ${bold ? "font-bold text-stone-900" : "text-stone-600"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-wrap gap-2 mb-6">
            <button type="button" onClick={() => setMode("afford")}
              className={`rounded-full px-4 py-2 font-bold text-sm transition ${mode === "afford" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              How much house can I afford?
            </button>
            <button type="button" onClick={() => setMode("income")}
              className={`rounded-full px-4 py-2 font-bold text-sm transition ${mode === "income" ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
              Income needed for a home price
            </button>
          </div>

          <div>
            <span className={labelCls}>Loan program (sets the lender&apos;s ratio limits)</span>
            <div className="flex flex-wrap gap-2">
              {PROGRAM_KEYS.map((k) => (
                <button key={k} type="button" onClick={() => setProgram(k)}
                  className={`rounded-full px-4 py-2 font-bold text-sm transition ${program === k ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  {PROGRAM_DEFAULTS[k].program.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-stone-400">
              {prog.note} Mortgage insurance here: {PROGRAM_DEFAULTS[program].miLabel}.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {mode === "afford" ? (
              <div>
                <label className={labelCls} htmlFor="ha-income">Gross annual income ($)</label>
                <input id="ha-income" type="number" min="0" step="1000" className={inputCls} value={income} onChange={(e) => setIncome(e.target.value)} />
              </div>
            ) : (
              <div>
                <label className={labelCls} htmlFor="ha-price">Home price you want ($)</label>
                <input id="ha-price" type="number" min="0" step="5000" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
            )}
            <div>
              <label className={labelCls} htmlFor="ha-debts">Monthly debts, excluding housing ($)</label>
              <input id="ha-debts" type="number" min="0" step="10" className={inputCls} value={debts} onChange={(e) => setDebts(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">Car loans, card minimums, student loans — the payments, not the balances. Not sure? Run the <Link href="/dti-calculator" className="font-semibold text-orange-700">DTI calculator</Link> first.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-down">Down payment ($)</label>
              <input id="ha-down" type="number" min="0" step="1000" className={inputCls} value={down} onChange={(e) => setDown(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-rate">Mortgage rate (%)</label>
              <input id="ha-rate" type="number" min="0" step="0.05" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-term">Loan term</label>
              <select id="ha-term" className={inputCls} value={term} onChange={(e) => setTerm(e.target.value)}>
                <option value="30">30 years</option>
                <option value="20">20 years</option>
                <option value="15">15 years</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-tax">Property tax (% of price / year)</label>
              <input id="ha-tax" type="number" min="0" step="0.05" className={inputCls} value={taxPct} onChange={(e) => setTaxPct(e.target.value)} />
              <p className="mt-2 text-xs text-stone-400">US effective rates run roughly 0.3% (Hawaii) to 2.5% (New Jersey); 1.1% is a mid-US default.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-ins">Homeowner&apos;s insurance ($ / year)</label>
              <input id="ha-ins" type="number" min="0" step="50" className={inputCls} value={insurance} onChange={(e) => setInsurance(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="ha-hoa">HOA dues ($ / month)</label>
              <input id="ha-hoa" type="number" min="0" step="10" className={inputCls} value={hoa} onChange={(e) => setHoa(e.target.value)} />
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-400">
            Estimates for planning, not a pre-approval: lenders verify income, debts and credit, and
            rates move daily. Everything is calculated in your browser.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          {mode === "afford" ? (
            <>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  You can afford a home up to
                </p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {fmt.format(afford.maxPrice)}
                </p>
                <p className="mt-2 text-stone-500">
                  on a {prog.label} loan — capped by your {afford.binding === "front" ? "housing (front-end)" : "total-debt (back-end)"} ratio
                </p>
              </div>
              <div className="mt-8 max-w-xl mx-auto divide-y divide-stone-100">
                {row("Loan amount", fmt.format(afford.loanAmount))}
                {row(`Down payment (${afford.downPct}% down)`, fmt.format(num(down)))}
                {row("Principal & interest / month", fmt2.format(afford.monthlyPI))}
                {row("Property tax / month", fmt2.format(afford.monthlyTax))}
                {row("Insurance / month", fmt2.format(afford.monthlyInsurance))}
                {afford.monthlyHoa > 0 && row("HOA / month", fmt2.format(afford.monthlyHoa))}
                {afford.monthlyMi > 0 && row("Mortgage insurance / month", fmt2.format(afford.monthlyMi))}
                {row("Total monthly cost", fmt2.format(afford.totalMonthly), true)}
              </div>
              {afford.monthlyMi > 0 && program === "conventional" && (
                <p className="mt-4 text-center text-sm text-stone-500">
                  PMI is in that payment because the down payment is under 20%. See when it falls off
                  with the <Link href="/mortgage-payoff-calculator" className="font-semibold text-orange-700">mortgage payoff calculator</Link>.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  Gross income needed for a {fmt.format(num(price))} home
                </p>
                <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">
                  {fmt.format(needed.annualIncome)}
                  <span className="text-2xl text-stone-500"> / year</span>
                </p>
                <p className="mt-2 text-stone-500">
                  with a total housing cost of {fmt2.format(needed.monthlyHousing)} a month on a {prog.label} loan
                </p>
              </div>
              <p className="mt-6 text-center text-sm text-stone-500 max-w-xl mx-auto">
                That is the income at which both of the program&apos;s ratios pass at once. A higher down
                payment or smaller other debts lowers it — try the numbers above and watch it move.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
