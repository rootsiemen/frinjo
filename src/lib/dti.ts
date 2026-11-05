// Shared debt-to-income (DTI) engine — powers the DTI calculator and the
// home affordability calculator. Pure functions, no React, unit-testable.
// Ratios follow the standard US mortgage definitions:
//   front-end (housing) ratio = housing expense / gross monthly income
//   back-end (total debt) ratio = (housing + all recurring debts) / income

import { monthlyPaymentMonths } from "./amort";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number, fallback = 0): number => (Number.isFinite(n) ? n : fallback);

export interface DtiResult {
  frontPct: number;
  backPct: number;
  totalMonthlyDebts: number;
}

/** Front-end and back-end DTI percentages. Income of 0 returns zeros. */
export function dtiRatios(
  grossMonthlyIncome: number,
  housingMonthly: number,
  otherMonthlyDebts: number,
): DtiResult {
  const income = Math.max(0, clean(grossMonthlyIncome));
  const housing = Math.max(0, clean(housingMonthly));
  const debts = Math.max(0, clean(otherMonthlyDebts));
  if (income === 0) return { frontPct: 0, backPct: 0, totalMonthlyDebts: round2(housing + debts) };
  return {
    frontPct: round2((housing / income) * 100),
    backPct: round2(((housing + debts) / income) * 100),
    totalMonthlyDebts: round2(housing + debts),
  };
}

export interface LoanProgram {
  key: "conventional" | "fha" | "va";
  label: string;
  /** Guideline front-end (housing) cap, % — null for VA (no front-end cap). */
  frontCapPct: number | null;
  /** Guideline back-end (total debt) cap, %. */
  backCapPct: number;
  /** Documented maximum back-end ratio with strong compensating factors. */
  maxBackPct: number;
  note: string;
}

export const LOAN_PROGRAMS: LoanProgram[] = [
  {
    key: "conventional",
    label: "Conventional",
    frontCapPct: 28,
    backCapPct: 36,
    maxBackPct: 50,
    note: "The classic 28/36 rule. Automated underwriting can approve back-end ratios up to about 50% with strong credit and reserves.",
  },
  {
    key: "fha",
    label: "FHA",
    frontCapPct: 31,
    backCapPct: 43,
    maxBackPct: 56.9,
    note: "FHA guidelines use 31/43; with compensating factors the back-end ratio can reach 56.9%. FHA loans carry an upfront mortgage insurance premium (1.75%) plus an annual premium (0.55% for most 30-year loans).",
  },
  {
    key: "va",
    label: "VA",
    frontCapPct: null,
    backCapPct: 41,
    maxBackPct: 60,
    note: "VA loans have no front-end cap; the 41% back-end figure is a guideline, and lenders weigh residual income heavily. No monthly mortgage insurance — a one-time funding fee (2.15% for first use with less than 5% down) is usually financed into the loan.",
  },
];

/** The largest housing payment a program's ratios allow for this borrower. */
export function maxHousingPayment(
  grossMonthlyIncome: number,
  otherMonthlyDebts: number,
  program: LoanProgram,
): number {
  const income = Math.max(0, clean(grossMonthlyIncome));
  const debts = Math.max(0, clean(otherMonthlyDebts));
  const byBack = (program.backCapPct / 100) * income - debts;
  const byFront =
    program.frontCapPct === null ? Infinity : (program.frontCapPct / 100) * income;
  return round2(Math.max(0, Math.min(byBack, byFront)));
}

/** How much additional monthly debt payment fits under a target back-end
 *  ratio, given the borrower's current housing cost and debts. */
export function maxAdditionalDebtPayment(
  grossMonthlyIncome: number,
  housingMonthly: number,
  otherMonthlyDebts: number,
  targetBackPct: number,
): number {
  const income = Math.max(0, clean(grossMonthlyIncome));
  const used =
    Math.max(0, clean(housingMonthly)) + Math.max(0, clean(otherMonthlyDebts));
  return round2(Math.max(0, (Math.max(0, clean(targetBackPct)) / 100) * income - used));
}

export interface AffordabilityInput {
  grossAnnualIncome: number;
  /** Recurring monthly debts excluding the new housing payment. */
  otherMonthlyDebts: number;
  downPayment: number;
  annualRatePct: number;
  termYears: number;
  program: LoanProgram;
  /** Annual property tax as % of the home price. */
  propertyTaxPctOfPrice: number;
  /** Annual homeowner's insurance, dollars. */
  homeInsuranceAnnual: number;
  hoaMonthly: number;
  /** Annual mortgage-insurance rate on the loan, % (conventional PMI). */
  pmiAnnualPct: number;
  /** One-time fee financed into the loan, % of the base loan (FHA UFMIP
   *  1.75%, VA funding fee 2.15%). 0 for conventional. */
  financedFeePct: number;
  /** Charge mortgage insurance from day one regardless of LTV (FHA annual
   *  MIP). Conventional PMI is charged only while LTV > 80%. */
  miAlways?: boolean;
}

export interface AffordabilityResult {
  maxPrice: number;
  loanAmount: number;
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyMi: number;
  totalMonthly: number;
  /** Which ratio capped the price. */
  binding: "front" | "back";
  downPct: number;
}

/** Solve the maximum home price whose full monthly cost fits the program's
 *  ratios. Cost = P&I + property tax + insurance + HOA + mortgage insurance
 *  (PMI/MIP charged while LTV > 80%). Monotonic in price → bisection. */
export function affordability(input: AffordabilityInput): AffordabilityResult {
  const income = Math.max(0, clean(input.grossAnnualIncome)) / 12;
  const debts = Math.max(0, clean(input.otherMonthlyDebts));
  const down = Math.max(0, clean(input.downPayment));
  const months = Math.max(1, Math.round(clean(input.termYears, 30) * 12));
  const taxPct = Math.max(0, clean(input.propertyTaxPctOfPrice));
  const insMonthly = Math.max(0, clean(input.homeInsuranceAnnual)) / 12;
  const hoa = Math.max(0, clean(input.hoaMonthly));
  const feePct = Math.max(0, clean(input.financedFeePct)) / 100;
  const pmiPct = Math.max(0, clean(input.pmiAnnualPct)) / 100;

  const budget = maxHousingPayment(income, debts, input.program);
  const binding: "front" | "back" =
    input.program.frontCapPct !== null &&
    (input.program.frontCapPct / 100) * income <=
      (input.program.backCapPct / 100) * income - debts
      ? "front"
      : "back";

  const costAt = (price: number) => {
    const baseLoan = Math.max(0, price - down);
    const loan = baseLoan * (1 + feePct);
    const pi = monthlyPaymentMonths(loan, input.annualRatePct, months);
    const tax = (price * taxPct) / 100 / 12;
    const ltv = price > 0 ? baseLoan / price : 0;
    const mi = input.miAlways || ltv > 0.8 ? (loan * pmiPct) / 12 : 0;
    return { loan, pi, tax, mi, total: pi + tax + insMonthly + hoa + mi };
  };

  let lo = down; // loan of 0 — always affordable if budget covers tax/ins
  let hi = 50_000_000;
  if (costAt(hi).total <= budget) lo = hi;
  else {
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      if (costAt(mid).total <= budget) lo = mid;
      else hi = mid;
    }
  }
  const price = Math.floor(lo);
  const c = costAt(price);
  return {
    maxPrice: price,
    loanAmount: round2(c.loan),
    monthlyPI: round2(c.pi),
    monthlyTax: round2(c.tax),
    monthlyInsurance: round2(insMonthly),
    monthlyHoa: round2(hoa),
    monthlyMi: round2(c.mi),
    totalMonthly: round2(c.total),
    binding,
    downPct: price > 0 ? round2((down / price) * 100) : 0,
  };
}

/** Reverse mode: gross annual income needed to afford a target home price
 *  under a program's ratios (the higher of the front- and back-end needs). */
export function incomeNeededForPrice(
  input: Omit<AffordabilityInput, "grossAnnualIncome"> & { price: number },
): { annualIncome: number; monthlyHousing: number } {
  const price = Math.max(0, clean(input.price));
  const down = Math.max(0, clean(input.downPayment));
  const debts = Math.max(0, clean(input.otherMonthlyDebts));
  const months = Math.max(1, Math.round(clean(input.termYears, 30) * 12));
  const feePct = Math.max(0, clean(input.financedFeePct)) / 100;
  const pmiPct = Math.max(0, clean(input.pmiAnnualPct)) / 100;
  const baseLoan = Math.max(0, price - down);
  const loan = baseLoan * (1 + feePct);
  const pi = monthlyPaymentMonths(loan, input.annualRatePct, months);
  const tax = (price * Math.max(0, clean(input.propertyTaxPctOfPrice))) / 100 / 12;
  const ins = Math.max(0, clean(input.homeInsuranceAnnual)) / 12;
  const hoa = Math.max(0, clean(input.hoaMonthly));
  const ltv = price > 0 ? baseLoan / price : 0;
  const mi = input.miAlways || ltv > 0.8 ? (loan * pmiPct) / 12 : 0;
  const housing = pi + tax + ins + hoa + mi;

  const prog = input.program;
  const byBack = ((housing + debts) * 12 * 100) / prog.backCapPct;
  const byFront =
    prog.frontCapPct === null ? 0 : (housing * 12 * 100) / prog.frontCapPct;
  return { annualIncome: round2(Math.max(byBack, byFront)), monthlyHousing: round2(housing) };
}
