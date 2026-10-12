// SMS alerts for customers + the site owner. Configure on the server:
//
//   SMS_PROVIDER=twilio   -> TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
//   SMS_PROVIDER=url      -> SMS_API_URL (a GET/POST URL containing {to} and
//                            {message} placeholders, e.g. a Pakistani gateway:
//                            https://gateway.example.com/send?api_key=KEY&to={to}&message={message}
//                            SMS_API_METHOD=GET|POST (default GET)
//   SMS_OWNER_NUMBER      -> where new-inquiry alerts go (defaults to the
//                            WhatsApp number in the site config)
//
// If no provider is configured, messages are logged to the console (dev
// fallback) and sendSms returns false — the checkout/inquiry flow never breaks.
import { BRAND } from "./content";

type Provider =
  | { kind: "twilio"; sid: string; token: string; from: string }
  | { kind: "url"; url: string; method: "GET" | "POST" }
  | null;

function getProvider(): Provider {
  const which = (process.env.SMS_PROVIDER || "").trim().toLowerCase();
  if (which === "twilio") {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM;
    if (!sid || !token || !from) return null;
    return { kind: "twilio", sid, token, from };
  }
  if (which === "url") {
    const url = process.env.SMS_API_URL;
    if (!url || !url.includes("{to}") || !url.includes("{message}")) return null;
    const method = (process.env.SMS_API_METHOD || "GET").toUpperCase() === "POST" ? "POST" : "GET";
    return { kind: "url", url, method };
  }
  return null;
}

export function isSmsConfigured(): boolean {
  return getProvider() !== null;
}

/** Normalize a phone number to E.164-ish (+92..., +964..., etc).
 *  Handles Pakistani mobiles typed as 0300..., 92300..., +92 300..., 00300.... */
export function normalizePhone(raw: string): string {
  let s = String(raw || "").trim();
  const hadPlus = s.startsWith("+");
  let d = s.replace(/\D/g, "");
  if (!d) return "";
  if (s.startsWith("00")) d = d.slice(2); // drop intl prefix, then treat rest as national
  else if (hadPlus) return "+" + d; // already international
  if (d.startsWith("92") && d.length === 12) return "+" + d; // already +92
  if (d.startsWith("0") && d.length >= 10 && d.length <= 12) return "+92" + d.slice(1);
  if (d.length === 10 || d.length === 11) return "+92" + d; // assume Pakistan
  return "+" + d;
}

/** Where owner alerts (new inquiries) go. */
export function ownerNumber(): string {
  const env = (process.env.SMS_OWNER_NUMBER || "").trim();
  return normalizePhone(env || BRAND.whatsapp);
}

async function sendViaTwilio(p: Extract<Provider, { kind: "twilio" }>, to: string, message: string): Promise<boolean> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${p.sid}/Messages.json`;
  const body = new URLSearchParams({ To: to, From: p.from, Body: message });
  const auth = Buffer.from(`${p.sid}:${p.token}`).toString("base64");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  return res.ok;
}

async function sendViaUrl(p: Extract<Provider, { kind: "url" }>, to: string, message: string): Promise<boolean> {
  const filled = p.url
    .replace("{to}", encodeURIComponent(to))
    .replace("{message}", encodeURIComponent(message));
  const res =
    p.method === "POST"
      ? await fetch(filled.split("?")[0], {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: filled.split("?")[1] || "",
        })
      : await fetch(filled);
  return res.ok;
}

/** Never throws: returns true when the provider accepted the message. */
export async function sendSms(to: string, message: string): Promise<boolean> {
  const num = normalizePhone(to);
  if (!num || !message) return false;
  const provider = getProvider();
  if (!provider) {
    console.log(`[sms:dev] To: ${num} | ${message}`);
    return false;
  }
  try {
    if (provider.kind === "twilio") return await sendViaTwilio(provider, num, message);
    return await sendViaUrl(provider, num, message);
  } catch (e) {
    console.error("sendSms failed", e);
    return false;
  }
}

// ---- Message templates (kept short for SMS) ----

export const orderConfirmationSms = (name: string, orderId: number | string, pkg: string, amount: number) =>
  `Frinjo: Hi ${name}, your order #${orderId} (${pkg}, $${amount}) is received. We'll contact you on WhatsApp shortly to confirm payment. Thank you!`;

export const orderStatusSms = (name: string, orderId: number | string, status: string) =>
  `Frinjo: Hi ${name}, your order #${orderId} status is now: ${String(status).toUpperCase()}. Questions? Message us on WhatsApp.`;

export const inquiryAlertSms = (name: string, whatsapp: string, message: string) => {
  const snippet = String(message || "").replace(/\s+/g, " ").trim().slice(0, 110);
  return `Frinjo: New inquiry from ${name} (${normalizePhone(whatsapp)}): ${snippet}`;
};
