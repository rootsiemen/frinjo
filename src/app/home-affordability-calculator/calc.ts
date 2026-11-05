// Home affordability presets — the shared DTI engine (src/lib/dti.ts)
// configured per loan program: each program sets its ratio caps, its
// up-front financed fee and how its mortgage insurance behaves.

import {
  LOAN_PROGRAMS,
  affordability,
  incomeNeededForPrice,
  type AffordabilityInput,
  type AffordabilityResult,
  type LoanProgram,
} from "@/lib/dti";

export type ProgramKey = "conventional" | "fha" | "va";

export interface ProgramDefaults {
  program: LoanProgram;
  /** Financed one-time fee, % of base loan (FHA UFMIP / VA funding fee). */
  financedFeePct: number;
  /** Annual mortgage-insurance rate on the loan, %. */
  miAnnualPct: number;
  miAlways: boolean;
  miLabel: string;
}

export const PROGRAM_DEFAULTS: Record<ProgramKey, ProgramDefaults> = {
  conventional: {
    program: LOAN_PROGRAMS[0],
    financedFeePct: 0,
    miAnnualPct: 0.5,
    miAlways: false,
    miLabel: "PMI while you owe more than 80% of the price",
  },
  fha: {
    program: LOAN_PROGRAMS[1],
    financedFeePct: 1.75,
    miAnnualPct: 0.55,
    miAlways: true,
    miLabel: "Annual MIP for the loan's early years (life of loan under 10% down)",
  },
  va: {
    program: LOAN_PROGRAMS[2],
    financedFeePct: 2.15,
    miAnnualPct: 0,
    miAlways: false,
    miLabel: "No monthly mortgage insurance on VA loans",
  },
};

export function programAffordability(
  key: ProgramKey,
  input: Omit<AffordabilityInput, "program" | "financedFeePct" | "pmiAnnualPct" | "miAlways">,
): AffordabilityResult {
  const d = PROGRAM_DEFAULTS[key];
  return affordability({
    ...input,
    program: d.program,
    financedFeePct: d.financedFeePct,
    pmiAnnualPct: d.miAnnualPct,
    miAlways: d.miAlways,
  });
}

export function programIncomeNeeded(
  key: ProgramKey,
  input: Omit<AffordabilityInput, "program" | "financedFeePct" | "pmiAnnualPct" | "miAlways" | "grossAnnualIncome"> & { price: number },
): { annualIncome: number; monthlyHousing: number } {
  const d = PROGRAM_DEFAULTS[key];
  return incomeNeededForPrice({
    ...input,
    program: d.program,
    financedFeePct: d.financedFeePct,
    pmiAnnualPct: d.miAnnualPct,
    miAlways: d.miAlways,
  });
}

export { LOAN_PROGRAMS };
