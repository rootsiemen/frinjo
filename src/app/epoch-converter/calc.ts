/* Pure logic for the Epoch Converter. No DOM, no React — unit-tested. */

export type EpochUnit = "s" | "ms" | "us" | "ns";

export const UNIT_LABELS: Record<EpochUnit, string> = {
  s: "Seconds",
  ms: "Milliseconds",
  us: "Microseconds",
  ns: "Nanoseconds",
};

const FACTOR: Record<EpochUnit, number> = { s: 1e3, ms: 1, us: 1e-3, ns: 1e-6 };

/** Guess the unit of a raw epoch number from its magnitude (digit count). */
export function detectUnit(value: number): EpochUnit {
  const a = Math.abs(value);
  if (a < 1e11) return "s"; // seconds until ~5138 AD
  if (a < 1e14) return "ms"; // milliseconds until ~5138 AD
  if (a < 1e17) return "us";
  return "ns";
}

/** Convert an epoch value in `unit` to milliseconds since the Unix epoch. */
export function epochToMs(value: number, unit: EpochUnit): number {
  return value * FACTOR[unit];
}

/** Convert milliseconds since the Unix epoch into `unit`. */
export function msToEpoch(ms: number, unit: EpochUnit): number {
  return ms / FACTOR[unit];
}

/**
 * Human relative time for a target instant, e.g. "3 days ago" / "in 2 hours".
 * Mirrors the Intl.RelativeTimeFormat unit ladder.
 */
export function formatRelative(targetMs: number, nowMs: number): string {
  const diffSec = Math.round((targetMs - nowMs) / 1000);
  const abs = Math.abs(diffSec);
  const units: [number, string][] = [
    [31_536_000, "year"],
    [2_592_000, "month"],
    [604_800, "week"],
    [86_400, "day"],
    [3_600, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (const [size, name] of units) {
    if (abs >= size || size === 1) {
      const v = Math.round(diffSec / size);
      const label = Math.abs(v) === 1 ? name : `${name}s`;
      return v < 0 ? `${Math.abs(v)} ${label} ago` : v > 0 ? `in ${v} ${label}` : "just now";
    }
  }
  return "just now";
}

/** Break a Date into the display parts the tool shows. */
export function dateParts(d: Date) {
  return {
    iso: d.toISOString(),
    utc: d.toUTCString(),
    weekday: d.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    dayOfYear: Math.floor(
      (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) -
        Date.UTC(d.getUTCFullYear(), 0, 0)) /
        86_400_000,
    ),
  };
}
