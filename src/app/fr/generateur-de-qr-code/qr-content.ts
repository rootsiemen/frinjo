// Payload builders for the French QR generator.
// URL / texte / WiFi / vCard / e-mail / téléphone / WhatsApp builders are
// language-neutral and shared with the Spanish generator; this module adds
// the French-specific SEPA payment QR (norme EPC069-12, « QR de virement »).

export * from "../../es/generador-de-codigos-qr/qr-content";

/**
 * Payload d'un QR de virement SEPA (EPC069-12, version 002, ensemble de
 * caractères UTF-8 = « 1 »). Le montant est optionnel (champ vide = montant
 * libre côté banque). L'objet / la référence est limité à 140 caractères.
 */
export function sepaPayload(nomBeneficiaire: string, iban: string, montantEur: number | null, objet: string, bic = ""): string {
  const ibanClean = iban.replace(/\s/g, "").toUpperCase();
  const montant =
    montantEur !== null && Number.isFinite(montantEur) && montantEur > 0
      ? `EUR${montantEur.toFixed(2)}`
      : "";
  const lines = [
    "BCD",
    "002",
    "1",
    "SCT",
    bic.toUpperCase(),
    nomBeneficiaire.slice(0, 70),
    ibanClean,
    montant,
    "",
    "",
    objet.slice(0, 140),
  ];
  return lines.join("\n");
}
