/* Pure logic for the Period Calculator. All dates are ISO yyyy-mm-dd, UTC math. */

const DAY = 86_400_000;

export function addDaysISO(iso: string, days: number): string {
  const t = Date.parse(`${iso}T00:00:00Z`);
  return new Date(t + days * DAY).toISOString().slice(0, 10);
}

export function diffDaysISO(aISO: string, bISO: string): number {
  return Math.round((Date.parse(`${bISO}T00:00:00Z`) - Date.parse(`${aISO}T00:00:00Z`)) / DAY);
}

export function formatISO(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export interface CycleForecast {
  cycle: number;
  periodStart: string;
  periodEnd: string;
  fertileStart: string;
  fertileEnd: string;
  ovulation: string;
  periodWindowNote: string; // ±2 day window around the predicted start
}

/**
 * Forecast `count` cycles from the first day of the last period.
 * Ovulation is estimated at (cycle length − 14) days after the period starts;
 * the fertile window is the 5 days before ovulation plus ovulation day.
 */
export function forecastCycles(
  lastPeriodISO: string,
  cycleLength: number,
  periodLength: number,
  count = 3,
): CycleForecast[] {
  const cycle = Math.min(45, Math.max(20, Math.floor(cycleLength) || 28));
  const plen = Math.min(10, Math.max(1, Math.floor(periodLength) || 5));
  const out: CycleForecast[] = [];
  for (let i = 0; i < count; i++) {
    const start = addDaysISO(lastPeriodISO, i * cycle);
    // Ovulation falls on cycle day (cycle − 14); day 1 is the start date itself.
    const ovulation = addDaysISO(start, cycle - 15);
    out.push({
      cycle: i + 1,
      periodStart: start,
      periodEnd: addDaysISO(start, plen - 1),
      fertileStart: addDaysISO(ovulation, -5),
      fertileEnd: ovulation,
      ovulation,
      periodWindowNote: `${formatISO(addDaysISO(start, -2))} – ${formatISO(addDaysISO(start, 2))}`,
    });
  }
  return out;
}

/** Which phase of the current cycle a given day falls in (for the "today" panel). */
export function cycleDayInfo(
  lastPeriodISO: string,
  cycleLength: number,
  periodLength: number,
  todayISO: string,
): { cycleDay: number; daysUntilNextPeriod: number; phase: string } {
  const cycle = Math.min(45, Math.max(20, Math.floor(cycleLength) || 28));
  const plen = Math.min(10, Math.max(1, Math.floor(periodLength) || 5));
  const elapsed = diffDaysISO(lastPeriodISO, todayISO);
  const cycleDay = ((elapsed % cycle) + cycle) % cycle + 1;
  const ovulationDay = cycle - 14;
  let phase = "Follicular phase";
  if (cycleDay <= plen) phase = "Period (menstrual phase)";
  else if (cycleDay >= ovulationDay - 5 && cycleDay <= ovulationDay) phase = "Fertile window";
  else if (cycleDay === ovulationDay) phase = "Ovulation (estimated)";
  else if (cycleDay > ovulationDay) phase = "Luteal phase";
  return { cycleDay, daysUntilNextPeriod: cycle - cycleDay + 1, phase };
}
