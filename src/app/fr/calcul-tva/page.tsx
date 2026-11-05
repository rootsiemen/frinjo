import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import TvaCalculator from "./TvaCalculator";

export const metadata = {
  title: "Calcul TVA 2026 — HT vers TTC, Tous Taux",
  description:
    "Calcul TVA gratuit : convertissez HT en TTC et TTC en HT aux taux de 20 %, 10 %, 5,5 % et 2,1 % (8,5 % DOM). Facture multi-lignes, sans inscription.",
  keywords: [
    "calcul TVA",
    "calculer la TVA",
    "HT en TTC",
    "TTC en HT",
    "calcul TVA 20",
    "calcul TVA 10",
    "calcul TVA 5.5",
    "montant TVA",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/calcul-tva",
    languages: {
      fr: "https://frinjo.me/fr/calcul-tva",
      es: "https://frinjo.me/es/calculadora-de-iva",
      "x-default": "https://frinjo.me/es/calculadora-de-iva",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Calcul TVA 2026 — HT ⇄ TTC, tous les taux français | Frinjo",
    description:
      "Ajoutez ou retirez la TVA (20, 10, 5,5, 2,1 %) sur une ligne ou une facture complète, avec ventilation par taux. Gratuit, sans inscription.",
    url: "https://frinjo.me/fr/calcul-tva",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calcul TVA",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/calcul-tva",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculatrice de TVA gratuite pour la France. Pour ajouter la TVA : montant de TVA = prix HT × taux ÷ 100 et TTC = HT + TVA. Pour retirer la TVA d'un prix TTC : HT = TTC ÷ (1 + taux ÷ 100). Taux français 20 % (normal), 10 % (intermédiaire), 5,5 % (réduit), 2,1 % (super-réduit) et 8,5 % (Guadeloupe, Martinique, La Réunion). Factures multi-lignes avec un taux par ligne et ventilation de la TVA par taux, comme l'exige la facturation. Tous les calculs sont effectués dans le navigateur ; aucune donnée n'est envoyée ni conservée.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Calcul TVA", item: "https://frinjo.me/fr/calcul-tva" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Comment calculer la TVA à partir d'un prix HT ?",
    "Multipliez le prix hors taxes par le taux : TVA = HT × taux ÷ 100, puis TTC = HT + TVA. Exemple au taux normal de 20 % : un produit à 100 € HT donne 20 € de TVA et un prix final de 120 € TTC. Cette calculatrice fait l'opération ligne par ligne si votre facture mélange plusieurs taux.",
  ],
  [
    "Comment retrouver le HT à partir d'un prix TTC ?",
    "Divisez le prix TTC par (1 + taux ÷ 100). Exemple : 120 € TTC au taux de 20 % → 120 ÷ 1,20 = 100 € HT, et la TVA contenue est de 20 €. L'erreur classique consiste à retirer 20 % du TTC (120 − 24 = 96 €), ce qui est faux : le taux s'applique au HT, pas au TTC.",
  ],
  [
    "Quels sont les taux de TVA en France en 2026 ?",
    "Quatre taux en métropole : 20 % (taux normal, la majorité des biens et services), 10 % (taux intermédiaire : restauration, transports de voyageurs, travaux dans les logements anciens…), 5,5 % (taux réduit : produits alimentaires, livres, abonnements d'énergie, travaux de rénovation énergétique…) et 2,1 % (taux super-réduit : presse, médicaments remboursables…). En Guadeloupe, Martinique et à La Réunion, le taux normal est de 8,5 % ; la Guyane et Mayotte sont hors champ de TVA (0 %). En Corse, certains produits ont des taux particuliers (ex. 10 % au lieu de 20 % pour plusieurs catégories).",
  ],
  [
    "Auto-entrepreneur : dois-je calculer la TVA ?",
    "En franchise en base de TVA (le régime de départ de la micro-entreprise), vous ne facturez pas la TVA : vos factures portent la mention « TVA non applicable, art. 293 B du CGI » et vos prix sont directement des prix nets. Dès que vous dépassez les seuils de la franchise (91 900 € pour les ventes, 36 800 € pour les services, chiffres 2024–2026) ou que vous optez pour le régime réel, vous facturez la TVA au taux de votre activité — c'est là que cette calculatrice devient quotidienne.",
  ],
  [
    "Pourquoi ventiler la TVA par taux sur une facture ?",
    "Parce que l'administration l'exige : une facture qui mélange des produits à 5,5 % et à 20 % doit indiquer, pour chaque taux, la base HT et le montant de TVA correspondant. La ventilation affichée sous les totaux de cette calculatrice reprend exactement ces deux colonnes, prêtes à reporter dans votre logiciel ou votre tableur.",
  ],
  [
    "La calculatrice est-elle gratuite ? Mes montants sont-ils conservés ?",
    "Oui, elle est gratuite et sans inscription. Tous les calculs se font dans votre navigateur : les montants de vos factures ne sont ni envoyés à un serveur ni conservés. Fermez la page, il n'en reste aucune trace.",
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

export default function CalculTvaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Sans inscription · Tous les taux
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calcul <span className="text-gold-gradient">TVA</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            HT → TTC et TTC → HT, ligne par ligne
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Ajoutez ou retirez la TVA avec les taux français — 20 %, 10 %, 5,5 %, 2,1 % et 8,5 % pour les
            DOM — construisez votre facture ligne par ligne et obtenez la <strong>ventilation par taux</strong>{" "}
            prête à recopier.
          </p>
        </div>
      </section>

      <TvaCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Les deux formules de la TVA"
            sub="Tout le calcul tient en deux formules. La calculatrice les applique à chaque ligne, avec l'arrondi au centime qu'utilise toute facture."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Ajouter la TVA</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">TVA = HT × taux ÷ 100</h3>
              <p className="text-stone-600 leading-relaxed">
                Vous partez de votre prix net. 100 € HT au taux normal donnent 20 € de TVA et 120 € TTC.
                C&apos;est le sens « facturation » : la taxe s&apos;ajoute <strong>sur</strong> votre prix.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Retirer la TVA</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">HT = TTC ÷ (1 + taux ÷ 100)</h3>
              <p className="text-stone-600 leading-relaxed">
                Vous partez d&apos;un prix affiché. 120 € TTC à 20 % cachent 100 € HT et 20 € de TVA. Ne
                retirez jamais le pourcentage du total : ce raccourci sous-évalue le HT et fausse la TVA
                déductible.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Plusieurs taux</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Une ligne = un taux</h3>
              <p className="text-stone-600 leading-relaxed">
                Alimentation à 5,5 %, prestation à 20 %, transport à 10 % : chaque ligne garde son taux et
                le récapitulatif ventile base HT et TVA par taux, comme l&apos;exige une facture conforme.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">DOM et Corse</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">8,5 % et taux particuliers</h3>
              <p className="text-stone-600 leading-relaxed">
                Le taux normal est de 8,5 % en Guadeloupe, Martinique et à La Réunion ; la Guyane et
                Mayotte sont à 0 %. Un taux libre peut être saisi pour tout cas particulier, Corse comprise.
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
            La TVA réglée, le reste de vos chiffres aussi
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Pour un achat immobilier, estimez les <strong className="text-white">frais de notaire</strong> avec
            le vrai barème ; pour votre épargne, projetez vos <strong className="text-white">intérêts
            composés</strong> ; et pour un départ ou des congés, comptez les{" "}
            <strong className="text-white">jours entre deux dates</strong> avec les jours fériés français
            inclus.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/fr/frais-de-notaire" className="font-semibold text-orange-400 hover:text-orange-300">
              Frais de notaire
            </Link>{" "}
            ·{" "}
            <Link href="/fr/interets-composes" className="font-semibold text-orange-400 hover:text-orange-300">
              Intérêts composés
            </Link>{" "}
            ·{" "}
            <Link href="/fr/jours-entre-deux-dates" className="font-semibold text-orange-400 hover:text-orange-300">
              Jours entre deux dates
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
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur la TVA, tranchées" />
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
              Calculer ma TVA <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Cette calculatrice fournit une information générale, pas un conseil fiscal. Pour votre situation,
            rapprochez-vous de votre expert-comptable ou de l&apos;administration fiscale.
          </p>
        </div>
      </section>
    </>
  );
}
