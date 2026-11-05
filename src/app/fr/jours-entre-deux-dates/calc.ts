// Pure date logic — Jours entre deux dates (France) — no React, unit-testable.
// Includes the full French public-holiday calendar (jours fériés), incl.
// movable feasts computed from Easter (computus grégorien).

export interface JourFerie {
  /** Date ISO yyyy-mm-dd. */
  date: string;
  nom: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");
export const toISODate = (d: Date): string =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export function parseISODate(iso: string): Date | null {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const addDays = (d: Date, n: number): Date => new Date(d.getTime() + n * 86400000);

/** Dimanche de Pâques (algorithme de Meeus / computus grégorien). */
export function paques(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = mars, 4 = avril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Jours fériés légaux en France métropolitaine pour une année.
 * Alsace-Moselle (option) ajoute le Vendredi saint et le 26 décembre.
 */
export function joursFeriesFrance(year: number, alsaceMoselle = false): JourFerie[] {
  const fixed: [string, string][] = [
    [`${year}-01-01`, "Jour de l'An"],
    [`${year}-05-01`, "Fête du Travail"],
    [`${year}-05-08`, "Victoire 1945"],
    [`${year}-07-14`, "Fête nationale"],
    [`${year}-08-15`, "Assomption"],
    [`${year}-11-01`, "Toussaint"],
    [`${year}-11-11`, "Armistice 1918"],
    [`${year}-12-25`, "Noël"],
  ];
  const easter = paques(year);
  const movable: [Date, string][] = [
    [addDays(easter, 1), "Lundi de Pâques"],
    [addDays(easter, 39), "Ascension"],
    [addDays(easter, 50), "Lundi de Pentecôte"],
  ];
  const list: JourFerie[] = [
    ...fixed.map(([date, nom]) => ({ date, nom })),
    ...movable.map(([d, nom]) => ({ date: toISODate(d), nom })),
  ];
  if (alsaceMoselle) {
    list.push({ date: toISODate(addDays(easter, -2)), nom: "Vendredi saint (Alsace-Moselle)" });
    list.push({ date: `${year}-12-26`, nom: "Saint-Étienne (Alsace-Moselle)" });
  }
  return list.sort((x, y) => x.date.localeCompare(y.date));
}

export interface JoursResult {
  /** Nombre total de jours calendaires entre les deux dates (fin − début). */
  totalJours: number;
  /** Semaines complètes + jours restants. */
  semaines: number;
  joursRestants: number;
  /** Jours ouvrés : lundi–vendredi hors jours fériés. */
  joursOuvres: number;
  /** Jours ouvrables : lundi–samedi hors jours fériés. */
  joursOuvrables: number;
  /** Jours de week-end (samedi + dimanche) dans l'intervalle. */
  joursWeekend: number;
  /** Jours fériés tombant dans l'intervalle (avec leur nom). */
  feriesDansIntervalle: JourFerie[];
  /** Nombre de jours fériés tombant un jour de semaine (lun–ven). */
  feriesEnSemaine: number;
}

/**
 * Counts over the half-open interval [debut, fin) — each calendar day of the
 * span is counted exactly once, so totalJours = fin − debut.
 */
export function computeJours(debutISO: string, finISO: string, alsaceMoselle = false): JoursResult | null {
  const debut = parseISODate(debutISO);
  const fin = parseISODate(finISO);
  if (!debut || !fin) return null;
  const total = Math.round((fin.getTime() - debut.getTime()) / 86400000);
  if (total < 0) return null;

  const feriesByDate = new Map<string, string>();
  for (let y = debut.getUTCFullYear(); y <= fin.getUTCFullYear(); y++) {
    for (const f of joursFeriesFrance(y, alsaceMoselle)) feriesByDate.set(f.date, f.nom);
  }

  let ouvres = 0;
  let ouvrables = 0;
  let weekend = 0;
  let feriesEnSemaine = 0;
  const feriesDansIntervalle: JourFerie[] = [];

  for (let i = 0; i < total; i++) {
    const d = addDays(debut, i);
    const dow = d.getUTCDay(); // 0 = dimanche … 6 = samedi
    const iso = toISODate(d);
    const nomFerie = feriesByDate.get(iso);
    if (nomFerie) {
      feriesDansIntervalle.push({ date: iso, nom: nomFerie });
      if (dow >= 1 && dow <= 5) feriesEnSemaine++;
    }
    if (dow === 0 || dow === 6) weekend++;
    if (dow >= 1 && dow <= 5 && !nomFerie) ouvres++;
    if (dow >= 1 && dow <= 6 && !nomFerie) ouvrables++;
  }

  return {
    totalJours: total,
    semaines: Math.floor(total / 7),
    joursRestants: total % 7,
    joursOuvres: ouvres,
    joursOuvrables: ouvrables,
    joursWeekend: weekend,
    feriesDansIntervalle,
    feriesEnSemaine,
  };
}
