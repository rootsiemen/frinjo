// Pure calculation logic for the Calculadora de IVA — no React, unit-testable.

export type VatMode = "add" | "extract";

export interface CountryPreset {
  id: string;
  name: string;
  /** Local name of the tax (IVA, IGV in Perú, ITBMS in Panamá, ITBIS in R. Dominicana). */
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
  { id: "es", name: "España", taxName: "IVA", currency: "EUR", currencyOne: "euro", currencyMany: "euros", centOne: "céntimo", centMany: "céntimos", rates: [21, 10, 4, 0], defaultRate: 21 },
  { id: "mx", name: "México", taxName: "IVA", currency: "MXN", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [16, 8, 0], defaultRate: 16 },
  { id: "co", name: "Colombia", taxName: "IVA", currency: "COP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [19, 5, 0], defaultRate: 19 },
  { id: "ar", name: "Argentina", taxName: "IVA", currency: "ARS", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [21, 10.5, 27, 0], defaultRate: 21 },
  { id: "cl", name: "Chile", taxName: "IVA", currency: "CLP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [19], defaultRate: 19 },
  { id: "pe", name: "Perú", taxName: "IGV", currency: "PEN", currencyOne: "sol", currencyMany: "soles", centOne: "céntimo", centMany: "céntimos", rates: [18], defaultRate: 18 },
  { id: "ec", name: "Ecuador", taxName: "IVA", currency: "USD", currencyOne: "dólar", currencyMany: "dólares", centOne: "centavo", centMany: "centavos", rates: [15, 0], defaultRate: 15 },
  { id: "uy", name: "Uruguay", taxName: "IVA", currency: "UYU", currencyOne: "peso", currencyMany: "pesos", centOne: "centésimo", centMany: "centésimos", rates: [22, 10, 0], defaultRate: 22 },
  { id: "do", name: "República Dominicana", taxName: "ITBIS", currency: "DOP", currencyOne: "peso", currencyMany: "pesos", centOne: "centavo", centMany: "centavos", rates: [18, 0], defaultRate: 18 },
  { id: "cr", name: "Costa Rica", taxName: "IVA", currency: "CRC", currencyOne: "colón", currencyMany: "colones", centOne: "céntimo", centMany: "céntimos", rates: [13, 0], defaultRate: 13 },
  { id: "pa", name: "Panamá", taxName: "ITBMS", currency: "USD", currencyOne: "dólar", currencyMany: "dólares", centOne: "centavo", centMany: "centavos", rates: [7, 0], defaultRate: 7 },
];

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export interface VatLineInput {
  quantity: number;
  unitPrice: number;
  ratePct: number;
}

export interface LineTotals {
  /** Net amount (sin impuesto). */
  base: number;
  /** Tax amount (cuota). */
  tax: number;
  /** Gross amount (con impuesto). */
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
  /** ISR withholding: % applied to the base (subtotal). */
  isrRetention: number;
  /** IVA withholding: % applied to the tax amount (cuota). E.g. two thirds in México = 66.67%. */
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
/* Spanish number-to-words (numeroALetras)                             */
/* ------------------------------------------------------------------ */

const UNITS = ["cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const TEENS = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"];
const TWENTIES = ["veinte", "veintiuno", "veintidós", "veintitrés", "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve"];
const TENS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const HUNDREDS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function wordsUnder100(n: number): string {
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 30) return TWENTIES[n - 20];
  const ten = Math.floor(n / 10);
  const unit = n % 10;
  return unit === 0 ? TENS[ten] : `${TENS[ten]} y ${UNITS[unit]}`;
}

function wordsUnder1000(n: number): string {
  if (n === 100) return "cien";
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  if (hundred === 0) return wordsUnder100(n);
  return rest === 0 ? HUNDREDS[hundred] : `${HUNDREDS[hundred]} ${wordsUnder100(rest)}`;
}

/** "uno" → "un" (and "veintiuno" → "veintiún") before "mil" / "millón" / "millones". */
function apocope(words: string): string {
  if (words.endsWith("veintiuno")) return `${words.slice(0, words.length - "veintiuno".length)}veintiún`;
  if (words.endsWith("uno")) return words.slice(0, words.length - 1);
  return words;
}

/** Integer to Spanish words. Supports 0 up to 999,999,999. */
function integerWords(n: number): string {
  if (n === 0) return "cero";
  const parts: string[] = [];
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  if (millions === 1) parts.push("un millón");
  else if (millions > 1) parts.push(`${apocope(wordsUnder1000(millions))} millones`);
  if (thousands === 1) parts.push("mil");
  else if (thousands > 1) parts.push(`${apocope(wordsUnder1000(thousands))} mil`);
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
 * Amount in Spanish words, invoice style ("total en letra"):
 * numeroALetras(1234.56, EUR words) → "Mil doscientos treinta y cuatro euros con cincuenta y seis céntimos".
 */
export function numeroALetras(amount: number, currency: CurrencyWords): string {
  const safe = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  const totalCents = Math.round(safe * 100);
  const intPart = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const words = apocope(integerWords(intPart));
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  let out = `${capitalized} ${intPart === 1 ? currency.currencyOne : currency.currencyMany}`;
  if (cents > 0) {
    out += ` con ${apocope(integerWords(cents))} ${cents === 1 ? currency.centOne : currency.centMany}`;
  }
  return out;
}
