// Pure calculation logic — Zakat Calculator.
// Ported faithfully from calc.frinjo.me (PakCalc). Default bullion rates are
// the source's defaults (All Pakistan Sarafa Association, verified
// 2026-10-15 at source) and stay user-editable in the tool itself.

export const DEFAULT_GOLD_TOLA = 437836;
export const DEFAULT_SILVER_TOLA = 6148;

export interface ZakatInput {
  cash: number;
  goldTola: number;
  silverTola: number;
  assets: number;
  debts: number;
  goldRate: number; // Rs per tola; falls back to default when 0/invalid
  silverRate: number; // Rs per tola; falls back to default when 0/invalid
}

export interface ZakatResult {
  goldRate: number;
  silverRate: number;
  nisabGold: number;
  nisabSilver: number;
  nisab: number;
  goldVal: number;
  silverVal: number;
  total: number;
  liable: boolean;
  zakat: number;
}

export function computeZakat(input: ZakatInput): ZakatResult {
  const gr = input.goldRate || DEFAULT_GOLD_TOLA;
  const sr = input.silverRate || DEFAULT_SILVER_TOLA;
  const nisabGold = 7.5 * gr;
  const nisabSilver = 52.5 * sr;
  const nisab = Math.min(nisabGold, nisabSilver);
  const goldVal = input.goldTola * gr;
  const silverVal = input.silverTola * sr;
  const total = input.cash + goldVal + silverVal + input.assets - input.debts;
  const liable = total >= nisab && total > 0;
  const zakat = liable ? total * 0.025 : 0;
  return { goldRate: gr, silverRate: sr, nisabGold, nisabSilver, nisab, goldVal, silverVal, total, liable, zakat };
}
