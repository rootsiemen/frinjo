// Pure calculation logic — Salary / Income Tax Calculator Pakistan.
// Ported faithfully from calc.frinjo.me (PakCalc) — Finance Act 2026,
// salaried individuals, FY 2026-27 (verified Oct 2026 at source).

export interface PkSlab {
  upTo: number;
  base: number;
  rate: number;
  over: number;
  label: string;
}

export const PK_SLABS: PkSlab[] = [
  { upTo: 600_000, base: 0, rate: 0, over: 0, label: "Up to Rs 600,000" },
  { upTo: 1_200_000, base: 0, rate: 0.01, over: 600_000, label: "Rs 600,001 – 1,200,000" },
  { upTo: 2_200_000, base: 6_000, rate: 0.11, over: 1_200_000, label: "Rs 1,200,001 – 2,200,000" },
  { upTo: 3_200_000, base: 116_000, rate: 0.2, over: 2_200_000, label: "Rs 2,200,001 – 3,200,000" },
  { upTo: 4_100_000, base: 316_000, rate: 0.25, over: 3_200_000, label: "Rs 3,200,001 – 4,100,000" },
  { upTo: 5_600_000, base: 541_000, rate: 0.29, over: 4_100_000, label: "Rs 4,100,001 – 5,600,000" },
  { upTo: 7_000_000, base: 976_000, rate: 0.32, over: 5_600_000, label: "Rs 5,600,001 – 7,000,000" },
  { upTo: Infinity, base: 1_424_000, rate: 0.35, over: 7_000_000, label: "Above Rs 7,000,000" },
];

/** Annual income tax (Rs) on a salaried annual income, FY 2026-27 slabs. */
export function pkTaxOn(annual: number): number {
  if (annual <= 0) return 0;
  const s = PK_SLABS.find((x) => annual <= x.upTo)!;
  return Math.round(s.base + s.rate * (annual - s.over));
}

/** Index of the slab an annual income falls into (-1 for no income). */
export function pkSlabIndex(annual: number): number {
  return PK_SLABS.findIndex((x) => annual <= x.upTo);
}

export const pkr = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-PK", { maximumFractionDigits: 0 });
