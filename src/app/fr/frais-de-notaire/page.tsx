import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import NotaireCalculator from "./NotaireCalculator";

export const metadata = {
  title: "Frais de Notaire 2026 — Calculatrice Ancien et Neuf, Détail Complet | Frinjo",
  description:
    "Calculatrice de frais de notaire gratuite : droits de mutation (5,81 % ou 5,09 % selon le département, 0,715 % dans le neuf), émoluments au barème officiel, débours et contribution de sécurité immobilière, détaillés poste par poste. Estimation sans inscription.",
  keywords: [
    "frais de notaire",
    "calculatrice frais de notaire",
    "calcul frais de notaire",
    "frais de notaire ancien",
    "frais de notaire neuf",
    "droits de mutation",
    "émoluments notaire",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/frais-de-notaire",
    languages: { fr: "https://frinjo.me/fr/frais-de-notaire", es: "https://frinjo.me/es/calculadora-de-hipoteca", en: "https://frinjo.me/tools" },
  },
  openGraph: {
    title: "Frais de Notaire 2026 — Ancien & Neuf, Détail Poste par Poste | Frinjo",
    description:
      "Estimez vos frais de notaire avec le vrai barème : droits de mutation par département, émoluments dégressifs, débours, CSI. Gratuit, sans inscription.",
    url: "https://frinjo.me/fr/frais-de-notaire",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculatrice Frais de Notaire",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/frais-de-notaire",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Estimation des frais de notaire (frais d'acquisition) en France à partir des barèmes officiels. Droits de mutation : 5,80665 % du prix dans l'ancien au taux départemental standard (département 4,50 %, commune 1,20 %, frais d'assiette 2,37 % de la part départementale), 5,09006 % dans les départements à taux réduit (part départementale 3,80 %), 0,715 % dans le neuf (frais réduits). Émoluments proportionnels du notaire au barème dégressif (3,870 % jusqu'à 6 500 €, 1,596 % jusqu'à 17 000 €, 1,064 % jusqu'à 60 000 €, 0,799 % au-delà) plus TVA de 20 %. Débours estimés forfaitairement à 1 200 € et contribution de sécurité immobilière de 0,10 % du prix (minimum 15 €). Frais de garantie du prêt (PPD) estimés à environ 0,9 % du montant emprunté lorsqu'un prêt est indiqué. Résultat indicatif : seul le décompte définitif établi par le notaire fait foi.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Frais de Notaire", item: "https://frinjo.me/fr/frais-de-notaire" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Combien représentent les frais de notaire pour un bien à 200 000 € ?",
    "Dans l'ancien au régime standard : environ 15 408 €, soit 7,7 % du prix. Le détail : 11 613 € de droits de mutation (5,81 %), 2 394 € d'émoluments TTC (1 995 € HT au barème + 20 % de TVA), 200 € de contribution de sécurité immobilière et environ 1 200 € de débours. Dans le neuf, les mêmes 200 000 € donnent environ 5 224 € de frais (2,6 %), car les droits tombent à 0,715 %. Faites le calcul exact avec vos chiffres ci-dessus.",
  ],
  [
    "Que paie-t-on vraiment dans les « frais de notaire » ?",
    "Pour l'essentiel… des impôts. Sur un achat ancien, environ les trois quarts des frais sont des taxes reversées à l'État et aux collectivités (droits de mutation, contribution de sécurité immobilière). La rémunération du notaire — les émoluments, calculés au barème national dégressif, TVA de 20 % en plus — représente autour de 15 %, et les débours remboursent les documents et formalités qu'il a avancés pour vous (état hypothécaire, géomètre, cadastre…).",
  ],
  [
    "Pourquoi les frais sont-ils réduits dans le neuf ?",
    "Parce que l'acheteur d'un logement neuf (ou en VEFA) paie la TVA sur le prix de vente — déjà incluse dans le prix affiché — et bénéficie en échange de droits de mutation réduits à 0,715 % au lieu de 5,81 %. Au total, les frais d'acquisition dans le neuf tournent autour de 2 à 3 % du prix, contre 7 à 8 % dans l'ancien. Attention : un bien revendu par un particulier, même récent, est de l'« ancien » pour les droits.",
  ],
  [
    "Quels départements appliquent le taux réduit de droits ?",
    "La plupart des départements ont porté leur part à 4,50 % (total 5,81 %). Quelques-uns sont restés à 3,80 % (total 5,09 %) : notamment l'Indre, l'Isère, le Morbihan et Mayotte. Sur 200 000 €, l'écart vaut environ 1 433 € — d'où le sélecteur de régime dans cette calculatrice. Le taux qui compte est celui du département où se situe le bien, pas celui de votre domicile.",
  ],
  [
    "Les frais de garantie du prêt sont-ils inclus ?",
    "Uniquement si vous indiquez un montant de prêt : la calculatrice ajoute alors une estimation des frais de garantie en privilège de prêteur de deniers (PPD), autour de 0,9 % du prêt. Une hypothèque classique coûte plutôt 1,5 à 2 %, et une garantie par organisme de caution (type Crédit Logement) suit un autre barème avec restitution partielle en fin de prêt. Le montant exact dépend de votre banque et de votre dossier.",
  ],
  [
    "Cette estimation remplace-t-elle le calcul du notaire ?",
    "Non. Elle applique les barèmes officiels en vigueur et des forfaits réalistes pour les débours, mais seuls le notaire connaît les pièces exactes de votre vente (état hypothécaire, nombre d'actes, situation du bien). Servez-vous du résultat pour budgéter votre acquisition — comptez une marge — puis demandez le décompte prévisionnel à l'étude avant de signer le compromis.",
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

export default function FraisDeNotairePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Barème officiel · Détail complet
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Frais de <span className="text-gold-gradient">Notaire</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Ancien ou neuf : chaque poste, expliqué et chiffré
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Droits de mutation selon votre département, émoluments au barème dégressif officiel, débours et
            contribution de sécurité immobilière : une estimation <strong>poste par poste</strong>, pas un
            simple pourcentage sorti d&apos;un chapeau.
          </p>
        </div>
      </section>

      <NotaireCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Comment ça marche"
            title="De quoi se composent les frais d'acquisition"
            sub="Quatre postes, dont un seul rémunère vraiment le notaire. Voici le rôle de chacun."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Poste n° 1 — le plus gros</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Droits de mutation : 5,81 %, 5,09 % ou 0,715 %</h3>
              <p className="text-stone-600 leading-relaxed">
                Dans l&apos;ancien : 4,50 % pour le département, 1,20 % pour la commune et les frais
                d&apos;assiette — 5,80665 % au total, ou 5,09006 % dans les départements restés à 3,80 %.
                Dans le neuf : 0,715 % seulement. C&apos;est le poste qui fait toute la différence.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Poste n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Émoluments : le barème dégressif national</h3>
              <p className="text-stone-600 leading-relaxed">
                La rémunération du notaire suit un barème unique en France : 3,870 % sur les premiers
                6 500 €, puis 1,596 %, 1,064 % et 0,799 % au-delà de 60 000 €, plus 20 % de TVA. Pour
                200 000 € : 1 995 € HT, soit 2 394 € TTC — loin des 15 000 € de frais totaux.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Poste n° 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Débours : environ 1 200 €</h3>
              <p className="text-stone-600 leading-relaxed">
                Le notaire avance des frais pour votre dossier — documents d&apos;urbanisme, état
                hypothécaire, géomètre, extraits cadastraux — et vous les refacture au réel. L&apos;estimation
                retient un forfait de 1 200 €, dans la fourchette habituelle de 800 à 1 500 €.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Poste n° 4</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Contribution de sécurité immobilière : 0,10 %</h3>
              <p className="text-stone-600 leading-relaxed">
                Une taxe de 0,10 % du prix (15 € minimum) qui finance le service de publicité foncière —
                l&apos;enregistrement officiel de votre titre de propriété.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Outils en français
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Après les frais, le crédit et la TVA
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Le budget complet d&apos;un achat passe aussi par la mensualité : notre outil en espagnol de{" "}
            <strong className="text-white">calcul d&apos;hypothèque</strong> donne le tableau
            d&apos;amortissement, et le <strong className="text-white">calcul TVA</strong> sert vos
            factures si vous achetez via une activité. Pour le vendeur comme pour l&apos;acheteur, comptez
            aussi les <strong className="text-white">jours entre deux dates</strong> avec les jours fériés.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/fr/calcul-tva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calcul TVA
            </Link>{" "}
            ·{" "}
            <Link href="/fr/jours-entre-deux-dates" className="font-semibold text-orange-400 hover:text-orange-300">
              Jours entre deux dates
            </Link>{" "}
            ·{" "}
            <Link href="/fr/interets-composes" className="font-semibold text-orange-400 hover:text-orange-300">
              Intérêts composés
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
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur les frais de notaire" />
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
              Estimer mes frais <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Estimation indicative à partir des barèmes en vigueur ; seul le décompte définitif de votre
            notaire fait foi.
          </p>
        </div>
      </section>
    </>
  );
}
