import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import InteretsCalculator from "./InteretsCalculator";

export const metadata = {
  title: "Intérêts Composés — Versements Mensuels",
  description:
    "Calculatrice d'intérêts composés gratuite : versements mensuels, capitalisation mensuelle à annuelle, valeur réelle après inflation. Sans inscription.",
  keywords: [
    "intérêts composés",
    "calculatrice intérêts composés",
    "simulateur épargne",
    "intérêt composé",
    "versements mensuels épargne",
    "livret a intérêts",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/interets-composes",
    languages: {
      fr: "https://frinjo.me/fr/interets-composes",
      en: "https://frinjo.me/compound-interest-calculator",
      "x-default": "https://frinjo.me/compound-interest-calculator",
    },
  },
  openGraph: {
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "WebStore Pro — Frinjo" }],
    title: "Intérêts Composés — Simulateur d'Épargne Complet | Frinjo",
    description:
      "Projetez votre épargne : versements mensuels, fréquence de capitalisation, courbe de croissance et pouvoir d'achat réel après inflation. Gratuit.",
    url: "https://frinjo.me/fr/interets-composes",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calculatrice d'Intérêts Composés",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/interets-composes",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Simulation d'épargne à intérêts composés : valeur future = P(1 + r/n)^(n·t) + versement périodique × [((1 + r/n)^(n·t) − 1) ÷ (r/n)], versements en fin de période, avec capitalisation annuelle, trimestrielle ou mensuelle et versements mensuels convertis à la fréquence choisie. Affiche le total versé, les intérêts cumulés, la part des intérêts dans la valeur finale, un tableau et un graphique année par année, ainsi que la valeur réelle après inflation (valeur future ÷ (1 + inflation)^années). Presets indicatifs et modifiables : Livret A / LDDS, assurance-vie en fonds euros, PEA / ETF monde. Projection brute, avant la fiscalité propre à chaque produit. Calcul effectué dans le navigateur.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Intérêts Composés", item: "https://frinjo.me/fr/interets-composes" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Comment fonctionnent les intérêts composés ?",
    "Chaque période, les intérêts sont calculés sur le capital ET sur les intérêts déjà gagnés : votre argent produit de l'argent qui produit de l'argent. La formule : valeur = P × (1 + r/n)^(n·t), où P est le capital, r le taux annuel, n le nombre de capitalisations par an et t les années. Exemple de référence : 10 000 € à 5 % pendant 10 ans, sans versement, donnent 16 288,95 € — contre 15 000 € en intérêts simples. L'écart grandit avec le temps : c'est la durée, plus que le taux, qui fait la magie.",
  ],
  [
    "Que changent les versements mensuels au résultat ?",
    "Énormément, parce qu'ils alimentent la machine en continu. Avec 10 000 € de départ à 5 % sur 20 ans, vous arrivez à environ 26 533 €. Ajoutez 200 € par mois (capitalisation mensuelle) et la valeur finale atteint 109 333 €, dont 51 333 € d'intérêts — alors que vous n'avez versé que 58 000 € au total. Testez-le ci-dessus : le graphique sépare vos versements (gris) des intérêts (orange) année par année.",
  ],
  [
    "Livret A, assurance-vie, PEA : quel taux saisir ?",
    "Celui de votre produit, en sachant qu'il évolue : le taux du Livret A est fixé par les pouvoirs publics et change (les presets de cette page sont des exemples modifiables, pas des taux garantis) ; un fonds euros d'assurance-vie rapporte le taux servi chaque année par l'assureur ; un PEA investi en ETF monde suit les marchés — la moyenne historique longue des actions mondiales tourne autour de 7 % par an, avec de fortes variations annuelles qu'un taux fixe ne reproduit pas. Pour un marché, considérez le résultat comme une trajectoire moyenne, jamais comme une promesse.",
  ],
  [
    "Pourquoi afficher une valeur « après inflation » ?",
    "Parce que 109 333 € dans 20 ans n'achèteront pas ce que 109 333 € achètent aujourd'hui. Avec 2 % d'inflation annuelle, la valeur réelle de cette somme est d'environ 73 578 € en pouvoir d'achat actuel. C'est aussi le test d'un placement : un produit à 2 % quand l'inflation est à 2 % maintient votre pouvoir d'achat sans l'augmenter. La calculatrice affiche les deux valeurs, nominale et réelle.",
  ],
  [
    "La fiscalité est-elle incluse dans la projection ?",
    "Non, et elle dépend entièrement du produit : le Livret A et le LDDS sont exonérés d'impôt et de prélèvements sociaux ; l'assurance-vie est imposée aux retraits selon son ancienneté (avec des abattements après 8 ans) ; le PEA échappe à l'impôt sur le revenu après 5 ans mais reste soumis aux prélèvements sociaux de 17,2 %. La projection est donc brute : pour comparer deux produits, appliquez ensuite le régime de chacun, ou raisonnez en taux nets des deux côtés.",
  ],
  [
    "Capitalisation mensuelle ou annuelle : quelle différence ?",
    "À taux annuel égal, capitaliser plus souvent rapporte un peu plus : les intérêts produisent des intérêts plus tôt. 10 000 € à 5 % sur 10 ans donnent 16 288,95 € en capitalisation annuelle et environ 16 470 € en mensuelle. L'écart reste modeste face à celui du taux ou de la durée — mais pour un Livret A (intérêts calculés par quinzaine et capitalisés chaque 31 décembre), la logique annuelle de la calculatrice est la bonne approximation.",
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

export default function InteretsComposesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Versements mensuels · Valeur réelle
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Intérêts <span className="text-gold-gradient">Composés</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Voyez vos versements travailler — et l&apos;inflation aussi
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Capital de départ, versements mensuels, fréquence de capitalisation : la projection complète,
            avec le graphique qui sépare <strong>ce que vous versez</strong> de <strong>ce que les intérêts
            ajoutent</strong>, et la valeur réelle après inflation.
          </p>
        </div>
      </section>

      <InteretsCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Les quatre leviers de votre épargne"
            sub="Par ordre d'impact réel : la durée, la régularité, le taux — et un ennemi silencieux, l'inflation."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Levier n° 1</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">La durée : exponentielle, pas linéaire</h3>
              <p className="text-stone-600 leading-relaxed">
                À 5 %, 10 000 € deviennent 16 289 € en 10 ans, 26 533 € en 20 ans et 43 219 € en 30 ans :
                chaque décennie ajoute plus que la précédente. Commencer tôt bat verser tard et beaucoup.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Levier n° 2</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Les versements programmés</h3>
              <p className="text-stone-600 leading-relaxed">
                200 € par mois pendant 20 ans, c&apos;est 48 000 € versés — qui, à 5 %, produisent plus de
                34 000 € d&apos;intérêts à eux seuls. La régularité transforme un petit effort en capital.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Levier n° 3</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Le taux : puissant, mais pas magique</h3>
              <p className="text-stone-600 leading-relaxed">
                Passer de 2 % à 5 % sur 20 ans fait bien plus que doubler les intérêts. Mais un taux élevé
                promis sans risque n&apos;existe pas : comparez toujours taux, risque et fiscalité du produit.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">L'ennemi</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">L'inflation mange le rendement dormant</h3>
              <p className="text-stone-600 leading-relaxed">
                À 2 % d&apos;inflation, un capital qui ne rapporte rien perd un tiers de son pouvoir
                d&apos;achat en 20 ans. La valeur « réelle » affichée par la calculatrice est votre vrai
                résultat.
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
            Votre épargne projetée, vos autres chiffres aussi
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Le point de départ de tout plan d&apos;épargne est le salaire net réel : convertissez le vôtre
            avec <strong className="text-white">Salaire Brut en Net</strong>. Et si votre projet est
            immobilier, estimez les <strong className="text-white">frais de notaire</strong> avant même de
            visiter.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/fr/salaire-brut-en-net" className="font-semibold text-orange-400 hover:text-orange-300">
              Salaire brut en net
            </Link>{" "}
            ·{" "}
            <Link href="/fr/frais-de-notaire" className="font-semibold text-orange-400 hover:text-orange-300">
              Frais de notaire
            </Link>{" "}
            ·{" "}
            <Link href="/fr/calcul-tva" className="font-semibold text-orange-400 hover:text-orange-300">
              Calcul TVA
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
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur les intérêts composés" />
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
              Projeter mon épargne <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Simulation indicative, avant fiscalité et hors garanties : les performances passées ou simulées
            ne préjugent pas des performances futures.
          </p>
        </div>
      </section>
    </>
  );
}
