// Pure calculation logic — PTA Mobile Tax Calculator (Pakistan, DIRBS).
// Ported faithfully from calc.frinjo.me (PakCalc) — SRO 1064(I)/2026 +
// Finance Act 2026 (verified Oct 2026 at source).

export interface PtaBand {
  maxUsd: number;
  label: string;
  rd: number;
  incomeTax: number; // CNIC filer
  levy: number; // smartphone
  stRate: number;
}

export const PTA_BANDS: PtaBand[] = [
  { maxUsd: 30, label: "Up to $30", rd: 240, incomeTax: 100, levy: 100, stRate: 0.18 },
  { maxUsd: 100, label: "$30 – $100", rd: 2400, incomeTax: 100, levy: 200, stRate: 0.18 },
  { maxUsd: 200, label: "$100 – $200", rd: 6000, incomeTax: 100, levy: 200, stRate: 0.18 },
  { maxUsd: 350, label: "$200 – $350", rd: 8800, incomeTax: 970, levy: 1800, stRate: 0.18 },
  { maxUsd: 500, label: "$350 – $500", rd: 12000, incomeTax: 5000, levy: 4000, stRate: 0.18 },
  { maxUsd: 700, label: "$500 – $700", rd: 17600, incomeTax: 11500, levy: 8000, stRate: 0.25 },
  { maxUsd: Infinity, label: "Above $700", rd: 17600, incomeTax: 11500, levy: 16000, stRate: 0.25 },
];

export const PTA_CUSTOMS_DUTY = 250;

export interface PtaInput {
  usd: number;
  rate: number; // Rs per USD
  regType: "cnic" | "passport";
  filer: boolean;
  smartphone: boolean;
}

export interface PtaResult {
  valueRs: number;
  band: PtaBand;
  cd: number;
  rd: number;
  st: number;
  it: number;
  levy: number;
  total: number;
}

export function ptaBandFor(usd: number): PtaBand {
  return PTA_BANDS.find((b) => usd <= b.maxUsd) ?? PTA_BANDS[PTA_BANDS.length - 1];
}

export function computePta(input: PtaInput): PtaResult {
  const { usd, rate, regType, filer, smartphone } = input;
  const valueRs = usd * rate;
  const band = ptaBandFor(usd);
  const cd = PTA_CUSTOMS_DUTY;
  const rd = band.rd;
  const st = Math.round((valueRs + cd + rd) * band.stRate);
  let it = 0;
  if (regType === "cnic") {
    it = band.incomeTax;
    if (!smartphone && usd <= 30) it = 70; // basic phone, lowest band
    if (!filer) it *= 2;
  }
  const levy = smartphone ? band.levy : 0;
  const total = cd + rd + st + it + levy;
  return { valueRs, band, cd, rd, st, it, levy, total };
}
