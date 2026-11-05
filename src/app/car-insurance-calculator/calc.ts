// "How much car insurance do I need?" logic — recommended liability limits
// from what a driver actually has to protect (net worth + income), checked
// against the legal floor of their state, with national cost context.
// The recommendation rule is the consumer-standard one: your liability
// limits should at least cover what a court could take — net worth plus
// garnishable future income. Pure functions, no React, unit-testable.

import { STATE_MINIMUMS, type StateMinimum } from "./states";

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;
const clean = (n: number): number => (Number.isFinite(n) ? n : 0);
const pos = (n: number): number => Math.max(0, clean(n));

export interface Limits {
  biPerson: number;
  biAccident: number;
  pd: number;
}

export type CoverageTier = "starter" | "standard" | "high" | "umbrella";

/** Round a needed amount up to the nearest standard split limit insurers
 *  actually sell. */
export function standardLimitsFor(exposure: number): Limits & { tier: CoverageTier } {
  const e = pos(exposure);
  if (e <= 50_000) return { biPerson: 50000, biAccident: 100000, pd: 50000, tier: "starter" };
  if (e <= 250_000) return { biPerson: 100000, biAccident: 300000, pd: 100000, tier: "standard" };
  if (e <= 500_000) return { biPerson: 250000, biAccident: 500000, pd: 100000, tier: "high" };
  return { biPerson: 250000, biAccident: 500000, pd: 250000, tier: "umbrella" };
}

export interface CoverageInput {
  stateCode: string;
  netWorth: number;
  annualIncome: number;
  /** Car's approximate value — drives the collision/comprehensive advice. */
  carValue: number;
  /** Still paying a loan or lease? Lenders require full coverage. */
  financed: boolean;
}

export interface CoverageResult {
  state: StateMinimum;
  /** What a judgment could reach: assets + one year of income (a common
   *  consumer-planning proxy for garnishment exposure). */
  exposure: number;
  recommended: Limits & { tier: CoverageTier };
  /** True when the state's legal minimum is higher than the asset-based
   *  recommendation (the law wins). */
  stateMinimumIsHigher: boolean;
  /** Collision/comprehensive verdict for the car itself. */
  fullCoverage: "required" | "worth-it" | "optional";
  fullCoverageReason: string;
  /** Rough national cost orientation per year — NOT a quote. */
  costRange: { low: number; high: number };
}

/* Cost context anchor: the national average full-coverage premium of
 * $2,578/year published by Insure.com (2025). Tier ranges are expressed
 * as shares of that average and labeled on-page as orientation only. */
export const NATIONAL_AVG_FULL_COVERAGE = 2578;
const TIER_COST_SHARE: Record<CoverageTier, [number, number]> = {
  starter: [0.5, 0.75], // higher-limit liability + full coverage, smaller cars skew lower
  standard: [0.85, 1.1],
  high: [1.05, 1.3],
  umbrella: [1.15, 1.45], // plus a separate umbrella policy, typically $150–$300/yr
};

export function recommendCoverage(input: CoverageInput): CoverageResult {
  const state =
    STATE_MINIMUMS.find((s) => s.code === input.stateCode) ?? STATE_MINIMUMS[0];
  const exposure = round2(pos(input.netWorth) + pos(input.annualIncome));
  const byAssets = standardLimitsFor(exposure);
  const stateFloor: Limits = {
    biPerson: state.biPerson,
    biAccident: state.biAccident,
    pd: state.pd,
  };
  const stateMinimumIsHigher =
    stateFloor.biAccident > byAssets.biAccident || stateFloor.biPerson > byAssets.biPerson;
  const recommended = stateMinimumIsHigher
    ? { ...stateFloor, tier: byAssets.tier }
    : byAssets;

  const carValue = pos(input.carValue);
  let fullCoverage: CoverageResult["fullCoverage"];
  let fullCoverageReason: string;
  if (input.financed) {
    fullCoverage = "required";
    fullCoverageReason =
      "Your lender or leasing company requires collision and comprehensive until the loan is paid off — this one is not a choice.";
  } else if (carValue >= 5000) {
    fullCoverage = "worth-it";
    fullCoverageReason = `A car worth about $${carValue.toLocaleString("en-US")} is expensive to replace out of pocket; collision and comprehensive usually cost far less than the car until it ages well past $5,000 in value.`;
  } else {
    fullCoverage = "optional";
    fullCoverageReason =
      "Below roughly $5,000 in value, collision and comprehensive premiums plus the deductible approach what the car is worth — many owners drop them and bank the difference.";
  }

  const [lo, hi] = TIER_COST_SHARE[recommended.tier];
  return {
    state,
    exposure,
    recommended,
    stateMinimumIsHigher,
    fullCoverage,
    fullCoverageReason,
    costRange: {
      low: Math.round((NATIONAL_AVG_FULL_COVERAGE * lo) / 10) * 10,
      high: Math.round((NATIONAL_AVG_FULL_COVERAGE * hi) / 10) * 10,
    },
  };
}

/** "100/300/100" shorthand used across the industry. */
export function limitsLabel(l: Limits): string {
  const k = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}` : `${n}`);
  return `${k(l.biPerson)}/${k(l.biAccident)}/${k(l.pd)}`;
}
