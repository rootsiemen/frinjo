/* Pure logic for the Discount Calculator. */

const round2 = (n: number) => Math.round(n * 100) / 100;

export interface DiscountResult {
  finalPrice: number;
  saved: number;
  effectivePct: number; // total % off the original price
  steps: { label: string; price: number }[]; // price after each step
}

/**
 * Apply one or two stacked percentage discounts, then optional sales tax.
 * Stacked discounts multiply — 20% + 10% is 28% off, not 30%.
 */
export function computeDiscount(
  price: number,
  pct1: number,
  pct2 = 0,
  taxPct = 0,
): DiscountResult | null {
  if (!Number.isFinite(price) || price < 0) return null;
  const clamp = (p: number) => Math.min(100, Math.max(0, p || 0));
  const steps: { label: string; price: number }[] = [{ label: "Original price", price: round2(price) }];
  let current = price * (1 - clamp(pct1) / 100);
  steps.push({ label: `After ${clamp(pct1)}% off`, price: round2(current) });
  if (clamp(pct2) > 0) {
    current = current * (1 - clamp(pct2) / 100);
    steps.push({ label: `After extra ${clamp(pct2)}% off`, price: round2(current) });
  }
  const afterDiscounts = round2(current);
  const withTax = taxPct > 0 ? round2(afterDiscounts * (1 + taxPct / 100)) : afterDiscounts;
  if (taxPct > 0) steps.push({ label: `With ${taxPct}% sales tax`, price: withTax });
  return {
    finalPrice: withTax,
    saved: round2(price - afterDiscounts),
    effectivePct: price > 0 ? round2((1 - afterDiscounts / price) * 100) : 0,
    steps,
  };
}

/** Reverse: what % off takes `original` down to `sale`? */
export function percentOff(original: number, sale: number): number | null {
  if (!Number.isFinite(original) || original <= 0 || !Number.isFinite(sale)) return null;
  return round2((1 - sale / original) * 100);
}

/** Reverse: what was the original price if `finalPrice` is after pct% off? */
export function originalPrice(finalPrice: number, pct: number): number | null {
  if (!Number.isFinite(finalPrice) || pct >= 100 || pct < 0) return null;
  return round2(finalPrice / (1 - pct / 100));
}
