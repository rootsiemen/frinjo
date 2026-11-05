"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateIdentity, identityText, identitiesCSV, formatFecha, inboxBody,
  type CountryCode, type GenderPref, type Identity, type InboxEmail,
} from "./generate";

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function IdentidadFalsa() {
  const [country, setCountry] = useState<CountryCode>("ES");
  const [gender, setGender] = useState<GenderPref>("Aleatorio");
  const [mode, setMode] = useState<"identity" | "full" | "first" | "last">("identity");
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState("");
  const [inboxEmail, setInboxEmail] = useState<string | null>(null);
  const [inboxMsgs, setInboxMsgs] = useState<InboxEmail[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [openMsg, setOpenMsg] = useState<InboxEmail | null>(null);

  useEffect(() => {
    if (!inboxEmail) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/temp-inbox?address=${encodeURIComponent(inboxEmail)}`);
        const data = (await res.json()) as { emails?: InboxEmail[]; error?: string };
        if (!cancelled) {
          setInboxMsgs(Array.isArray(data.emails) ? data.emails : []);
          setInboxError(data.error || "");
        }
      } catch {
        if (!cancelled) setInboxError("No se pudo cargar la bandeja. Inténtalo de nuevo.");
      }
      if (!cancelled) setInboxLoading(false);
    };
    setInboxLoading(true);
    setInboxMsgs([]);
    setOpenMsg(null);
    load();
    const t = window.setInterval(load, 15000);
    return () => { cancelled = true; window.clearInterval(t); };
  }, [inboxEmail]);

  function toggleInbox(emailAddr: string) {
    if (inboxEmail === emailAddr) {
      setInboxEmail(null);
      setOpenMsg(null);
    } else {
      setInboxEmail(emailAddr);
    }
  }

  const identities: Identity[] = useMemo(() => {
    void seed;
    return Array.from({ length: count }, () => generateIdentity(country, gender));
  }, [country, gender, count, seed]);

  const namesOnly = useMemo(() => {
    if (mode === "identity") return [];
    return identities.map((i) => (mode === "full" ? i.fullName : mode === "first" ? i.firstName : i.lastName));
  }, [identities, mode]);

  async function copyText(text: string, tag: string) {
    try { await navigator.clipboard.writeText(text); setCopied(tag); setTimeout(() => setCopied(""), 1500); } catch { /* portapapeles no disponible */ }
  }

  const field = (label: string, value: string) => (
    <p key={label} className="flex justify-between gap-3 text-sm border-b border-stone-100 py-1.5 last:border-0">
      <span className="font-bold text-stone-400 uppercase text-[11px] tracking-wider pt-0.5">{label}</span>
      <span className="font-semibold text-stone-800 text-right">{value}</span>
    </p>
  );

  return (
    <>
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelCls} htmlFor="id-country">País</label>
                <select id="id-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value as CountryCode)}>
                  <option value="ES">España</option>
                  <option value="MX">México</option>
                  <option value="CO">Colombia</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="PE">Perú</option>
                  <option value="US">Estados Unidos (datos hispanos)</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="id-gender">Sexo</label>
                <select id="id-gender" className={inputCls} value={gender} onChange={(e) => setGender(e.target.value as GenderPref)}>
                  <option value="Aleatorio">Aleatorio</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="id-mode">Salida</label>
                <select id="id-mode" className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                  <option value="identity">Identidad completa</option>
                  <option value="full">Solo nombres — completos</option>
                  <option value="first">Solo nombres — nombre</option>
                  <option value="last">Solo nombres — apellidos</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="id-count">Cantidad (1–100)</label>
                <input id="id-count" type="number" min={1} max={100} className={inputCls} value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Math.floor(Number(e.target.value) || 1))))} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => { setSeed((s) => s + 1); setInboxEmail(null); setOpenMsg(null); }} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-7 py-3 transition">
                Generar {count > 1 ? `${count} identidades` : "identidad"}
              </button>
              {mode === "identity" ? (
                <>
                  <button type="button" onClick={() => download("identidades-falsas.csv", identitiesCSV(identities), "text/csv")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Descargar CSV</button>
                  <button type="button" onClick={() => download("identidades-falsas.json", JSON.stringify(identities, null, 2), "application/json")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Descargar JSON</button>
                  <button type="button" onClick={() => download("identidades-falsas.txt", identities.map(identityText).join("\n\n"), "text/plain")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Descargar TXT</button>
                </>
              ) : (
                <button type="button" onClick={() => copyText(namesOnly.join("\n"), "all")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">
                  {copied === "all" ? "¡Copiado!" : "Copiar todos los nombres"}
                </button>
              )}
            </div>
            <p className="mt-4 text-sm text-stone-400">Sin límite diario y sin registro. Todo se genera en tu navegador con aleatoriedad criptográfica: nada se envía a un servidor. El correo de cada identidad es una dirección temporal real en nuestros propios dominios de correo temporal (tempmaill.tech): su bandeja es pública y se borra en una hora, así que úsala para registros de prueba y códigos de verificación, nunca para nada privado. Las identidades son para pruebas, diseño y escritura, nunca para suplantar a nadie ni abrir cuentas reales.</p>
          </div>

          {mode !== "identity" ? (
            <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <ol className="space-y-1.5">
                {namesOnly.map((n, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0">
                    <span className="font-semibold text-stone-800"><span className="text-stone-400 font-bold mr-3">{i + 1}.</span>{n}</span>
                    <button type="button" onClick={() => copyText(n, `n${i}`)} className="text-xs font-bold text-orange-700 hover:text-orange-800">{copied === `n${i}` ? "¡Copiado!" : "Copiar"}</button>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {identities.map((idn, i) => (
                <article key={i} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-stone-900">{idn.fullName}</h3>
                      <p className="text-sm text-stone-500">{idn.occupation} · {idn.company}</p>
                    </div>
                    <button type="button" onClick={() => copyText(identityText(idn), `c${i}`)} className="shrink-0 rounded-full bg-stone-900 text-white px-4 py-2 text-xs font-bold hover:bg-stone-800 transition">
                      {copied === `c${i}` ? "¡Copiado!" : "Copiar todo"}
                    </button>
                  </div>
                  <div className="mt-4">
                    {field("Sexo", idn.gender)}
                    {field("Dirección", `${idn.street}, ${idn.city}, ${idn.region} ${idn.postal}`)}
                    {field("País", idn.country)}
                    {field("Teléfono", idn.phone)}
                    {field("Correo", idn.email)}
                    {field("Usuario", idn.username)}
                    {field("Contraseña", idn.password)}
                    {field("Nacimiento", `${formatFecha(idn.birthday)} (${idn.age} años)`)}
                  </div>
                  <div className="mt-4 border-t border-stone-100 pt-4">
                    <button type="button" onClick={() => toggleInbox(idn.email)}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${inboxEmail === idn.email ? "bg-stone-900 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}`}>
                      {inboxEmail === idn.email ? "Cerrar bandeja" : "📥 Abrir bandeja de correo"}
                    </button>
                    {inboxEmail === idn.email && (
                      <div className="mt-3 rounded-2xl bg-stone-50 border border-stone-200 p-4">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                          Bandeja — {idn.email} <span className="normal-case font-semibold">(bandeja pública · se actualiza cada 15 s · el correo se borra en 1 hora)</span>
                        </p>
                        {inboxLoading ? (
                          <p className="mt-3 text-sm text-stone-500">Cargando la bandeja…</p>
                        ) : openMsg ? (
                          <div className="mt-3">
                            <button type="button" onClick={() => setOpenMsg(null)} className="text-xs font-bold text-orange-700 hover:text-orange-800">← Todos los correos</button>
                            <h4 className="mt-2 font-display text-lg font-bold text-stone-900">{openMsg.subject || "(Sin asunto)"}</h4>
                            <p className="text-xs text-stone-400">{openMsg.from} · {new Date(openMsg.date).toLocaleString("es-ES")}</p>
                            <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-stone-700 leading-relaxed font-sans max-h-96 overflow-y-auto">{inboxBody(openMsg)}</pre>
                          </div>
                        ) : inboxError ? (
                          <p className="mt-3 text-sm text-red-600">{inboxError}</p>
                        ) : inboxMsgs.length === 0 ? (
                          <p className="mt-3 text-sm text-stone-500">Todavía no ha llegado ningún correo a esta dirección. Regístrate en un sitio de prueba con este correo y el mensaje de verificación aparecerá aquí.</p>
                        ) : (
                          <ul className="mt-2 divide-y divide-stone-200">
                            {inboxMsgs.map((m) => (
                              <li key={m.id}>
                                <button type="button" onClick={() => setOpenMsg(m)} className="w-full text-left py-3 hover:bg-white rounded-lg px-2 transition">
                                  <span className="flex items-baseline justify-between gap-3">
                                    <span className="font-bold text-stone-900 truncate">{m.subject || "(Sin asunto)"}</span>
                                    <span className="shrink-0 text-xs text-stone-400">{new Date(m.date).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                                  </span>
                                  <span className="block text-xs text-stone-500 truncate">{m.from}</span>
                                  {m.preview && <span className="block text-sm text-stone-500 truncate mt-0.5">{m.preview}</span>}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-orange-50/60">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-stone-900">¿Qué tan realistas son las combinaciones?</h2>
          <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
            <p>
              Cada campo sale de un <strong className="text-stone-900">pool adaptado al país</strong>: los nombres y los dos
              apellidos son los habituales del mundo hispanohablante; las direcciones usan los tipos de vía reales de cada
              país (calle, avenida, carrera en Colombia, jirón en Perú, colonias en México, comunas en Chile) y códigos
              postales con los rangos correctos de cada ciudad (Madrid 28xxx, Barcelona 08xxx, Valencia 46xxx, Sevilla
              41xxx, Ciudad de México por delegación, Bogotá 11xxxx, código postal argentino en Buenos Aires). Los
              teléfonos siguen el formato móvil de cada país (+34 6XX, +52 55, +57 3XX, +54 9 11, +56 9, +51 9) y, donde
              el formato lo permite, el prefijo coincide con la ciudad generada.
            </p>
            <p>
              Dos decisiones deliberadas: <strong className="text-stone-900">los correos usan nuestros propios dominios de
              correo temporal</strong> (abahi.tech, abahi.page, abahi.me — los dominios de tempmaill.tech), así que un registro
              de prueba o un código de verificación enviado a una dirección generada llega de verdad y puede leerse abriendo
              la bandeja aquí mismo — pero esa bandeja es pública y se borra en una hora, lo que hace que las identidades
              sean inútiles para cualquier cosa privada; y <strong className="text-stone-900">nunca se generan números de
              documento (DNI/NIE), números fiscales ni tarjetas bancarias</strong>: si una prueba necesita un valor de pago,
              usa los números de prueba oficiales que publica tu proveedor de pagos. Esta herramienta existe para probar
              formularios, poblar bases de datos de desarrollo, maquetas de diseño y ficción; usarla para suplantar a
              alguien o abrir cuentas reales es fraude.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
