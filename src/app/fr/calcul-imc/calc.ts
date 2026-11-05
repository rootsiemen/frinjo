/**
 * Calcul de l'IMC (indice de masse corporelle) selon la formule de l'OMS :
 * IMC = poids (kg) ÷ taille² (m). Seuils adultes (20 ans et plus) :
 * insuffisance pondérale < 18,5 · poids normal 18,5–24,9 ·
 * surpoids 25,0–29,9 · obésité ≥ 30,0.
 */

export type ImcCategory =
  | "Insuffisance pondérale"
  | "Poids normal"
  | "Surpoids"
  | "Obésité";

export interface ImcResult {
  imc: number;
  category: ImcCategory;
  /** Borne basse de la fourchette de poids santé pour cette taille (kg). */
  healthyMinKg: number;
  /** Borne haute de la fourchette de poids santé pour cette taille (kg). */
  healthyMaxKg: number;
}

export function computeImc(weightKg: number, heightM: number): ImcResult {
  const imc = weightKg / (heightM * heightM);
  const healthyMinKg = 18.5 * heightM * heightM;
  const healthyMaxKg = 24.99 * heightM * heightM;

  let category: ImcCategory;
  if (imc < 18.5) {
    category = "Insuffisance pondérale";
  } else if (imc < 25) {
    category = "Poids normal";
  } else if (imc < 30) {
    category = "Surpoids";
  } else {
    category = "Obésité";
  }

  return { imc, category, healthyMinKg, healthyMaxKg };
}
