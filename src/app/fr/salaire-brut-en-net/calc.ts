/**
 * Modèle d'estimation salaire brut → net (France).
 *
 * Modèle simplifié et transparent : un taux forfaitaire de charges salariales
 * selon le statut, puis le prélèvement à la source (PAS) appliqué sur le net
 * avant impôt. Ce n'est PAS le modèle officiel ligne par ligne de
 * mon-entreprise / Urssaf — c'est une estimation indicative.
 */

export type Statut = "non-cadre" | "cadre" | "fonction-publique";

export interface SalaireInput {
  /** Salaire brut mensuel en euros. */
  brutMensuel: number;
  statut: Statut;
  /** Taux de prélèvement à la source, en pourcentage (ex. 7 pour 7 %). */
  pasPct: number;
}

export interface SalaireResult {
  /** Montant des charges salariales (mensuel, €). */
  chargesSalariales: number;
  /** Taux de charges salariales appliqué, en fraction (0.22 = 22 %). */
  chargesSalarialesPct: number;
  netAvantImpotMensuel: number;
  /** Montant du prélèvement à la source (mensuel, €). */
  pas: number;
  netApresImpotMensuel: number;
  netAvantImpotAnnuel: number;
  netApresImpotAnnuel: number;
  /** Coût total employeur estimé (mensuel, €) — null pour la fonction publique. */
  coutEmployeurMensuel: number | null;
  /** Taux de charges patronales appliqué, en fraction — null pour la fonction publique. */
  chargesPatronalesPct: number | null;
}

/** Charges salariales moyennes estimées, en fraction du brut. */
export const CHARGES_SALARIALES: Record<Statut, number> = {
  "non-cadre": 0.22,
  cadre: 0.25,
  "fonction-publique": 0.17,
};

/** Charges patronales moyennes estimées (secteur privé), en fraction du brut. */
export const CHARGES_PATRONALES: Record<Statut, number | null> = {
  "non-cadre": 0.42,
  cadre: 0.45,
  "fonction-publique": null,
};

export function computeSalaire({ brutMensuel, statut, pasPct }: SalaireInput): SalaireResult {
  const chargesPct = CHARGES_SALARIALES[statut];
  const chargesSalariales = brutMensuel * chargesPct;
  const netAvantImpotMensuel = brutMensuel - chargesSalariales;
  const pas = netAvantImpotMensuel * (pasPct / 100);
  const netApresImpotMensuel = netAvantImpotMensuel - pas;
  const patronalesPct = CHARGES_PATRONALES[statut];
  const coutEmployeurMensuel =
    patronalesPct === null ? null : brutMensuel * (1 + patronalesPct);

  return {
    chargesSalariales,
    chargesSalarialesPct: chargesPct,
    netAvantImpotMensuel,
    pas,
    netApresImpotMensuel,
    netAvantImpotAnnuel: netAvantImpotMensuel * 12,
    netApresImpotAnnuel: netApresImpotMensuel * 12,
    coutEmployeurMensuel,
    chargesPatronalesPct: patronalesPct,
  };
}
