"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  wifiPayload,
  vcardPayload,
  emailPayload,
  phonePayload,
  whatsappPayload,
  urlPayload,
  type QrType,
} from "./qr-content";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const TYPES: { id: QrType; label: string }[] = [
  { id: "url", label: "URL / link" },
  { id: "text", label: "Text" },
  { id: "wifi", label: "WiFi" },
  { id: "vcard", label: "Contact (vCard)" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
];

export default function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://frinjo.me");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSeg, setWifiSeg] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  const [vc, setVc] = useState({ firstName: "", lastName: "", company: "", title: "", phone: "", email: "", website: "" });
  const [waPhone, setWaPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [emTo, setEmTo] = useState("");
  const [emSubject, setEmSubject] = useState("");
  const [emBody, setEmBody] = useState("");
  const [phone, setPhone] = useState("");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");
  const [pngUrl, setPngUrl] = useState("");
  const [svgText, setSvgText] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    switch (type) {
      case "url": return urlPayload(url);
      case "text": return text.trim();
      case "wifi": return ssid.trim() ? wifiPayload(ssid, wifiPass, wifiSeg, wifiHidden) : "";
      case "vcard": return vc.firstName || vc.lastName ? vcardPayload(vc) : "";
      case "whatsapp": return waPhone.replace(/\D/g, "") ? whatsappPayload(waPhone, waMsg) : "";
      case "email": return emTo.trim() ? emailPayload(emTo.trim(), emSubject, emBody) : "";
      case "phone": return phone.replace(/\D/g, "") ? phonePayload(phone) : "";
      default: return "";
    }
  }, [type, url, text, ssid, wifiPass, wifiSeg, wifiHidden, vc, waPhone, waMsg, emTo, emSubject, emBody, phone]);

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setPngUrl("");
      setSvgText("");
      setError("");
      return;
    }
    const opts = { width: 1024, margin: 2, color: { dark: fg, light: bg } };
    QRCode.toDataURL(payload, opts)
      .then((u) => { if (!cancelled) { setPngUrl(u); setError(""); } })
      .catch(() => { if (!cancelled) setError("That content is too long for a single QR code."); });
    QRCode.toString(payload, { type: "svg", margin: 2, color: { dark: fg, light: bg } })
      .then((s) => { if (!cancelled) setSvgText(s); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [payload, fg, bg]);

  const downloadSvg = () => {
    if (!svgText) return;
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const u = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = u;
    a.download = "qr-code.svg";
    a.click();
    URL.revokeObjectURL(u);
  };

  const vcField = (key: keyof typeof vc) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setVc((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <section className="py-14 sm:py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
            <span className={labelCls}>Code type</span>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t.id} type="button" onClick={() => setType(t.id)}
                  className={`rounded-full px-4 py-2 font-bold text-sm transition ${type === t.id ? "bg-orange-600 text-white" : "bg-white border border-stone-300 text-stone-700 hover:border-orange-400"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {type === "url" && (
                <div>
                  <label className={labelCls} htmlFor="qr-url">Web address</label>
                  <input id="qr-url" type="text" placeholder="yourshop.com/page" className={inputCls}
                    value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
              )}
              {type === "text" && (
                <div>
                  <label className={labelCls} htmlFor="qr-text">Free text</label>
                  <textarea id="qr-text" rows={4} className={inputCls}
                    placeholder="Any text: a coupon, an address, a message…"
                    value={text} onChange={(e) => setText(e.target.value)} />
                </div>
              )}
              {type === "wifi" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-ssid">Network name (SSID)</label>
                    <input id="qr-ssid" type="text" className={inputCls} value={ssid} onChange={(e) => setSsid(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="qr-wifipass">Password</label>
                      <input id="qr-wifipass" type="text" className={inputCls} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="qr-wifiseg">Security</label>
                      <select id="qr-wifiseg" className={inputCls} value={wifiSeg} onChange={(e) => setWifiSeg(e.target.value as typeof wifiSeg)}>
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No password</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="w-4 h-4 accent-orange-600" />
                    <span className="text-sm text-stone-600">Hidden network</span>
                  </label>
                </>
              )}
              {type === "vcard" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelCls} htmlFor="qr-vc-first">First name</label><input id="qr-vc-first" className={inputCls} value={vc.firstName} onChange={vcField("firstName")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-last">Last name</label><input id="qr-vc-last" className={inputCls} value={vc.lastName} onChange={vcField("lastName")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-company">Company</label><input id="qr-vc-company" className={inputCls} value={vc.company} onChange={vcField("company")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-title">Job title</label><input id="qr-vc-title" className={inputCls} value={vc.title} onChange={vcField("title")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-phone">Mobile phone</label><input id="qr-vc-phone" className={inputCls} value={vc.phone} onChange={vcField("phone")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-email">Email</label><input id="qr-vc-email" className={inputCls} value={vc.email} onChange={vcField("email")} /></div>
                  <div className="sm:col-span-2"><label className={labelCls} htmlFor="qr-vc-web">Website</label><input id="qr-vc-web" className={inputCls} value={vc.website} onChange={vcField("website")} /></div>
                </div>
              )}
              {type === "whatsapp" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-wa-tel">Number with country code</label>
                    <input id="qr-wa-tel" type="text" placeholder="+1 555 123 4567" className={inputCls} value={waPhone} onChange={(e) => setWaPhone(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-wa-msg">Pre-filled message (optional)</label>
                    <input id="qr-wa-msg" type="text" placeholder="Hi, I'd like to know more about…" className={inputCls} value={waMsg} onChange={(e) => setWaMsg(e.target.value)} />
                  </div>
                </>
              )}
              {type === "email" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-to">Recipient email</label>
                    <input id="qr-em-to" type="email" className={inputCls} value={emTo} onChange={(e) => setEmTo(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-subject">Subject (optional)</label>
                    <input id="qr-em-subject" type="text" className={inputCls} value={emSubject} onChange={(e) => setEmSubject(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-body">Message (optional)</label>
                    <textarea id="qr-em-body" rows={3} className={inputCls} value={emBody} onChange={(e) => setEmBody(e.target.value)} />
                  </div>
                </>
              )}
              {type === "phone" && (
                <div>
                  <label className={labelCls} htmlFor="qr-tel">Phone number</label>
                  <input id="qr-tel" type="text" placeholder="+1 555 123 4567" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="qr-fg">Code colour</label>
                <input id="qr-fg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={fg} onChange={(e) => setFg(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="qr-bg">Background colour</label>
                <input id="qr-bg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={bg} onChange={(e) => setBg(e.target.value)} />
              </div>
            </div>
            <p className="mt-4 text-xs text-stone-400">
              Keep strong contrast between the code and the background: scanners fail with light or
              inverted colours. Everything is generated in your browser: your content is never uploaded
              to a server.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 text-center">Your QR code</p>
            {pngUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pngUrl} alt="Generated QR code" className="mt-4 w-full rounded-2xl border border-stone-100" />
                <div className="mt-5 flex flex-col gap-3">
                  <a href={pngUrl} download="qr-code.png"
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-6 py-3 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
                    Download PNG (1024 px)
                  </a>
                  <button type="button" onClick={downloadSvg}
                    className="inline-flex justify-center items-center gap-2 rounded-full border-2 border-stone-300 text-stone-700 font-bold px-6 py-3 hover:border-orange-400 transition">
                    Download SVG (vector)
                  </button>
                </div>
                <p className="mt-4 text-xs text-stone-400 text-center break-all">
                  Content: {payload.length > 90 ? `${payload.slice(0, 90)}…` : payload}
                </p>
              </>
            ) : (
              <div className="mt-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 aspect-square grid place-items-center px-6 text-center">
                <p className="text-sm text-stone-500">
                  {error || "Fill in the content on the left and your code appears here instantly."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
