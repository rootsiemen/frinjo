// Pure calculation logic — Intérêts composés — no React, unit-testable.
// FV = P(1 + r/n)^(n·t) + versement × [((1 + r/n)^(n·t) − 1) / (r/n)]
// (versements en fin de période). Versements mensuels convertis sur la
// fréquence de capitalisation choisie.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export type Frequence = 1 | 4 | 12; // annuelle, trimestrielle, mensuelle

export interface InteretsInput {
  capitalInitial: number;
  /** Taux annuel en % (ex. 5 pour 5 %). */
  tauxAnnuelPct: number;
  dureeAnnees: number;
  /** Versement régulier par mois (converti à la fréquence de capitalisation). */
  versementMensuel: number;
  frequence: Frequence;
}

export interface AnneeRow {
  annee: number;
  versementsCumules: number;
  interetsCumules: number;
  /** Valeur du placement en fin d'année. */
  valeur: number;
}

export interface InteretsResult {
  valeurFinale: number;
  totalVerse: number; // capital initial + versements
  totalInterets: number;
  rows: AnneeRow[];
}

export function computeInterets(input: InteretsInput): InteretsResult {
  const P = Number.isFinite(input.capitalInitial) ? Math.max(0, input.capitalInitial) : 0;
  const taux = Number.isFinite(input.tauxAnnuelPct) ? Math.max(0, input.tauxAnnuelPct) : 0;
  const annees = Math.max(0, Math.floor(Number.isFinite(input.dureeAnnees) ? input.dureeAnnees : 0));
  const versementMensuel = Number.isFinite(input.versementMensuel) ? Math.max(0, input.versementMensuel) : 0;
  const n = input.frequence;
  const r = taux / 100;
  const versementParPeriode = versementMensuel * (12 / n);
  const periodesParAn = n;

  const rows: AnneeRow[] = [];
  let valeur = P;
  let verseCumule = P;

  for (let annee = 1; annee <= annees; annee++) {
    for (let p = 0; p < periodesParAn; p++) {
      valeur = valeur * (1 + r / n) + versementParPeriode;
      verseCumule += versementParPeriode;
    }
    rows.push({
      annee,
      versementsCumules: round2(verseCumule),
      interetsCumules: round2(valeur - verseCumule),
      valeur: round2(valeur),
    });
  }

  const totalVerse = round2(P + versementMensuel * 12 * annees);
  return {
    valeurFinale: round2(valeur),
    totalVerse,
    totalInterets: round2(valeur - totalVerse),
    rows,
  };
}

/** Valeur réelle après inflation (pouvoir d'achat en euros d'aujourd'hui). */
export function valeurReelle(valeurFuture: number, inflationPct: number, annees: number): number {
  const v = Number.isFinite(valeurFuture) ? valeurFuture : 0;
  const i = (Number.isFinite(inflationPct) ? inflationPct : 0) / 100;
  const t = Math.max(0, Number.isFinite(annees) ? annees : 0);
  if (i === 0) return round2(v);
  return round2(v / Math.pow(1 + i, t));
}
