"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  wifiPayload,
  vcardPayload,
  emailPayload,
  telefonoPayload,
  whatsappPayload,
  urlPayload,
  type QrType,
} from "./qr-content";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

const TYPES: { id: QrType; label: string }[] = [
  { id: "url", label: "URL / enlace" },
  { id: "texto", label: "Texto" },
  { id: "wifi", label: "WiFi" },
  { id: "vcard", label: "Contacto (vCard)" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Correo" },
  { id: "telefono", label: "Teléfono" },
];

export default function QrGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://frinjo.me");
  const [texto, setTexto] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSeg, setWifiSeg] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiOculta, setWifiOculta] = useState(false);
  const [vc, setVc] = useState({ nombre: "", apellidos: "", empresa: "", cargo: "", telefono: "", email: "", sitioWeb: "" });
  const [waTel, setWaTel] = useState("");
  const [waMsg, setWaMsg] = useState("");
  const [emDestino, setEmDestino] = useState("");
  const [emAsunto, setEmAsunto] = useState("");
  const [emCuerpo, setEmCuerpo] = useState("");
  const [tel, setTel] = useState("");
  const [fg, setFg] = useState("#111111");
  const [bg, setBg] = useState("#ffffff");
  const [pngUrl, setPngUrl] = useState("");
  const [svgText, setSvgText] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(() => {
    switch (type) {
      case "url": return urlPayload(url);
      case "texto": return texto.trim();
      case "wifi": return ssid.trim() ? wifiPayload(ssid, wifiPass, wifiSeg, wifiOculta) : "";
      case "vcard": return vc.nombre || vc.apellidos ? vcardPayload(vc) : "";
      case "whatsapp": return waTel.replace(/\D/g, "") ? whatsappPayload(waTel, waMsg) : "";
      case "email": return emDestino.trim() ? emailPayload(emDestino.trim(), emAsunto, emCuerpo) : "";
      case "telefono": return tel.replace(/\D/g, "") ? telefonoPayload(tel) : "";
      default: return "";
    }
  }, [type, url, texto, ssid, wifiPass, wifiSeg, wifiOculta, vc, waTel, waMsg, emDestino, emAsunto, emCuerpo, tel]);

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
      .catch(() => { if (!cancelled) setError("El contenido es demasiado largo para un solo código QR."); });
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
    a.download = "codigo-qr.svg";
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
            <span className={labelCls}>Tipo de código</span>
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
                  <label className={labelCls} htmlFor="qr-url">Dirección web</label>
                  <input id="qr-url" type="text" placeholder="tutienda.com/pagina" className={inputCls}
                    value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
              )}
              {type === "texto" && (
                <div>
                  <label className={labelCls} htmlFor="qr-texto">Texto libre</label>
                  <textarea id="qr-texto" rows={4} className={inputCls}
                    placeholder="Cualquier texto: un cupón, una dirección, un mensaje…"
                    value={texto} onChange={(e) => setTexto(e.target.value)} />
                </div>
              )}
              {type === "wifi" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-ssid">Nombre de la red (SSID)</label>
                    <input id="qr-ssid" type="text" className={inputCls} value={ssid} onChange={(e) => setSsid(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="qr-wifipass">Contraseña</label>
                      <input id="qr-wifipass" type="text" className={inputCls} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="qr-wifiseg">Seguridad</label>
                      <select id="qr-wifiseg" className={inputCls} value={wifiSeg} onChange={(e) => setWifiSeg(e.target.value as typeof wifiSeg)}>
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Sin contraseña</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={wifiOculta} onChange={(e) => setWifiOculta(e.target.checked)} className="w-4 h-4 accent-orange-600" />
                    <span className="text-sm text-stone-600">Red oculta</span>
                  </label>
                </>
              )}
              {type === "vcard" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelCls} htmlFor="qr-vc-nombre">Nombre</label><input id="qr-vc-nombre" className={inputCls} value={vc.nombre} onChange={vcField("nombre")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-apellidos">Apellidos</label><input id="qr-vc-apellidos" className={inputCls} value={vc.apellidos} onChange={vcField("apellidos")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-empresa">Empresa</label><input id="qr-vc-empresa" className={inputCls} value={vc.empresa} onChange={vcField("empresa")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-cargo">Cargo</label><input id="qr-vc-cargo" className={inputCls} value={vc.cargo} onChange={vcField("cargo")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-tel">Teléfono móvil</label><input id="qr-vc-tel" className={inputCls} value={vc.telefono} onChange={vcField("telefono")} /></div>
                  <div><label className={labelCls} htmlFor="qr-vc-email">Correo</label><input id="qr-vc-email" className={inputCls} value={vc.email} onChange={vcField("email")} /></div>
                  <div className="sm:col-span-2"><label className={labelCls} htmlFor="qr-vc-web">Sitio web</label><input id="qr-vc-web" className={inputCls} value={vc.sitioWeb} onChange={vcField("sitioWeb")} /></div>
                </div>
              )}
              {type === "whatsapp" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-wa-tel">Número con código de país</label>
                    <input id="qr-wa-tel" type="text" placeholder="+52 55 1234 5678" className={inputCls} value={waTel} onChange={(e) => setWaTel(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-wa-msg">Mensaje prellenado (opcional)</label>
                    <input id="qr-wa-msg" type="text" placeholder="Hola, quiero información sobre…" className={inputCls} value={waMsg} onChange={(e) => setWaMsg(e.target.value)} />
                  </div>
                </>
              )}
              {type === "email" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-dest">Correo destino</label>
                    <input id="qr-em-dest" type="email" className={inputCls} value={emDestino} onChange={(e) => setEmDestino(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-asunto">Asunto (opcional)</label>
                    <input id="qr-em-asunto" type="text" className={inputCls} value={emAsunto} onChange={(e) => setEmAsunto(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qr-em-cuerpo">Mensaje (opcional)</label>
                    <textarea id="qr-em-cuerpo" rows={3} className={inputCls} value={emCuerpo} onChange={(e) => setEmCuerpo(e.target.value)} />
                  </div>
                </>
              )}
              {type === "telefono" && (
                <div>
                  <label className={labelCls} htmlFor="qr-tel">Número de teléfono</label>
                  <input id="qr-tel" type="text" placeholder="+34 600 123 456" className={inputCls} value={tel} onChange={(e) => setTel(e.target.value)} />
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="qr-fg">Color del código</label>
                <input id="qr-fg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={fg} onChange={(e) => setFg(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="qr-bg">Color de fondo</label>
                <input id="qr-bg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={bg} onChange={(e) => setBg(e.target.value)} />
              </div>
            </div>
            <p className="mt-4 text-xs text-stone-400">
              Mantén buen contraste entre el código y el fondo: los lectores fallan con colores claros o
              invertidos. Todo se genera en tu navegador: tu contenido no se sube a ningún servidor.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 text-center">Tu código QR</p>
            {pngUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pngUrl} alt="Código QR generado" className="mt-4 w-full rounded-2xl border border-stone-100" />
                <div className="mt-5 flex flex-col gap-3">
                  <a href={pngUrl} download="codigo-qr.png"
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-6 py-3 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
                    Descargar PNG (1024 px)
                  </a>
                  <button type="button" onClick={downloadSvg}
                    className="inline-flex justify-center items-center gap-2 rounded-full border-2 border-stone-300 text-stone-700 font-bold px-6 py-3 hover:border-orange-400 transition">
                    Descargar SVG (vector)
                  </button>
                </div>
                <p className="mt-4 text-xs text-stone-400 text-center break-all">
                  Contenido: {payload.length > 90 ? `${payload.slice(0, 90)}…` : payload}
                </p>
              </>
            ) : (
              <div className="mt-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 aspect-square grid place-items-center px-6 text-center">
                <p className="text-sm text-stone-500">
                  {error || "Completa el contenido a la izquierda y tu código aparecerá aquí al instante."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
