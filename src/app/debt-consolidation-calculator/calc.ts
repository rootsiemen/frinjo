// Debt consolidation logic — every debt modeled on its own balance, APR
// and payment (never one blended average), then compared honestly against
// a consolidation loan and an optional balance-transfer offer.
// Pure functions, no React, unit-testable.

import { amortize } from "@/lib/amort";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);

export interface DebtInput {
  name: string;
  balance: number;
  aprPct: number;
  monthlyPayment: number;
}

export interface DebtPath {
  name: string;
  balance: number;
  aprPct: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  neverPaysOff: boolean;
}

export interface CurrentPathResult {
  perDebt: DebtPath[];
  /** Months until the last debt is gone. */
  months: number;
  totalInterest: number;
  totalPaid: number;
  totalMonthlyPayment: number;
  totalBalance: number;
  anyNeverPaysOff: boolean;
}

/** Keep paying every debt exactly as today, each on its own terms. */
export function currentPath(debts: DebtInput[]): CurrentPathResult {
  const perDebt: DebtPath[] = debts
    .filter((d) => clean(d.balance) > 0)
    .map((d) => {
      const res = amortize({
        principal: d.balance,
        annualRatePct: d.aprPct,
        months: 1200,
        fixedPayment: d.monthlyPayment,
      });
      return {
        name: d.name,
        balance: Math.max(0, clean(d.balance)),
        aprPct: Math.max(0, clean(d.aprPct)),
        months: res.payoffMonths,
        totalInterest: res.totalInterest,
        totalPaid: res.totalPaid,
        neverPaysOff: res.neverPaysOff,
      };
    });
  return {
    perDebt,
    months: perDebt.reduce((m, d) => Math.max(m, d.neverPaysOff ? 1200 : d.months), 0),
    totalInterest: round2(perDebt.reduce((s, d) => s + d.totalInterest, 0)),
    totalPaid: round2(perDebt.reduce((s, d) => s + d.totalPaid, 0)),
    totalMonthlyPayment: round2(
      debts.reduce((s, d) => s + Math.max(0, clean(d.monthlyPayment)), 0),
    ),
    totalBalance: round2(debts.reduce((s, d) => s + Math.max(0, clean(d.balance)), 0)),
    anyNeverPaysOff: perDebt.some((d) => d.neverPaysOff),
  };
}

export interface ConsolidationInput {
  ratePct: number;
  termMonths: number;
  feePct: number;
  /** true: fee added to the loan balance. false: fee paid in cash up front. */
  feeFinanced: boolean;
}

export interface ConsolidationResult {
  loanAmount: number;
  feeAmount: number;
  payment: number;
  months: number;
  totalInterest: number;
  /** Everything the borrower hands over: payments + any cash fee. */
  totalCost: number;
}

/** Roll all balances into one new loan. */
export function consolidationPath(
  totalBalance: number,
  input: ConsolidationInput,
): ConsolidationResult {
  const balance = Math.max(0, clean(totalBalance));
  const feeAmount = round2((balance * Math.max(0, clean(input.feePct))) / 100);
  const loanAmount = input.feeFinanced ? round2(balance + feeAmount) : balance;
  const res = amortize({
    principal: loanAmount,
    annualRatePct: input.ratePct,
    months: Math.max(1, Math.round(clean(input.termMonths))),
  });
  return {
    loanAmount,
    feeAmount,
    payment: res.payment,
    months: res.payoffMonths,
    totalInterest: res.totalInterest,
    totalCost: round2(res.totalPaid + (input.feeFinanced ? 0 : feeAmount)),
  };
}

export interface BalanceTransferInput {
  promoAprPct: number;
  promoMonths: number;
  transferFeePct: number;
  regularAprPct: number;
  monthlyPayment: number;
}

export interface BalanceTransferResult {
  feeAmount: number;
  months: number;
  totalInterest: number;
  totalPaid: number;
  neverPaysOff: boolean;
}

/** Move the whole balance to a transfer offer and pay a fixed amount a
 *  month: promo rate first, regular rate after, fee added to the balance. */
export function balanceTransferPath(
  totalBalance: number,
  input: BalanceTransferInput,
): BalanceTransferResult {
  const feeAmount = round2(
    (Math.max(0, clean(totalBalance)) * Math.max(0, clean(input.transferFeePct))) / 100,
  );
  let balance = round2(Math.max(0, clean(totalBalance)) + feeAmount);
  const payment = Math.max(0, clean(input.monthlyPayment));
  const promoMonths = Math.max(0, Math.round(clean(input.promoMonths)));
  let totalInterest = 0;
  let totalPaid = 0;
  let month = 0;
  while (balance > 0 && month < 1200) {
    month++;
    const rate = month <= promoMonths ? Math.max(0, clean(input.promoAprPct)) : Math.max(0, clean(input.regularAprPct));
    const interest = (balance * rate) / 1200;
    totalInterest += interest;
    balance = round2(balance + interest);
    const pay = Math.min(payment, balance);
    totalPaid += pay;
    balance = round2(balance - pay);
    if (pay <= interest && month > promoMonths) break; // shrinking never starts
  }
  return {
    feeAmount,
    months: month,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    neverPaysOff: balance > 0,
  };
}

export interface Verdict {
  /** Cheapest of the paths that actually finish. */
  best: "current" | "consolidation" | "transfer" | "none";
  /** Total-cost saving of the best path vs staying put (0 when staying wins). */
  savingVsCurrent: number;
  message: string;
}

export function verdict(
  current: CurrentPathResult,
  consolidation: ConsolidationResult | null,
  transfer: BalanceTransferResult | null,
): Verdict {
  const candidates: { key: Verdict["best"]; cost: number }[] = [];
  if (!current.anyNeverPaysOff) candidates.push({ key: "current", cost: current.totalPaid });
  if (consolidation) candidates.push({ key: "consolidation", cost: consolidation.totalCost });
  if (transfer && !transfer.neverPaysOff)
    candidates.push({ key: "transfer", cost: transfer.totalPaid });
  if (candidates.length === 0) {
    return {
      best: "none",
      savingVsCurrent: 0,
      message:
        "On these numbers none of the paths finishes the debt — at least one current payment does not cover its monthly interest. Raising a payment or lowering a rate has to come first.",
    };
  }
  candidates.sort((a, b) => a.cost - b.cost);
  const winner = candidates[0];
  if (winner.key === "current") {
    return {
      best: "current",
      savingVsCurrent: 0,
      message: current.anyNeverPaysOff
        ? "Staying put never finishes at least one debt, yet the alternatives cost more in total — the honest move is to raise the payment on the debt that never dies before consolidating anything."
        : "Staying put is the cheapest path on these numbers. Consolidation would lower the monthly payment only by stretching the debt out and charging more interest overall — a lower payment is not the same as a cheaper debt.",
    };
  }
  const saving = current.anyNeverPaysOff
    ? 0
    : round2(current.totalPaid - winner.cost);
  return {
    best: winner.key,
    savingVsCurrent: saving,
    message:
      winner.key === "consolidation"
        ? current.anyNeverPaysOff
          ? "Consolidating wins by default: at least one current debt never pays off at its current payment, and the new loan retires everything on a fixed schedule."
          : "The consolidation loan is the cheapest path — it retires every balance on one fixed schedule and costs less in total than staying put."
        : "The balance transfer is the cheapest path — if the balance is truly gone before the promo rate ends, or the leftover is small enough that the regular rate cannot eat the saving.",
  };
}
