import Link from "next/link";
import { SectionHead, Icon, btnPrimary, btnOutline } from "@/components/ui";
import JoursCalculator from "./JoursCalculator";

export const metadata = {
  title: "Jours Entre Deux Dates — Ouvrés, Ouvrables et Jours Fériés | Frinjo",
  description:
    "Calculez le nombre de jours entre deux dates avec les jours ouvrés, les jours ouvrables ET le calendrier complet des jours fériés français (fêtes mobiles incluses : lundi de Pâques, Ascension, Pentecôte). Gratuit, sans inscription.",
  keywords: [
    "jours entre deux dates",
    "calculer le nombre de jours entre deux dates",
    "jours ouvrés",
    "jours ouvrables",
    "jours fériés",
    "nombre de jours entre deux dates",
  ],
  alternates: {
    canonical: "https://frinjo.me/fr/jours-entre-deux-dates",
    languages: { fr: "https://frinjo.me/fr/jours-entre-deux-dates", es: "https://frinjo.me/es/calculadora-de-dias-entre-fechas", en: "https://frinjo.me/days-between-dates-calculator" },
  },
  openGraph: {
    title: "Jours Entre Deux Dates — Avec Jours Fériés Français | Frinjo",
    description:
      "Durée totale, jours ouvrés, jours ouvrables et liste des jours fériés de la période — fêtes mobiles calculées exactement. Gratuit, sans inscription.",
    url: "https://frinjo.me/fr/jours-entre-deux-dates",
    type: "website",
  },
};

const appJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Jours Entre Deux Dates",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://frinjo.me/fr/jours-entre-deux-dates",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Organization", name: "WebStore Pro", url: "https://frinjo.me" },
  description:
    "Calcul du nombre de jours entre deux dates pour la France : durée calendaire totale, semaines, jours ouvrés (lundi–vendredi hors jours fériés), jours ouvrables (lundi–samedi hors jours fériés) et jours de week-end. Le calendrier des jours fériés français est complet : 8 fêtes fixes (Jour de l'An, 1er mai, 8 mai, 14 juillet, Assomption, Toussaint, 11 novembre, Noël) et 3 fêtes mobiles calculées depuis le dimanche de Pâques par le comput grégorien (lundi de Pâques +1 jour, Ascension +39 jours, lundi de Pentecôte +50 jours). Option Alsace-Moselle : Vendredi saint et 26 décembre. Contrairement à de nombreux calculateurs, les jours fériés sont réellement déduits des jours ouvrés et ouvrables, et la liste des fériés de la période est affichée. Calcul effectué dans le navigateur.",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://frinjo.me/" },
    { "@type": "ListItem", position: 2, name: "Outils", item: "https://frinjo.me/fr" },
    { "@type": "ListItem", position: 3, name: "Jours Entre Deux Dates", item: "https://frinjo.me/fr/jours-entre-deux-dates" },
  ],
};

const FAQS: [string, string][] = [
  [
    "Quelle est la différence entre jours ouvrés et jours ouvrables ?",
    "Les jours ouvrables sont tous les jours de la semaine sauf le repos hebdomadaire (en général le dimanche) : donc du lundi au samedi, hors jours fériés. Les jours ouvrés sont les jours effectivement travaillés dans l'entreprise : en général du lundi au vendredi, hors jours fériés. Un délai « en jours ouvrés » est donc plus long en dates calendaires qu'un délai « en jours ouvrables » de même nombre. Cette calculatrice donne les deux, fériés déduits.",
  ],
  [
    "Les jours fériés sont-ils vraiment déduits du calcul ?",
    "Oui — c'est la différence avec plusieurs calculateurs concurrents qui reconnaissent eux-mêmes ignorer les jours fériés. Ici, le calendrier légal complet est chargé pour chaque année de la période (11 jours fériés en métropole, 13 avec l'option Alsace-Moselle) et chaque férié tombant un jour de semaine est retiré des jours ouvrés et ouvrables, avec la liste détaillée affichée.",
  ],
  [
    "Comment sont calculés le lundi de Pâques, l'Ascension et la Pentecôte ?",
    "Ce sont des fêtes mobiles : elles dépendent de la date de Pâques, calculée par l'algorithme du comput grégorien (Meeus). Le lundi de Pâques est le lendemain du dimanche de Pâques, l'Ascension tombe 39 jours après Pâques (un jeudi) et le lundi de Pentecôte 50 jours après. En 2026 : Pâques le 5 avril, lundi de Pâques le 6 avril, Ascension le 14 mai, lundi de Pentecôte le 25 mai. La calculatrice les place exactement, quelle que soit l'année choisie.",
  ],
  [
    "Comment compter un délai de préavis ou de congés avec cet outil ?",
    "Saisissez la date de début et la date de fin de la période : le compteur « jours ouvrés » donne le nombre de jours travaillés réellement contenus dans l'intervalle, par exemple pour vérifier un préavis exprimé en jours ouvrés ou le nombre de jours de congés posés hors week-ends et fériés. Attention aux conventions : un délai légal court souvent à partir du lendemain du jour de départ (notification, signature). Vérifiez le point de départ exact dans votre contrat ou convention collective.",
  ],
  [
    "Que se passe-t-il si un jour férié tombe un week-end ?",
    "Il reste un jour férié calendaire (il apparaît dans la liste), mais il ne retire aucun jour ouvré puisqu'il n'était pas travaillé de toute façon : c'est le fameux férié « perdu ». La calculatrice distingue donc le nombre total de fériés de la période et ceux qui tombent en semaine, seuls impactants pour les délais et les congés.",
  ],
  [
    "Le 26 décembre et le Vendredi saint sont-ils fériés partout en France ?",
    "Non : uniquement en Alsace-Moselle (Bas-Rhin, Haut-Rhin, Moselle), héritage du droit local. Cochez l'option Alsace-Moselle si la période concerne ces départements : le calendrier passe alors à 13 jours fériés et les deux jours sont déduits comme les autres.",
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

export default function JoursEntreDeuxDatesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section id="top" className="bg-orange-50 dot-grid pt-16 sm:pt-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] bg-orange-600 text-white rounded-full px-3 py-1 mb-5">
            Gratuit · Jours fériés inclus · Sans inscription
          </span>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-stone-900 leading-tight">
            Jours Entre <span className="text-gold-gradient">Deux Dates</span>
          </h1>
          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-stone-800">
            Ouvrés, ouvrables — et les jours fériés, pour de vrai
          </p>
          <p className="mt-5 text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            La plupart des calculateurs ignorent les jours fériés. Celui-ci charge le{" "}
            <strong>calendrier légal français complet</strong> — fêtes fixes et mobiles — et les déduit des
            jours ouvrés et ouvrables, avec la liste détaillée de votre période.
          </p>
        </div>
      </section>

      <JoursCalculator />

      <section className="py-16 sm:py-20 bg-white border-t border-stone-100">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            eyebrow="Comment ça marche"
            title="Trois compteurs, un seul calendrier officiel"
            sub="Chaque jour de la période est classé une fois : calendaire, week-end, férié — puis les compteurs ouvrés et ouvrables en découlent sans approximation."
          />
          <div className="grid gap-5 md:grid-cols-2 text-left">
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Jours ouvrés</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Lundi–vendredi, hors fériés</h3>
              <p className="text-stone-600 leading-relaxed">
                Le compteur des délais RH et des congés : préavis, délais de rétractation exprimés en jours
                ouvrés, jours de travail effectif entre deux dates. Un férié un jeudi le réduit d&apos;autant.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 mb-3">Jours ouvrables</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Lundi–samedi, hors fériés</h3>
              <p className="text-stone-600 leading-relaxed">
                Le compteur des délais administratifs et commerciaux (beaucoup de délais légaux se comptent
                en jours ouvrables). Le samedi compte, le dimanche et les fériés non.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-600 mb-3">Fêtes mobiles</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Pâques calculée, pas devinée</h3>
              <p className="text-stone-600 leading-relaxed">
                Lundi de Pâques, Ascension et lundi de Pentecôte changent chaque année. Ils sont dérivés du
                comput grégorien, l&apos;algorithme officiel du calendrier : exacts pour n&apos;importe quelle
                année, passée ou future.
              </p>
            </div>
            <div className={card}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-600 mb-3">Alsace-Moselle</p>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-3">Deux fériés de plus, en option</h3>
              <p className="text-stone-600 leading-relaxed">
                Vendredi saint et 26 décembre ne sont fériés que dans le Bas-Rhin, le Haut-Rhin et la
                Moselle. Une case à cocher suffit pour passer le calendrier de 11 à 13 jours fériés.
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
            Le même calcul, côté espagnol et mexicain
          </h2>
          <p className="mt-6 text-stone-300 leading-relaxed">
            Notre version espagnole compte les <strong className="text-white">días hábiles</strong> avec le
            calendrier des jours de repos obligatoires du Mexique (article 74 de la LFT, lundis de report
            inclus) ou les festivos nationaux d&apos;Espagne. Pour vos autres calculs du quotidien : le{" "}
            <strong className="text-white">salaire brut en net</strong> et le{" "}
            <strong className="text-white">calcul TVA</strong>.
          </p>
          <p className="mt-8 text-center text-sm text-stone-400">
            <Link href="/es/calculadora-de-dias-entre-fechas" className="font-semibold text-orange-400 hover:text-orange-300">
              Días entre fechas (ES)
            </Link>{" "}
            ·{" "}
            <Link href="/fr/salaire-brut-en-net" className="font-semibold text-orange-400 hover:text-orange-300">
              Salaire brut en net
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
          <SectionHead eyebrow="Questions fréquentes" title="Vos questions sur les jours et les délais" />
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
              Compter mes jours <Icon name="arrow" className="w-5 h-5" />
            </a>
          </div>
          <p className="mt-8 text-center text-xs text-stone-400">
            Outil d&apos;information générale : pour un délai légal précis, vérifiez le point de départ et
            la convention de comptage dans le texte ou le contrat applicable.
          </p>
        </div>
      </section>
    </>
  );
}
