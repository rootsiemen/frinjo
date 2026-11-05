// Pure calculation logic for Calcul TVA (France) — no React, unit-testable.
// Transfer of the ES IVA engine: multi-line invoice, add (HT → TTC) or
// extract (TTC → HT), French VAT rates 20 / 10 / 5.5 / 2.1 (+ 8.5 DOM, 0).

export type TvaMode = "add" | "extract";

export const TVA_RATES: { rate: number; label: string }[] = [
  { rate: 20, label: "20 % — taux normal" },
  { rate: 10, label: "10 % — taux intermédiaire (restauration, travaux, transport…)" },
  { rate: 5.5, label: "5,5 % — taux réduit (alimentation, livres, énergie…)" },
  { rate: 2.1, label: "2,1 % — taux super-réduit (presse, médicaments remboursables)" },
  { rate: 8.5, label: "8,5 % — taux normal Guadeloupe, Martinique, La Réunion" },
  { rate: 0, label: "0 % — exonéré / hors champ (Guyane, Mayotte, export…)" },
];

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export interface TvaLineInput {
  quantity: number;
  unitPrice: number;
  ratePct: number;
}

export interface LineTotals {
  /** Montant hors taxes (HT). */
  ht: number;
  /** Montant de TVA. */
  tva: number;
  /** Montant toutes taxes comprises (TTC). */
  ttc: number;
}

/**
 * Totals for one invoice line.
 * - mode "add": unitPrice is HT → TVA is added on top.
 * - mode "extract": unitPrice is TTC → ht = ttc / (1 + rate/100).
 */
export function lineTotals(line: TvaLineInput, mode: TvaMode): LineTotals {
  const qty = Number.isFinite(line.quantity) ? line.quantity : 0;
  const price = Number.isFinite(line.unitPrice) ? line.unitPrice : 0;
  const rate = Number.isFinite(line.ratePct) ? line.ratePct : 0;
  const amount = qty * price;
  if (mode === "add") {
    const ht = round2(amount);
    const tva = round2((ht * rate) / 100);
    return { ht, tva, ttc: round2(ht + tva) };
  }
  const ttc = round2(amount);
  const ht = round2(ttc / (1 + rate / 100));
  return { ht, tva: round2(ttc - ht), ttc };
}

export interface InvoiceTotals {
  ht: number;
  tva: number;
  ttc: number;
  /** TVA breakdown by rate: ratePct → { baseHt, tva }. */
  byRate: { ratePct: number; baseHt: number; tva: number }[];
}

export function invoiceTotals(lines: TvaLineInput[], mode: TvaMode): InvoiceTotals {
  let ht = 0;
  let tva = 0;
  const map = new Map<number, { baseHt: number; tva: number }>();
  for (const line of lines) {
    const t = lineTotals(line, mode);
    ht += t.ht;
    tva += t.tva;
    const rate = Number.isFinite(line.ratePct) ? line.ratePct : 0;
    const cur = map.get(rate) ?? { baseHt: 0, tva: 0 };
    cur.baseHt += t.ht;
    cur.tva += t.tva;
    map.set(rate, cur);
  }
  ht = round2(ht);
  tva = round2(tva);
  return {
    ht,
    tva,
    ttc: round2(ht + tva),
    byRate: [...map.entries()]
      .map(([ratePct, v]) => ({ ratePct, baseHt: round2(v.baseHt), tva: round2(v.tva) }))
      .sort((a, b) => b.ratePct - a.ratePct),
  };
}

/** Single-amount shortcut: convert one price HT → TTC or TTC → HT. */
export function convertAmount(amount: number, ratePct: number, mode: TvaMode): LineTotals {
  return lineTotals({ quantity: 1, unitPrice: amount, ratePct }, mode);
}
