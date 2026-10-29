"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface IpResult {
  ip: string;
  type: string | null;
  continent: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  postal: string | null;
  lat: number | null;
  lon: number | null;
  isp: string | null;
  org: string | null;
  asn: string | null;
  domain: string | null;
  tzId: string | null;
  tzAbbr: string | null;
  tzUtc: string | null;
  currency: string | null;
  languages: string | null;
  callingCode: string | null;
  capital: string | null;
  connectionType: string | null;
  source: string;
  raw: unknown;
}

type FactorState = "pass" | "warn" | "bad" | "na" | "pending";

interface Factor {
  state: FactorState;
  detail: string;
  ded: number;
}

type FactorKey = "webrtc" | "dns" | "tz" | "lang" | "dnt" | "js";

const FACTOR_NAMES: Record<FactorKey, string> = {
  webrtc: "WebRTC leak",
  dns: "DNS resolver",
  tz: "Timezone match",
  lang: "Language match",
  dnt: "Do Not Track",
  js: "JavaScript",
};

const FACTOR_ICONS: Record<FactorState, string> = {
  pass: "✓",
  warn: "!",
  bad: "✕",
  na: "–",
  pending: "…",
};

const FACTOR_WORDS: Record<FactorState, string> = {
  pass: "Pass",
  warn: "Warning",
  bad: "Fail",
  na: "N/A",
  pending: "Checking",
};

const pendingFactors = (): Record<FactorKey, Factor> => ({
  webrtc: { state: "pending", detail: "Checking…", ded: 0 },
  dns: { state: "pending", detail: "Checking…", ded: 0 },
  tz: { state: "pending", detail: "Checking…", ded: 0 },
  lang: { state: "pending", detail: "Checking…", ded: 0 },
  dnt: { state: "pending", detail: "Checking…", ded: 0 },
  js: { state: "pending", detail: "Checking…", ded: 0 },
});

/* ------------------------------------------------------------------ */
/* IP validation (ported from the reference implementation)            */
/* ------------------------------------------------------------------ */

function isIPv4(ip: string): boolean {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (!m) return false;
  for (let i = 1; i <= 4; i++) {
    if (Number(m[i]) > 255) return false;
  }
  return true;
}

function isIPv6(ip: string): boolean {
  if (ip.indexOf(":") === -1) return false;
  if (!/^[0-9a-fA-F:.\[\]]+$/.test(ip)) return false;
  try {
    new URL("http://[" + ip.replace(/^\[|\]$/g, "") + "]/");
    return true;
  } catch {
    return false;
  }
}

function isValidIp(ip: string): boolean {
  return isIPv4(ip) || isIPv6(ip);
}

function isPrivateIp(ip: string): boolean {
  if (isIPv4(ip)) {
    const p = ip.split(".").map(Number);
    if (p[0] === 10 || p[0] === 127) return true;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 169 && p[1] === 254) return true;
    if (p[0] === 0) return true;
  }
  const low = ip.toLowerCase();
  if (low === "::1" || low.indexOf("fe80:") === 0 || low.indexOf("fc") === 0 || low.indexOf("fd") === 0) return true;
  return false;
}

function joinParts(parts: (string | null | undefined)[], sep = ", "): string {
  const out: string[] = [];
  for (const v of parts) {
    if (v != null && String(v).trim() !== "" && !out.includes(String(v).trim())) out.push(String(v).trim());
  }
  return out.join(sep);
}

/* ------------------------------------------------------------------ */
/* Geolocation providers — normalised to one shape                     */
/* ------------------------------------------------------------------ */

async function fetchJson(url: string): Promise<Record<string, unknown>> {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  return (await r.json()) as Record<string, unknown>;
}

type Raw = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function fromIpwho(d: Raw): IpResult {
  if (!d || d.success === false || !d.ip) throw new Error((d && d.message) || "Lookup failed");
  const c = d.connection || {};
  const tz = d.timezone || {};
  const cur = d.currency || {};
  return {
    ip: d.ip,
    type: d.type || (String(d.ip).indexOf(":") > -1 ? "IPv6" : "IPv4"),
    continent: d.continent ?? null,
    country: d.country ?? null,
    countryCode: d.country_code ?? null,
    region: d.region ?? null,
    city: d.city ?? null,
    postal: d.postal ?? null,
    lat: typeof d.latitude === "number" ? d.latitude : null,
    lon: typeof d.longitude === "number" ? d.longitude : null,
    isp: c.isp || c.org || null,
    org: c.org ?? null,
    asn: c.asn ? "AS" + c.asn : null,
    domain: c.domain ?? null,
    tzId: tz.id ?? null,
    tzAbbr: tz.abbr ?? null,
    tzUtc: tz.utc ?? null,
    currency: cur.name ? cur.name + (cur.code ? " (" + cur.code + ")" : "") : null,
    languages: null,
    callingCode: d.calling_code ?? null,
    capital: d.capital ?? null,
    connectionType: null,
    source: "ipwho.is",
    raw: d,
  };
}

function fromIpapi(d: Raw): IpResult {
  if (!d || d.error || !d.ip) throw new Error((d && d.reason) || "Lookup failed");
  return {
    ip: d.ip,
    type: d.version || (String(d.ip).indexOf(":") > -1 ? "IPv6" : "IPv4"),
    continent: d.continent_code ?? null,
    country: d.country_name ?? null,
    countryCode: d.country_code ?? null,
    region: d.region ?? null,
    city: d.city ?? null,
    postal: d.postal ?? null,
    lat: typeof d.latitude === "number" ? d.latitude : null,
    lon: typeof d.longitude === "number" ? d.longitude : null,
    isp: d.org ?? null,
    org: d.org ?? null,
    asn: d.asn ?? null,
    domain: null,
    tzId: d.timezone ?? null,
    tzAbbr: d.utc_offset ? "UTC" + d.utc_offset : null,
    tzUtc: d.utc_offset ?? null,
    currency: d.currency_name ? d.currency_name + (d.currency ? " (" + d.currency + ")" : "") : null,
    languages: d.languages ?? null,
    callingCode: d.country_calling_code ?? null,
    capital: null,
    connectionType: null,
    source: "ipapi.co",
    raw: d,
  };
}

function fromFreeIpApi(d: Raw): IpResult {
  if (!d || !d.ipAddress) throw new Error("Lookup failed");
  const tz = d.timeZones && d.timeZones.length ? d.timeZones[0] : null;
  return {
    ip: d.ipAddress,
    type: d.ipVersion ? "IPv" + d.ipVersion : String(d.ipAddress).indexOf(":") > -1 ? "IPv6" : "IPv4",
    continent: d.continent ?? null,
    country: d.countryName ?? null,
    countryCode: d.countryCode ?? null,
    region: d.regionName ?? null,
    city: d.cityName ?? null,
    postal: d.zipCode ?? null,
    lat: typeof d.latitude === "number" ? d.latitude : null,
    lon: typeof d.longitude === "number" ? d.longitude : null,
    isp: d.asnOrganization ?? null,
    org: d.asnOrganization ?? null,
    asn: d.asn ? "AS" + d.asn : null,
    domain: null,
    tzId: tz,
    tzAbbr: null,
    tzUtc: null,
    currency: null,
    languages: null,
    callingCode: d.phoneCodes && d.phoneCodes.length ? "+" + d.phoneCodes[0] : null,
    capital: d.capital ?? null,
    connectionType: null,
    source: "freeipapi.com",
    raw: d,
  };
}

async function lookupIp(ip: string): Promise<IpResult> {
  const target = ip || "";
  try {
    return fromIpwho(await fetchJson("https://ipwho.is/" + encodeURIComponent(target)));
  } catch {
    try {
      return fromIpapi(await fetchJson("https://ipapi.co/" + encodeURIComponent(target) + "/json/"));
    } catch {
      return fromFreeIpApi(await fetchJson("https://freeipapi.com/api/json/" + encodeURIComponent(target)));
    }
  }
}

/* ------------------------------------------------------------------ */
/* WebRTC leak probe                                                   */
/* ------------------------------------------------------------------ */

interface WebrtcResult {
  supported: boolean;
  pub: string[];
  local: string[];
}

function collectWebrtcIps(timeoutMs: number): Promise<WebrtcResult> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.RTCPeerConnection) {
      resolve({ supported: false, pub: [], local: [] });
      return;
    }
    let pc: RTCPeerConnection;
    try {
      pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
      });
    } catch {
      resolve({ supported: false, pub: [], local: [] });
      return;
    }
    const pub: Record<string, true> = {};
    const local: Record<string, true> = {};
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      try {
        pc.close();
      } catch {
        /* noop */
      }
      resolve({ supported: true, pub: Object.keys(pub), local: Object.keys(local) });
    }
    pc.onicecandidate = (ev) => {
      if (!ev.candidate) {
        finish();
        return;
      }
      const cand = ev.candidate.candidate || "";
      const typeM = /typ\s+(\w+)/.exec(cand);
      const typ = typeM ? typeM[1] : "";
      const ipM =
        /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(cand) ||
        /([0-9a-fA-F]{1,4}(?::[0-9a-fA-F]{0,4}){2,}(?::[0-9a-fA-F]{1,4})?)/.exec(cand) ||
        /([0-9a-f-]+\.local)/.exec(cand);
      if (!ipM) return;
      const ip = ipM[1];
      if (ip.indexOf(".local") === -1 && !isValidIp(ip)) return;
      if ((typ === "srflx" || typ === "relay") && !isPrivateIp(ip)) pub[ip] = true;
      else local[ip] = true;
    };
    try {
      pc.createDataChannel("leak-test");
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {});
    } catch {
      /* noop */
    }
    setTimeout(finish, timeoutMs);
  });
}

/* ------------------------------------------------------------------ */
/* Browser & device panel                                              */
/* ------------------------------------------------------------------ */

interface DeviceCell {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
  small?: boolean;
}

function collectBrowserInfo(): DeviceCell[] {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    javaEnabled?: () => boolean;
  };
  const ua = nav.userAgent || "";
  let m: RegExpExecArray | null;
  let browser = "Unknown";
  if ((m = /Edg\/([\d.]+)/.exec(ua))) browser = "Microsoft Edge " + m[1];
  else if ((m = /OPR\/([\d.]+)/.exec(ua))) browser = "Opera " + m[1];
  else if ((m = /Firefox\/([\d.]+)/.exec(ua))) browser = "Firefox " + m[1];
  else if ((m = /Chrome\/([\d.]+)/.exec(ua))) browser = "Chrome " + m[1];
  else if ((m = /Version\/([\d.]+).*Safari/.exec(ua))) browser = "Safari " + m[1];

  let os = "Unknown";
  if (/Windows NT 10/.test(ua)) os = "Windows 10 / 11";
  else if ((m = /Windows NT ([\d.]+)/.exec(ua))) os = "Windows (NT " + m[1] + ")";
  else if ((m = /Android ([\d.]+)/.exec(ua))) os = "Android " + m[1];
  else if (/Android/.test(ua)) os = "Android";
  else if ((m = /iPhone OS ([\d_]+)/.exec(ua))) os = "iOS " + m[1].replace(/_/g, ".");
  else if ((m = /CPU OS ([\d_]+)/.exec(ua))) os = "iPadOS " + m[1].replace(/_/g, ".");
  else if ((m = /Mac OS X ([\d_]+)/.exec(ua))) os = "macOS " + m[1].replace(/_/g, ".");
  else if (/Linux/.test(ua)) os = "Linux";

  let tz: string | null = null;
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    /* noop */
  }

  const touch = (nav.maxTouchPoints || 0) > 0 || "ontouchstart" in window;
  let javaOn = false;
  try {
    javaOn = !!nav.javaEnabled?.();
  } catch {
    /* noop */
  }
  const nc = nav.connection;
  let gl = "Not available";
  try {
    const cv = document.createElement("canvas");
    const ctx = (cv.getContext("webgl") || cv.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (ctx) {
      const ext = ctx.getExtension("WEBGL_debug_renderer_info");
      gl = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
    }
  } catch {
    /* noop */
  }

  const dash = (v: string | null | undefined) => (v == null || v === "" ? "—" : v);
  return [
    { label: "Operating system", value: dash(os) },
    { label: "Browser", value: dash(browser) },
    { label: "Platform", value: dash(nav.platform) },
    { label: "User agent", value: dash(ua), mono: true, wide: true, small: true },
    { label: "Languages", value: dash(nav.languages && nav.languages.length ? nav.languages.join(", ") : nav.language) },
    { label: "Browser timezone", value: dash(tz) },
    { label: "Screen", value: `${screen.width} × ${screen.height} (window ${window.innerWidth} × ${window.innerHeight})`, mono: true },
    { label: "Colour & pixels", value: `${screen.colorDepth}-bit colour · ${window.devicePixelRatio || 1}× pixel ratio` },
    { label: "Touch support", value: touch ? "Yes" + (nav.maxTouchPoints ? ` — ${nav.maxTouchPoints} touch points` : "") : "No" },
    { label: "Cookies", value: nav.cookieEnabled ? "Enabled" : "Disabled" },
    { label: "Java", value: javaOn ? "Enabled" : "Not available" },
    { label: "CPU cores", value: nav.hardwareConcurrency ? `${nav.hardwareConcurrency} cores` : "—" },
    { label: "Device memory", value: nav.deviceMemory ? `≈ ${nav.deviceMemory} GB` : "Not reported" },
    {
      label: "Network",
      value:
        dash(
          nc
            ? joinParts(
                [
                  nc.effectiveType ? nc.effectiveType.toUpperCase() : null,
                  nc.downlink ? `≈ ${nc.downlink} Mbps down` : null,
                  nc.rtt != null ? `${nc.rtt} ms round trip` : null,
                ],
                " · ",
              ) || null
            : "Not reported",
        ) || "Not reported",
    },
    { label: "WebGL renderer", value: gl, wide: true, small: true },
  ];
}

/* ------------------------------------------------------------------ */
/* Leaflet (loaded from CDN only when a map is needed)                 */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureLeaflet(): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (w.L) return w.L;
  if (!document.querySelector("link[data-leaflet]")) {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    l.setAttribute("data-leaflet", "1");
    document.head.appendChild(l);
  }
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("leaflet failed to load"));
    document.head.appendChild(s);
  });
  return w.L;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

const CHIPS: { ip: string; label: string }[] = [
  { ip: "8.8.8.8", label: "8.8.8.8 · Google DNS" },
  { ip: "1.1.1.1", label: "1.1.1.1 · Cloudflare" },
  { ip: "9.9.9.9", label: "9.9.9.9 · Quad9" },
  { ip: "2606:4700:4700::1111", label: "2606:4700:4700::1111 · IPv6" },
];

const cell =
  "rounded-2xl border border-stone-200 bg-stone-50/60 p-5 min-w-0";
const cellK = "text-[11px] font-bold uppercase tracking-[0.15em] text-orange-700 mb-1.5";
const cellV = "font-semibold text-stone-900 break-words";

export default function IpTracker() {
  const [ownIp, setOwnIp] = useState<string | null>(null);
  const [ownState, setOwnState] = useState<"detecting" | "ok" | "fail">("detecting");
  const [ownSub, setOwnSub] = useState("");
  const [copied, setCopied] = useState(false);

  const [input, setInput] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<{ mode: "" | "loading" | "error"; msg: string }>({
    mode: "loading",
    msg: "Detecting your connection…",
  });
  const [result, setResult] = useState<IpResult | null>(null);
  const [localTime, setLocalTime] = useState("—");

  const [factors, setFactors] = useState<Record<FactorKey, Factor>>(pendingFactors);
  const [dns, setDns] = useState<{ ip: string; org: string; country: string; verdict: string; pill: FactorState }>({
    ip: "…",
    org: "…",
    country: "…",
    verdict: "Asking your resolver where it sits…",
    pill: "pending",
  });
  const [rtc, setRtc] = useState<{ pub: string; local: string; verdict: string; pill: FactorState }>({
    pub: "…",
    local: "…",
    verdict: "Probing WebRTC for leaked addresses…",
    pill: "pending",
  });
  const [device, setDevice] = useState<DeviceCell[]>([]);
  const [deviceTime, setDeviceTime] = useState("—");

  const resultsRef = useRef<HTMLElement>(null);
  const mapElRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<{ map: any; marker: any } | null>(null);

  const setFactor = useCallback((key: FactorKey, state: FactorState, detail: string, ded: number) => {
    setFactors((prev) => ({ ...prev, [key]: { state, detail, ded } }));
  }, []);

  /* ---------------- anonymity checks ---------------- */

  const runChecks = useCallback(
    (r: IpResult | null) => {
      if (!r) {
        const msg = "Your connection couldn't be detected, so this check can't run.";
        (Object.keys(FACTOR_NAMES) as FactorKey[]).forEach((k) => setFactor(k, "na", msg, 0));
        setDns((d) => ({ ...d, pill: "na", verdict: "Unavailable — your connection couldn't be detected." }));
        setRtc((d) => ({ ...d, pill: "na", verdict: "Unavailable — your connection couldn't be detected." }));
        return;
      }

      /* timezone vs IP timezone */
      let btz: string | null = null;
      try {
        btz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        /* noop */
      }
      if (btz && r.tzId) {
        if (btz === r.tzId) setFactor("tz", "pass", `Browser timezone matches your IP: ${btz}.`, 0);
        else
          setFactor(
            "tz",
            "warn",
            `Browser says ${btz} but your IP sits in ${r.tzId} — a mismatch websites can spot.`,
            15,
          );
      } else setFactor("tz", "na", "Timezone couldn't be compared for this connection.", 0);

      /* browser language vs IP country */
      const bl = navigator.language || "";
      const region = (bl.split("-")[1] || "").toUpperCase();
      if (region && r.countryCode) {
        if (region === String(r.countryCode).toUpperCase())
          setFactor("lang", "pass", `Browser language ${bl} fits your IP country (${r.country}).`, 0);
        else
          setFactor(
            "lang",
            "warn",
            `Browser language is ${bl} but your IP is in ${r.country || "a different country"} — the two don't line up.`,
            10,
          );
      } else setFactor("lang", "na", `Browser language (${bl || "unknown"}) carries no country signal to compare.`, 0);

      /* do not track */
      const navDnt = navigator as Navigator & { doNotTrack?: string };
      if (navDnt.doNotTrack === "1" || (window as Window & { doNotTrack?: string }).doNotTrack === "1")
        setFactor("dnt", "pass", "Do Not Track is on — sites are at least asked to leave you alone.", 0);
      else setFactor("dnt", "warn", "Do Not Track is off in this browser.", 5);

      /* javascript */
      setFactor(
        "js",
        "warn",
        "JavaScript is on. Most sites need it, but it also lets them measure this browser in fine detail.",
        5,
      );

      /* DNS resolver check */
      setDns((d) => ({ ...d, pill: "pending" }));
      fetchJson("https://edns.ip-api.com/json")
        .then((data) => {
          const dnsObj = (data.dns || {}) as { ip?: string; geo?: string };
          const geo = dnsObj.geo || "";
          const parts = geo.split(" - ");
          const dCountry = (parts[0] || "").trim();
          const dOrg = parts.slice(1).join(" - ").trim();
          setDns((d) => ({ ...d, ip: dnsObj.ip || "—", org: dOrg || "—", country: dCountry || "—" }));
          if (dCountry && r.country && dCountry.toLowerCase() === String(r.country).toLowerCase()) {
            setFactor("dns", "pass", `Your DNS resolver is in ${dCountry}, the same country as your IP — nothing leaks.`, 0);
            setDns((d) => ({
              ...d,
              pill: "pass",
              verdict: "Your DNS requests are resolved in the same country your IP points to.",
            }));
          } else if (dCountry) {
            setFactor(
              "dns",
              "bad",
              `DNS leak: your resolver is in ${dCountry} while your IP says ${r.country}. If you use a VPN, your DNS is bypassing it.`,
              25,
            );
            setDns((d) => ({
              ...d,
              pill: "bad",
              verdict: `Mismatch — DNS country (${dCountry}) doesn't match IP country (${r.country}).`,
            }));
          } else {
            setFactor("dns", "na", "The DNS check answered without a location.", 0);
            setDns((d) => ({ ...d, pill: "na", verdict: "The resolver answered, but its location couldn't be read." }));
          }
        })
        .catch(() => {
          setFactor("dns", "na", "The DNS check didn't answer — it may be blocked on this network.", 0);
          setDns({ ip: "—", org: "—", country: "—", pill: "na", verdict: "Couldn't reach the DNS check service from this browser." });
        });

      /* WebRTC leak check */
      setRtc((d) => ({ ...d, pill: "pending" }));
      collectWebrtcIps(4000).then((res) => {
        if (!res.supported) {
          setFactor("webrtc", "na", "WebRTC isn't available in this browser session, so the check can't run.", 0);
          setRtc({
            pub: "—",
            local: "—",
            pill: "na",
            verdict: "WebRTC isn't available here, so nothing can leak through it either.",
          });
          return;
        }
        const pubStr = res.pub.length ? res.pub.join(", ") : "None exposed";
        const localStr = res.local.length ? res.local.join(", ") : "None exposed";
        const leaks = res.pub.filter((ip) => ip !== r.ip);
        if (leaks.length) {
          setFactor(
            "webrtc",
            "bad",
            `WebRTC exposes ${leaks.join(", ")} — a different address than the one websites see (${r.ip}). Behind a VPN, that's your real IP leaking.`,
            40,
          );
          setRtc({
            pub: pubStr,
            local: localStr,
            pill: "bad",
            verdict: `Leak — WebRTC reveals ${leaks.join(", ")}, which differs from your connection IP ${r.ip}.`,
          });
        } else if (res.pub.length) {
          setFactor("webrtc", "pass", `WebRTC only reveals ${r.ip} — the same address websites already see.`, 0);
          setRtc({ pub: pubStr, local: localStr, pill: "pass", verdict: "WebRTC reveals only your public connection IP. Nothing extra leaks." });
        } else {
          setFactor("webrtc", "pass", "WebRTC exposed no public IP at all from this browser.", 0);
          setRtc({
            pub: pubStr,
            local: localStr,
            pill: "pass",
            verdict: "No public IP came back through WebRTC — it may be blocked or routed safely.",
          });
        }
      });
    },
    [setFactor],
  );

  /* ---------------- lookups ---------------- */

  const runLookup = useCallback(async (ip: string, isOwn: boolean): Promise<IpResult> => {
    setFormError("");
    setStatus({ mode: "loading", msg: ip ? `Looking up ${ip}…` : "Detecting your connection…" });
    try {
      const r = await lookupIp(ip);
      setResult(r);
      setStatus({
        mode: "",
        msg: isOwn
          ? `Showing your own connection — ${joinParts([r.city, r.country])}`
          : `Found: ${joinParts([r.city, r.region, r.country])}${r.isp ? " · " + r.isp : ""}`,
      });
      return r;
    } catch {
      setStatus({
        mode: "error",
        msg: "Lookup failed — the geolocation services didn't answer. Check your connection and try again.",
      });
      throw new Error("lookup failed");
    }
  }, []);

  const detectOwn = useCallback(() => {
    lookupIp("")
      .then((r) => {
        setOwnIp(r.ip);
        setOwnState("ok");
        setOwnSub(joinParts([r.city, r.region, r.country]) + (r.isp ? " · " + r.isp : ""));
        setResult(r);
        setStatus({ mode: "", msg: "This is the connection you're browsing from right now." });
        runChecks(r);
      })
      .catch(() => {
        setOwnState("fail");
        setOwnSub("The lookup services didn't answer — try tracking an IP below.");
        setStatus({
          mode: "error",
          msg: "Couldn't detect your IP automatically. You can still look up any public IP below.",
        });
        runChecks(null);
      });
  }, [runChecks]);

  /* ---------------- lifecycle ---------------- */

  useEffect(() => {
    setDevice(collectBrowserInfo());
    detectOwn();
  }, [detectOwn]);

  /* device clock */
  useEffect(() => {
    const tick = () => {
      try {
        setDeviceTime(
          new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()),
        );
      } catch {
        setDeviceTime("—");
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  /* result local-time clock */
  useEffect(() => {
    if (!result?.tzId) {
      setLocalTime("—");
      return;
    }
    const tzId = result.tzId;
    const tick = () => {
      try {
        setLocalTime(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: tzId,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(new Date()),
        );
      } catch {
        setLocalTime("—");
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [result]);

  /* map */
  useEffect(() => {
    if (!result || typeof result.lat !== "number" || typeof result.lon !== "number" || !mapElRef.current) return;
    const lat = result.lat;
    const lon = result.lon;
    let cancelled = false;
    ensureLeaflet()
      .then((L) => {
        if (cancelled || !mapElRef.current) return;
        const icon = L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        if (!mapRef.current) {
          const map = L.map(mapElRef.current).setView([lat, lon], 9);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);
          const marker = L.marker([lat, lon], { icon }).addTo(map);
          mapRef.current = { map, marker };
        } else {
          mapRef.current.map.setView([lat, lon], 9);
          mapRef.current.marker.setLatLng([lat, lon]);
          setTimeout(() => mapRef.current?.map.invalidateSize(), 50);
        }
      })
      .catch(() => {
        /* map is an enhancement — the Google Maps link below still works */
      });
    return () => {
      cancelled = true;
    };
  }, [result]);

  useEffect(() => {
    return () => {
      try {
        mapRef.current?.map.remove();
      } catch {
        /* noop */
      }
      mapRef.current = null;
    };
  }, []);

  /* ---------------- handlers ---------------- */

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const ip = input.trim().replace(/^\[|\]$/g, "");
    if (!ip) {
      setFormError("Type an IP address first — or tap one of the examples below.");
      return;
    }
    if (!isValidIp(ip)) {
      setFormError(
        `“${ip}” doesn't look like a valid IP address. Check for typos — IPv4 looks like 8.8.8.8, IPv6 like 2606:4700:4700::1111.`,
      );
      return;
    }
    if (isPrivateIp(ip)) {
      setFormError(`${ip} is a private/reserved address — it only exists inside a local network, so it has no public location to track.`);
      return;
    }
    setFormError("");
    runLookup(ip, false)
      .then(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
      .catch(() => {});
  }

  function onChip(ip: string) {
    setInput(ip);
    runLookup(ip, false).catch(() => {});
  }

  function onCopyOwn() {
    if (!ownIp) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(ownIp).then(done).catch(done);
    else done();
  }

  function onTrackOwn() {
    if (ownIp) {
      setInput(ownIp);
      runLookup(ownIp, true)
        .then(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
        .catch(() => {});
    } else {
      setOwnState("detecting");
      detectOwn();
    }
  }

  /* ---------------- score ---------------- */

  const counted = (Object.keys(factors) as FactorKey[])
    .map((k) => factors[k])
    .filter((f) => f.state === "pass" || f.state === "warn" || f.state === "bad");
  const anyPending = (Object.keys(factors) as FactorKey[]).some((k) => factors[k].state === "pending");
  const dedTotal = counted.reduce((s, f) => s + f.ded, 0);
  const score = counted.length ? Math.max(0, Math.min(100, 100 - dedTotal)) : null;
  const scoreMeta =
    score == null
      ? { word: anyPending ? "Running checks…" : "Couldn't score", cls: "text-stone-500", stroke: "#d6d3d1" }
      : score >= 85
        ? { word: "High anonymity", cls: "text-green-600", stroke: "#16a34a" }
        : score >= 60
          ? { word: "Partial anonymity", cls: "text-amber-500", stroke: "#f59e0b" }
          : { word: "Low anonymity", cls: "text-red-500", stroke: "#ef4444" };
  const RING_C = 351.86;
  const ringOffset = score == null ? RING_C : RING_C * (1 - score / 100);

  const factorTone = (s: FactorState) =>
    s === "pass"
      ? "bg-green-100 text-green-700"
      : s === "warn"
        ? "bg-amber-100 text-amber-600"
        : s === "bad"
          ? "bg-red-100 text-red-600"
          : "bg-stone-100 text-stone-400";
  const stateWordTone = (s: FactorState) =>
    s === "pass" ? "text-green-600" : s === "warn" ? "text-amber-500" : s === "bad" ? "text-red-500" : "text-stone-400";
  const pillTone = (s: FactorState) =>
    s === "pass"
      ? "bg-green-100 text-green-700"
      : s === "warn"
        ? "bg-amber-100 text-amber-600"
        : s === "bad"
          ? "bg-red-100 text-red-600"
          : "bg-stone-100 text-stone-500";

  const dash = (v: string | null | undefined) => (v == null || v === "" ? "—" : v);
  const hasCoords = result != null && typeof result.lat === "number" && typeof result.lon === "number";
  const locExtra = result
    ? joinParts(
        [
          result.capital ? `Capital: ${result.capital}` : null,
          result.continent && String(result.continent).length > 3 ? String(result.continent) : null,
          result.countryCode ? `Country code: ${result.countryCode}` : null,
        ],
        " · ",
      )
    : "";

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* ---------- your connection ---------- */}
        <div className="rounded-3xl border border-stone-200 bg-stone-950 text-white p-8 sm:p-10 flex flex-wrap items-center gap-6 justify-between shadow-xl">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-400 mb-2">Your IP address</p>
            <p className="font-display text-4xl sm:text-5xl font-bold break-all leading-tight">
              {ownState === "detecting" ? "Detecting…" : ownState === "fail" ? "Couldn't detect" : ownIp}
            </p>
            <p className="mt-2 text-stone-300">{ownSub}</p>
          </div>
          <div className="flex gap-3">
            {ownState === "ok" && (
              <button
                type="button"
                onClick={onCopyOwn}
                className="rounded-full border-2 border-stone-700 text-white font-semibold px-6 py-3 hover:border-stone-500 transition"
              >
                {copied ? "Copied ✓" : "Copy IP"}
              </button>
            )}
            <button
              type="button"
              onClick={onTrackOwn}
              disabled={ownState === "detecting"}
              className="rounded-full bg-orange-400 text-orange-950 font-bold px-6 py-3 hover:bg-orange-300 transition disabled:opacity-50"
            >
              {ownState === "fail" ? "Try again" : "Full details"}
            </button>
          </div>
        </div>

        {/* ---------- anonymity score ---------- */}
        <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-8 sm:p-10 flex flex-col md:flex-row gap-10 items-center md:items-start shadow-sm">
          <div className="text-center shrink-0">
            <div className="relative w-[132px] h-[132px] mx-auto">
              <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true" className="-rotate-90">
                <circle cx="66" cy="66" r="56" fill="none" stroke="#e7e5e4" strokeWidth="10" />
                <circle
                  cx="66"
                  cy="66"
                  r="56"
                  fill="none"
                  stroke={scoreMeta.stroke}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease" }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-display text-4xl font-bold text-stone-900">
                  {score == null ? "–" : score}
                  <span className="text-lg text-stone-400">%</span>
                </span>
              </div>
            </div>
            <p className={`mt-3 font-display text-xl font-bold ${scoreMeta.cls}`}>{scoreMeta.word}</p>
            <p className="text-sm text-stone-500">Anonymity score</p>
          </div>
          <div className="flex-1 min-w-0 w-full">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">How anonymous is this connection?</h2>
            <p className="mt-2 text-stone-600">
              Each check below runs live against the connection you&apos;re browsing from right now.
            </p>
            <ul className="mt-6 space-y-3">
              {(Object.keys(FACTOR_NAMES) as FactorKey[]).map((k) => (
                <li key={k} className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50/60 px-4 py-3">
                  <span className={`shrink-0 w-7 h-7 rounded-full grid place-items-center font-bold text-sm ${factorTone(factors[k].state)}`}>
                    {FACTOR_ICONS[factors[k].state]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900 text-sm">{FACTOR_NAMES[k]}</p>
                    <p className="text-sm text-stone-600 break-words">{factors[k].detail}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-bold uppercase tracking-wider pt-1 ${stateWordTone(factors[k].state)}`}>
                    {FACTOR_WORDS[factors[k].state]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-stone-500">
              The score is an estimate built only from checks that finished. Anything that couldn&apos;t run is
              marked N/A and left out of the score — it is never padded to 100%.
            </p>
          </div>
        </div>

        {/* ---------- leak tests ---------- */}
        <h2 className="font-display text-3xl font-bold text-stone-900 mt-16">Leak tests</h2>
        <p className="mt-2 text-stone-600">Two silent ways a connection betrays its real location — even behind a VPN.</p>
        <div className="grid gap-5 md:grid-cols-2 mt-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-7">
            <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-3">
              DNS resolver
              <span className={`ml-auto text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 ${pillTone(dns.pill)}`}>
                {dns.pill === "pending" ? "Checking" : dns.pill === "pass" ? "No leak" : dns.pill === "bad" ? "Leak" : "Unavailable"}
              </span>
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">DNS server</dt>
                <dd className="font-semibold text-stone-900 font-mono text-[13px] text-right break-all">{dns.ip}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Provider</dt>
                <dd className="font-semibold text-stone-900 text-right">{dns.org}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Country</dt>
                <dd className="font-semibold text-stone-900 text-right">{dns.country}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-stone-600">{dns.verdict}</p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-7">
            <h3 className="font-display text-lg font-bold text-stone-900 flex items-center gap-3">
              WebRTC
              <span className={`ml-auto text-[11px] font-bold uppercase tracking-wider rounded-full px-3 py-1 ${pillTone(rtc.pill)}`}>
                {rtc.pill === "pending" ? "Checking" : rtc.pill === "pass" ? "No leak" : rtc.pill === "bad" ? "Leak" : "Unavailable"}
              </span>
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Public IPs exposed</dt>
                <dd className="font-semibold text-stone-900 font-mono text-[13px] text-right break-all">{rtc.pub}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-500">Local addresses</dt>
                <dd className="font-semibold text-stone-900 font-mono text-[13px] text-right break-all">{rtc.local}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-stone-600">{rtc.verdict}</p>
          </div>
        </div>

        {/* ---------- browser & device ---------- */}
        <h2 className="font-display text-3xl font-bold text-stone-900 mt-16">This browser &amp; device</h2>
        <p className="mt-2 text-stone-600">Everything below is readable by any website you visit — no permission needed.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {device.map((c) => (
            <div key={c.label} className={`${cell} ${c.wide ? "sm:col-span-2 lg:col-span-3" : ""}`}>
              <p className={cellK}>{c.label}</p>
              <p className={`${cellV} ${c.mono ? "font-mono" : ""} ${c.small ? "text-[13px] font-medium" : ""}`}>{c.value}</p>
            </div>
          ))}
          <div className={cell}>
            <p className={cellK}>Device time</p>
            <p className={`${cellV} font-mono`}>{deviceTime}</p>
          </div>
        </div>

        {/* ---------- lookup ---------- */}
        <div className="mt-16 rounded-3xl border border-stone-200 bg-orange-50 dot-grid p-8 sm:p-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 text-center">Track any IP address</h2>
          <p className="mt-2 text-stone-600 text-center max-w-xl mx-auto">
            Enter any public IPv4 or IPv6 address to see its location, provider and network details.
          </p>
          <form onSubmit={onSubmit} noValidate className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder="Enter an IP address — e.g. 8.8.8.8"
              aria-label="IP address to look up"
              className="flex-1 rounded-full border border-stone-300 bg-white px-6 py-3.5 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-mono text-[15px]"
            />
            <button
              type="submit"
              className="rounded-full bg-orange-400 text-orange-950 font-bold px-8 py-3.5 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20"
            >
              Track IP
            </button>
          </form>
          {formError && (
            <p role="alert" className="mt-4 max-w-2xl mx-auto rounded-2xl bg-red-50 border border-red-200 text-red-700 px-5 py-3 text-sm font-medium">
              {formError}
            </p>
          )}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-stone-500 py-1.5">Try:</span>
            {CHIPS.map((c) => (
              <button
                key={c.ip}
                type="button"
                onClick={() => onChip(c.ip)}
                className="rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-medium text-stone-700 hover:border-orange-300 hover:text-orange-700 transition font-mono"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* status */}
        {status.msg && (
          <p role="status" aria-live="polite" className={`mt-6 text-center font-medium ${status.mode === "error" ? "text-red-600" : "text-stone-600"}`}>
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle ${
                status.mode === "error" ? "bg-red-500" : status.mode === "loading" ? "bg-amber-400 animate-pulse" : "bg-green-500"
              }`}
            />
            {status.msg}
          </p>
        )}

        {/* ---------- results ---------- */}
        {result && (
          <section ref={resultsRef} aria-label="Lookup result" className="mt-10 scroll-mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900 break-all">{result.ip}</h2>
              {result.type && (
                <span className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-orange-100 text-orange-700 px-3 py-1">{result.type}</span>
              )}
              {ownIp && result.ip === ownIp && (
                <span className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-green-100 text-green-700 px-3 py-1">Your connection</span>
              )}
              <span className="text-[11px] font-bold uppercase tracking-wider rounded-full bg-stone-100 text-stone-500 px-3 py-1">via {result.source}</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              <div className={`${cell} sm:col-span-2`}>
                <p className={cellK}>Location</p>
                <p className={cellV}>{dash(joinParts([result.city, result.region, result.country]) || null)}</p>
                {locExtra && <p className="text-sm text-stone-500 mt-1">{locExtra}</p>}
              </div>
              <div className={cell}>
                <p className={cellK}>Postal code</p>
                <p className={`${cellV} font-mono`}>{dash(result.postal)}</p>
              </div>
              <div className={`${cell} sm:col-span-2`}>
                <p className={cellK}>ISP / provider</p>
                <p className={cellV}>{dash(result.isp)}</p>
                {result.org && result.isp && result.org !== result.isp && <p className="text-sm text-stone-500 mt-1">{result.org}</p>}
                {!result.org && result.domain && <p className="text-sm text-stone-500 mt-1">{result.domain}</p>}
              </div>
              <div className={cell}>
                <p className={cellK}>ASN</p>
                <p className={`${cellV} font-mono`}>{dash(result.asn)}</p>
              </div>
              <div className={cell}>
                <p className={cellK}>Timezone</p>
                <p className={cellV}>{dash(result.tzId)}</p>
                {(result.tzAbbr || result.tzUtc) && (
                  <p className="text-sm text-stone-500 mt-1">
                    {joinParts([result.tzAbbr, result.tzUtc && result.tzAbbr !== result.tzUtc ? result.tzUtc : null], " · ")}
                  </p>
                )}
              </div>
              <div className={cell}>
                <p className={cellK}>Local time there</p>
                <p className={`${cellV} font-mono`}>{localTime}</p>
              </div>
              <div className={cell}>
                <p className={cellK}>Coordinates</p>
                <p className={`${cellV} font-mono`}>{hasCoords ? `${result.lat!.toFixed(4)}, ${result.lon!.toFixed(4)}` : "—"}</p>
              </div>
              <div className={cell}>
                <p className={cellK}>Connection</p>
                <p className={cellV}>{dash(result.connectionType || (result.isp ? "ISP network" : null))}</p>
              </div>
              <div className={cell}>
                <p className={cellK}>Currency</p>
                <p className={cellV}>{dash(result.currency)}</p>
              </div>
              <div className={cell}>
                <p className={cellK}>Languages</p>
                <p className={cellV}>{dash(result.languages ? String(result.languages).split(",").join(", ") : null)}</p>
              </div>
            </div>

            {/* map */}
            <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Approximate location — {dash(joinParts([result.city, result.country]) || null)}
                </h3>
                {hasCoords && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${result.lat},${result.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange-700 hover:text-orange-800 text-sm"
                  >
                    Open in Google Maps ↗
                  </a>
                )}
              </div>
              {hasCoords ? (
                <>
                  <p className="text-sm text-stone-500 font-mono mt-1">
                    {result.lat!.toFixed(4)}, {result.lon!.toFixed(4)}
                  </p>
                  <div className="isolate mt-4">
                    <div ref={mapElRef} className="h-72 w-full rounded-2xl overflow-hidden border border-stone-200" />
                  </div>
                  <p className="text-xs text-stone-400 mt-3">
                    IP locations are approximate — usually accurate to the city, not the street.
                  </p>
                </>
              ) : (
                <p className="text-sm text-stone-500 mt-2">No coordinates were returned for this address, so there is nothing to plot.</p>
              )}
            </div>

            {/* raw JSON */}
            <details className="mt-6 rounded-3xl border border-stone-200 bg-stone-950 group">
              <summary className="cursor-pointer list-none px-7 py-5 font-bold text-white flex items-center justify-between [&::-webkit-details-marker]:hidden">
                Raw lookup record (JSON)
                <span className="shrink-0 w-8 h-8 rounded-full bg-stone-800 text-orange-400 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
              </summary>
              <pre className="px-7 pb-7 text-[12.5px] leading-relaxed text-stone-300 overflow-x-auto">{JSON.stringify(result.raw, null, 2)}</pre>
            </details>
          </section>
        )}

        <p className="mt-10 text-sm text-stone-500 max-w-2xl">
          Lookups run live from your browser against the free <strong>ipwho.is</strong> geolocation service
          (with ipapi.co and freeipapi.com as fallbacks). Nothing you type is stored or sent anywhere else.
        </p>
      </div>
    </section>
  );
}
