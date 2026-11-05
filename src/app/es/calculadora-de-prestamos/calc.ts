// Pure calculation logic for the Calculadora de Préstamos — no React, unit-testable.
// Same French amortization engine as the hipoteca calculator, reframed for
// general personal loans with a term in months.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Fixed monthly payment for a loan of `principal` over `months` at
 * `annualRatePct` % annual interest. Zero-rate edge case: P / n.
 */
export function monthlyPaymentMonths(principal: number, annualRatePct: number, months: number): number {
  const p = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const n = Math.max(0, Math.round(Number.isFinite(months) ? months : 0));
  if (p === 0 || n === 0) return 0;
  const r = (Number.isFinite(annualRatePct) ? Math.max(0, annualRatePct) : 0) / 100 / 12;
  if (r === 0) return round2(p / n);
  const factor = Math.pow(1 + r, n);
  return round2((p * r * factor) / (factor - 1));
}

export interface MonthRow {
  month: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  /** Month-by-month schedule (capped at 360 rows). */
  schedule: MonthRow[];
  /** Year-by-year aggregation for display. */
  byYear: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

/** Full amortization for a personal loan, month by month. */
export function computeLoan(principal: number, annualRatePct: number, months: number): LoanResult {
  const p = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const n = Math.max(0, Math.round(Number.isFinite(months) ? months : 0));
  const payment = monthlyPaymentMonths(p, annualRatePct, n);
  const r = (Number.isFinite(annualRatePct) ? Math.max(0, annualRatePct) : 0) / 100 / 12;

  const schedule: MonthRow[] = [];
  const byYearMap = new Map<number, { principalPaid: number; interestPaid: number; balance: number }>();
  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= n && balance > 0; month++) {
    const interest = balance * r;
    let principalPaid = payment - interest;
    if (principalPaid > balance) principalPaid = balance;
    balance = round2(balance - principalPaid);
    totalInterest += interest;
    totalPaid += interest + principalPaid;
    if (schedule.length < 360) {
      schedule.push({
        month,
        payment: round2(interest + principalPaid),
        principalPaid: round2(principalPaid),
        interestPaid: round2(interest),
        balance: Math.max(0, balance),
      });
    }
    const year = Math.ceil(month / 12);
    const cur = byYearMap.get(year) ?? { principalPaid: 0, interestPaid: 0, balance: 0 };
    cur.principalPaid += principalPaid;
    cur.interestPaid += interest;
    cur.balance = Math.max(0, balance);
    byYearMap.set(year, cur);
  }

  return {
    monthlyPayment: payment,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    schedule,
    byYear: [...byYearMap.entries()].map(([year, v]) => ({
      year,
      principalPaid: round2(v.principalPaid),
      interestPaid: round2(v.interestPaid),
      balance: v.balance,
    })),
  };
}
