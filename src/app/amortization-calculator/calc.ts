// Amortization calculator logic — a thin, named layer over the shared
// engine (src/lib/amort.ts) so this tool's page and tests share one import.

import {
  amortize,
  scheduleByYear,
  scheduleCsv,
  addMonthsIso,
  type AmortizeResult,
  type ScheduleRow,
  type YearRow,
} from "@/lib/amort";

export interface AmortizationSummary {
  result: AmortizeResult;
  byYear: YearRow[];
  /** Date of the first payment (start date + 1 month). */
  firstPaymentDate: string;
  payoffDate: string;
  /** Share of everything paid that is interest, %. */
  interestSharePct: number;
}

export function amortizationSummary(input: {
  principal: number;
  annualRatePct: number;
  months: number;
  startDateIso: string;
  extraMonthly?: number;
  annualLump?: number;
  lumpSums?: { month: number; amount: number }[];
}): AmortizationSummary {
  const result = amortize(input);
  return {
    result,
    byYear: scheduleByYear(result.rows),
    firstPaymentDate: addMonthsIso(input.startDateIso, 1),
    payoffDate: addMonthsIso(input.startDateIso, result.payoffMonths),
    interestSharePct:
      result.totalPaid > 0
        ? Math.round((result.totalInterest / result.totalPaid) * 1000) / 10
        : 0,
  };
}

export { scheduleCsv };
export type { ScheduleRow, YearRow, AmortizeResult };
