// Life insurance needs logic — the DIME method (Debts, Income, Mortgage,
// Education) with the offsets most calculators skip: a spouse's continuing
// income and Social Security survivor benefits reduce the gap; replacing a
// stay-at-home parent's work adds to it. Compared against the 10× rule and
// a discounted human-life-value estimate. No lead-gen form, ever.
// Pure functions, no React, unit-testable.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);
const pos = (n: number): number => Math.max(0, clean(n));

/** Present value of $1 a year for `years` years at `discountPct`. */
export function annuityPvFactor(years: number, discountPct: number): number {
  const y = Math.max(0, clean(years));
  const d = Math.max(0, clean(discountPct)) / 100;
  if (y === 0) return 0;
  if (d === 0) return y;
  return (1 - Math.pow(1 + d, -y)) / d;
}

export interface LifeInsuranceInput {
  /** Non-mortgage debts to clear (cards, car loans, student loans). */
  debts: number;
  /** Funeral, burial and estate-settling costs. */
  finalExpenses: number;
  annualIncome: number;
  incomeYears: number;
  /** Discount rate for the human-life-value method, %. */
  discountPct: number;
  mortgageBalance: number;
  children: number;
  /** Total education fund wanted per child. */
  educationPerChild: number;
  existingCoverage: number;
  liquidAssets: number;
  /** Income a surviving spouse keeps earning, per year, and for how long. */
  spouseAnnualIncome: number;
  spouseYears: number;
  /** Estimated monthly Social Security survivor benefit, and years paid.
   *  User-entered estimate — the SSA's own statement is the source. */
  ssSurvivorMonthly: number;
  ssYears: number;
  /** Yearly cost of replacing a stay-at-home parent's work (childcare,
   *  transport, household help), and for how many years. */
  sahmAnnualValue: number;
  sahmYears: number;
}

export interface LifeInsuranceResult {
  /** DIME total before offsets. */
  dimeGross: number;
  dimeIncomeComponent: number;
  educationTotal: number;
  sahmTotal: number;
  /** Everything that shrinks the gap. */
  offsetsTotal: number;
  spouseOffset: number;
  ssOffset: number;
  /** Recommended new coverage by each method (never below 0). */
  dimeNeed: number;
  tenXNeed: number;
  hlvNeed: number;
}

/** The three standard methods, all fed by the same inputs and offsets. */
export function computeLifeInsurance(input: LifeInsuranceInput): LifeInsuranceResult {
  const debts = pos(input.debts);
  const finalExpenses = pos(input.finalExpenses);
  const mortgage = pos(input.mortgageBalance);
  const educationTotal = round2(pos(input.children) * pos(input.educationPerChild));
  const sahmTotal = round2(pos(input.sahmAnnualValue) * pos(input.sahmYears));

  const dimeIncome = round2(pos(input.annualIncome) * pos(input.incomeYears));
  const dimeGross = round2(debts + finalExpenses + dimeIncome + mortgage + educationTotal + sahmTotal);

  const spouseOffset = round2(pos(input.spouseAnnualIncome) * pos(input.spouseYears));
  const ssOffset = round2(pos(input.ssSurvivorMonthly) * 12 * pos(input.ssYears));
  const offsetsTotal = round2(
    pos(input.existingCoverage) + pos(input.liquidAssets) + spouseOffset + ssOffset,
  );

  const hlvIncome = round2(
    pos(input.annualIncome) * annuityPvFactor(input.incomeYears, input.discountPct),
  );
  const hlvGross = round2(debts + finalExpenses + hlvIncome + mortgage + educationTotal + sahmTotal);

  return {
    dimeGross,
    dimeIncomeComponent: dimeIncome,
    educationTotal,
    sahmTotal,
    offsetsTotal,
    spouseOffset,
    ssOffset,
    dimeNeed: Math.max(0, round2(dimeGross - offsetsTotal)),
    tenXNeed: Math.max(
      0,
      round2(pos(input.annualIncome) * 10 + mortgage + debts - offsetsTotal),
    ),
    hlvNeed: Math.max(0, round2(hlvGross - offsetsTotal)),
  };
}

/* Illustrative monthly premiums for a 20-year term policy, healthy
 * non-smoker, per $500,000 of coverage — compiled from published 2025
 * market averages. Orientation only: underwriting, health, smoking and
 * the insurer move real quotes a lot. This is NOT a quote. */
export const TERM_PREMIUM_TABLE: { fromAge: number; monthlyPer500k: number }[] = [
  { fromAge: 20, monthlyPer500k: 24 },
  { fromAge: 25, monthlyPer500k: 27 },
  { fromAge: 30, monthlyPer500k: 30 },
  { fromAge: 35, monthlyPer500k: 36 },
  { fromAge: 40, monthlyPer500k: 47 },
  { fromAge: 45, monthlyPer500k: 71 },
  { fromAge: 50, monthlyPer500k: 112 },
  { fromAge: 55, monthlyPer500k: 185 },
  { fromAge: 60, monthlyPer500k: 320 },
];

/** Illustrative monthly premium for a coverage amount at an age.
 *  Scales linearly with coverage — an approximation, labeled as such. */
export function estimateTermPremium(age: number, coverage: number): number {
  const a = Math.max(20, Math.min(65, Math.round(clean(age) || 35)));
  const cov = Math.max(0, clean(coverage));
  if (cov === 0) return 0;
  let rate = TERM_PREMIUM_TABLE[0].monthlyPer500k;
  for (const row of TERM_PREMIUM_TABLE) if (a >= row.fromAge) rate = row.monthlyPer500k;
  return round2(rate * (cov / 500_000));
}
