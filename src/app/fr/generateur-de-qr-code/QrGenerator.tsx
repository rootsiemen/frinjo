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
  sepaPayload,
} from "./qr-content";

const inputCls =
  "w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

type FrQrType = "url" | "texte" | "wifi" | "vcard" | "sepa" | "whatsapp" | "email" | "telephone";

const TYPES: { id: FrQrType; label: string }[] = [
  { id: "url", label: "URL / lien" },
  { id: "texte", label: "Texte" },
  { id: "wifi", label: "WiFi" },
  { id: "vcard", label: "Contact (vCard)" },
  { id: "sepa", label: "Virement SEPA" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "E-mail" },
  { id: "telephone", label: "Téléphone" },
];

const numFr = (s: string): number => {
  const v = parseFloat(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};

export default function QrGenerator() {
  const [type, setType] = useState<FrQrType>("url");
  const [url, setUrl] = useState("https://frinjo.me");
  const [texte, setTexte] = useState("");
  const [ssid, setSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSeg, setWifiSeg] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiCache, setWifiCache] = useState(false);
  const [vc, setVc] = useState({ nombre: "", apellidos: "", empresa: "", cargo: "", telefono: "", email: "", sitioWeb: "" });
  const [sepaNom, setSepaNom] = useState("");
  const [sepaIban, setSepaIban] = useState("");
  const [sepaMontant, setSepaMontant] = useState("");
  const [sepaObjet, setSepaObjet] = useState("");
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
      case "texte": return texte.trim();
      case "wifi": return ssid.trim() ? wifiPayload(ssid, wifiPass, wifiSeg, wifiCache) : "";
      case "vcard": return vc.nombre || vc.apellidos ? vcardPayload(vc) : "";
      case "sepa": {
        const ibanClean = sepaIban.replace(/\s/g, "");
        if (ibanClean.length < 15 || !sepaNom.trim()) return "";
        return sepaPayload(sepaNom.trim(), sepaIban, sepaMontant.trim() ? numFr(sepaMontant) : null, sepaObjet.trim());
      }
      case "whatsapp": return waTel.replace(/\D/g, "") ? whatsappPayload(waTel, waMsg) : "";
      case "email": return emDestino.trim() ? emailPayload(emDestino.trim(), emAsunto, emCuerpo) : "";
      case "telephone": return tel.replace(/\D/g, "") ? telefonoPayload(tel) : "";
      default: return "";
    }
  }, [type, url, texte, ssid, wifiPass, wifiSeg, wifiCache, vc, sepaNom, sepaIban, sepaMontant, sepaObjet, waTel, waMsg, emDestino, emAsunto, emCuerpo, tel]);

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
      .catch(() => { if (!cancelled) setError("Le contenu est trop long pour un seul code QR."); });
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
            <span className={labelCls}>Type de code</span>
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
                  <label className={labelCls} htmlFor="qrfr-url">Adresse web</label>
                  <input id="qrfr-url" type="text" placeholder="votre-site.fr/page" className={inputCls}
                    value={url} onChange={(e) => setUrl(e.target.value)} />
                </div>
              )}
              {type === "texte" && (
                <div>
                  <label className={labelCls} htmlFor="qrfr-texte">Texte libre</label>
                  <textarea id="qrfr-texte" rows={4} className={inputCls}
                    placeholder="Un code promo, une adresse, un message…"
                    value={texte} onChange={(e) => setTexte(e.target.value)} />
                </div>
              )}
              {type === "wifi" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-ssid">Nom du réseau (SSID)</label>
                    <input id="qrfr-ssid" type="text" className={inputCls} value={ssid} onChange={(e) => setSsid(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="qrfr-wifipass">Mot de passe</label>
                      <input id="qrfr-wifipass" type="text" className={inputCls} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="qrfr-wifiseg">Sécurité</label>
                      <select id="qrfr-wifiseg" className={inputCls} value={wifiSeg} onChange={(e) => setWifiSeg(e.target.value as typeof wifiSeg)}>
                        <option value="WPA">WPA / WPA2 / WPA3</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Aucun mot de passe</option>
                      </select>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={wifiCache} onChange={(e) => setWifiCache(e.target.checked)} className="w-4 h-4 accent-orange-600" />
                    <span className="text-sm text-stone-600">Réseau masqué</span>
                  </label>
                </>
              )}
              {type === "vcard" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelCls} htmlFor="qrfr-vc-prenom">Prénom</label><input id="qrfr-vc-prenom" className={inputCls} value={vc.nombre} onChange={vcField("nombre")} /></div>
                  <div><label className={labelCls} htmlFor="qrfr-vc-nom">Nom</label><input id="qrfr-vc-nom" className={inputCls} value={vc.apellidos} onChange={vcField("apellidos")} /></div>
                  <div><label className={labelCls} htmlFor="qrfr-vc-entreprise">Entreprise</label><input id="qrfr-vc-entreprise" className={inputCls} value={vc.empresa} onChange={vcField("empresa")} /></div>
                  <div><label className={labelCls} htmlFor="qrfr-vc-fonction">Fonction</label><input id="qrfr-vc-fonction" className={inputCls} value={vc.cargo} onChange={vcField("cargo")} /></div>
                  <div><label className={labelCls} htmlFor="qrfr-vc-tel">Téléphone mobile</label><input id="qrfr-vc-tel" className={inputCls} value={vc.telefono} onChange={vcField("telefono")} /></div>
                  <div><label className={labelCls} htmlFor="qrfr-vc-email">E-mail</label><input id="qrfr-vc-email" className={inputCls} value={vc.email} onChange={vcField("email")} /></div>
                  <div className="sm:col-span-2"><label className={labelCls} htmlFor="qrfr-vc-web">Site web</label><input id="qrfr-vc-web" className={inputCls} value={vc.sitioWeb} onChange={vcField("sitioWeb")} /></div>
                </div>
              )}
              {type === "sepa" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-sepa-nom">Nom du bénéficiaire</label>
                    <input id="qrfr-sepa-nom" type="text" placeholder="Ex. : Atelier Dupont" className={inputCls} value={sepaNom} onChange={(e) => setSepaNom(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-sepa-iban">IBAN du bénéficiaire</label>
                    <input id="qrfr-sepa-iban" type="text" placeholder="FR76 …" className={inputCls} value={sepaIban} onChange={(e) => setSepaIban(e.target.value)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls} htmlFor="qrfr-sepa-montant">Montant en € (vide = libre)</label>
                      <input id="qrfr-sepa-montant" type="number" min="0" step="0.01" className={inputCls} value={sepaMontant} onChange={(e) => setSepaMontant(e.target.value)} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="qrfr-sepa-objet">Objet / référence (140 car. max)</label>
                      <input id="qrfr-sepa-objet" type="text" maxLength={140} placeholder="Facture 2026-042" className={inputCls} value={sepaObjet} onChange={(e) => setSepaObjet(e.target.value)} />
                    </div>
                  </div>
                  <p className="text-xs text-stone-400">
                    QR de virement au format européen EPC069-12 : vos clients le scannent avec leur
                    application bancaire et le virement est pré-rempli (bénéficiaire, IBAN, montant, objet).
                    Aucune donnée bancaire n&apos;est envoyée à un serveur : tout est généré dans votre navigateur.
                  </p>
                </>
              )}
              {type === "whatsapp" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-wa-tel">Numéro avec indicatif pays</label>
                    <input id="qrfr-wa-tel" type="text" placeholder="+33 6 12 34 56 78" className={inputCls} value={waTel} onChange={(e) => setWaTel(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-wa-msg">Message pré-rempli (optionnel)</label>
                    <input id="qrfr-wa-msg" type="text" placeholder="Bonjour, je souhaite un devis pour…" className={inputCls} value={waMsg} onChange={(e) => setWaMsg(e.target.value)} />
                  </div>
                </>
              )}
              {type === "email" && (
                <>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-em-dest">E-mail destinataire</label>
                    <input id="qrfr-em-dest" type="email" className={inputCls} value={emDestino} onChange={(e) => setEmDestino(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-em-asunto">Objet (optionnel)</label>
                    <input id="qrfr-em-asunto" type="text" className={inputCls} value={emAsunto} onChange={(e) => setEmAsunto(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="qrfr-em-cuerpo">Message (optionnel)</label>
                    <textarea id="qrfr-em-cuerpo" rows={3} className={inputCls} value={emCuerpo} onChange={(e) => setEmCuerpo(e.target.value)} />
                  </div>
                </>
              )}
              {type === "telephone" && (
                <div>
                  <label className={labelCls} htmlFor="qrfr-tel">Numéro de téléphone</label>
                  <input id="qrfr-tel" type="text" placeholder="+33 1 84 00 00 00" className={inputCls} value={tel} onChange={(e) => setTel(e.target.value)} />
                </div>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="qrfr-fg">Couleur du code</label>
                <input id="qrfr-fg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={fg} onChange={(e) => setFg(e.target.value)} />
              </div>
              <div>
                <label className={labelCls} htmlFor="qrfr-bg">Couleur de fond</label>
                <input id="qrfr-bg" type="color" className="w-full h-12 rounded-2xl border border-stone-300 bg-white px-2 cursor-pointer" value={bg} onChange={(e) => setBg(e.target.value)} />
              </div>
            </div>
            <p className="mt-4 text-xs text-stone-400">
              Gardez un contraste fort entre le code et le fond : les lecteurs échouent sur les couleurs
              claires ou inversées. Tout est généré dans votre navigateur, sans envoi sur un serveur.
            </p>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm h-fit">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 text-center">Votre QR code</p>
            {pngUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pngUrl} alt="QR code généré" className="mt-4 w-full rounded-2xl border border-stone-100" />
                <div className="mt-5 flex flex-col gap-3">
                  <a href={pngUrl} download="qr-code.png"
                    className="inline-flex justify-center items-center gap-2 rounded-full bg-orange-400 text-orange-950 font-bold px-6 py-3 hover:bg-orange-300 transition shadow-lg shadow-orange-400/20">
                    Télécharger PNG (1024 px)
                  </a>
                  <button type="button" onClick={downloadSvg}
                    className="inline-flex justify-center items-center gap-2 rounded-full border-2 border-stone-300 text-stone-700 font-bold px-6 py-3 hover:border-orange-400 transition">
                    Télécharger SVG (vectoriel)
                  </button>
                </div>
                <p className="mt-4 text-xs text-stone-400 text-center break-all">
                  Contenu : {payload.length > 90 ? `${payload.slice(0, 90)}…` : payload}
                </p>
              </>
            ) : (
              <div className="mt-4 rounded-2xl bg-stone-50 border border-dashed border-stone-300 aspect-square grid place-items-center px-6 text-center">
                <p className="text-sm text-stone-500">
                  {error || "Complétez le contenu à gauche : votre QR code apparaît ici instantanément."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
