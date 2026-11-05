// Pure date logic — Días entre fechas con días hábiles y festivos — no React.
// Calendarios oficiales: México (LFT art. 74, días de descanso obligatorio,
// incluidos los «lunes» por traslado) y España (festivos nacionales).

export interface DiaFestivo {
  fecha: string; // yyyy-mm-dd
  nombre: string;
}

const pad = (n: number): string => String(n).padStart(2, "0");
export const toISODate = (d: Date): string =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

export function parseISODate(iso: string): Date | null {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

const addDays = (d: Date, n: number): Date => new Date(d.getTime() + n * 86400000);

/** Domingo de Pascua (computus gregoriano, algoritmo de Meeus). */
export function pascua(year: number): Date {
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
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** n-ésimo lunes del mes (n = 1 primer lunes, 3 = tercer lunes…). */
function lunesDelMes(year: number, monthIdx: number, n: number): Date {
  const first = new Date(Date.UTC(year, monthIdx, 1));
  const dow = first.getUTCDay(); // 0 dom … 1 lun
  const offset = (8 - dow) % 7; // días hasta el primer lunes (0 si el 1.º es lunes)
  return addDays(first, offset + (n - 1) * 7);
}

/** Días de descanso obligatorio en México (LFT art. 74). */
export function festivosMexico(year: number): DiaFestivo[] {
  const list: DiaFestivo[] = [
    { fecha: `${year}-01-01`, nombre: "Año Nuevo" },
    { fecha: toISODate(lunesDelMes(year, 1, 1)), nombre: "Día de la Constitución (primer lunes de febrero)" },
    { fecha: toISODate(lunesDelMes(year, 2, 3)), nombre: "Natalicio de Benito Juárez (tercer lunes de marzo)" },
    { fecha: `${year}-05-01`, nombre: "Día del Trabajo" },
    { fecha: `${year}-09-16`, nombre: "Día de la Independencia" },
    { fecha: toISODate(lunesDelMes(year, 10, 3)), nombre: "Día de la Revolución (tercer lunes de noviembre)" },
    { fecha: `${year}-12-25`, nombre: "Navidad" },
  ];
  // 1.º de octubre cada seis años: transmisión del Poder Ejecutivo (2024, 2030, 2036…).
  if ((year - 2024) % 6 === 0 && year >= 2024) {
    list.push({ fecha: `${year}-10-01`, nombre: "Transmisión del Poder Ejecutivo Federal" });
  }
  return list.sort((x, y) => x.fecha.localeCompare(y.fecha));
}

/** Festivos nacionales de España (calendario estatal; cada comunidad añade los suyos). */
export function festivosEspana(year: number): DiaFestivo[] {
  const easter = pascua(year);
  const list: DiaFestivo[] = [
    { fecha: `${year}-01-01`, nombre: "Año Nuevo" },
    { fecha: `${year}-01-06`, nombre: "Epifanía del Señor (Reyes)" },
    { fecha: toISODate(addDays(easter, -2)), nombre: "Viernes Santo" },
    { fecha: `${year}-05-01`, nombre: "Fiesta del Trabajo" },
    { fecha: `${year}-08-15`, nombre: "Asunción de la Virgen" },
    { fecha: `${year}-10-12`, nombre: "Fiesta Nacional de España" },
    { fecha: `${year}-11-01`, nombre: "Todos los Santos" },
    { fecha: `${year}-12-06`, nombre: "Día de la Constitución" },
    { fecha: `${year}-12-08`, nombre: "Inmaculada Concepción" },
    { fecha: `${year}-12-25`, nombre: "Navidad" },
  ];
  return list.sort((x, y) => x.fecha.localeCompare(y.fecha));
}

export type PaisCalendario = "mx" | "es" | "ninguno";

export function festivosPorPais(pais: PaisCalendario, year: number): DiaFestivo[] {
  if (pais === "mx") return festivosMexico(year);
  if (pais === "es") return festivosEspana(year);
  return [];
}

export interface DiasResult {
  totalDias: number;
  semanas: number;
  diasRestantes: number;
  /** Días hábiles: lunes a viernes sin festivos oficiales. */
  diasHabiles: number;
  /** Días naturales de fin de semana (sábado + domingo). */
  diasFinDeSemana: number;
  festivosEnIntervalo: DiaFestivo[];
  festivosEnSemana: number;
}

/** Conteo sobre el intervalo semiabierto [inicio, fin): cada día se cuenta una vez. */
export function computeDias(inicioISO: string, finISO: string, pais: PaisCalendario): DiasResult | null {
  const inicio = parseISODate(inicioISO);
  const fin = parseISODate(finISO);
  if (!inicio || !fin) return null;
  const total = Math.round((fin.getTime() - inicio.getTime()) / 86400000);
  if (total < 0) return null;

  const festivos = new Map<string, string>();
  for (let y = inicio.getUTCFullYear(); y <= fin.getUTCFullYear(); y++) {
    for (const f of festivosPorPais(pais, y)) festivos.set(f.fecha, f.nombre);
  }

  let habiles = 0;
  let finde = 0;
  let festivosEnSemana = 0;
  const festivosEnIntervalo: DiaFestivo[] = [];

  for (let i = 0; i < total; i++) {
    const d = addDays(inicio, i);
    const dow = d.getUTCDay();
    const iso = toISODate(d);
    const nombre = festivos.get(iso);
    if (nombre) {
      festivosEnIntervalo.push({ fecha: iso, nombre });
      if (dow >= 1 && dow <= 5) festivosEnSemana++;
    }
    if (dow === 0 || dow === 6) finde++;
    if (dow >= 1 && dow <= 5 && !nombre) habiles++;
  }

  return {
    totalDias: total,
    semanas: Math.floor(total / 7),
    diasRestantes: total % 7,
    diasHabiles: habiles,
    diasFinDeSemana: finde,
    festivosEnIntervalo,
    festivosEnSemana,
  };
}
