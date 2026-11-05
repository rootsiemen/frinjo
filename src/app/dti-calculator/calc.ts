// DTI calculator verdicts — the shared engine (src/lib/dti.ts) plus the
// plain-English bands lenders actually use.

import { LOAN_PROGRAMS, dtiRatios, maxAdditionalDebtPayment } from "@/lib/dti";

export type DtiBand = "excellent" | "solid" | "workable" | "stretched" | "high";

export interface DtiVerdict {
  band: DtiBand;
  label: string;
  detail: string;
}

/** Band a back-end ratio the way an underwriter would describe it. */
export function backEndVerdict(backPct: number): DtiVerdict {
  if (backPct <= 20)
    return {
      band: "excellent",
      label: "Excellent — well inside every program's limits",
      detail:
        "A back-end ratio at or under 20% passes every mainstream mortgage program with room to spare and leaves real slack in the monthly budget.",
    };
  if (backPct <= 36)
    return {
      band: "solid",
      label: "Solid — inside the classic 28/36 rule",
      detail:
        "You are within the conventional 36% back-end guideline. Most lenders read this as a comfortable file.",
    };
  if (backPct <= 43)
    return {
      band: "workable",
      label: "Workable — fine for FHA and many conventional approvals",
      detail:
        "Above the classic guideline but inside FHA's 43% and the range automated underwriting approves with compensating factors (credit score, reserves, small payment increase).",
    };
  if (backPct <= 50)
    return {
      band: "stretched",
      label: "Stretched — approvable, but fragile",
      detail:
        "Conventional loans can reach about 50% with strong compensating factors, but one car repair or rate rise puts the budget under water. Lenders know it, and price for it.",
    };
  return {
    band: "high",
    label: "High — most mortgage programs will push back",
    detail:
      "Above 50%, mainstream programs generally decline or require the debts to shrink first. Paying down the smallest high-payment debt usually moves this ratio fastest per dollar.",
  };
}

export { LOAN_PROGRAMS, dtiRatios, maxAdditionalDebtPayment };
