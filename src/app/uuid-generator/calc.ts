/* Pure logic for the UUID Generator (v4 + v7, RFC 4122 / RFC 9562). */

function bytesToUuid(b: Uint8Array): string {
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function randomBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(b);
  } else {
    for (let i = 0; i < n; i++) b[i] = Math.floor(Math.random() * 256);
  }
  return b;
}

/** Random UUID v4. */
export function uuidV4(): string {
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant 10xx
  return bytesToUuid(b);
}

/** Time-ordered UUID v7: 48-bit Unix millisecond timestamp + random tail. */
export function uuidV7(nowMs: number = Date.now()): string {
  const b = randomBytes(16);
  const t = Math.floor(nowMs);
  b[0] = Math.floor(t / 2 ** 40) & 0xff;
  b[1] = Math.floor(t / 2 ** 32) & 0xff;
  b[2] = Math.floor(t / 2 ** 24) & 0xff;
  b[3] = Math.floor(t / 2 ** 16) & 0xff;
  b[4] = Math.floor(t / 2 ** 8) & 0xff;
  b[5] = t & 0xff;
  b[6] = (b[6] & 0x0f) | 0x70; // version 7
  b[8] = (b[8] & 0x3f) | 0x80; // variant 10xx
  return bytesToUuid(b);
}

export interface UuidOptions {
  uppercase?: boolean;
  hyphens?: boolean; // default true
}

export function formatUuid(u: string, opts: UuidOptions = {}): string {
  let out = u;
  if (opts.hyphens === false) out = out.replace(/-/g, "");
  if (opts.uppercase) out = out.toUpperCase();
  return out;
}

export function generateBulk(
  count: number,
  version: "v4" | "v7",
  opts: UuidOptions = {},
): string[] {
  const n = Math.min(Math.max(Math.floor(count) || 1, 1), 500);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    out.push(formatUuid(version === "v7" ? uuidV7() : uuidV4(), opts));
  }
  return out;
}

const UUID_RE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export interface UuidCheck {
  valid: boolean;
  version: number | null;
  variant: string | null;
  isNil: boolean;
}

/** Validate a UUID string and report its version/variant. */
export function checkUuid(input: string): UuidCheck {
  const s = input.trim();
  if (!UUID_RE.test(s)) return { valid: false, version: null, variant: null, isNil: false };
  const isNil = /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(s);
  const version = parseInt(s.charAt(14), 16);
  const v = parseInt(s.charAt(19), 16);
  const variant =
    v >= 8 && v <= 11 ? "RFC 4122" : v >= 12 && v <= 13 ? "Microsoft" : v === 14 || v === 15 ? "Reserved" : "NCS";
  return { valid: true, version: isNil ? null : version, variant, isNil };
}
