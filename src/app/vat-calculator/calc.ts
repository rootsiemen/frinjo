// Pure calculation logic for the VAT Calculator — no React, unit-testable.

export type VatMode = "add" | "extract";

export interface CountryPreset {
  id: string;
  name: string;
  /** Local name of the tax (IVA, IGV in Peru, ITBMS in Panama, ITBIS in the Dominican Republic). */
  taxName: string;
  /** ISO 4217 currency code, used with Intl.NumberFormat. */
  currency: string;
  currencyOne: string;
  currencyMany: string;
  centOne: string;
  centMany: string;
  /** Selectable rates (%) for this country. */
  rates: number[];
  defaultRate: number;
}

export const COUNTRY_PRESETS: CountryPreset[] = [
  { id: "es", name: "Spain", taxName: "IVA", currency: "EUR", currencyOne: "euro", currencyMany: "euros", centOne: "cent", centMany: "cents", rates: [21, 10, 4, 0], defaultRate: 21 },
  { id: "mx", name: "Mexico", taxName: "IVA", currency: "MXN", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [16, 8, 0], defaultRate: 16 },
  { id: "co", name: "Colombia", taxName: "IVA", currency: "COP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [19, 5, 0], defaultRate: 19 },
  { id: "ar", name: "Argentina", taxName: "IVA", currency: "ARS", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [21, 10.5, 27, 0], defaultRate: 21 },
  { id: "cl", name: "Chile", taxName: "IVA", currency: "CLP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [19], defaultRate: 19 },
  { id: "pe", name: "Peru", taxName: "IGV", currency: "PEN", currencyOne: "sol", currencyMany: "soles", centOne: "céntimo", centMany: "céntimos", rates: [18], defaultRate: 18 },
  { id: "ec", name: "Ecuador", taxName: "IVA", currency: "USD", currencyOne: "dollar", currencyMany: "dollars", centOne: "cent", centMany: "cents", rates: [15, 0], defaultRate: 15 },
  { id: "uy", name: "Uruguay", taxName: "IVA", currency: "UYU", currencyOne: "peso", currencyMany: "pesos", centOne: "centésimo", centMany: "centésimos", rates: [22, 10, 0], defaultRate: 22 },
  { id: "do", name: "Dominican Republic", taxName: "ITBIS", currency: "DOP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [18, 0], defaultRate: 18 },
  { id: "cr", name: "Costa Rica", taxName: "IVA", currency: "CRC", currencyOne: "colón", currencyMany: "colones", centOne: "céntimo", centMany: "céntimos", rates: [13, 0], defaultRate: 13 },
  { id: "pa", name: "Panama", taxName: "ITBMS", currency: "USD", currencyOne: "dollar", currencyMany: "dollars", centOne: "cent", centMany: "cents", rates: [7, 0], defaultRate: 7 },
];

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export interface VatLineInput {
  quantity: number;
  unitPrice: number;
  ratePct: number;
}

export interface LineTotals {
  /** Net amount (before tax). */
  base: number;
  /** Tax amount. */
  tax: number;
  /** Gross amount (tax included). */
  total: number;
}

/**
 * Totals for one invoice line.
 * - mode "add":  unitPrice is the NET price → tax is added on top.
 * - mode "extract": unitPrice is the GROSS price → base = gross / (1 + rate/100).
 */
export function lineTotals(line: VatLineInput, mode: VatMode): LineTotals {
  const qty = Number.isFinite(line.quantity) ? line.quantity : 0;
  const price = Number.isFinite(line.unitPrice) ? line.unitPrice : 0;
  const rate = Number.isFinite(line.ratePct) ? line.ratePct : 0;
  const amount = qty * price;
  if (mode === "add") {
    const base = round2(amount);
    const tax = round2((base * rate) / 100);
    return { base, tax, total: round2(base + tax) };
  }
  const total = round2(amount);
  const base = round2(total / (1 + rate / 100));
  return { base, tax: round2(total - base), total };
}

export interface InvoiceTotals {
  base: number;
  tax: number;
  /** Income-tax withholding: % applied to the base (subtotal). */
  isrRetention: number;
  /** VAT withholding: % applied to the tax amount. E.g. two thirds in Mexico = 66.67%. */
  ivaRetention: number;
  total: number;
}

export function invoiceTotals(
  lines: VatLineInput[],
  mode: VatMode,
  isrRetentionPct = 0,
  ivaRetentionPct = 0,
): InvoiceTotals {
  let base = 0;
  let tax = 0;
  for (const line of lines) {
    const t = lineTotals(line, mode);
    base += t.base;
    tax += t.tax;
  }
  base = round2(base);
  tax = round2(tax);
  const isrRetention = round2((base * (Number.isFinite(isrRetentionPct) ? isrRetentionPct : 0)) / 100);
  const ivaRetention = round2((tax * (Number.isFinite(ivaRetentionPct) ? ivaRetentionPct : 0)) / 100);
  return { base, tax, isrRetention, ivaRetention, total: round2(base + tax - isrRetention - ivaRetention) };
}

/* ------------------------------------------------------------------ */
/* English number-to-words                                             */
/* ------------------------------------------------------------------ */

const ONES = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen",
];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function wordsUnder100(n: number): string {
  if (n < 20) return ONES[n];
  const ten = Math.floor(n / 10);
  const unit = n % 10;
  return unit === 0 ? TENS[ten] : `${TENS[ten]}-${ONES[unit]}`;
}

function wordsUnder1000(n: number): string {
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (hundred === 0) return wordsUnder100(n);
  return rest === 0 ? `${ONES[hundred]} hundred` : `${ONES[hundred]} hundred ${wordsUnder100(rest)}`;
}

/** Integer to English words. Supports 0 up to 999,999,999. */
function integerWords(n: number): string {
  if (n === 0) return "zero";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions > 0) parts.push(`${wordsUnder1000(millions)} million`);
  if (thousands > 0) parts.push(`${wordsUnder1000(thousands)} thousand`);
  if (rest > 0) parts.push(wordsUnder1000(rest));
  return parts.join(" ");
}

export interface CurrencyWords {
  currencyOne: string;
  currencyMany: string;
  centOne: string;
  centMany: string;
}

/**
 * Amount in English words, invoice style ("total in words"):
 * amountInWords(1234.56, EUR words) → "One thousand two hundred thirty-four euros with fifty-six cents".
 */
export function amountInWords(amount: number, currency: CurrencyWords): string {
  const safe = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const totalCents = Math.round(safe * 100);
  const intPart = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const words = integerWords(intPart);
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  let out = `${capitalized} ${intPart === 1 ? currency.currencyOne : currency.currencyMany}`;
  if (cents > 0) {
    out += ` with ${integerWords(cents)} ${cents === 1 ? currency.centOne : currency.centMany}`;
  }
  return out;
}
