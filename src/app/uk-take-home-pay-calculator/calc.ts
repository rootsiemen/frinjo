// Pure calculation logic — UK taxes 2026/27 (shared by the UK Take-Home Pay
// Calculator and the IR35 Calculator).
// Ported faithfully from uk.frinjo.me (UKPayCalc) lib/tax.ts — UK tax year
// 2026/27 (6 April 2026 – 5 April 2027), constants as verified at source
// (Oct 2026): income tax bands, NI thresholds (HMRC CA38), employer NI 15%
// above £5,000, Scotland bands.

export const TAX_YEAR = "2026/27";

// ---- Income tax: England, Wales & Northern Ireland ----
export const PERSONAL_ALLOWANCE = 12570;
export const PA_TAPER_START = 100000; // allowance falls £1 per £2 above this
export const PA_TAPER_END = 125140; // allowance fully gone

// Band widths in TAXABLE-income terms (after personal allowance)
const RUK_WIDTHS = [
  { width: 37700, rate: 0.2 }, // basic:  £12,571 – £50,270 gross
  { width: 74870, rate: 0.4 }, // higher: £50,271 – £125,140 gross
  { width: Infinity, rate: 0.45 }, // additional: above £125,140
];

// ---- Income tax: Scotland ----
const SCOT_WIDTHS = [
  { width: 3967, rate: 0.19 }, // starter:      £12,571 – £16,537
  { width: 12989, rate: 0.2 }, // basic:        £16,538 – £29,526
  { width: 14136, rate: 0.21 }, // intermediate: £29,527 – £43,662
  { width: 31338, rate: 0.42 }, // higher:       £43,663 – £75,000
  { width: 50140, rate: 0.45 }, // advanced:     £75,001 – £125,140
  { width: Infinity, rate: 0.48 }, // top:        above £125,140
];

// ---- Employee National Insurance (Class 1) ----
export const NI_PRIMARY_THRESHOLD = 12570;
export const NI_UPPER_LIMIT = 50270;
export const NI_MAIN_RATE = 0.08;
export const NI_UPPER_RATE = 0.02;

// ---- Employer National Insurance ----
export const EMPLOYER_NI_THRESHOLD = 5000;
export const EMPLOYER_NI_RATE = 0.15;

// ---- Apprenticeship / Growth & Skills Levy (umbrella & deemed employers) ----
export const LEVY_RATE = 0.005;

export type Region = "ruk" | "scotland";

export function personalAllowance(gross: number): number {
  if (gross <= PA_TAPER_START) return PERSONAL_ALLOWANCE;
  const reduction = Math.floor((gross - PA_TAPER_START) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

export function incomeTax(gross: number, region: Region): number {
  if (gross <= 0) return 0;
  const pa = personalAllowance(gross);
  let taxable = Math.max(0, gross - pa);
  const widths = region === "scotland" ? SCOT_WIDTHS : RUK_WIDTHS;
  let tax = 0;
  for (const b of widths) {
    const slice = Math.min(taxable, b.width);
    tax += slice * b.rate;
    taxable -= slice;
    if (taxable <= 0) break;
  }
  return Math.round(tax);
}

export function employeeNI(gross: number): number {
  if (gross <= NI_PRIMARY_THRESHOLD) return 0;
  const main = Math.min(gross, NI_UPPER_LIMIT) - NI_PRIMARY_THRESHOLD;
  const upper = Math.max(0, gross - NI_UPPER_LIMIT);
  return Math.round(main * NI_MAIN_RATE + upper * NI_UPPER_RATE);
}

export function employerNI(gross: number): number {
  return Math.round(Math.max(0, gross - EMPLOYER_NI_THRESHOLD) * EMPLOYER_NI_RATE);
}

export const gbp = (n: number) =>
  "£" + Math.round(n).toLocaleString("en-GB", { maximumFractionDigits: 0 });
