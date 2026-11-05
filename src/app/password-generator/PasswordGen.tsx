"use client";

import { useCallback, useEffect, useState } from "react";

const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const SETS = {
  lower: "abcdefghjkmnpqrstuvwxyz",
  lowerAmb: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHJKMNPQRSTUVWXYZ",
  upperAmb: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "23456789",
  digitsAmb: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/",
};

export interface PwOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  noAmbiguous: boolean;
}

export function buildCharset(o: PwOptions): string {
  let cs = "";
  if (o.lower) cs += o.noAmbiguous ? SETS.lower : SETS.lowerAmb;
  if (o.upper) cs += o.noAmbiguous ? SETS.upper : SETS.upperAmb;
  if (o.digits) cs += o.noAmbiguous ? SETS.digits : SETS.digitsAmb;
  if (o.symbols) cs += SETS.symbols;
  return cs;
}

export function cryptoRandomInt(maxExclusive: number): number {
  // CSPRNG with rejection sampling — no modulo bias
  const limit = Math.floor(256 / maxExclusive) * maxExclusive;
  const buf = new Uint8Array(1);
  for (;;) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) return buf[0] % maxExclusive;
  }
}

export function generatePassword(o: PwOptions): string {
  const cs = buildCharset(o);
  if (!cs) return "";
  // guarantee at least one char from each selected set
  const required: string[] = [];
  if (o.lower) required.push((o.noAmbiguous ? SETS.lower : SETS.lowerAmb)[cryptoRandomInt(o.noAmbiguous ? SETS.lower.length : SETS.lowerAmb.length)]);
  if (o.upper) required.push((o.noAmbiguous ? SETS.upper : SETS.upperAmb)[cryptoRandomInt(o.noAmbiguous ? SETS.upper.length : SETS.upperAmb.length)]);
  if (o.digits) required.push((o.noAmbiguous ? SETS.digits : SETS.digitsAmb)[cryptoRandomInt(o.noAmbiguous ? SETS.digits.length : SETS.digitsAmb.length)]);
  if (o.symbols) required.push(SETS.symbols[cryptoRandomInt(SETS.symbols.length)]);
  const chars: string[] = [];
  for (let i = 0; i < o.length; i++) chars.push(cs[cryptoRandomInt(cs.length)]);
  required.forEach((c, i) => { if (i < chars.length) chars[cryptoRandomInt(chars.length)] = c; });
  return chars.join("");
}

export function entropyBits(o: PwOptions): number {
  const cs = buildCharset(o);
  if (!cs || o.length === 0) return 0;
  return Math.round(o.length * Math.log2(cs.length));
}

function strengthLabel(bits: number): { label: string; color: string } {
  if (bits < 40) return { label: "Weak — fine for throwaway logins only", color: "#ef4444" };
  if (bits < 64) return { label: "Fair — okay for low-value accounts", color: "#f59e0b" };
  if (bits < 80) return { label: "Strong — good for important accounts", color: "#84cc16" };
  if (bits < 112) return { label: "Very strong — years of GPU cracking", color: "#22c55e" };
  return { label: "Excellent — effectively uncrackable by brute force", color: "#16a34a" };
}

export default function PasswordGen() {
  const [opts, setOpts] = useState<PwOptions>({
    length: 20, lower: true, upper: true, digits: true, symbols: true, noAmbiguous: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const regen = useCallback(() => {
    setPassword(generatePassword(opts));
    setCopied(false);
  }, [opts]);

  useEffect(() => { regen(); }, [regen]);

  const bits = entropyBits(opts);
  const s = strengthLabel(bits);
  const set = (p: Partial<PwOptions>) => setOpts((o) => ({ ...o, ...p }));

  const toggleCls = (on: boolean) =>
    `rounded-full px-4 py-2 text-sm font-bold transition cursor-pointer ${on ? "bg-stone-900 text-white" : "bg-white border border-stone-300 text-stone-500"}`;

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-10 shadow-sm">
          <div className="rounded-2xl bg-stone-950 px-6 py-6 flex items-center justify-between gap-4 flex-wrap">
            <code className="font-mono text-xl sm:text-2xl text-orange-300 break-all flex-1 min-w-[240px]">{password || "—"}</code>
            <div className="flex gap-2.5">
              <button type="button" onClick={() => { navigator.clipboard?.writeText(password).then(() => setCopied(true)).catch(() => {}); }}
                className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-5 py-2.5 text-sm transition">
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <button type="button" onClick={regen}
                className="rounded-full border-2 border-orange-400 text-orange-300 font-bold px-5 py-2.5 text-sm hover:bg-orange-400/10 transition">
                ↻ New
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold" style={{ color: s.color }}>{s.label}</span>
              <span className="text-stone-500 font-semibold">{bits} bits of entropy</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-stone-200 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (bits / 128) * 100)}%`, background: s.color }} />
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pw-len">Length: {opts.length} characters</label>
              <input id="pw-len" type="range" min="8" max="64" value={opts.length}
                onChange={(e) => set({ length: Number(e.target.value) })}
                className="w-full accent-orange-600" />
              <p className="mt-1 text-xs text-stone-400">Length beats complexity tricks: every extra character multiplies the search space.</p>
            </div>
            <div>
              <span className={labelCls}>Character sets</span>
              <div className="flex flex-wrap gap-2">
                <button type="button" className={toggleCls(opts.lower)} onClick={() => set({ lower: !opts.lower })}>a–z</button>
                <button type="button" className={toggleCls(opts.upper)} onClick={() => set({ upper: !opts.upper })}>A–Z</button>
                <button type="button" className={toggleCls(opts.digits)} onClick={() => set({ digits: !opts.digits })}>0–9</button>
                <button type="button" className={toggleCls(opts.symbols)} onClick={() => set({ symbols: !opts.symbols })}>Symbols</button>
                <button type="button" className={toggleCls(opts.noAmbiguous)} onClick={() => set({ noAmbiguous: !opts.noAmbiguous })}>No look-alikes (0/O, 1/l)</button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-stone-400 leading-relaxed">
            Generated with your browser&apos;s cryptographic random source (crypto.getRandomValues) using
            rejection sampling, so every character is uniformly random with no modulo bias. The password
            never leaves this tab and is never stored or sent anywhere — close the tab and it is gone.
            Use a unique password per account and keep them in a password manager; no generator can
            protect a password you reuse.
          </p>
        </div>
      </div>
    </section>
  );
}
