// Mortgage payoff logic — baseline vs accelerated payoff with the two
// mortgage-specific extras the generic engines miss: the PMI drop-off
// date (when the balance crosses 80% of the original home value) and the
// biweekly-payment effect. Built on src/lib/amort.ts.

import {
  amortize,
  firstMonthBalanceAtOrBelow,
  monthlyPaymentMonths,
  type AmortizeResult,
  type LumpSum,
} from "@/lib/amort";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);

export interface MortgagePayoffInput {
  balance: number;
  annualRatePct: number;
  /** Remaining contractual term, months. */
  remainingMonths: number;
  /** Home value at purchase (PMI thresholds are based on the original
   *  value, not today's appraisal). */
  originalValue: number;
  /** Current monthly PMI premium, if any. */
  pmiMonthly: number;
  extraMonthly: number;
  /** Pay half the monthly P&I every two weeks (= 13 full payments a year). */
  biweekly: boolean;
  lumpSums?: LumpSum[];
}

export interface MortgagePayoffResult {
  baseline: AmortizeResult;
  accelerated: AmortizeResult;
  monthsSaved: number;
  interestSaved: number;
  /** Month (1-based) the balance crosses 80% of the original value —
   *  the point PMI can be requested off. Null if it starts below. */
  pmiDropMonthBaseline: number | null;
  pmiDropMonthAccelerated: number | null;
  /** Total PMI paid until drop-off on each path. */
  pmiPaidBaseline: number;
  pmiPaidAccelerated: number;
  /** The extra monthly amount the biweekly option effectively adds. */
  biweeklyExtra: number;
}

export function mortgagePayoff(input: MortgagePayoffInput): MortgagePayoffResult {
  const months = Math.max(1, Math.round(clean(input.remainingMonths)));
  const payment = monthlyPaymentMonths(input.balance, input.annualRatePct, months);
  const biweeklyExtra = input.biweekly ? round2(payment / 12) : 0;

  const baseline = amortize({
    principal: input.balance,
    annualRatePct: input.annualRatePct,
    months,
  });
  const accelerated = amortize({
    principal: input.balance,
    annualRatePct: input.annualRatePct,
    months,
    extraMonthly: Math.max(0, clean(input.extraMonthly)) + biweeklyExtra,
    lumpSums: input.lumpSums,
  });

  const threshold = Math.max(0, clean(input.originalValue)) * 0.8;
  const startsBelow = Math.max(0, clean(input.balance)) <= threshold;
  const dropBase = startsBelow ? null : firstMonthBalanceAtOrBelow(baseline.rows, threshold);
  const dropAcc = startsBelow ? null : firstMonthBalanceAtOrBelow(accelerated.rows, threshold);
  const pmiMonthly = Math.max(0, clean(input.pmiMonthly));
  const pmiPaid = (drop: number | null, payoff: number) =>
    round2(pmiMonthly * (startsBelow ? 0 : (drop ?? payoff)));

  return {
    baseline,
    accelerated,
    monthsSaved: baseline.payoffMonths - accelerated.payoffMonths,
    interestSaved: round2(baseline.totalInterest - accelerated.totalInterest),
    pmiDropMonthBaseline: dropBase,
    pmiDropMonthAccelerated: dropAcc,
    pmiPaidBaseline: pmiPaid(dropBase, baseline.payoffMonths),
    pmiPaidAccelerated: pmiPaid(dropAcc, accelerated.payoffMonths),
    biweeklyExtra,
  };
}

/** Extra monthly principal needed to own the home free and clear within
 *  targetMonths. */
export function extraNeededForDebtFreeDate(input: {
  balance: number;
  annualRatePct: number;
  remainingMonths: number;
  targetMonths: number;
}): { requiredPayment: number; currentPayment: number; extraNeeded: number } {
  const currentPayment = monthlyPaymentMonths(
    input.balance,
    input.annualRatePct,
    Math.max(1, Math.round(clean(input.remainingMonths))),
  );
  const requiredPayment = monthlyPaymentMonths(
    input.balance,
    input.annualRatePct,
    Math.max(1, Math.round(clean(input.targetMonths))),
  );
  return {
    requiredPayment,
    currentPayment,
    extraNeeded: round2(Math.max(0, requiredPayment - currentPayment)),
  };
}
