// Loan payoff logic — baseline (keep paying as today) vs accelerated
// (extra monthly + lump sums), plus the payoff-by-a-target-date solver.
// Built on the shared amortization engine (src/lib/amort.ts).

import {
  amortize,
  monthlyPaymentMonths,
  type AmortizeResult,
  type LumpSum,
} from "@/lib/amort";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);

export interface PayoffScenario {
  baseline: AmortizeResult;
  accelerated: AmortizeResult;
  monthsSaved: number;
  interestSaved: number;
}

/** Compare paying the contractual amount vs adding extras. The baseline
 *  uses the payment implied by the remaining term the user states; the
 *  accelerated run keeps that payment and adds the extras on top. */
export function payoffScenario(input: {
  balance: number;
  annualRatePct: number;
  remainingMonths: number;
  extraMonthly: number;
  lumpSums?: LumpSum[];
}): PayoffScenario {
  const baseline = amortize({
    principal: input.balance,
    annualRatePct: input.annualRatePct,
    months: Math.max(1, Math.round(clean(input.remainingMonths))),
  });
  const accelerated = amortize({
    principal: input.balance,
    annualRatePct: input.annualRatePct,
    months: Math.max(1, Math.round(clean(input.remainingMonths))),
    extraMonthly: input.extraMonthly,
    lumpSums: input.lumpSums,
  });
  return {
    baseline,
    accelerated,
    monthsSaved: baseline.payoffMonths - accelerated.payoffMonths,
    interestSaved: round2(baseline.totalInterest - accelerated.totalInterest),
  };
}

/** The extra monthly payment needed to be debt-free within targetMonths. */
export function extraNeededForTargetDate(input: {
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
