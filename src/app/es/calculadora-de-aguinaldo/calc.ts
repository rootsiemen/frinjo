// Pure calculation logic — Calculadora de Aguinaldo (México, LFT) — no React.
// Ley Federal del Trabajo, art. 87: aguinaldo anual mínimo de 15 días de
// salario, pagadero antes del 20 de diciembre; parte proporcional para quien
// no cumplió el año de servicios.

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export const DIAS_AGUINALDO_MINIMO = 15;
export const DIAS_ANIO = 365;

/** Salario diario a partir del salario mensual (convención LFT: mensual / 30). */
export function salarioDiario(salarioMensual: number): number {
  const m = Number.isFinite(salarioMensual) ? Math.max(0, salarioMensual) : 0;
  return round2(m / 30);
}

export interface AguinaldoInput {
  salarioMensual: number;
  /** Días trabajados en el año (1–365). 365 = año completo. */
  diasTrabajados: number;
  /** Días de aguinaldo que otorga la empresa (mínimo legal: 15). */
  diasAguinaldo?: number;
}

export interface AguinaldoResult {
  salarioDiario: number;
  diasAguinaldo: number;
  diasTrabajados: number;
  /** Aguinaldo de un año completo con esos días otorgados. */
  aguinaldoAnioCompleto: number;
  /** Aguinaldo bruto que corresponde (proporcional si aplica). */
  aguinaldoBruto: number;
  /** Fracción del año trabajada (0–1). */
  fraccionAnio: number;
  esProporcional: boolean;
}

export function computeAguinaldo(input: AguinaldoInput): AguinaldoResult {
  const diario = salarioDiario(input.salarioMensual);
  const diasOtorgados =
    Number.isFinite(input.diasAguinaldo ?? NaN) && (input.diasAguinaldo ?? 0) > 0
      ? (input.diasAguinaldo as number)
      : DIAS_AGUINALDO_MINIMO;
  const diasTrab = Math.min(
    DIAS_ANIO,
    Math.max(0, Math.floor(Number.isFinite(input.diasTrabajados) ? input.diasTrabajados : 0)),
  );
  const completo = round2(diario * diasOtorgados);
  const bruto = round2((completo * diasTrab) / DIAS_ANIO);
  return {
    salarioDiario: diario,
    diasAguinaldo: diasOtorgados,
    diasTrabajados: diasTrab,
    aguinaldoAnioCompleto: completo,
    aguinaldoBruto: bruto,
    fraccionAnio: round2((diasTrab / DIAS_ANIO) * 10000) / 10000,
    esProporcional: diasTrab < DIAS_ANIO,
  };
}

/** Días trabajados en el año a partir de la fecha de ingreso (incluye ambos extremos, tope 365). */
export function diasTrabajadosEnAnio(fechaIngresoISO: string, anio: number): number {
  const ingreso = new Date(`${fechaIngresoISO}T00:00:00Z`);
  if (Number.isNaN(ingreso.getTime())) return 0;
  const inicioAnio = Date.UTC(anio, 0, 1);
  const finAnio = Date.UTC(anio, 11, 31);
  const desde = Math.max(ingreso.getTime(), inicioAnio);
  if (desde > finAnio) return 0;
  return Math.min(DIAS_ANIO, Math.floor((finAnio - desde) / 86400000) + 1);
}
