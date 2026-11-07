/* Pure logic for the Running Pace Calculator. Distances stored in km internally. */

export const KM_PER_MILE = 1.609344;

export interface RacePreset {
  name: string;
  km: number;
}

export const RACES: RacePreset[] = [
  { name: "1 mile", km: 1.609344 },
  { name: "5K", km: 5 },
  { name: "10K", km: 10 },
  { name: "Half marathon", km: 21.0975 },
  { name: "Marathon", km: 42.195 },
  { name: "50K ultra", km: 50 },
];

/** Pace (seconds per unit) from a distance and a finish time. */
export function paceSeconds(distanceKm: number, timeSec: number, perMile: boolean): number | null {
  if (distanceKm <= 0 || timeSec <= 0) return null;
  const units = perMile ? distanceKm / KM_PER_MILE : distanceKm;
  return timeSec / units;
}

/** Finish time from distance and pace (seconds per unit). */
export function timeSeconds(distanceKm: number, paceSec: number, perMile: boolean): number | null {
  if (distanceKm <= 0 || paceSec <= 0) return null;
  const units = perMile ? distanceKm / KM_PER_MILE : distanceKm;
  return paceSec * units;
}

/** Distance covered in a time at a pace (seconds per unit). Returns km. */
export function distanceKm(timeSec: number, paceSec: number, perMile: boolean): number | null {
  if (timeSec <= 0 || paceSec <= 0) return null;
  const units = timeSec / paceSec;
  return perMile ? units * KM_PER_MILE : units;
}

/** 3723 -> "1:02:03"; 545 -> "9:05". */
export function formatTime(totalSec: number): string {
  const s = Math.round(totalSec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

/** Parse "1:02:03", "9:05" or "45" (seconds) into total seconds. */
export function parseTime(input: string): number | null {
  const parts = input.trim().split(":").map((p) => p.trim());
  if (parts.length < 1 || parts.length > 3) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => !Number.isFinite(n) || n < 0)) return null;
  if (nums.length === 1) return nums[0];
  if (nums.length === 2) return nums[0] * 60 + nums[1];
  return nums[0] * 3600 + nums[1] * 60 + nums[2];
}

export interface Split {
  n: number; // split number (1-based)
  distanceLabel: string; // e.g. "1 km" / "26.2 mi" for the last partial split
  splitTime: string; // time for this split alone
  cumulative: string; // clock time at the end of this split
}

/** Even splits for a distance at a constant pace. */
export function buildSplits(distanceKmTotal: number, paceSecPerUnit: number, perMile: boolean): Split[] {
  if (distanceKmTotal <= 0 || paceSecPerUnit <= 0) return [];
  const unitKm = perMile ? KM_PER_MILE : 1;
  const totalUnits = distanceKmTotal / unitKm;
  const whole = Math.floor(totalUnits);
  const splits: Split[] = [];
  for (let i = 1; i <= whole; i++) {
    splits.push({
      n: i,
      distanceLabel: `${i} ${perMile ? "mi" : "km"}`,
      splitTime: formatTime(paceSecPerUnit),
      cumulative: formatTime(paceSecPerUnit * i),
    });
  }
  const remainder = totalUnits - whole;
  if (remainder > 0.001) {
    splits.push({
      n: whole + 1,
      distanceLabel: `${round1(totalUnits)} ${perMile ? "mi" : "km"} (finish)`,
      splitTime: formatTime(paceSecPerUnit * remainder),
      cumulative: formatTime(paceSecPerUnit * totalUnits),
    });
  }
  return splits;
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
export const round2 = (n: number) => Math.round(n * 100) / 100;
