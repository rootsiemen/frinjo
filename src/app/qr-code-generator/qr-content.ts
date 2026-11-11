// Pure payload builders for the QR Code Generator — no React, unit-testable.
// The QR encoding itself is done client-side with the `qrcode` library.

export type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "phone" | "whatsapp";

const escapeWifi = (s: string): string => s.replace(/([\\;,:"'])/g, "\\$1");

/** WiFi payload per the zxing WIFI format: WIFI:T:WPA;S:ssid;P:pass;H:false;; */
export function wifiPayload(ssid: string, password: string, security: "WPA" | "WEP" | "nopass", hidden = false): string {
  const sec = security === "nopass" ? "nopass" : security;
  const passPart = security === "nopass" ? "" : `P:${escapeWifi(password)};`;
  return `WIFI:T:${sec};S:${escapeWifi(ssid)};${passPart}H:${hidden ? "true" : "false"};;`;
}

export interface VCardInput {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

/** vCard 3.0 payload. */
export function vcardPayload(v: VCardInput): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v.lastName};${v.firstName};;;`,
    `FN:${`${v.firstName} ${v.lastName}`.trim()}`,
  ];
  if (v.company) lines.push(`ORG:${v.company}`);
  if (v.title) lines.push(`TITLE:${v.title}`);
  if (v.phone) lines.push(`TEL;TYPE=CELL:${v.phone}`);
  if (v.email) lines.push(`EMAIL:${v.email}`);
  if (v.website) lines.push(`URL:${v.website}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function emailPayload(email: string, subject: string, body: string): string {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const qs = params.toString();
  return `mailto:${email}${qs ? `?${qs}` : ""}`;
}

export function phonePayload(phone: string): string {
  return `tel:${phone.replace(/[\s()-]/g, "")}`;
}

export function whatsappPayload(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const qs = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${qs}`;
}

/** Normalise a user-typed URL: adds https:// when no scheme is present. */
export function urlPayload(raw: string): string {
  const t = raw.trim();
  if (!t) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(t) || /^mailto:|^tel:/i.test(t)) return t;
  return `https://${t}`;
}
