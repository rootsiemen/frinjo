import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import QrGenerator from "./QrGenerator";

export const metadata = {
  title: "Générateur de QR Code Gratuit — URL, WiFi, vCard, Virement SEPA | Frinjo",
  description:
    "Générateur de QR code gratuit et sans filigrane : liens, texte, WiFi, contacts vCard, WhatsApp, e-mail, téléphone et QR de virement SEPA pour vos factures. Téléchargement PNG haute résolution ou SVG vectoriel, sans inscription.",
  keywords: [
    "générateur de qr code",
    "créer un qr code gratuit",
    "qr code wifi",
    "qr code virement sepa",
    "qr code facture",
    "qr code vcard",
    "générateur qr code sans filigrane",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/generateur-de-qr-code",
    languages: { fr: "https://frinjo.me/fr/generateur-de-qr-code", es: "https://frinjo.me/es/generador-de-codigos-qr", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Générateur de QR Code Gratuit — Dont Virement SEPA | Frinjo",
    description:
      "QR pour URL, WiFi, vCard, WhatsApp et virements SEPA pré-remplis. PNG 1024 px ou SVG, sans filigrane, sans inscription, 100 % navigateur.",
    url: "https://frinjo.me/fr/generateur-de-qr-code",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Générateur de QR Code",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/generateur-de-qr-code",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Générateur de QR codes gratuit fonctionnant entièrement dans le navigateur (bibliothèque qrcode, génération locale, aucun serveur). Types : URL (https:// ajouté si absent), texte libre, WiFi au format standard WIFI:T:WPA;S:ssid;P:mot de passe;; (WPA/WEP/réseau ouvert, réseau masqué), carte de contact vCard 3.0, QR de virement SEPA au format européen EPC069-12 (BCD, version 002, SCT : bénéficiaire, IBAN, montant optionnel et objet jusqu'à 140 caractères, pré-rempli dans l'application bancaire du payeur), lien WhatsApp wa.me avec message pré-rempli, e-mail mailto avec objet et corps, et appel tel:. Personnalisation des couleurs, aperçu instantané, téléchargement PNG 1024 px ou SVG vectoriel, sans filigrane ni inscription. Les codes sont statiques : le contenu est codé directement dans le QR, sans expiration ni intermédiaire.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Générateur de QR Code", item: "https://frinjo.me/fr/generateur-de-qr-code" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Comment fonctionne le QR de virement SEPA ?",
    "Il suit la norme européenne EPC069-12 : le code contient les lignes BCD / 002 / 1 / SCT, puis le nom du bénéficiaire, son IBAN, le montant (optionnel) et l'objet. Quand votre client le scanne avec l'application de sa banque, un virement pré-rempli s'ouvre : il n'a plus qu'à valider. C'est l'arme des factures qui se font payer vite — plus de RIB recopié à la main, plus d'erreur de saisie. Laissez le montant vide si le payeur doit le choisir lui-même.",
  ],
  [
    "Le QR code expire-t-il ?",
    "Non. Les codes créés ici sont STATIQUES : le contenu est codé directement dans les modules du QR, sans serveur intermédiaire. Ils fonctionnent tant que le contenu reste valable (votre page en ligne, votre mot de passe WiFi inchangé, votre IBAN actif). Ce sont les QR « dynamiques » des plateformes par abonnement qui s'éteignent quand vous cessez de payer — pas ceux-ci.",
  ],
  [
    "Puis-je l'utiliser pour mon entreprise (menus, cartes, factures) ?",
    "Oui, librement et sans filigrane. Usages fréquents : menu de restaurant (QR vers votre carte en ligne), carte de visite (vCard enregistrée comme contact au scan), WiFi d'un commerce, vitrine (QR WhatsApp) et factures (QR de virement SEPA). Pour l'impression professionnelle, téléchargez le SVG : il est vectoriel et se prête à toutes les tailles sans perte.",
  ],
  [
    "Quel format télécharger pour imprimer ?",
    "Le PNG 1024 px suffit pour les cartes et flyers. Le SVG s'impose pour les affiches, vitrines et tout envoi chez un imprimeur. Dans tous les cas : conservez une marge blanche autour du code (la zone de silence), évitez les fonds foncés ou brillants, et testez le scan sur l'épreuve finale avant un tirage en nombre.",
  ],
  [
    "Pourquoi mon QR code ne se scanne-t-il pas ?",
    "Trois causes dominent : le manque de contraste (code clair sur fond foncé ou couleurs proches — la règle est code sombre sur fond clair) ; un contenu trop long, qui produit un QR très dense, illisible en petit format — raccourcissez l'URL ; et une impression trop petite (comptez 3–4 cm de côté minimum pour un code chargé). Testez toujours avec deux téléphones différents avant de publier.",
  ],
  [
    "Mes données (IBAN, mot de passe WiFi) sont-elles envoyées quelque part ?",
    "Non. La génération se fait à 100 % dans votre navigateur avec une bibliothèque locale : ni l'IBAN de vos QR de virement, ni votre mot de passe WiFi, ni vos contacts ne quittent votre appareil. Le générateur fonctionne même connexion coupée. Notez seulement qu'un QR de virement affiche son contenu à quiconque le scanne — c'est son principe même.",
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

export default function GenerateurQrCodePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Sans filigrane · Sans expiration
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Générateur de <span className="text-gold-gradient">QR Code</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            URL, WiFi, vCard — et le virement SEPA pour vos factures
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Huit types de codes, couleurs personnalisables, téléchargement{" "}
            <strong>PNG 1024 px ou SVG vectoriel</strong>. Le type que les autres générateurs oublient : le{" "}
            <strong>QR de virement SEPA</strong>, qui pré-remplit le paiement dans la banque de vos clients.
          </p>
        </div>
      </section>

      <QrGenerator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Les types qu'une entreprise utilise vraiment"
            sub="Chaque type encode le format standard que les téléphones et les banques comprennent déjà : au scan, l'action se fait toute seule."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Virement SEPA</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Des factures payées sans recopier un RIB</h3>
              <p className="text-stone-600 leading-relaxed">
                Norme européenne EPC069-12 : bénéficiaire, IBAN, montant et objet voyagent dans le QR.
                Votre client scanne, son application bancaire pré-remplit le virement, il valide. Zéro
                erreur de saisie, des délais de paiement qui raccourcissent.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">WiFi</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Vos clients se connectent sans demander la clé</h3>
              <p className="text-stone-600 leading-relaxed">
                Le QR contient le nom du réseau et le mot de passe au format standard : au scan, le
                téléphone propose de rejoindre le réseau. Parfait pour cafés, cabinets, locations et bureaux.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">vCard</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">La carte de visite qui entre dans l'agenda</h3>
              <p className="text-stone-600 leading-relaxed">
                Nom, entreprise, fonction, téléphone, e-mail et site au format vCard 3.0 : un scan suffit
                pour vous enregistrer comme contact, sans papier qui se perd.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">WhatsApp & URL</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">De la vitrine à la conversation</h3>
              <p className="text-stone-600 leading-relaxed">
                Un lien wa.me avec message pré-rempli pour les demandes de devis, ou n&apos;importe quelle
                URL : menu, avis Google, page de réservation. Plus le contenu est court, plus le code se
                scanne facilement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Outils en français et en espagnol
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            La version espagnole pour vos clients hispanophones
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Le <strong className="text-white">generador de códigos QR</strong> en espagnol couvre les mêmes
            types (URL, WiFi, vCard, WhatsApp…). Et pour vos chiffres d&apos;entreprise : le{" "}
            <strong className="text-white">calcul TVA</strong> et les{" "}
            <strong className="text-white">frais de notaire</strong> détaillés.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/generador-de-codigos-qr" className="font-semibold text-orange-400 hover:text-orange-300">
              Generador de códigos QR (ES)
            </Link>{" "}
            ·{" "}
            <Link href="/fr/calcul-tva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calcul TVA
            </Link>{" "}
            ·{" "}
            <Link href="/fr/frais-de-notaire" className="font-semibold text-orange-400 hover:text-orange-300">
              Frais de notaire
            </Link>{" "}
            ·{" "}
            <Link href="/tools" className="font-semibold text-orange-400 hover:text-orange-300">
              Tous les outils
            </Link>
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-orange-50 dot-grid">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHead
            eyebrow="Fait pour vous"
            title="Vous voulez un outil comme celui-ci sur votre site ?"
            sub="WebStore Pro crée des sites rapides de Développement Web Full Stack et des calculateurs sur mesure qui se positionnent : conçus, développés et prêts pour le SEO dès le premier jour."
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className={btnPrimary}>
              Demandez votre devis gratuit <Icon name="arrow" className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/923258774221" target="_blank" rel="noopener noreferrer" className={btnOutline}>
              WhatsApp +92 325 8774221
            </a>
          </div>
          <p className="mt-5 text-sm text-stone-500">
            Vous préférez l&apos;e-mail ? <a href="mailto:neilsonsmarry@gmail.com" className="font-semibold text-orange-700 hover:text-orange-800">neilsonsmarry@gmail.com</a>
            {" "}· Ou découvrez nos <Link href="/services" className="font-semibold text-orange-700 hover:text-orange-800">services</Link> et <Link href="/tools" className="font-semibold text-orange-700 hover:text-orange-800">outils gratuits</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur les QR codes" />
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
              Créer mon QR code <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
