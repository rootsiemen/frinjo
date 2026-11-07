/* Pure logic for the Base64 Encoder/Decoder. UTF-8 safe (TextEncoder/TextDecoder). */

function bytesToBinary(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return bin;
}

/** Encode text (any Unicode) to Base64. urlSafe swaps +/ for -_ and drops padding. */
export function encodeBase64(text: string, urlSafe = false): string {
  const bytes = new TextEncoder().encode(text);
  let out = btoa(bytesToBinary(bytes));
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

/** Decode Base64 back to text. Throws on malformed input. */
export function decodeBase64(input: string, urlSafe = false): string {
  let s = input.trim().replace(/\s+/g, "");
  if (urlSafe) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4 !== 0) s += "=";
  }
  if (!isValidBase64(s)) throw new Error("That is not valid Base64 — check for missing or stray characters.");
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/** Strict-ish Base64 check: alphabet, length and padding placement. */
export function isValidBase64(s: string): boolean {
  if (s.length === 0) return false;
  if (s.length % 4 !== 0) return false;
  return /^[A-Za-z0-9+/]*={0,2}$/.test(s) && !/=/.test(s.slice(0, -2).replace(/-/g, ""));
}

/** Encode raw bytes (e.g. from a file) to Base64. */
export function encodeBytes(bytes: Uint8Array, urlSafe = false): string {
  let out = btoa(bytesToBinary(bytes));
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

/** Decoded byte size of a Base64 string without decoding it. */
export function decodedSize(b64: string): number {
  const s = b64.replace(/\s+/g, "");
  const padding = s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((s.length * 3) / 4) - padding);
}
