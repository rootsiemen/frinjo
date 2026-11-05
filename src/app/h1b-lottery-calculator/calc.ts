// Pure data/logic — H-1B Lottery Calculator (FY2027 wage-weighted lottery).
// Ported faithfully from visa.frinjo.me (USVisaKit): odds by DOL prevailing
// wage level, based on DHS FY2027 projections / USCIS registration data.

export type WageLevel = "I" | "II" | "III" | "IV";

export const H1B_ODDS: Record<WageLevel, { entries: number; chance: number }> = {
  I: { entries: 1, chance: 15 },
  II: { entries: 2, chance: 30 },
  III: { entries: 3, chance: 45 },
  IV: { entries: 4, chance: 61 },
};

export const H1B_LEVELS: WageLevel[] = ["I", "II", "III", "IV"];

export function h1bNote(advancedDegree: boolean): string {
  return advancedDegree
    ? "In FY2027, 71.5% of selected beneficiaries held a US advanced degree — a strong positive signal under the weighted system."
    : "Only 17.7% of FY2027 selections were wage Level I. A higher wage level improves odds far more than anything else.";
}
