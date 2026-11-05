// Pure calculation logic — Calculadora de Finiquito (México, LFT) — no React.
// Finiquito = lo que la empresa debe al terminar la relación laboral por
// renuncia o mutuo acuerdo: salarios pendientes, aguinaldo proporcional,
// vacaciones no gozadas + proporcionales y su prima vacacional (25 %).
// NO incluye la indemnización de la liquidación por despido injustificado
// (3 meses + prima de antigüedad), que es un concepto distinto.

import { salarioDiario } from "../calculadora-de-aguinaldo/calc";

export { salarioDiario };

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export const PRIMA_VACACIONAL_PCT = 25;

/**
 * Días de vacaciones que corresponden por cada año de servicios (LFT art. 76,
 * reforma «Vacaciones Dignas» vigente desde 2023).
 * `anioServicio` = el año de servicios en curso (1 = primer año).
 */
export function diasVacacionesPorAnio(anioServicio: number): number {
  const a = Math.max(1, Math.floor(Number.isFinite(anioServicio) ? anioServicio : 1));
  if (a === 1) return 12;
  if (a === 2) return 14;
  if (a === 3) return 16;
  if (a === 4) return 18;
  if (a === 5) return 20;
  // Desde el 6.º año: +2 días por cada 5 años.
  const bloque = Math.floor((a - 1) / 5); // años 6–10 → 1, 11–15 → 2, …
  return 20 + bloque * 2;
}

export interface FiniquitoInput {
  salarioMensual: number;
  /** Días de salario ya trabajados y aún no pagados. */
  diasSalarioPendiente: number;
  /** Días trabajados en el año en curso (para aguinaldo y vacaciones proporcionales). */
  diasTrabajadosAnio: number;
  /** Años completos de servicio ya cumplidos (0 si aún no cumple el primero). */
  aniosCompletos: number;
  /** Días de vacaciones de años anteriores que nunca se tomaron. */
  diasVacacionesNoGozadas: number;
  /** Días de aguinaldo que otorga la empresa (mínimo legal: 15). */
  diasAguinaldo?: number;
}

export interface FiniquitoResult {
  salarioDiario: number;
  salarioPendiente: number;
  aguinaldoProporcional: number;
  /** Días de vacaciones proporcionales del año en curso. */
  diasVacacionesProporcionales: number;
  vacacionesProporcionales: number;
  vacacionesNoGozadas: number;
  /** Vacaciones totales pagadas (proporcionales + no gozadas). */
  vacacionesTotal: number;
  primaVacacional: number;
  total: number;
}

export function computeFiniquito(input: FiniquitoInput): FiniquitoResult {
  const diario = salarioDiario(input.salarioMensual);
  const diasPend = Math.max(0, Number.isFinite(input.diasSalarioPendiente) ? input.diasSalarioPendiente : 0);
  const diasAnio = Math.min(365, Math.max(0, Number.isFinite(input.diasTrabajadosAnio) ? input.diasTrabajadosAnio : 0));
  const anios = Math.max(0, Math.floor(Number.isFinite(input.aniosCompletos) ? input.aniosCompletos : 0));
  const noGozadas = Math.max(0, Number.isFinite(input.diasVacacionesNoGozadas) ? input.diasVacacionesNoGozadas : 0);
  const diasAguinaldo =
    Number.isFinite(input.diasAguinaldo ?? NaN) && (input.diasAguinaldo ?? 0) > 0
      ? (input.diasAguinaldo as number)
      : 15;

  const salarioPendiente = round2(diario * diasPend);
  const aguinaldoProporcional = round2(((diario * diasAguinaldo) / 365) * diasAnio);

  // Vacaciones del año en curso: tabla según el año de servicio que se está
  // cursando (años completos + 1), prorrateadas por los días trabajados.
  const diasVacAnio = diasVacacionesPorAnio(anios + 1);
  const diasProp = round2(((diasVacAnio / 365) * diasAnio) * 100) / 100;
  const vacacionesProporcionales = round2(diario * diasProp);
  const vacacionesNoGozadas = round2(diario * noGozadas);
  const vacacionesTotal = round2(vacacionesProporcionales + vacacionesNoGozadas);
  const primaVacacional = round2((vacacionesTotal * PRIMA_VACACIONAL_PCT) / 100);

  return {
    salarioDiario: diario,
    salarioPendiente,
    aguinaldoProporcional,
    diasVacacionesProporcionales: diasProp,
    vacacionesProporcionales,
    vacacionesNoGozadas,
    vacacionesTotal,
    primaVacacional,
    total: round2(salarioPendiente + aguinaldoProporcional + vacacionesTotal + primaVacacional),
  };
}
