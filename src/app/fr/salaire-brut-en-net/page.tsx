import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import SalaireCalculator from "./SalaireCalculator";

export const metadata = {
  title: "Salaire Brut en Net 2026 — Gratuit",
  description:
    "Salaire brut en net, gratuit et instantané : non-cadre (22 %), cadre (25 %) ou fonction publique (17 %), avant et après impôt, par mois et par an.",
  keywords: [
    "salaire brut en net",
    "brut en net",
    "convertir salaire brut en net",
    "calcul salaire net",
    "salaire net cadre",
    "salaire net fonction publique",
    "prélèvement à la source",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/salaire-brut-en-net",
    languages: { fr: "https://frinjo.me/fr/salaire-brut-en-net" },
  },
  openGraph: {
    title: "Salaire Brut en Net — Convertisseur Gratuit 2026 | Frinjo",
    description:
      "Votre salaire net avant et après impôt, selon votre statut (non-cadre, cadre, fonction publique) — instantané, gratuit, sans inscription.",
    url: "https://frinjo.me/fr/salaire-brut-en-net",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Salaire Brut en Net",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/salaire-brut-en-net",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Convertisseur gratuit de salaire brut en net pour la France. Méthodologie (estimation) : le salaire net avant impôt est le salaire brut diminué des charges salariales moyennes estimées — 22 % du brut pour un salarié non-cadre, 25 % pour un salarié cadre, 17 % pour la fonction publique. Le salaire net après impôt applique ensuite le taux de prélèvement à la source (PAS) saisi par l'utilisateur au net avant impôt. Le coût total employeur est estimé en ajoutant les charges patronales moyennes (≈ 42 % du brut pour un non-cadre, ≈ 45 % pour un cadre). Il s'agit d'une estimation simplifiée et transparente, pas du calcul officiel ligne par ligne : le simulateur mon-entreprise de l'Urssaf fait foi. Le calcul s'exécute localement dans le navigateur du visiteur.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Salaire Brut en Net", item: "https://frinjo.me/fr/salaire-brut-en-net" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Comment convertir un salaire brut en net ?",
    "La formule de base : salaire net avant impôt = salaire brut − charges salariales. Avec les taux moyens utilisés ici, un salarié non-cadre garde environ 78 % de son brut, un cadre environ 75 % et un fonctionnaire environ 83 %. Exemple : 2 500 € brut mensuel pour un non-cadre donnent 1 950 € net avant impôt. On applique ensuite le taux de prélèvement à la source pour obtenir le net après impôt, c'est-à-dire le montant réellement versé sur le compte.",
  ],
  [
    "Quel taux de charges salariales s'applique à mon salaire ?",
    "En moyenne, les cotisations salariales représentent environ 22 % du brut pour un salarié non-cadre, 25 % pour un cadre (cotisations de retraite complémentaire plus élevées) et 17 % dans la fonction publique. Ce sont des ordres de grandeur : le taux réel varie selon la convention collective, la mutuelle, les heures supplémentaires et les éléments variables de la fiche de paie.",
  ],
  [
    "Qu'est-ce que le prélèvement à la source (PAS) ?",
    "Depuis 2019, l'impôt sur le revenu est prélevé directement par l'employeur sur le salaire net, au taux transmis par l'administration fiscale (taux personnalisé, individualisé ou non personnalisé). Ce taux figure sur votre fiche de paie et dans votre espace impots.gouv.fr. Le taux de 7 % utilisé par défaut dans ce convertisseur est un exemple de taux moyen — remplacez-le par le vôtre pour un résultat fidèle.",
  ],
  [
    "Quelle est la différence de net entre cadre et non-cadre ?",
    "À brut égal, un cadre perçoit un net légèrement inférieur : ses cotisations salariales sont plus élevées (≈ 25 % contre ≈ 22 %), principalement à cause de la retraite complémentaire AGIRC-ARRCO et de la prévoyance cadre. Exemple avec ce modèle : 3 000 € brut donnent 2 340 € net avant impôt en non-cadre, contre 2 250 € en cadre.",
  ],
  [
    "Ce résultat est-il exact ? Quelles sont les limites de l'estimation ?",
    "C'est une estimation, pas une fiche de paie. Le modèle applique des taux moyens de charges : il ne tient pas compte de la mutuelle obligatoire, des titres-restaurant, des heures supplémentaires défiscalisées, des primes, des avantages en nature ni des dispositifs particuliers (alsace-moselle, apprentissage, exonérations). Pour un calcul officiel et détaillé, le simulateur mon-entreprise de l'Urssaf fait foi. Notez aussi que le « net à payer avant impôt » calculé ici diffère légèrement du « net imposable », qui réintègre une partie de la CSG non déductible.",
  ],
  [
    "Le convertisseur est-il gratuit ? Mes données sont-elles conservées ?",
    "Oui, il est entièrement gratuit et sans inscription. Votre salaire est traité uniquement dans votre navigateur : aucune donnée n'est envoyée à nos serveurs ni conservée.",
  ],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition";

/** Tableau généré avec le même modèle que le convertisseur (charges : non-cadre 22 %, cadre 25 % ; PAS exemple 7 %). */
const CONVERSIONS: { brut: string; netNonCadre: string; netCadre: string; netApresImpot: string }[] = [
  { brut: "2 000 €", netNonCadre: "1 560 €", netCadre: "1 500 €", netApresImpot: "1 451 €" },
  { brut: "2 500 €", netNonCadre: "1 950 €", netCadre: "1 875 €", netApresImpot: "1 814 €" },
  { brut: "3 000 €", netNonCadre: "2 340 €", netCadre: "2 250 €", netApresImpot: "2 176 €" },
  { brut: "4 000 €", netNonCadre: "3 120 €", netCadre: "3 000 €", netApresImpot: "2 902 €" },
];

export default function SalaireBrutEnNetPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Sans inscription · Résultat instantané
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Salaire Brut en <span className="text-gold-gradient">Net</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Que reste-t-il vraiment de votre salaire brut ?
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Saisissez votre salaire brut, votre statut — <strong>non-cadre, cadre ou fonction publique</strong> —
            et votre taux de prélèvement à la source : vous obtenez votre <strong>net avant et après impôt</strong>,
            par mois et par an. Le résultat se met à jour pendant que vous tapez.
          </p>
        </div>
      </section>

      {/* CALCULATEUR */}
      <SalaireCalculator />

      {/* MÉTHODE */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="La méthode"
            title="Comment passer du brut au net ?"
            sub="Trois étapes, aucune boîte noire : le brut, moins les charges salariales, donne le net avant impôt ; le prélèvement à la source donne ensuite le net réellement versé."
          />
          <div className="grid gap-5 md:grid-cols-3 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Étape 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Les charges salariales</h3>
              <p className="text-stone-600 leading-relaxed">
                Ce sont les cotisations prélevées sur votre salaire (retraite, chômage, CSG/CRDS…). Notre
                estimation utilise des taux moyens : <strong>22 %</strong> du brut en non-cadre,{" "}
                <strong>25 %</strong> en cadre et <strong>17 %</strong> dans la fonction publique.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Étape 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Le net avant impôt</h3>
              <p className="text-stone-600 leading-relaxed">
                Net avant impôt = brut × (1 − taux de charges). C&apos;est le « net à payer avant impôt sur le
                revenu » de votre fiche de paie — à ne pas confondre avec le net imposable, légèrement différent.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Étape 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Le prélèvement à la source</h3>
              <p className="text-stone-600 leading-relaxed">
                Net après impôt = net avant impôt × (1 − taux de PAS). C&apos;est le montant versé sur votre
                compte. Pour l&apos;employeur, il faut encore ajouter les charges patronales (≈ 42 % du brut en
                non-cadre, ≈ 45 % en cadre) : c&apos;est le coût total du poste.
              </p>
            </div>
          </div>

          {/* TABLEAU DE CONVERSION */}
          <div className="mt-14 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-stone-900 text-center">
              Exemples de conversion (par mois)
            </h3>
            <p className="mt-3 text-stone-600 text-center max-w-2xl mx-auto">
              Calculés avec le même modèle que le convertisseur ci-dessus. La dernière colonne applique un
              prélèvement à la source de 7 % au non-cadre, à titre d&apos;exemple.
            </p>
            <div className="mt-8 overflow-x-auto rounded-3xl border border-stone-200">
              <table className="w-full text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-stone-950 text-white">
                    <th className="px-5 py-4 font-bold">Brut mensuel</th>
                    <th className="px-5 py-4 font-bold">Net avant impôt (non-cadre)</th>
                    <th className="px-5 py-4 font-bold">Net avant impôt (cadre)</th>
                    <th className="px-5 py-4 font-bold">Net après impôt à 7 % (non-cadre)</th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSIONS.map((row, i) => (
                    <tr key={row.brut} className={i % 2 === 0 ? "bg-white" : "bg-stone-50"}>
                      <td className="px-5 py-4 font-bold text-stone-900">{row.brut}</td>
                      <td className="px-5 py-4 text-stone-700">{row.netNonCadre}</td>
                      <td className="px-5 py-4 text-stone-700">{row.netCadre}</td>
                      <td className="px-5 py-4 text-stone-700">{row.netApresImpot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-6 text-sm text-stone-500 leading-relaxed">
              <strong className="text-stone-700">Transparence :</strong> ces chiffres sont des estimations
              fondées sur des taux moyens de charges. Votre net réel dépend de votre convention collective, de
              votre mutuelle et des éléments variables de votre paie. Pour un calcul officiel ligne par ligne,
              utilisez le simulateur <strong className="text-stone-700">mon-entreprise de l&apos;Urssaf</strong>,
              qui fait foi.
            </p>
          </div>
        </div>
      </section>

      {/* AUTRES OUTILS */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400">
            Outils gratuits en français
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Continuez avec nos autres outils
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Calculez votre indice de masse corporelle avec notre{" "}
            <Link href="/fr/calcul-imc" className="font-semibold text-orange-400 hover:text-orange-300">
              calcul IMC
            </Link>
            , ou générez une identité fictive complète pour vos tests avec le{" "}
            <Link href="/fr/generateur-de-faux-nom" className="font-semibold text-orange-400 hover:text-orange-300">
              générateur de faux nom
            </Link>
            . Tous nos outils — en français et en anglais — sont réunis dans le{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              hub d&apos;outils
            </Link>
            .
          </p>
        </div>
      </section>

      {/* SERVICES CTA */}
      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Clé en main"
            title="Un outil comme celui-ci sur votre propre site ?"
            sub="WebStore Pro conçoit des sites rapides en développement web Full Stack et des calculateurs sur mesure qui se positionnent sur Google — design, code et SEO dès le premier jour."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Demander un devis gratuit <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              WhatsApp +92 325 8774221
            </a>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            Vous préférez l&apos;e-mail ? <a href="mailto:neilsonsmarry@gmail.com" className="font-semibold text-orange-700 hover:text-orange-800">neilsonsmarry@gmail.com</a>
            {" "}· Ou découvrez nos <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> et nos <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">outils gratuits</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Salaire brut et net : vos questions" />
          <div className="space-y-3">
            {FAQS.map(([q, a]) => (
              <details key={q} className="rounded-2xl border border-stone-200 bg-stone-50/60 open:bg-white open:shadow-md transition group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-6 py-5 font-bold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="px-6 pb-6 text-stone-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href="#top" className={btnPrimary}>
              Convertir mon salaire <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimation indicative à titre d&apos;information générale — elle ne remplace ni une fiche de paie
            ni le simulateur officiel de l&apos;Urssaf.
          </p>
        </div>
      </section>
    </>
  );
}
