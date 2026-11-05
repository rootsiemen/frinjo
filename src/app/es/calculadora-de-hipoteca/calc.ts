// Pure calculation logic for the Calculadora de Hipoteca — no React, unit-testable.
// French amortization system (sistema francés): fixed monthly payment,
// interest-heavy at the start, capital-heavy at the end.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Fixed monthly payment (capital + intereses) for a loan.
 * M = P × r(1+r)^n / ((1+r)^n − 1), where r = annualRatePct/100/12 and n = years×12.
 * Zero-rate edge case: M = P / n.
 */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const p = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const n = Math.max(0, Math.round((Number.isFinite(years) ? years : 0) * 12));
  if (p === 0 || n === 0) return 0;
  const r = (Number.isFinite(annualRatePct) ? Math.max(0, annualRatePct) : 0) / 100 / 12;
  if (r === 0) return round2(p / n);
  const factor = Math.pow(1 + r, n);
  return round2((p * r * factor) / (factor - 1));
}

export interface YearRow {
  year: number;
  /** Capital amortizado durante ese año. */
  principalPaid: number;
  /** Intereses pagados durante ese año. */
  interestPaid: number;
  /** Saldo pendiente al final del año. */
  balance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalInterest: number;
  /** Total de pagos de capital + intereses (sin entrada, impuestos ni seguros). */
  totalPaid: number;
  rows: YearRow[];
}

/** Year-by-year amortization schedule plus loan totals. */
export function amortizationByYear(
  principal: number,
  annualRatePct: number,
  years: number,
): AmortizationResult {
  const p = Number.isFinite(principal) ? Math.max(0, principal) : 0;
  const totalYears = Math.max(0, Math.floor(Number.isFinite(years) ? years : 0));
  const payment = monthlyPayment(p, annualRatePct, totalYears);
  const r = (Number.isFinite(annualRatePct) ? Math.max(0, annualRatePct) : 0) / 100 / 12;

  const rows: YearRow[] = [];
  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let year = 1; year <= totalYears; year++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    for (let month = 0; month < 12 && balance > 0; month++) {
      const interest = balance * r;
      let principalPaid = payment - interest;
      if (principalPaid > balance) principalPaid = balance; // last payment adjustment
      balance = round2(balance - principalPaid);
      yearInterest += interest;
      yearPrincipal += principalPaid;
      totalInterest += interest;
      totalPaid += interest + principalPaid;
    }
    rows.push({
      year,
      principalPaid: round2(yearPrincipal),
      interestPaid: round2(yearInterest),
      balance: Math.max(0, balance),
    });
    if (balance <= 0) break;
  }

  return {
    monthlyPayment: payment,
    totalInterest: round2(totalInterest),
    totalPaid: round2(totalPaid),
    rows,
  };
}
