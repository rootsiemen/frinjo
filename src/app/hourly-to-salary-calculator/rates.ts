export const POPULAR_RATES = [
  12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38,
  40, 42, 45, 48, 50, 55, 60, 65, 70, 75, 80, 90, 100,
];

export function rateSlug(rate: number): string {
  return `${rate}-an-hour-is-how-much-a-year`;
}

export interface PayBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
}

export function breakdown(hourly: number, hoursPerWeek: number, weeksPerYear: number): PayBreakdown {
  const weekly = hourly * hoursPerWeek;
  const annual = weekly * weeksPerYear;
  return {
    hourly,
    daily: hourly * (hoursPerWeek / 5),
    weekly,
    biweekly: weekly * 2,
    monthly: annual / 12,
    annual,
  };
}

export function money(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 100 ? 2 : 0,
  });
}
