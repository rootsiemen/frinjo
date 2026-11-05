import Link from "next/link";
import { SectionHead, Icon } from "@/components/ui";

export const metadata = {
  title: "Outils Gratuits en Français",
  description:
    "8 outils gratuits en français : salaire brut en net, calcul TVA, frais de notaire, intérêts composés, jours entre dates, QR code, faux nom, IMC.",
  keywords: [
    "outils en ligne en français",
    "salaire brut en net",
    "calcul imc",
    "générateur de faux nom",
    "convertisseur salaire",
    "calcul tva",
    "frais de notaire",
    "jours entre deux dates",
    "intérêts composés",
    "générateur de qr code",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr",
    languages: { fr: "https://frinjo.me/fr", es: "https://frinjo.me/es", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Outils Gratuits en Français | WebStore Pro",
    description:
      "Salaire brut en net, générateur de faux nom et calcul IMC — gratuits, sans inscription et en français.",
    url: "https://frinjo.me/fr",
    type: "website",
  },
};

const TOOLS = [
  {
    name: "Salaire Brut en Net",
    href: "/fr/salaire-brut-en-net",
    tag: "Salaire · Paie",
    desc: "Convertissez un salaire brut en net : non-cadre, cadre ou fonction publique, avant et après prélèvement à la source, avec le coût employeur estimé. Mensuel ou annuel, instantané.",
  },
  {
    name: "Générateur de Faux Nom",
    href: "/fr/generateur-de-faux-nom",
    tag: "Générateur · Tests",
    desc: "De fausses identités complètes pour la France, la Belgique, la Suisse et le Québec : nom, adresse locale, téléphone, e-mail temporaire qui reçoit vraiment les messages, mot de passe et profession. Jusqu'à 100 à la fois, export CSV/JSON. Aucun numéro d'identité, par conception.",
  },
  {
    name: "Calcul IMC",
    href: "/fr/calcul-imc",
    tag: "Santé · Forme",
    desc: "Votre indice de masse corporelle selon l'échelle de l'OMS, en unités métriques ou impériales, avec la plage de poids santé pour votre taille exacte et des explications honnêtes sur les limites de l'IMC.",
  },
  {
    name: "Calcul TVA",
    href: "/fr/calcul-tva",
    tag: "Taxes · Facturation",
    desc: "Convertissez HT en TTC et TTC en HT avec les taux français 20 %, 10 %, 5,5 % et 2,1 % (et 8,5 % pour les DOM) : facture multi-lignes et ventilation de la TVA par taux, comme l'exige la facturation.",
  },
  {
    name: "Frais de Notaire",
    href: "/fr/frais-de-notaire",
    tag: "Immobilier · Achat",
    desc: "Estimation poste par poste : droits de mutation (5,81 % ou 5,09 % selon le département, 0,715 % dans le neuf), émoluments au barème officiel dégressif, débours et contribution de sécurité immobilière.",
  },
  {
    name: "Jours Entre Deux Dates",
    href: "/fr/jours-entre-deux-dates",
    tag: "Dates · Délais",
    desc: "Durée totale, jours ouvrés et jours ouvrables entre deux dates — avec le calendrier complet des jours fériés français réellement déduits, fêtes mobiles incluses (Pâques, Ascension, Pentecôte) et option Alsace-Moselle.",
  },
  {
    name: "Intérêts Composés",
    href: "/fr/interets-composes",
    tag: "Épargne · Finance",
    desc: "Projetez votre épargne : capital initial, versements mensuels, capitalisation mensuelle, trimestrielle ou annuelle, graphique année par année et valeur réelle après inflation. Presets Livret A, assurance-vie, PEA.",
  },
  {
    name: "Générateur de QR Code",
    href: "/fr/generateur-de-qr-code",
    tag: "Générateur · Entreprise",
    desc: "QR codes gratuits et sans filigrane : URL, texte, WiFi, contact vCard, WhatsApp, e-mail, téléphone — et le QR de virement SEPA qui pré-remplit le paiement sur vos factures. PNG 1024 px ou SVG.",
  },
];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils en Français", item: "https://frinjo.me/fr" },
  ],
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Outils gratuits en français",
  itemListElement: TOOLS.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    url: `https://frinjo.me${t.href}`,
  })),
};

const card =
  "rounded-3xl border border-stone-200 bg-white p-8 hover:shadow-xl hover:border-orange-200 transition block";

export default function FrHubPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Sans inscription · En français
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Outils en <span className="text-gold-gradient">Français</span>
          </h1>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Des calculateurs pensés pour la France et la francophonie : le salaire net réel derrière un
            brut, la TVA et les frais de notaire au barème officiel, les jours ouvrés avec les jours
            fériés, les intérêts composés, les QR codes de virement SEPA, des identités de test locales
            et l'IMC expliqué sans détour. Tout fonctionne dans votre navigateur.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead eyebrow="Outils" title="Choisissez un outil" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 text-left">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className={card}>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">{t.tag}</p>
                <h2 className="font-display text-xl font-bold text-stone-900 mb-3">{t.name}</h2>
                <p className="text-stone-600 leading-relaxed">{t.desc}</p>
                <p className="mt-4 font-semibold text-orange-700 inline-flex items-center gap-2">
                  Ouvrir <Icon name="arrow" className="w-4 h-4" />
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-center text-stone-500">
            Vous cherchez plus ? Plus de 30 outils gratuits en anglais sont dans le{" "}
            <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">
              centre d'outils
            </Link>
            , et la version espagnole est sur{" "}
            <Link href="/es" className="font-semibold text-orange-700 hover:text-orange-800">
              frinjo.me/es
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
