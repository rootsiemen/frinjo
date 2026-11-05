// Shared amortization engine — powers the loan payoff, amortization,
// mortgage payoff, debt consolidation, credit card payoff and personal
// loan calculators. Pure functions, no React, unit-testable.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

const clean = (n: number, fallback = 0): number =>
  Number.isFinite(n) ? n : fallback;

/** Fixed monthly payment (principal + interest) for a loan over N months.
 *  M = P × r(1+r)^n / ((1+r)^n − 1), r = annualRatePct/100/12.
 *  Zero-rate edge case: M = P / n. */
export function monthlyPaymentMonths(
  principal: number,
  annualRatePct: number,
  months: number,
): number {
  const p = Math.max(0, clean(principal));
  const n = Math.max(0, Math.round(clean(months)));
  if (p === 0 || n === 0) return 0;
  const r = Math.max(0, clean(annualRatePct)) / 100 / 12;
  if (r === 0) return round2(p / n);
  const f = Math.pow(1 + r, n);
  return round2((p * r * f) / (f - 1));
}

export interface LumpSum {
  /** 1-based month in which the extra lump sum is paid. */
  month: number;
  amount: number;
}

export interface AmortizeInput {
  principal: number;
  annualRatePct: number;
  /** Contractual term in months (the baseline schedule length). */
  months: number;
  /** Use this monthly P&I instead of the computed contractual payment
   *  (payoff calculators where the user states what they actually pay). */
  fixedPayment?: number;
  extraMonthly?: number;
  /** Extra lump sum paid once a year, in month 12, 24, 36, … */
  annualLump?: number;
  lumpSums?: LumpSum[];
}

export interface ScheduleRow {
  month: number;
  /** Scheduled principal + interest paid this month (excludes extras). */
  payment: number;
  principal: number;
  interest: number;
  /** Extra principal paid this month (monthly extra + lumps). */
  extra: number;
  balance: number;
}

export interface AmortizeResult {
  /** The contractual monthly P&I used. */
  payment: number;
  rows: ScheduleRow[];
  totalInterest: number;
  totalPaid: number;
  /** Months until the balance reaches zero (rows.length). */
  payoffMonths: number;
  /** First month in which the principal portion of the scheduled payment
   *  exceeds the interest portion — null if it never happens. */
  crossoverMonth: number | null;
  /** True when the payment does not cover monthly interest. */
  neverPaysOff: boolean;
}

const MAX_MONTHS = 1200; // 100-year safety cap

export function amortize(input: AmortizeInput): AmortizeResult {
  const p = Math.max(0, clean(input.principal));
  const rate = Math.max(0, clean(input.annualRatePct));
  const r = rate / 100 / 12;
  const termMonths = Math.max(0, Math.round(clean(input.months)));
  const payment =
    input.fixedPayment !== undefined && clean(input.fixedPayment) > 0
      ? round2(clean(input.fixedPayment))
      : monthlyPaymentMonths(p, rate, termMonths);
  const extraMonthly = Math.max(0, clean(input.extraMonthly ?? 0));
  const annualLump = Math.max(0, clean(input.annualLump ?? 0));
  const lumps = new Map<number, number>();
  for (const l of input.lumpSums ?? []) {
    const m = Math.round(clean(l.month));
    if (m >= 1) lumps.set(m, (lumps.get(m) ?? 0) + Math.max(0, clean(l.amount)));
  }

  const rows: ScheduleRow[] = [];
  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;
  let crossoverMonth: number | null = null;

  if (p === 0 || payment === 0) {
    return { payment, rows, totalInterest: 0, totalPaid: 0, payoffMonths: 0, crossoverMonth: null, neverPaysOff: false };
  }
  // Payment must cover the first month's interest, extras aside.
  if (payment + extraMonthly <= balance * r && balance * r > 0) {
    return { payment, rows, totalInterest: 0, totalPaid: 0, payoffMonths: 0, crossoverMonth: null, neverPaysOff: true };
  }

  let month = 0;
  while (balance > 0 && month < MAX_MONTHS) {
    month++;
    const interest = balance * r;
    // The final scheduled payment is balance + interest, which can be a
    // few cents above or below the regular payment (rounding) — that is
    // how real amortization schedules close out. On the contractual
    // final month the whole remaining due is paid.
    const due = round2(balance + interest);
    const scheduledPay = month >= termMonths ? due : Math.min(payment, due);
    let principal = scheduledPay - interest;
    if (principal < 0) {
      // Payment does not cover interest (extras may still save the loan):
      // the shortfall capitalizes onto the balance.
      balance = round2(balance - principal);
      principal = 0;
    }
    let extra = extraMonthly + (lumps.get(month) ?? 0) + (month % 12 === 0 ? annualLump : 0);
    if (extra > balance - principal) extra = Math.max(0, round2(balance - principal));
    balance = round2(balance - principal - extra);
    totalInterest += interest;
    totalPaid += interest + principal + extra;
    if (crossoverMonth === null && principal > interest) crossoverMonth = month;
    rows.push({
      month,
      payment: round2(interest + principal),
      principal: round2(principal),
      interest: round2(interest),
      extra: round2(extra),
      balance: Math.max(0, balance),
    });
  }

  return {
    payment,
    rows,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    payoffMonths: rows.length,
    crossoverMonth,
    neverPaysOff: balance > 0,
  };
}

export interface YearRow {
  year: number;
  principal: number;
  interest: number;
  extra: number;
  balance: number;
}

/** Aggregate a monthly schedule into calendar years of the loan (1–12, 13–24, …). */
export function scheduleByYear(rows: ScheduleRow[]): YearRow[] {
  const out: YearRow[] = [];
  for (const row of rows) {
    const y = Math.floor((row.month - 1) / 12) + 1;
    let yr = out[out.length - 1];
    if (!yr || yr.year !== y) {
      yr = { year: y, principal: 0, interest: 0, extra: 0, balance: row.balance };
      out.push(yr);
    }
    yr.principal = round2(yr.principal + row.principal);
    yr.interest = round2(yr.interest + row.interest);
    yr.extra = round2(yr.extra + row.extra);
    yr.balance = row.balance;
  }
  return out;
}

/** Date (YYYY-MM-DD) that is `months` months after `startIso`. */
export function addMonthsIso(startIso: string, months: number): string {
  const d = new Date(`${startIso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  d.setUTCMonth(d.getUTCMonth() + Math.max(0, Math.round(months)));
  return d.toISOString().slice(0, 10);
}

/** Month index (1-based) of the first schedule row whose balance is at or
 *  below `threshold` — used for the PMI drop-off date. Null if never. */
export function firstMonthBalanceAtOrBelow(rows: ScheduleRow[], threshold: number): number | null {
  for (const row of rows) if (row.balance <= threshold) return row.month;
  return null;
}

/** Build a CSV string from a monthly schedule (for the download button). */
export function scheduleCsv(rows: ScheduleRow[]): string {
  const head = "Month,Payment,Principal,Interest,Extra principal,Balance";
  const lines = rows.map(
    (r) => `${r.month},${r.payment.toFixed(2)},${r.principal.toFixed(2)},${r.interest.toFixed(2)},${r.extra.toFixed(2)},${r.balance.toFixed(2)}`,
  );
  return [head, ...lines].join("\n");
}
