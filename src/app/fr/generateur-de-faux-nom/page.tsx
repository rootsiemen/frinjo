import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import FauxNom from "./FauxNom";

const SELF = "https://frinjo.me/fr/generateur-de-faux-nom";

export const metadata = {
  title: "Générateur de Faux Nom — Identité Test",
  description:
    "Générateur de faux nom gratuit : identités de test complètes pour la France, la Belgique, la Suisse et le Québec. Jusqu'à 100 par lot, export CSV/JSON.",
  keywords: ["générateur de faux nom", "fausse identité", "générateur de nom aléatoire", "faux nom", "données de test", "générateur de personne fictive"],
  alternates: {
    canonical: SELF,
    languages: {
      fr: "https://frinjo.me/fr/generateur-de-faux-nom",
      en: "https://frinjo.me/fake-name-generator",
      es: "https://frinjo.me/es/generador-de-identidad-falsa",
      "x-default": "https://frinjo.me/fake-name-generator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Générateur de Faux Nom — Fausses Identités de Test Complètes | Frinjo",
    description:
      "Nom, adresse, téléphone, e-mail avec vraie boîte de réception, date de naissance et profession — France, Belgique, Suisse, Québec, jusqu'à 100 par lot, sans limites. Par WebStore Pro.",
    url: SELF,
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Générateur de Faux Nom",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: SELF,
  inLanguage: "fr",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Génère de fausses identités de test pour la France, la Belgique, la Suisse et le Canada (Québec). Chaque identité complète contient un prénom et un nom de famille des pools francophones, une adresse au format réel du pays (numéro et type de voie en France, codes postaux par ville : Paris 750xx, Lyon 690xx, Marseille 130xx, Nantes 440xx, Lille 59xxx, Bordeaux 330xx ; 1000-4000 en Belgique, 1000-8000 en Suisse, codes postaux alphanumériques H/G/J au Québec), un téléphone au format mobile national (+33 06/07, +32 4XX, +41 7X, +1 avec indicatifs québécois 514/418/450/819), un e-mail sur des domaines propres de courrier temporaire (abahi.tech, abahi.page, abahi.me — les domaines de tempmaill.tech, avec boîte publique consultable sur la même page et supprimée après une heure), un nom d'utilisateur, un mot de passe de 12 caractères généré avec un hasard cryptographique (crypto.getRandomValues), une date de naissance entre 1958 et 2005 avec l'âge calculé, une profession et une entreprise avec la forme juridique locale (SAS/SARL, SRL, Sàrl, Inc./Ltée). Lots de 1 à 100 sans limite quotidienne ; export CSV, JSON ou TXT ; modes noms seuls (complets, prénoms ou noms). Tout est généré dans le navigateur du visiteur : rien n'est transmis ni stocké. Par conception, l'outil ne génère jamais de numéro d'identité national (NIR, numéro national), de numéro fiscal ni de numéro de carte bancaire.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Générateur de Faux Nom", item: SELF },
  ],
};

const FAQS: [string, string][] = [
  [
    "Les identités générées sont-elles de vraies personnes ?",
    "Non. Chaque identité est une combinaison aléatoire de prénoms, de noms, de rues et de villes fréquents : elle ne correspond à aucune personne réelle. Un nom courant associé à une vraie ville peut ressembler par hasard à quelqu'un, et c'est exactement pour cela que les e-mails vivent sur des domaines temporaires à boîte publique supprimée après une heure, et qu'aucun numéro de document n'est jamais généré.",
  ],
  [
    "Quels pays sont pris en charge ?",
    "Quatre, chacun avec ses propres pools de noms, formats d'adresse, téléphones et plages de codes postaux : la France, la Belgique, la Suisse (villes romandes et grandes villes) et le Canada (Québec, avec ses codes postaux alphanumériques et les noms québécois). C'est le premier générateur du genre entièrement en français : les résultats de recherche français ne proposaient jusqu'ici que des outils en anglais.",
  ],
  [
    "Combien d'identités puis-je générer ? Y a-t-il une limite ?",
    "Jusqu'à 100 par clic, autant de clics que vous voulez : aucune limite quotidienne et aucune inscription, contrairement aux générateurs connus qui limitent les invités. Exportez n'importe quel lot en CSV, JSON ou TXT pour alimenter des bases de développement et des jeux de test.",
  ],
  [
    "À quoi peut servir une fausse identité ?",
    "À tester des logiciels et des formulaires, alimenter des bases de données de développement, créer des maquettes et des prototypes, illustrer une documentation, servir d'exemple en classe et inventer des personnages de fiction. Elle ne doit jamais servir à usurper l'identité de quelqu'un, ouvrir de vrais comptes ou transmettre de fausses informations à des systèmes officiels : c'est une fraude.",
  ],
  [
    "Les adresses e-mail générées reçoivent-elles vraiment des messages ?",
    "Oui, volontairement. Chaque e-mail est sur l'un de nos domaines Temp Mail (abahi.tech, abahi.page, abahi.me), donc un code de vérification ou un message de test envoyé à cette adresse arrive réellement : chaque carte d'identité a un bouton de boîte de réception, et le message s'ouvre sur cette même page. Deux avertissements : cette boîte est publique (toute personne qui connaît l'adresse peut la lire) et elle s'efface après une heure — n'utilisez donc jamais une identité générée pour quoi que ce soit de privé, de financier ou d'important.",
  ],
  [
    "Mes données sont-elles stockées ou envoyées à un serveur ?",
    "Non. La génération se fait entièrement dans votre navigateur avec la Web Crypto API (crypto.getRandomValues), le même hasard cryptographique que notre générateur de mots de passe. Vos identités ne quittent jamais votre appareil, sauf si vous les téléchargez vous-même.",
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
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition block";

export default function GenerateurFauxNomPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Outil gratuit · Aucune limite quotidienne · Export CSV / JSON
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Générateur de <span className="text-gold-gradient">Faux Nom</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Pas seulement des noms : la <strong>fausse identité de test complète</strong> — nom, adresse, téléphone,
            e-mail, nom d&apos;utilisateur, mot de passe, date de naissance, profession et entreprise, aux formats réels
            de la France, de la Belgique, de la Suisse et du Québec. Jusqu&apos;à 100 par lot et aucune limite
            quotidienne : parfait pour tester des formulaires, alimenter des bases de développement et créer des
            maquettes.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 text-sm font-semibold text-stone-600">
            {["Identité complète, pas que des noms", "4 pays francophones", "Jusqu'à 100 par lot", "Aucun numéro d'identité / aucune carte — jamais"].map((chip) => (
              <span key={chip} className="rounded-full bg-white border border-stone-200 px-4 py-2">{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <FauxNom />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Continuer à explorer"
            title="Plus d'outils en français"
            sub="Calculateurs et générateurs gratuits de Frinjo en français, sans inscription et sans limites."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-left">
            <Link href="/fr/salaire-brut-en-net" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Salaire Brut en Net</h3>
              <p className="text-stone-600 leading-relaxed">Convertissez un salaire brut en net (et l&apos;inverse) pour salarié du privé, cadre ou fonction publique.</p>
            </Link>
            <Link href="/fr/calcul-imc" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Calcul IMC</h3>
              <p className="text-stone-600 leading-relaxed">Votre indice de masse corporelle sur l&apos;échelle de l&apos;OMS, avec la fourchette de poids santé pour votre taille.</p>
            </Link>
            <Link href="/fake-name-generator" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Version anglaise</h3>
              <p className="text-stone-600 leading-relaxed">Le générateur original avec des données pour les États-Unis, le Royaume-Uni, le Canada, l&apos;Australie et le Pakistan.</p>
            </Link>
            <Link href="/tools" className={card}>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-2">Tous les outils</h3>
              <p className="text-stone-600 leading-relaxed">Plus de 25 calculateurs et générateurs gratuits dans le centre d&apos;outils de Frinjo.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="WebStore Pro"
            title="Il vous faut des données de test… ou un site complet ?"
            sub="Nous créons des sites web Full Stack et des outils comme celui-ci pour les entreprises et les créateurs : développement web complet, rapide et prêt pour le SEO dès le premier jour."
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
            {" "}· Plus d&apos;outils gratuits : <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">tous les calculateurs et outils</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur le générateur, répondues" />
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
              Générer des identités <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
