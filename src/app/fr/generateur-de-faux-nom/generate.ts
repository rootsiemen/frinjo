/* Générateur de faux nom — logique et données (côté client uniquement).
   Ne génère JAMAIS de numéros d'identité nationaux (NIR, numéro national),
   de numéros fiscaux ni de numéros de carte bancaire. */

export function randInt(maxExclusive: number): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % maxExclusive;
}
export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(arr.length)];
}
export function digits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += String(randInt(10));
  return s;
}
function letter(): string {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[randInt(26)];
}
function slugifyName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/* ---------------- pools de noms ---------------- */
const MALE = [
  "Hugo", "Louis", "Gabriel", "Raphaël", "Arthur", "Nathan", "Maël", "Ethan", "Jules", "Adam",
  "Noah", "Lucas", "Léo", "Liam", "Paul", "Antoine", "Maxime", "Clément", "Alexandre", "Thomas",
  "Julien", "Nicolas", "Mathieu", "Pierre", "Jean", "François", "Olivier", "Sébastien", "David",
  "Karim", "Mehdi", "Yassine", "Mohamed", "Sofiane", "Théo", "Gaspard", "Marius", "Oscar", "Timéo",
  "Sacha", "Robin", "Victor", "Charles", "Émile", "Félix", "Olivier", "Samuel", "Benjamin", "Laurent",
];
const FEMALE = [
  "Jade", "Louise", "Emma", "Ambre", "Alba", "Romy", "Rose", "Anna", "Mia", "Lina",
  "Chloé", "Léa", "Camille", "Manon", "Julie", "Marie", "Sophie", "Claire", "Élodie", "Pauline",
  "Marion", "Laura", "Sarah", "Inès", "Zoé", "Alice", "Juliette", "Anaïs", "Margaux", "Lucie",
  "Émilie", "Charlotte", "Léonie", "Agathe", "Nina", "Aya", "Fatou", "Nour", "Louna", "Iris",
  "Adèle", "Jeanne", "Céline", "Geneviève", "Rosalie", "Florence", "Élise", "Noémie", "Audrey",
];
const SURNAMES = [
  "Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent",
  "Simon", "Michel", "Lefèvre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Girard", "Bonnet",
  "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent", "Muller", "Faure", "André", "Mercier", "Blanc",
  "Guérin", "François", "Garnier", "Chevalier", "Faivre", "Leroux", "Clerc", "Marchand", "Dufour", "Henry",
  "Perrin", "Morin", "Duval", "Coulon", "Lemaire", "Gautier", "Benoît", "Roy", "Barbier", "Charpentier",
  "Rey", "Bourgeois", "Nguyen", "Meyer", "Dupuis", "Renard", "Aubert", "Rolland", "Colin", "Arnaud",
  "Tremblay", "Gagnon", "Côté", "Bouchard", "Fortin", "Lachance", "Pelletier", "Bélanger", "Lévesque",
  "Morin", "Simard",
];

const JOBS = [
  "Développeur logiciel", "Enseignant", "Infirmier", "Comptable", "Commercial", "Électricien",
  "Graphiste", "Chargé de marketing", "Conseiller clientèle", "Chauffeur-livreur", "Cuisinier",
  "Pharmacien", "Ingénieur civil", "Analyste de données", "Assistant administratif", "Mécanicien",
  "Agent immobilier", "Journaliste", "Kinésithérapeute", "Responsable de magasin", "Webdesigner",
  "Employé de banque", "Policier", "Architecte", "Responsable RH", "Assistant dentaire",
  "Coach sportif", "Traducteur", "Plombier", "Boulanger",
];
const COMPANY_A = ["Atelier", "Groupe", "Maison", "Agence", "Cabinet", "Studio"];
const COMPANY_B = ["Lumière", "Horizon", "Verlaine", "Rivoli", "Cézanne", "Montmartre", "Saône", "Léman", "Provence", "Nordica"];
const EMAIL_DOMAINS = ["abahi.tech", "abahi.page", "abahi.me"];

/* ---------------- villes et formats par pays ---------------- */
export interface CityPool {
  city: string;
  region: string;
  postal: () => string;
  phone: () => string;
  street: () => string;
}

const FR_STREET_NAMES = ["de la République", "Victor Hugo", "Jean Jaurès", "de la Paix", "des Lilas", "du Général de Gaulle", "Pasteur", "de la Gare", "du Château", "des Roses", "de la Liberté", "Gambetta", "Foch", "de Verdun", "Saint-Michel", "du Commerce", "de l'Église", "des Écoles", "du Stade", "de la Fontaine"];
function streetFR(): string {
  return `${1 + randInt(190)} ${pick(["Rue", "Rue", "Avenue", "Boulevard", "Impasse", "Allée", "Place", "Chemin"])} ${pick(FR_STREET_NAMES)}`;
}
const phoneFR = () => `+33 ${pick(["6", "7"])} ${digits(2)} ${digits(2)} ${digits(2)} ${digits(2)}`;
const FR_CITIES: CityPool[] = [
  { city: "Paris", region: "Île-de-France", postal: () => "750" + String(1 + randInt(20)).padStart(2, "0"), phone: phoneFR, street: streetFR },
  { city: "Lyon", region: "Auvergne-Rhône-Alpes", postal: () => `6900${1 + randInt(9)}`, phone: phoneFR, street: streetFR },
  { city: "Marseille", region: "Provence-Alpes-Côte d'Azur", postal: () => "130" + String(1 + randInt(16)).padStart(2, "0"), phone: phoneFR, street: streetFR },
  { city: "Nantes", region: "Pays de la Loire", postal: () => String(44000 + randInt(400)), phone: phoneFR, street: streetFR },
  { city: "Lille", region: "Hauts-de-France", postal: () => String(59000 + randInt(900)), phone: phoneFR, street: streetFR },
  { city: "Bordeaux", region: "Nouvelle-Aquitaine", postal: () => String(33000 + randInt(900)), phone: phoneFR, street: streetFR },
  { city: "Toulouse", region: "Occitanie", postal: () => String(31000 + randInt(600)), phone: phoneFR, street: streetFR },
  { city: "Strasbourg", region: "Grand Est", postal: () => String(67000 + randInt(300)), phone: phoneFR, street: streetFR },
  { city: "Nice", region: "Provence-Alpes-Côte d'Azur", postal: () => String(6000 + randInt(400)).padStart(5, "0"), phone: phoneFR, street: streetFR },
  { city: "Montpellier", region: "Occitanie", postal: () => String(34000 + randInt(300)), phone: phoneFR, street: streetFR },
  { city: "Rennes", region: "Bretagne", postal: () => String(35000 + randInt(300)), phone: phoneFR, street: streetFR },
  { city: "Grenoble", region: "Auvergne-Rhône-Alpes", postal: () => String(38000 + randInt(200)), phone: phoneFR, street: streetFR },
];

const BE_STREET_NAMES = ["de la Loi", "Louise", "Neuve", "de Charleroi", "des Guillemins", "des Arts", "Haute", "Anspach", "de Fer", "de la Station", "de Bruxelles", "du Marché", "de l'Université", "Royale", "de la Montagne"];
function streetBE(): string {
  return `${1 + randInt(190)} ${pick(["Rue", "Rue", "Avenue", "Chaussée", "Boulevard"])} ${pick(BE_STREET_NAMES)}`;
}
const phoneBE = () => `+32 ${pick(["470", "471", "472", "473", "474", "475", "476", "477", "478", "479", "480", "483", "484", "485", "486", "487", "488", "489"])} ${digits(2)} ${digits(2)} ${digits(2)}`;
const BE_CITIES: CityPool[] = [
  { city: "Bruxelles", region: "Bruxelles-Capitale", postal: () => String(1000 + randInt(210)), phone: phoneBE, street: streetBE },
  { city: "Anvers", region: "Flandre", postal: () => String(2000 + randInt(660)), phone: phoneBE, street: streetBE },
  { city: "Gand", region: "Flandre", postal: () => "9000", phone: phoneBE, street: streetBE },
  { city: "Liège", region: "Wallonie", postal: () => String(4000 + randInt(30)), phone: phoneBE, street: streetBE },
  { city: "Charleroi", region: "Wallonie", postal: () => String(6000 + randInt(70)), phone: phoneBE, street: streetBE },
  { city: "Bruges", region: "Flandre", postal: () => String(8000 + randInt(380)), phone: phoneBE, street: streetBE },
  { city: "Namur", region: "Wallonie", postal: () => String(5000 + randInt(110)), phone: phoneBE, street: streetBE },
  { city: "Louvain", region: "Flandre", postal: () => String(3000 + randInt(30)), phone: phoneBE, street: streetBE },
];

const CH_STREET_NAMES = ["du Rhône", "de la Gare", "de Lausanne", "du Lac", "Saint-François", "du Léman", "de la Cité", "du Bourg", "de la Poste", "du Mont-Blanc", "de Carouge", "du Marché"];
function streetCH(): string {
  return `${1 + randInt(120)} ${pick(["Rue", "Rue", "Avenue", "Chemin"])} ${pick(CH_STREET_NAMES)}`;
}
const phoneCH = () => `+41 ${pick(["75", "76", "77", "78", "79"])} ${digits(3)} ${digits(2)} ${digits(2)}`;
const CH_CITIES: CityPool[] = [
  { city: "Genève", region: "Genève", postal: () => String(1200 + randInt(30)), phone: phoneCH, street: streetCH },
  { city: "Lausanne", region: "Vaud", postal: () => String(1003 + randInt(16)), phone: phoneCH, street: streetCH },
  { city: "Zurich", region: "Zurich", postal: () => String(8001 + randInt(49)), phone: phoneCH, street: streetCH },
  { city: "Fribourg", region: "Fribourg", postal: () => String(1700 + randInt(10)), phone: phoneCH, street: streetCH },
  { city: "Neuchâtel", region: "Neuchâtel", postal: () => String(2000 + randInt(10)), phone: phoneCH, street: streetCH },
  { city: "Sion", region: "Valais", postal: () => pick(["1950", "1951"]), phone: phoneCH, street: streetCH },
  { city: "Montreux", region: "Vaud", postal: () => String(1820 + randInt(3)), phone: phoneCH, street: streetCH },
  { city: "Berne", region: "Berne", postal: () => String(3000 + randInt(20)), phone: phoneCH, street: streetCH },
];

const QC_STREET_NAMES = ["Sainte-Catherine", "René-Lévesque", "Saint-Denis", "du Mont-Royal", "Sherbrooke", "Saint-Laurent", "Notre-Dame", "de la Côte-des-Neiges", "Jean-Talon", "Taschereau", "Saint-Jean", "Grande Allée"];
function streetQC(): string {
  return `${100 + randInt(6800)} ${pick(["Rue", "Rue", "Boulevard", "Avenue", "Chemin"])} ${pick(QC_STREET_NAMES)}`;
}
function qcPostal(prefix: string): string {
  return `${prefix}${letter()} ${digits(1)}${letter()}${digits(1)}`;
}
const QC_CITIES: CityPool[] = [
  { city: "Montréal", region: "Québec", postal: () => qcPostal(`H${1 + randInt(4)}`), phone: () => `+1 (${pick(["514", "438"])}) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Québec", region: "Québec", postal: () => qcPostal(`G${pick(["1", "2"])}`), phone: () => `+1 (${pick(["418", "581"])}) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Laval", region: "Québec", postal: () => qcPostal("H7"), phone: () => `+1 (450) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Longueuil", region: "Québec", postal: () => qcPostal("J4"), phone: () => `+1 (450) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Gatineau", region: "Québec", postal: () => qcPostal(`J${pick(["8", "9"])}`), phone: () => `+1 (819) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Sherbrooke", region: "Québec", postal: () => qcPostal("J1"), phone: () => `+1 (819) ${digits(3)}-${digits(4)}`, street: streetQC },
  { city: "Trois-Rivières", region: "Québec", postal: () => qcPostal(`G${pick(["8", "9"])}`), phone: () => `+1 (819) ${digits(3)}-${digits(4)}`, street: streetQC },
];

export type CountryCode = "FR" | "BE" | "CH" | "QC";
export type GenderPref = "Aléatoire" | "Homme" | "Femme";

const COUNTRIES: Record<CountryCode, { name: string; cities: CityPool[]; suffixes: string[] }> = {
  FR: { name: "France", cities: FR_CITIES, suffixes: ["SAS", "SARL", "SA"] },
  BE: { name: "Belgique", cities: BE_CITIES, suffixes: ["SRL", "SA"] },
  CH: { name: "Suisse", cities: CH_CITIES, suffixes: ["Sàrl", "SA"] },
  QC: { name: "Canada (Québec)", cities: QC_CITIES, suffixes: ["Inc.", "Ltée"] },
};

export interface Identity {
  fullName: string; firstName: string; lastName: string; gender: "Homme" | "Femme";
  street: string; city: string; region: string; postal: string; country: string;
  phone: string; email: string; username: string; password: string;
  birthday: string; age: number; occupation: string; company: string;
}

export function ageFromDob(dob: Date): number {
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

export function formatDateFr(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function generateIdentity(country: CountryCode, genderPref: GenderPref): Identity {
  const gender: "Homme" | "Femme" = genderPref === "Aléatoire" ? (randInt(2) === 0 ? "Homme" : "Femme") : genderPref;
  const def = COUNTRIES[country];
  const firstName = pick(gender === "Homme" ? MALE : FEMALE);
  const lastName = pick(SURNAMES);
  const c = pick(def.cities);
  const username = `${slugifyName(firstName)}.${slugifyName(lastName)}${randInt(10) === 0 ? "" : randInt(99)}`;
  const email = `${username}@${pick(EMAIL_DOMAINS)}`;
  const pwChars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let password = "";
  const pa = new Uint32Array(12);
  crypto.getRandomValues(pa);
  for (let i = 0; i < 12; i++) password += pwChars[pa[i] % pwChars.length];
  const year = 1958 + randInt(48); // 1958–2005
  const dob = new Date(year, randInt(12), 1 + randInt(28));
  const birthday = dob.toISOString().slice(0, 10);
  return {
    fullName: `${firstName} ${lastName}`, firstName, lastName, gender,
    street: c.street(), city: c.city, region: c.region, postal: c.postal(), country: def.name,
    phone: c.phone(), email, username, password, birthday, age: ageFromDob(dob),
    occupation: pick(JOBS), company: `${pick(COMPANY_A)} ${pick(COMPANY_B)} ${pick(def.suffixes)}`,
  };
}

export function identityText(idn: Identity): string {
  return [
    `Nom : ${idn.fullName}`,
    `Sexe : ${idn.gender}`,
    `Adresse : ${idn.street}, ${idn.postal} ${idn.city}, ${idn.region}, ${idn.country}`,
    `Téléphone : ${idn.phone}`,
    `E-mail : ${idn.email}`,
    `Nom d'utilisateur : ${idn.username}`,
    `Mot de passe : ${idn.password}`,
    `Date de naissance : ${formatDateFr(idn.birthday)} (${idn.age} ans)`,
    `Profession : ${idn.occupation}`,
    `Entreprise : ${idn.company}`,
  ].join("\n");
}

export function identitiesCSV(list: Identity[]): string {
  const head = "Nom complet,Prénom,Nom,Sexe,Rue,Ville,Région,Code postal,Pays,Téléphone,E-mail,Nom d'utilisateur,Mot de passe,Date de naissance,Âge,Profession,Entreprise";
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = list.map((i) => [i.fullName, i.firstName, i.lastName, i.gender, i.street, i.city, i.region, i.postal, i.country, i.phone, i.email, i.username, i.password, i.birthday, i.age, i.occupation, i.company].map(esc).join(","));
  return [head, ...rows].join("\n");
}

export interface InboxEmail {
  id: string; from: string; to: string; subject: string; date: string;
  text?: string; html?: string; preview?: string;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function inboxBody(msg: InboxEmail): string {
  const t = (msg.text || "").trim();
  if (t) return t;
  const h = stripHtml(msg.html || "");
  if (h) return h;
  return (msg.preview || "").trim() || "(Message vide)";
}
