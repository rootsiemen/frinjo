// Personal loan logic — the fee truth: an origination fee changes the real
// APR. The note rate prices the payments; the APR prices what you actually
// received. Pure functions, no React, unit-testable.

import { amortize, monthlyPaymentMonths, type AmortizeResult } from "@/lib/amort";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);

export type FeeMode = "deducted" | "financed";

export interface PersonalLoanInput {
  loanAmount: number;
  noteRatePct: number;
  termMonths: number;
  /** Origination fee as % of the loan amount. */
  feePct: number;
  /** deducted: the fee is taken out of the money you receive.
   *  financed: the fee is added to the balance you repay. */
  feeMode: FeeMode;
}

export interface PersonalLoanResult {
  /** Monthly payment (on the repaid principal). */
  payment: number;
  /** Principal the payments are calculated on. */
  repaidPrincipal: number;
  feeAmount: number;
  /** Cash that actually lands in the borrower's account. */
  netReceived: number;
  /** True APR: the rate that makes the payments worth exactly netReceived. */
  aprPct: number;
  totalInterest: number;
  totalCost: number;
  schedule: AmortizeResult;
}

/** Solve the monthly rate i with netReceived = payment × (1 − (1+i)^−n) / i
 *  by bisection, returned as a nominal annual percentage (i × 12 × 100). */
export function solveAprPct(netReceived: number, payment: number, months: number): number {
  const net = Math.max(0, clean(netReceived));
  const pmt = Math.max(0, clean(payment));
  const n = Math.max(0, Math.round(clean(months)));
  if (net === 0 || pmt === 0 || n === 0) return 0;
  if (pmt * n <= net) return 0; // no interest at all
  let lo = 0;
  let hi = 0.1; // 10% per month ceiling
  const pv = (i: number) => (i === 0 ? pmt * n : (pmt * (1 - Math.pow(1 + i, -n))) / i);
  for (let k = 0; k < 80; k++) {
    const mid = (lo + hi) / 2;
    if (pv(mid) > net) lo = mid;
    else hi = mid;
  }
  return round2(((lo + hi) / 2) * 12 * 100);
}

export function computePersonalLoan(input: PersonalLoanInput): PersonalLoanResult {
  const amount = Math.max(0, clean(input.loanAmount));
  const rate = Math.max(0, clean(input.noteRatePct));
  const months = Math.max(1, Math.round(clean(input.termMonths)));
  const feeAmount = round2((amount * Math.max(0, clean(input.feePct))) / 100);
  const repaidPrincipal =
    input.feeMode === "financed" ? round2(amount + feeAmount) : amount;
  const netReceived =
    input.feeMode === "financed" ? amount : round2(amount - feeAmount);
  const payment = monthlyPaymentMonths(repaidPrincipal, rate, months);
  const schedule = amortize({ principal: repaidPrincipal, annualRatePct: rate, months });
  return {
    payment,
    repaidPrincipal,
    feeAmount,
    netReceived,
    aprPct: solveAprPct(netReceived, payment, months),
    totalInterest: schedule.totalInterest,
    totalCost: round2(schedule.totalPaid - netReceived),
    schedule,
  };
}
