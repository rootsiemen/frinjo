// Pure data/logic — Visa Bulletin Priority Date Checker.
// Ported faithfully from visa.frinjo.me (USVisaKit): October 2026 Visa
// Bulletin Final Action Dates (null = Current).

export type EbCategory = "EB-1" | "EB-2" | "EB-3";
export type Chargeability = "ROW" | "China" | "India";

export const VISA_BULLETIN_MONTH = "October 2026";

export const FINAL_ACTION_DATES: Record<EbCategory, Record<Chargeability, string | null>> = {
  "EB-1": { ROW: null, China: "2023-07-01", India: "2023-02-01" },
  "EB-2": { ROW: "2025-01-01", China: "2021-10-01", India: "2013-11-01" },
  "EB-3": { ROW: "2024-05-15", China: "2022-01-08", India: "2014-01-01" },
};

export const EB_CATEGORIES: EbCategory[] = ["EB-1", "EB-2", "EB-3"];
export const CHARGEABILITY_AREAS: Chargeability[] = ["ROW", "China", "India"];

export function fmtBulletinDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export interface PriorityDateResult {
  current: boolean;
  label: string;
  detail: string;
}

/** A priority date is current when it is earlier than the cutoff (or the cell is Current). */
export function checkPriorityDate(cat: EbCategory, country: Chargeability, pd: string): PriorityDateResult {
  const cutoff = FINAL_ACTION_DATES[cat][country];
  if (!cutoff)
    return {
      current: true,
      label: "CURRENT",
      detail: "No cutoff date — visa numbers are available for this category and country.",
    };
  if (!pd)
    return { current: false, label: "—", detail: "Enter your priority date to check." };
  const ok = pd < cutoff;
  return ok
    ? {
        current: true,
        label: "CURRENT",
        detail: `Your priority date (${fmtBulletinDate(pd)}) is earlier than the cutoff (${fmtBulletinDate(cutoff)}).`,
      }
    : {
        current: false,
        label: "NOT YET CURRENT",
        detail: `Your priority date (${fmtBulletinDate(pd)}) is not earlier than the cutoff (${fmtBulletinDate(cutoff)}).`,
      };
}
