import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import ImcCalculator from "./ImcCalculator";

export const metadata = {
  title: "Calcul IMC — Calculez Votre Indice de Masse Corporelle | Frinjo",
  description:
    "Calcul IMC gratuit pour adultes : saisissez votre taille et votre poids en cm/kg (ou ft/in et lb) pour obtenir votre indice de masse corporelle, votre catégorie OMS et la fourchette de poids santé pour votre taille. Instantané, privé, sans inscription.",
  keywords: [
    "calcul imc",
    "calculer son imc",
    "indice de masse corporelle",
    "imc femme",
    "imc homme",
    "poids santé",
    "calculateur imc",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/calcul-imc",
    languages: {
      en: "https://frinjo.me/bmi-calculator",
      fr: "https://frinjo.me/fr/calcul-imc",
    },
  },
  openGraph: {
    title: "Calcul IMC — Indice de Masse Corporelle & Poids Santé | Frinjo",
    description:
      "Votre IMC, votre catégorie sur l'échelle de l'OMS et la fourchette de poids santé pour votre taille exacte — en métrique ou en impérial, gratuit et instantané.",
    url: "https://frinjo.me/fr/calcul-imc",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Calcul IMC",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/calcul-imc",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calculateur gratuit d'indice de masse corporelle (IMC) pour les adultes de 20 ans et plus. Méthodologie : l'IMC se calcule selon la formule de l'OMS — le poids en kilogrammes divisé par le carré de la taille en mètres (kg/m²) — et se classe sur l'échelle de l'Organisation mondiale de la santé : insuffisance pondérale en dessous de 18,5, poids normal de 18,5 à 24,9, surpoids de 25,0 à 29,9, obésité à partir de 30,0. Le calculateur affiche aussi la fourchette de poids santé correspondant à la taille saisie et s'exécute localement dans le navigateur du visiteur.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Calcul IMC", item: "https://frinjo.me/fr/calcul-imc" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Comment l'IMC est-il calculé ?",
    "L'IMC (indice de masse corporelle) est votre poids en kilogrammes divisé par le carré de votre taille en mètres : IMC = kg ÷ m². En unités impériales, la même formule s'écrit IMC = 703 × lb ÷ in². Ce calculateur convertit automatiquement vos pieds/pouces et vos livres, puis applique la formule métrique.",
  ],
  [
    "Quel est un IMC « normal » ?",
    "Sur l'échelle de l'Organisation mondiale de la santé utilisée pour les adultes, un IMC de 18,5 à 24,9 correspond au poids normal (poids santé). En dessous de 18,5, on parle d'insuffisance pondérale ; de 25,0 à 29,9, de surpoids ; et à partir de 30,0, d'obésité. Ce sont des repères statistiques issus de l'OMS, pas des diagnostics individuels.",
  ],
  [
    "Quelle est la fourchette de poids santé pour ma taille ?",
    "C'est l'intervalle de poids qui place votre IMC entre 18,5 et 24,9 pour votre taille — ce calculateur l'affiche à côté de votre résultat. Par exemple, pour 1,75 m, la fourchette santé va d'environ 56,7 kg à 76,5 kg.",
  ],
  [
    "L'IMC est-il fiable pour les sportifs et les personnes musclées ?",
    "L'IMC ne distingue pas le muscle de la graisse : une personne très musclée peut donc se retrouver dans la zone de surpoids tout en étant mince et en forme. Il ne tient pas compte non plus de l'âge, du sexe, de la densité osseuse ni de la répartition des graisses. Les médecins l'utilisent comme un premier chiffre de dépistage, aux côtés du tour de taille, de la tension et des analyses sanguines — jamais comme un verdict isolé.",
  ],
  [
    "Les enfants et les adolescents doivent-ils utiliser ce calculateur ?",
    "Non. De 2 à 19 ans, l'IMC s'interprète en percentiles par rapport aux courbes de croissance correspondant à l'âge et au sexe de l'enfant, et non par rapport aux seuils adultes. Ce calculateur est conçu pour les adultes de 20 ans et plus.",
  ],
  [
    "Le calcul IMC est-il gratuit ? Mes données sont-elles conservées ?",
    "Oui, entièrement gratuit et sans inscription. Votre taille et votre poids sont traités uniquement dans votre navigateur — rien n'est envoyé à nos serveurs ni conservé.",
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

export default function CalculImcPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO */}
      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Sans inscription · Adultes 20 ans et +
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Calcul <span className="text-gold-gradient">IMC</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Votre Indice de Masse Corporelle &amp; Votre Poids Santé
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Saisissez votre taille et votre poids — centimètres et kilos, ou pieds et livres — et obtenez
            votre IMC sur l&apos;échelle de l&apos;OMS, ainsi que la{" "}
            <strong>fourchette de poids santé pour votre taille exacte</strong>. Le résultat se met à jour
            pendant que vous tapez.
          </p>
        </div>
      </section>

      {/* CALCULATEUR */}
      <ImcCalculator />

      {/* CATÉGORIES */}
      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="L'échelle de l'OMS"
            title="Les catégories d'IMC, expliquées honnêtement"
            sub="Les quatre catégories adultes de l'Organisation mondiale de la santé. L'IMC est un outil de dépistage — un premier chiffre utile, jamais toute l'histoire d'un corps."
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Moins de 18,5</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Insuffisance pondérale</h3>
              <p className="text-stone-600 leading-relaxed">
                En dessous de la fourchette santé. Peut comporter ses propres risques — carences
                nutritionnelles, immunité affaiblie, perte osseuse — et mérite un avis médical si elle
                n&apos;est pas volontaire.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">18,5 – 24,9</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Poids normal (santé)</h3>
              <p className="text-stone-600 leading-relaxed">
                La fourchette associée au risque global le plus faible à l&apos;échelle de la population. La
                forme, la force et les habitudes comptent aussi à l&apos;intérieur de cette fourchette — le
                chiffre est une zone, pas une ligne d&apos;arrivée.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-3">25,0 – 29,9</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Surpoids</h3>
              <p className="text-stone-600 leading-relaxed">
                Au-dessus de la fourchette santé. C&apos;est aussi la zone où les morphologies musclées sont
                le plus souvent mal interprétées — l&apos;IMC compte toute la masse de la même façon, muscle
                ou graisse.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-3">30,0 et plus</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Obésité</h3>
              <p className="text-stone-600 leading-relaxed">
                Associée, à l&apos;échelle de la population, à un risque plus élevé de diabète de type 2, de
                maladies cardiaques et de problèmes articulaires. Un signal de dépistage à discuter avec un
                médecin — pas un jugement sur la personne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LIMITES */}
      <section className="py-16 sm:py-20 bg-stone-950 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-orange-400 text-center">
            Connaître les limites
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Ce que l&apos;IMC peut et ne peut pas vous dire
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            L&apos;IMC a été conçu au XIX<sup>e</sup> siècle comme une{" "}
            <strong className="text-white">statistique de population</strong>, et les autorités de santé
            l&apos;utilisent toujours ainsi : un premier dépistage simple et cohérent. Il{" "}
            <strong className="text-white">ne peut pas</strong> distinguer le muscle de la graisse, l&apos;os
            de l&apos;eau, ni dire où la graisse se situe sur le corps — or la graisse autour de la taille ne
            présente pas les mêmes risques que celle des hanches. Il ignore aussi l&apos;âge, le sexe et
            l&apos;origine, qui modifient tous la signification d&apos;un même IMC. Utilisez votre résultat
            comme le point de départ d&apos;une image que complètent le tour de taille, la forme physique, la
            tension et les analyses sanguines — idéalement avec un professionnel de santé qui vous connaît.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            D&apos;autres outils gratuits en français : le{" "}
            <Link href="/fr/salaire-brut-en-net" className="font-semibold text-orange-400 hover:text-orange-300">
              convertisseur salaire brut en net
            </Link>{" "}
            et le{" "}
            <Link href="/fr/generateur-de-faux-nom" className="font-semibold text-orange-400 hover:text-orange-300">
              générateur de faux nom
            </Link>
            {" "}— et la version anglaise de cet outil, le{" "}
            <Link href="/bmi-calculator" className="font-semibold text-orange-400 hover:text-orange-300">
              BMI Calculator
            </Link>
            , dans le{" "}
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
          <SectionHead eyebrow="FAQ" title="Vos questions sur l'IMC" />
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
              Calculer mon IMC <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Ce calculateur fournit une information générale destinée aux adultes ; il ne constitue pas un
            avis médical. Parlez à un professionnel de santé de vos propres chiffres.
          </p>
        </div>
      </section>
    </>
  );
}
