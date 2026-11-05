"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateIdentity, identityText, identitiesCSV, formatDateFr, inboxBody,
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

export default function FauxNom() {
  const [country, setCountry] = useState<CountryCode>("FR");
  const [gender, setGender] = useState<GenderPref>("Aléatoire");
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
        if (!cancelled) setInboxError("Impossible de charger la boîte de réception. Réessayez.");
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
    try { await navigator.clipboard.writeText(text); setCopied(tag); setTimeout(() => setCopied(""), 1500); } catch { /* presse-papiers indisponible */ }
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
                <label className={labelCls} htmlFor="fn2-country">Pays</label>
                <select id="fn2-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value as CountryCode)}>
                  <option value="FR">France</option>
                  <option value="BE">Belgique</option>
                  <option value="CH">Suisse</option>
                  <option value="QC">Canada (Québec)</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn2-gender">Sexe</label>
                <select id="fn2-gender" className={inputCls} value={gender} onChange={(e) => setGender(e.target.value as GenderPref)}>
                  <option value="Aléatoire">Aléatoire</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn2-mode">Résultat</label>
                <select id="fn2-mode" className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                  <option value="identity">Identité complète</option>
                  <option value="full">Noms seuls — complets</option>
                  <option value="first">Noms seuls — prénoms</option>
                  <option value="last">Noms seuls — noms</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn2-count">Nombre (1–100)</label>
                <input id="fn2-count" type="number" min={1} max={100} className={inputCls} value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Math.floor(Number(e.target.value) || 1))))} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => { setSeed((s) => s + 1); setInboxEmail(null); setOpenMsg(null); }} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-7 py-3 transition">
                Générer {count > 1 ? `${count} identités` : "une identité"}
              </button>
              {mode === "identity" ? (
                <>
                  <button type="button" onClick={() => download("fausses-identites.csv", identitiesCSV(identities), "text/csv")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Télécharger CSV</button>
                  <button type="button" onClick={() => download("fausses-identites.json", JSON.stringify(identities, null, 2), "application/json")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Télécharger JSON</button>
                  <button type="button" onClick={() => download("fausses-identites.txt", identities.map(identityText).join("\n\n"), "text/plain")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Télécharger TXT</button>
                </>
              ) : (
                <button type="button" onClick={() => copyText(namesOnly.join("\n"), "all")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">
                  {copied === "all" ? "Copié !" : "Copier tous les noms"}
                </button>
              )}
            </div>
            <p className="mt-4 text-sm text-stone-400">Aucune limite quotidienne, aucune inscription. Tout est généré dans votre navigateur avec un hasard cryptographique : rien n&apos;est envoyé à un serveur. L&apos;adresse e-mail de chaque identité est une vraie adresse temporaire sur nos propres domaines de courrier temporaire (tempmaill.tech) : sa boîte est publique et s&apos;efface après une heure, donc utilisez-la pour des inscriptions de test et des codes de vérification, jamais pour quoi que ce soit de privé. Ces identités servent aux tests, au design et à l&apos;écriture — jamais à usurper l&apos;identité de quelqu&apos;un ni à ouvrir de vrais comptes.</p>
          </div>

          {mode !== "identity" ? (
            <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <ol className="space-y-1.5">
                {namesOnly.map((n, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0">
                    <span className="font-semibold text-stone-800"><span className="text-stone-400 font-bold mr-3">{i + 1}.</span>{n}</span>
                    <button type="button" onClick={() => copyText(n, `n${i}`)} className="text-xs font-bold text-orange-700 hover:text-orange-800">{copied === `n${i}` ? "Copié !" : "Copier"}</button>
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
                      {copied === `c${i}` ? "Copié !" : "Tout copier"}
                    </button>
                  </div>
                  <div className="mt-4">
                    {field("Sexe", idn.gender)}
                    {field("Adresse", `${idn.street}, ${idn.postal} ${idn.city}, ${idn.region}`)}
                    {field("Pays", idn.country)}
                    {field("Téléphone", idn.phone)}
                    {field("E-mail", idn.email)}
                    {field("Utilisateur", idn.username)}
                    {field("Mot de passe", idn.password)}
                    {field("Naissance", `${formatDateFr(idn.birthday)} (${idn.age} ans)`)}
                  </div>
                  <div className="mt-4 border-t border-stone-100 pt-4">
                    <button type="button" onClick={() => toggleInbox(idn.email)}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${inboxEmail === idn.email ? "bg-stone-900 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}`}>
                      {inboxEmail === idn.email ? "Fermer la boîte" : "📥 Ouvrir la boîte de réception"}
                    </button>
                    {inboxEmail === idn.email && (
                      <div className="mt-3 rounded-2xl bg-stone-50 border border-stone-200 p-4">
                        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                          Boîte de réception — {idn.email} <span className="normal-case font-semibold">(boîte publique · actualisation automatique toutes les 15 s · suppression après 1 heure)</span>
                        </p>
                        {inboxLoading ? (
                          <p className="mt-3 text-sm text-stone-500">Chargement de la boîte…</p>
                        ) : openMsg ? (
                          <div className="mt-3">
                            <button type="button" onClick={() => setOpenMsg(null)} className="text-xs font-bold text-orange-700 hover:text-orange-800">← Tous les e-mails</button>
                            <h4 className="mt-2 font-display text-lg font-bold text-stone-900">{openMsg.subject || "(Sans objet)"}</h4>
                            <p className="text-xs text-stone-400">{openMsg.from} · {new Date(openMsg.date).toLocaleString("fr-FR")}</p>
                            <pre className="mt-3 whitespace-pre-wrap break-words text-sm text-stone-700 leading-relaxed font-sans max-h-96 overflow-y-auto">{inboxBody(openMsg)}</pre>
                          </div>
                        ) : inboxError ? (
                          <p className="mt-3 text-sm text-red-600">{inboxError}</p>
                        ) : inboxMsgs.length === 0 ? (
                          <p className="mt-3 text-sm text-stone-500">Aucun e-mail n&apos;est encore arrivé à cette adresse. Inscrivez-vous sur un site de test avec cette adresse : le message de vérification apparaîtra ici.</p>
                        ) : (
                          <ul className="mt-2 divide-y divide-stone-200">
                            {inboxMsgs.map((m) => (
                              <li key={m.id}>
                                <button type="button" onClick={() => setOpenMsg(m)} className="w-full text-left py-3 hover:bg-white rounded-lg px-2 transition">
                                  <span className="flex items-baseline justify-between gap-3">
                                    <span className="font-bold text-stone-900 truncate">{m.subject || "(Sans objet)"}</span>
                                    <span className="shrink-0 text-xs text-stone-400">{new Date(m.date).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
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
          <h2 className="font-display text-3xl font-bold text-stone-900">À quel point ces combinaisons sont-elles réalistes ?</h2>
          <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
            <p>
              Chaque champ est tiré d&apos;un <strong className="text-stone-900">pool adapté au pays</strong> : prénoms et noms
              de famille courants dans l&apos;espace francophone, adresses aux formats réels (numéro, type de voie et noms de
              rues plausibles), codes postaux dans les bonnes plages pour chaque ville (Paris 750xx, Lyon 690xx, Marseille
              130xx, Nantes 440xx, Lille 59xxx, Bordeaux 330xx ; 1000–4000 en Belgique, 1000–8000 en Suisse, codes H/G/J au
              Québec) et téléphones aux formats mobiles nationaux (+33 06/07, +32 4XX, +41 7X, +1 avec indicatifs du Québec).
              Là où le format inclut un indicatif régional, il correspond à la ville générée.
            </p>
            <p>
              Deux choix délibérés : <strong className="text-stone-900">les e-mails utilisent nos propres domaines de courrier
              temporaire</strong> (abahi.tech, abahi.page, abahi.me — les domaines de tempmaill.tech), donc un code de
              vérification ou un message de test envoyé à une adresse générée arrive réellement et peut être lu en ouvrant la
              boîte ici même — mais cette boîte est publique et s&apos;efface après une heure, ce qui rend ces identités
              inutilisables pour quoi que ce soit de privé ; et <strong className="text-stone-900">aucun numéro d&apos;identité
              national (NIR, numéro national), numéro fiscal ni numéro de carte bancaire n&apos;est jamais généré</strong> : si
              un test exige une valeur de paiement, utilisez les numéros de test officiels publiés par votre prestataire de
              paiement. Cet outil existe pour tester des formulaires, alimenter des bases de développement, faire des
              maquettes et écrire de la fiction ; l&apos;utiliser pour usurper une identité ou ouvrir de vrais comptes est
              une fraude.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
