"use client";

import { useMemo, useState } from "react";
import { computeLifeInsurance, estimateTermPremium } from "./calc";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const num = (s: string): number => {
  const v = parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

export default function LifeInsuranceCalculator() {
  const [age, setAge] = useState("38");
  const [debts, setDebts] = useState("25000");
  const [finalExp, setFinalExp] = useState("15000");
  const [income, setIncome] = useState("90000");
  const [incomeYears, setIncomeYears] = useState("12");
  const [discount, setDiscount] = useState("3");
  const [mortgage, setMortgage] = useState("280000");
  const [children, setChildren] = useState("2");
  const [education, setEducation] = useState("100000");
  const [coverage, setCoverage] = useState("100000");
  const [assets, setAssets] = useState("50000");
  const [spouseIncome, setSpouseIncome] = useState("40000");
  const [spouseYears, setSpouseYears] = useState("10");
  const [ssMonthly, setSsMonthly] = useState("2000");
  const [ssYears, setSsYears] = useState("16");
  const [sahmValue, setSahmValue] = useState("0");
  const [sahmYears, setSahmYears] = useState("8");

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
    [],
  );

  const res = useMemo(
    () =>
      computeLifeInsurance({
        debts: num(debts),
        finalExpenses: num(finalExp),
        annualIncome: num(income),
        incomeYears: num(incomeYears),
        discountPct: num(discount),
        mortgageBalance: num(mortgage),
        children: num(children),
        educationPerChild: num(education),
        existingCoverage: num(coverage),
        liquidAssets: num(assets),
        spouseAnnualIncome: num(spouseIncome),
        spouseYears: num(spouseYears),
        ssSurvivorMonthly: num(ssMonthly),
        ssYears: num(ssYears),
        sahmAnnualValue: num(sahmValue),
        sahmYears: num(sahmYears),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debts, finalExp, income, incomeYears, discount, mortgage, children, education, coverage, assets, spouseIncome, spouseYears, ssMonthly, ssYears, sahmValue, sahmYears],
  );
  const premium = estimateTermPremium(num(age), res.dimeNeed);

  const field = (id: string, label: string, value: string, set: (v: string) => void, hint?: string) => (
    <div>
      <label className={labelCls} htmlFor={id}>{label}</label>
      <input id={id} type="number" min="0" step="any" className={inputCls} value={value} onChange={(e) => set(e.target.value)} />
      {hint && <p className="mt-2 text-xs text-stone-400">{hint}</p>}
    </div>
  );
  const group = (title: string, children: React.ReactNode) => (
    <div className="rounded-2xl bg-white border border-stone-200 p-5">
      <p className="font-display font-bold text-stone-900 mb-4">{title}</p>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
  const line = (label: string, value: string, bold = false, negative = false) => (
    <div className={`flex justify-between gap-4 py-2 ${bold ? "font-bold text-stone-900 border-t border-stone-200" : "text-stone-600"}`}>
      <span>{label}</span>
      <span>{negative ? "−" : ""}{value}</span>
    </div>
  );

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-5">
          {group("Income to replace", <>
            {field("li-income", "Your gross annual income ($)", income, setIncome)}
            {field("li-years", "Years your family needs it replaced", incomeYears, setIncomeYears)}
            {field("li-age", "Your age (for the premium estimate)", age, setAge)}
            {field("li-discount", "Discount rate for the HLV method (%)", discount, setDiscount, "Human-life-value discounts future income; 3% is a common planning figure.")}
          </>)}
          {group("Debts, mortgage & final costs", <>
            {field("li-debts", "Debts to clear, excluding mortgage ($)", debts, setDebts, "Cards, car loans, student loans.")}
            {field("li-mortgage", "Mortgage balance to protect ($)", mortgage, setMortgage)}
            {field("li-final", "Final expenses ($)", finalExp, setFinalExp, "Funeral, burial, estate costs — $10,000–$20,000 is typical.")}
          </>)}
          {group("Family", <>
            {field("li-children", "Number of children", children, setChildren)}
            {field("li-education", "Education fund per child ($)", education, setEducation)}
            {field("li-sahm", "Replacing a stay-at-home parent ($ / year)", sahmValue, setSahmValue, "Childcare, transport, household help if a non-earning parent dies. $0 if not applicable.")}
            {field("li-sahmyears", "…for how many years", sahmYears, setSahmYears)}
          </>)}
          {group("What already covers the gap (offsets)", <>
            {field("li-coverage", "Life insurance you already have ($)", coverage, setCoverage)}
            {field("li-assets", "Liquid savings & investments ($)", assets, setAssets)}
            {field("li-spouse", "Spouse's continuing income ($ / year)", spouseIncome, setSpouseIncome)}
            {field("li-spouseyears", "…for how many years", spouseYears, setSpouseYears)}
            {field("li-ss", "Social Security survivor benefit ($ / month, your estimate)", ssMonthly, setSsMonthly, "From your own SSA statement at ssa.gov — enter what your family would actually receive. $0 if unsure.")}
            {field("li-ssyears", "…payable for how many years", ssYears, setSsYears, "Survivor benefits for children run to age 18 (longer for a spouse caring for young children).")}
          </>)}
        </div>
        <p className="mt-4 text-xs text-stone-400">
          No form, no email, no agent will call you: this calculator exists to give you a number, not
          to sell you a policy. Everything runs in your browser.
        </p>

        <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Coverage you need (DIME method)</p>
            <p className="mt-3 font-display text-6xl sm:text-7xl font-bold text-stone-900">{fmt.format(res.dimeNeed)}</p>
            {premium > 0 && (
              <p className="mt-2 text-stone-500">
                A healthy non-smoker aged {Math.round(num(age))} typically sees 20-year term quotes
                around <strong className="text-stone-800">{fmt.format(premium)}/month</strong> for that
                amount — illustrative published averages, not a quote.
              </p>
            )}
          </div>

          <div className="mt-8 max-w-xl mx-auto divide-y divide-stone-100">
            {line("Debts to clear", fmt.format(num(debts)))}
            {line("Final expenses", fmt.format(num(finalExp)))}
            {line(`Income replacement (${num(incomeYears)} years)`, fmt.format(res.dimeIncomeComponent))}
            {line("Mortgage balance", fmt.format(num(mortgage)))}
            {line("Education fund", fmt.format(res.educationTotal))}
            {res.sahmTotal > 0 && line("Stay-at-home parent replacement", fmt.format(res.sahmTotal))}
            {line("Total need before offsets", fmt.format(res.dimeGross), true)}
            {line("Existing coverage + savings", fmt.format(num(coverage) + num(assets)), false, true)}
            {line("Spouse's continuing income", fmt.format(res.spouseOffset), false, true)}
            {line("Social Security survivor benefits", fmt.format(res.ssOffset), false, true)}
            {line("Coverage still needed", fmt.format(res.dimeNeed), true)}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-orange-50 border border-orange-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-700">DIME (this page)</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(res.dimeNeed)}</p>
              <p className="mt-1 text-xs text-stone-500">Itemized: debts, income, mortgage, education</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">Human life value</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(res.hlvNeed)}</p>
              <p className="mt-1 text-xs text-stone-500">Income discounted at {num(discount)}% — the economist&apos;s version</p>
            </div>
            <div className="rounded-2xl bg-stone-50 border border-stone-100 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">The 10× rule</p>
              <p className="mt-2 font-display text-xl font-bold text-stone-900">{fmt.format(res.tenXNeed)}</p>
              <p className="mt-1 text-xs text-stone-500">10× income + mortgage + debts, same offsets</p>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-stone-500 max-w-2xl mx-auto">
            The three methods disagree by design: the 10× rule is a thumb, HLV discounts tomorrow&apos;s
            income, DIME counts what your family would actually have to pay. If the itemized number is
            far from the others, the breakdown above shows exactly why.
          </p>
        </div>
      </div>
    </section>
  );
}
