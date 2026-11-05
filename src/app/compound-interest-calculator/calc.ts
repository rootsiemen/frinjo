// Compound interest logic (English build, extended port of the FR engine):
// future value with monthly contributions, inflation-adjusted real value,
// an optional annual tax drag on interest, the effective APY, a goal
// solver and a CD mode with early-withdrawal penalties.
// FV = P(1 + r/n)^(n·t) + PMT × [((1 + r/n)^(n·t) − 1) / (r/n)]
// (contributions at the end of each period). Pure, unit-testable.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);
const pos = (n: number): number => Math.max(0, clean(n));

export type CompoundFreq = 1 | 4 | 12 | 365;

export interface CompoundInput {
  initial: number;
  annualRatePct: number;
  years: number;
  monthlyContribution: number;
  frequency: CompoundFreq;
  /** Marginal tax rate applied to each period's interest, %. */
  taxPct?: number;
}

export interface YearRow {
  year: number;
  contributed: number;
  interestEarned: number;
  value: number;
}

export interface CompoundResult {
  futureValue: number;
  totalContributed: number;
  /** Gross interest earned before the tax drag. */
  totalInterest: number;
  totalTaxPaid: number;
  /** Interest left after tax = futureValue − totalContributed. */
  netInterest: number;
  rows: YearRow[];
}

export function computeCompound(input: CompoundInput): CompoundResult {
  const P = pos(input.initial);
  const r = pos(input.annualRatePct) / 100;
  const years = Math.max(0, Math.floor(pos(input.years)));
  const monthly = pos(input.monthlyContribution);
  const n = input.frequency;
  const taxRate = Math.min(100, pos(input.taxPct ?? 0)) / 100;
  const perPeriod = monthly * (12 / n);

  const rows: YearRow[] = [];
  let value = P;
  let contributed = P;
  let taxPaid = 0;
  let grossInterest = 0;

  for (let y = 1; y <= years; y++) {
    for (let p = 0; p < n; p++) {
      const interest = value * (r / n);
      const tax = interest * taxRate;
      taxPaid += tax;
      grossInterest += interest;
      value = value + interest - tax + perPeriod;
      contributed += perPeriod;
    }
    rows.push({
      year: y,
      contributed: round2(contributed),
      interestEarned: round2(value - contributed),
      value: round2(value),
    });
  }

  const totalContributed = round2(P + monthly * 12 * years);
  return {
    futureValue: round2(value),
    totalContributed,
    totalInterest: round2(grossInterest),
    totalTaxPaid: round2(taxPaid),
    netInterest: round2(value - totalContributed),
    rows,
  };
}

/** Today's-money value of a future sum at an annual inflation rate. */
export function realValue(futureValue: number, inflationPct: number, years: number): number {
  const v = clean(futureValue);
  const i = pos(inflationPct) / 100;
  const t = pos(years);
  if (i === 0) return round2(v);
  return round2(v / Math.pow(1 + i, t));
}

/** Effective annual yield (APY) of a nominal rate compounded n times. */
export function effectiveApy(annualRatePct: number, frequency: CompoundFreq): number {
  const r = pos(annualRatePct) / 100;
  if (r === 0) return 0;
  return round2((Math.pow(1 + r / frequency, frequency) - 1) * 100);
}

/** Years (whole, rounding up) for the plan to reach a target value.
 *  Null when the target is unreachable within 100 years. */
export function yearsToTarget(
  input: Omit<CompoundInput, "years">,
  target: number,
): number | null {
  const t = pos(target);
  if (t <= pos(input.initial)) return 0;
  for (let y = 1; y <= 100; y++) {
    if (computeCompound({ ...input, years: y }).futureValue >= t) return y;
  }
  return null;
}

export interface CdInput {
  principal: number;
  /** APY in % — CDs are quoted on APY, already the effective yield. */
  apyPct: number;
  termMonths: number;
  /** Month in which the money is withdrawn (may exceed the term). */
  withdrawMonth: number;
  /** Early-withdrawal penalty, in months of interest. */
  penaltyMonths: number;
}

export interface CdResult {
  valueAtMaturity: number;
  interestAtMaturity: number;
  /** Value if withdrawn at withdrawMonth (before maturity: after penalty). */
  withdrawalValue: number;
  interestEarned: number;
  penalty: number;
  isEarly: boolean;
}

/** CD growth on an APY basis: value(t) = P × (1 + APY)^(t/12). The penalty
 *  is `penaltyMonths` of interest on the principal, capped at the interest
 *  actually earned (the standard bank practice). */
export function computeCd(input: CdInput): CdResult {
  const P = pos(input.principal);
  const apy = pos(input.apyPct) / 100;
  const term = Math.max(1, Math.round(pos(input.termMonths)));
  const withdraw = Math.max(0, Math.round(pos(input.withdrawMonth)));
  const growth = (months: number) => P * Math.pow(1 + apy, months / 12);
  const valueAtMaturity = round2(growth(term));
  const isEarly = withdraw < term;
  const atWithdraw = growth(withdraw);
  const interestEarned = round2(atWithdraw - P);
  const rawPenalty = P * (Math.pow(1 + apy, pos(input.penaltyMonths) / 12) - 1);
  const penalty = isEarly ? round2(Math.min(rawPenalty, Math.max(0, interestEarned))) : 0;
  return {
    valueAtMaturity,
    interestAtMaturity: round2(valueAtMaturity - P),
    withdrawalValue: round2(atWithdraw - penalty),
    interestEarned,
    penalty,
    isEarly,
  };
}
