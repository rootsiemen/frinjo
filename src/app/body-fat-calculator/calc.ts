/* Pure logic for the Body Fat Calculator — US Navy circumference method.
 * Formulas are defined in inches; metric inputs are converted before use. */

export const CM_PER_INCH = 2.54;

export type Sex = "male" | "female";

/**
 * US Navy body fat percentage.
 * Male:   86.010·log10(waist − neck) − 70.041·log10(height) + 36.76
 * Female: 163.205·log10(waist + hip − neck) − 97.684·log10(height) − 78.387
 * All measurements in inches. Returns null when the log arguments are invalid.
 */
export function navyBodyFat(
  sex: Sex,
  heightIn: number,
  neckIn: number,
  waistIn: number,
  hipIn = 0,
): number | null {
  if (!(heightIn > 0) || !(neckIn > 0) || !(waistIn > 0)) return null;
  let bf: number;
  if (sex === "male") {
    const diff = waistIn - neckIn;
    if (diff <= 0) return null;
    bf = 86.01 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76;
  } else {
    if (!(hipIn > 0)) return null;
    const sum = waistIn + hipIn - neckIn;
    if (sum <= 0) return null;
    bf = 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387;
  }
  if (!Number.isFinite(bf) || bf < 1 || bf > 80) return null;
  return Math.round(bf * 10) / 10;
}

export interface BfCategory {
  label: string;
  range: string;
}

/** ACE (American Council on Exercise) categories. */
export function bodyFatCategory(sex: Sex, bf: number): BfCategory {
  const table: [number, string, string][] =
    sex === "male"
      ? [
          [6, "Essential fat", "2–5%"],
          [14, "Athletes", "6–13%"],
          [18, "Fitness", "14–17%"],
          [25, "Average", "18–24%"],
          [Infinity, "Obese", "25%+"],
        ]
      : [
          [14, "Essential fat", "10–13%"],
          [21, "Athletes", "14–20%"],
          [25, "Fitness", "21–24%"],
          [32, "Average", "25–31%"],
          [Infinity, "Obese", "32%+"],
        ];
  for (const [max, label, range] of table) {
    if (bf <= max) return { label, range };
  }
  return { label: "Obese", range: sex === "male" ? "25%+" : "32%+" };
}

export function fatMass(weight: number, bfPct: number): number {
  return Math.round(weight * (bfPct / 100) * 10) / 10;
}

export function leanMass(weight: number, bfPct: number): number {
  return Math.round(weight * (1 - bfPct / 100) * 10) / 10;
}

/** Healthy body-fat reference range midpoint weight helper: weight at a target BF%. */
export function weightAtTargetBf(currentWeight: number, currentBfPct: number, targetBfPct: number): number {
  const lean = currentWeight * (1 - currentBfPct / 100);
  return Math.round((lean / (1 - targetBfPct / 100)) * 10) / 10;
}
