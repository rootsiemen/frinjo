// Pure payload builders for the QR generator — no React, unit-testable.
// The QR encoding itself is done client-side with the `qrcode` library.

export type QrType = "url" | "texto" | "wifi" | "vcard" | "email" | "telefono" | "whatsapp";

const escapeWifi = (s: string): string => s.replace(/([\\;,:"'])/g, "\\$1");

/** WiFi payload per the zxing WIFI format: WIFI:T:WPA;S:ssid;P:pass;H:false;; */
export function wifiPayload(ssid: string, password: string, security: "WPA" | "WEP" | "nopass", hidden = false): string {
  const sec = security === "nopass" ? "nopass" : security;
  const passPart = security === "nopass" ? "" : `P:${escapeWifi(password)};`;
  return `WIFI:T:${sec};S:${escapeWifi(ssid)};${passPart}H:${hidden ? "true" : "false"};;`;
}

export interface VCardInput {
  nombre: string;
  apellidos: string;
  empresa: string;
  cargo: string;
  telefono: string;
  email: string;
  sitioWeb: string;
}

/** vCard 3.0 payload. */
export function vcardPayload(v: VCardInput): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v.apellidos};${v.nombre};;;`,
    `FN:${`${v.nombre} ${v.apellidos}`.trim()}`,
  ];
  if (v.empresa) lines.push(`ORG:${v.empresa}`);
  if (v.cargo) lines.push(`TITLE:${v.cargo}`);
  if (v.telefono) lines.push(`TEL;TYPE=CELL:${v.telefono}`);
  if (v.email) lines.push(`EMAIL:${v.email}`);
  if (v.sitioWeb) lines.push(`URL:${v.sitioWeb}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function emailPayload(email: string, asunto: string, cuerpo: string): string {
  const params = new URLSearchParams();
  if (asunto) params.set("subject", asunto);
  if (cuerpo) params.set("body", cuerpo);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

export function telefonoPayload(telefono: string): string {
  return `tel:${telefono.replace(/[\s()-]/g, "")}`;
}

export function whatsappPayload(telefono: string, mensaje: string): string {
  const digits = telefono.replace(/\D/g, "");
  const qs = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${digits}${qs}`;
}

/** Normalise a user-typed URL: adds https:// when no scheme is present. */
export function urlPayload(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(t) || /^mailto:|^tel:/i.test(t)) return t;
  return `https://${t}`;
}
