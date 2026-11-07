/* Pure logic for the Tip Calculator + Bill Split. */

export interface TipInput {
  bill: number; // pre-tax subtotal the tip is calculated on, unless tipOnTax
  tipPct: number; // e.g. 20 for 20%
  taxPct?: number; // sales tax %, added to the bill
  people?: number; // split count, >= 1
  tipOnTax?: boolean; // calculate the tip on (bill + tax) instead of bill alone
  roundUpTotal?: boolean; // round the grand total up to the next whole dollar
}

export interface TipResult {
  taxAmount: number;
  tipBase: number;
  tipAmount: number;
  total: number;
  perPersonTotal: number;
  perPersonTip: number;
  perPersonShare: number; // (bill + tax) per person, before tip
  effectiveTipPct: number; // after any round-up, tip as % of the tip base
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeTip(input: TipInput): TipResult | null {
  const bill = input.bill;
  if (!Number.isFinite(bill) || bill < 0) return null;
  const people = Math.max(1, Math.floor(input.people ?? 1) || 1);
  const taxPct = Math.max(0, input.taxPct ?? 0);
  const taxAmount = round2((bill * taxPct) / 100);
  const tipBase = input.tipOnTax ? bill + taxAmount : bill;
  let tipAmount = round2((tipBase * Math.max(0, input.tipPct)) / 100);
  let total = round2(bill + taxAmount + tipAmount);
  if (input.roundUpTotal) {
    const rounded = Math.ceil(total);
    tipAmount = round2(tipAmount + (rounded - total));
    total = rounded;
  }
  return {
    taxAmount,
    tipBase,
    tipAmount,
    total,
    perPersonTotal: round2(total / people),
    perPersonTip: round2(tipAmount / people),
    perPersonShare: round2((bill + taxAmount) / people),
    effectiveTipPct: tipBase > 0 ? round2((tipAmount / tipBase) * 100) : 0,
  };
}

/** Standard US tipping guide rows used in the page content. */
export const TIP_GUIDE: [string, string][] = [
  ["Restaurant (table service)", "18–22%"],
  ["Restaurant (takeout / counter)", "0–10%"],
  ["Bar", "$1–2 per drink or 15–20% of the tab"],
  ["Food delivery", "15–20% (min. ~$5 on small orders)"],
  ["Coffee shop", "Optional — spare change to $1"],
  ["Taxi / rideshare", "15–20%"],
  ["Hair salon / barber", "15–20%"],
  ["Hotel housekeeping", "$2–5 per night"],
];
