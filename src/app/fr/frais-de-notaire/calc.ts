// Pure calculation logic for Frais de notaire (France) — no React, unit-testable.
// ESTIMATE based on the official scales in force (barème des émoluments,
// Code général des impôts for droits de mutation). The notaire's final
// statement prevails.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export type TypeBien = "ancien" | "neuf";
export type DepartementRegime = "standard" | "reduit";

/**
 * Droits de mutation à titre onéreux (DMTO), as a fraction of the price.
 * - Ancien, département standard (most départements): département 4.50 %
 *   + commune 1.20 % + frais d'assiette et de recouvrement 2.37 % of the
 *   département share (0.10665 %) = 5.80665 %.
 * - Ancien, département à taux réduit (Indre, Isère, Morbihan, Mayotte…):
 *   département 3.80 % + commune 1.20 % + assiette 0.09006 % = 5.09006 %.
 * - Neuf (frais réduits): 0.715 % total.
 */
export const DMTO_PCT: Record<string, number> = {
  "ancien-standard": 5.80665,
  "ancien-reduit": 5.09006,
  "neuf-standard": 0.715,
  "neuf-reduit": 0.715,
};

/** Débours (frais avancés par le notaire : documents, géomètre…) — forfait estimatif. */
export const DEBOURS_FORFAIT = 1200;

/** Contribution de sécurité immobilière: 0,10 % du prix, minimum 15 €. */
export const CSI_PCT = 0.1;

/** TVA sur les émoluments du notaire. */
export const TVA_EMOLUMENTS_PCT = 20;

/** Tranches du barème des émoluments proportionnels (taux HT). */
export const EMOLUMENTS_TRANCHES: { jusquA: number; tauxPct: number }[] = [
  { jusquA: 6500, tauxPct: 3.87 },
  { jusquA: 17000, tauxPct: 1.596 },
  { jusquA: 60000, tauxPct: 1.064 },
  { jusquA: Infinity, tauxPct: 0.799 },
];

/** Émoluments proportionnels HT for a sale price, by degressive tranches. */
export function emolumentsHt(prix: number): number {
  const p = Number.isFinite(prix) ? Math.max(0, prix) : 0;
  let total = 0;
  let prev = 0;
  for (const t of EMOLUMENTS_TRANCHES) {
    if (p <= prev) break;
    const slice = Math.min(p, t.jusquA) - prev;
    total += (slice * t.tauxPct) / 100;
    prev = t.jusquA;
  }
  return round2(total);
}

export interface NotaireInput {
  prix: number;
  type: TypeBien;
  departement: DepartementRegime;
  /** Montant emprunté (pour l'estimation des frais de garantie, optionnel). */
  montantPret?: number;
}

export interface NotaireResult {
  prix: number;
  /** Droits de mutation (taxe de publicité foncière / droits d'enregistrement). */
  droitsMutation: number;
  droitsMutationPct: number;
  emolumentsHt: number;
  tvaEmoluments: number;
  emolumentsTtc: number;
  debours: number;
  contributionSecuriteImmobiliere: number;
  /** Frais de garantie estimés (hypothèque / PPD) si un prêt est indiqué, sinon 0. */
  fraisGarantieEstimes: number;
  totalFrais: number;
  /** Total frais en % du prix. */
  totalFraisPct: number;
  coutTotalAcquisition: number;
}

export function computeFraisNotaire(input: NotaireInput): NotaireResult {
  const prix = Number.isFinite(input.prix) ? Math.max(0, input.prix) : 0;
  const key = `${input.type}-${input.departement}`;
  const dmtoPct = DMTO_PCT[key] ?? DMTO_PCT["ancien-standard"];
  const droitsMutation = round2((prix * dmtoPct) / 100);
  const emoHt = emolumentsHt(prix);
  const tvaEmoluments = round2((emoHt * TVA_EMOLUMENTS_PCT) / 100);
  const emolumentsTtc = round2(emoHt + tvaEmoluments);
  const csi = prix > 0 ? Math.max(15, round2((prix * CSI_PCT) / 100)) : 0;
  const debours = prix > 0 ? DEBOURS_FORFAIT : 0;
  // Frais de garantie indicatifs : ~0,9 % du prêt pour un PPD, ~1,6 % pour une
  // hypothèque classique. On retient le PPD (cas le plus fréquent hors neuf VEFA).
  const pret = Number.isFinite(input.montantPret ?? 0) ? Math.max(0, input.montantPret ?? 0) : 0;
  const fraisGarantieEstimes = pret > 0 ? round2(pret * 0.009) : 0;
  const totalFrais = round2(
    droitsMutation + emolumentsTtc + debours + csi + fraisGarantieEstimes,
  );
  return {
    prix,
    droitsMutation,
    droitsMutationPct: dmtoPct,
    emolumentsHt: emoHt,
    tvaEmoluments,
    emolumentsTtc,
    debours,
    contributionSecuriteImmobiliere: csi,
    fraisGarantieEstimes,
    totalFrais,
    totalFraisPct: prix > 0 ? round2((totalFrais / prix) * 10000) / 100 : 0,
    coutTotalAcquisition: round2(prix + totalFrais),
  };
}
