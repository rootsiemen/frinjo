/* Generador de identidad falsa — lógica y datos (solo cliente).
   NUNCA genera documentos de identidad (DNI/NIE), números fiscales ni tarjetas bancarias. */

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
function pad(n: number, w: number): string {
  return String(n).padStart(w, "0");
}
function slugifyName(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/* ---------------- pools de nombres ---------------- */
const MALE = [
  "Alejandro", "Javier", "Carlos", "Miguel", "José", "Antonio", "Francisco", "Manuel", "David", "Juan",
  "Daniel", "Pablo", "Fernando", "Luis", "Álvaro", "Sergio", "Raúl", "Jorge", "Iván", "Rubén",
  "Adrián", "Enrique", "Diego", "Andrés", "Hugo", "Marcos", "Mario", "Óscar", "Gonzalo", "Emilio",
  "José Luis", "Juan Carlos", "Miguel Ángel", "Luis Fernando", "Marco Antonio", "Carlos Alberto",
  "José Antonio", "Julio César", "Ricardo", "Eduardo", "Roberto", "Arturo", "Gerardo", "Víctor",
  "César", "Édgar", "Armando", "Santiago", "Mateo", "Sebastián", "Nicolás", "Andrés Felipe",
  "Juan Pablo", "Diego Alejandro", "Luis Miguel", "Pedro", "Ramón", "Esteban", "Mauricio", "Rodrigo",
];
const FEMALE = [
  "María", "Carmen", "Lucía", "Sofía", "Marta", "Cristina", "Laura", "Elena", "Isabel", "Ana",
  "Paula", "Sara", "Alba", "Beatriz", "Raquel", "Nuria", "Silvia", "Patricia", "Andrea", "Rocío",
  "Mónica", "Ángela", "Julia", "Claudia", "Natalia", "Valeria", "Daniela", "Gabriela", "Fernanda",
  "Mariana", "Alejandra", "Paola", "Karla", "Valentina", "Camila", "Ximena", "María Fernanda",
  "María José", "Ana María", "Daniela Fernanda", "María Camila", "Laura Sofía", "Isabela", "Renata",
  "Constanza", "Javiera", "Macarena", "Francisca", "Antonia", "Josefa", "Emilia", "Florencia",
];
const SURNAMES = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez",
  "Martín", "Jiménez", "Ruiz", "Hernández", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso",
  "Gutiérrez", "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Serrano", "Blanco",
  "Molina", "Suárez", "Ortega", "Morales", "Delgado", "Castro", "Ortiz", "Marín", "Rubio", "Iglesias",
  "Núñez", "Flores", "Herrera", "Medina", "Aguilar", "Cabrera", "Garrido", "Cortés", "Santos",
  "Guerrero", "Lozano", "Cano", "Prieto", "Méndez", "Cruz", "Reyes", "Mendoza", "Chávez", "Salazar",
  "Rojas", "Vega", "Soto", "Contreras", "Fuentes", "Peña", "Ríos", "Maldonado", "Campos", "Vargas",
  "Espinoza", "Araya", "Pizarro", "Sepúlveda", "Bravo", "Cáceres", "Valenzuela", "Contreras",
  "Figueroa", "Cárdenas", "Peralta", "Domínguez",
];

const JOBS = [
  "Ingeniero de software", "Diseñador gráfico", "Contable", "Abogado", "Médico", "Arquitecto",
  "Electricista", "Fontanero", "Comercial", "Gerente de ventas", "Analista de datos", "Periodista",
  "Chef", "Farmacéutico", "Ingeniero civil", "Administrativo", "Mecánico", "Agente inmobiliario",
  "Fisioterapeuta", "Gerente de tienda", "Diseñador web", "Empleado bancario", "Policía",
  "Responsable de recursos humanos", "Repartidor", "Asistente dental", "Entrenador personal",
  "Traductor", "Community manager", "Atención al cliente",
];
const COMPANY_A = ["Nova", "Vertex", "Andes", "Pacífica", "Atlántica", "Ibérica", "Litoral", "Cumbre", "Faro", "Puente", "Delta", "Origen"];
const COMPANY_B = ["Tech", "Media", "Salud", "Energía", "Retail", "Finanzas", "Agro", "Labs", "Works", "Foods", "Viajes", "Datos"];
const EMAIL_DOMAINS = ["abahi.tech", "abahi.page", "abahi.me"];

/* ---------------- ciudades y formatos por país ---------------- */
export interface CityPool {
  city: string;
  region: string;
  postal: () => string;
  phone: () => string;
  street: () => string;
}

const ES_STREET_NAMES = ["de Alcalá", "Gran Vía", "de Serrano", "del Prado", "Mayor", "de América", "de Fuencarral", "de Atocha", "de Génova", "de Bailén", "del Carmen", "de la Constitución", "de España", "Real", "de la Iglesia", "del Sol", "Nueva", "de Santa Engracia", "de Velázquez", "de Goya"];
function streetES(): string {
  return `${pick(["Calle", "Calle", "Avenida", "Plaza", "Paseo", "Camino", "Ronda"])} ${pick(ES_STREET_NAMES)} ${1 + randInt(180)}`;
}
const phoneES = () => `+34 ${pick(["6", "7"])}${digits(2)} ${digits(2)} ${digits(2)} ${digits(2)}`;
const ES_CITIES: CityPool[] = [
  { city: "Madrid", region: "Comunidad de Madrid", postal: () => "28" + pad(1 + randInt(55), 3), phone: phoneES, street: streetES },
  { city: "Barcelona", region: "Cataluña", postal: () => "08" + pad(1 + randInt(42), 3), phone: phoneES, street: streetES },
  { city: "Valencia", region: "Comunidad Valenciana", postal: () => "46" + pad(1 + randInt(26), 3), phone: phoneES, street: streetES },
  { city: "Sevilla", region: "Andalucía", postal: () => "41" + pad(1 + randInt(20), 3), phone: phoneES, street: streetES },
  { city: "Zaragoza", region: "Aragón", postal: () => "50" + pad(1 + randInt(18), 3), phone: phoneES, street: streetES },
  { city: "Málaga", region: "Andalucía", postal: () => "29" + pad(1 + randInt(18), 3), phone: phoneES, street: streetES },
  { city: "Bilbao", region: "País Vasco", postal: () => "48" + pad(1 + randInt(15), 3), phone: phoneES, street: streetES },
  { city: "Alicante", region: "Comunidad Valenciana", postal: () => "03" + pad(1 + randInt(16), 3), phone: phoneES, street: streetES },
];

const MX_STREETS = ["Insurgentes", "Reforma", "Juárez", "Hidalgo", "Madero", "Revolución", "Morelos", "Universidad", "Independencia", "López Mateos", "Allende", "Vallarta", "Patria", "Obregón", "Zaragoza", "Colón"];
const MX_COLONIAS = ["Centro", "Roma Norte", "Condesa", "Del Valle", "Polanco", "Narvarte", "Providencia", "Americana", "Obrera", "Santa Fe", "Ladrón de Guevara", "Jardines del Valle"];
function streetMX(): string {
  return `${pick(["Avenida", "Avenida", "Calle", "Calzada"])} ${pick(MX_STREETS)} ${100 + randInt(4800)}, Col. ${pick(MX_COLONIAS)}`;
}
const MX_CITIES: CityPool[] = [
  { city: "Ciudad de México", region: "CDMX", postal: () => pick(["010", "011", "012", "013", "014", "015", "016", "020", "030", "040", "050", "060", "070", "080", "090", "100", "110", "120", "140", "150", "160"]) + digits(2), phone: () => `+52 55 ${digits(4)} ${digits(4)}`, street: streetMX },
  { city: "Guadalajara", region: "Jalisco", postal: () => "44" + digits(3), phone: () => `+52 33 ${digits(4)} ${digits(4)}`, street: streetMX },
  { city: "Monterrey", region: "Nuevo León", postal: () => "64" + digits(3), phone: () => `+52 81 ${digits(4)} ${digits(4)}`, street: streetMX },
  { city: "Puebla", region: "Puebla", postal: () => "72" + digits(3), phone: () => `+52 222 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "Toluca", region: "Estado de México", postal: () => "50" + digits(3), phone: () => `+52 722 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "Tijuana", region: "Baja California", postal: () => "22" + digits(3), phone: () => `+52 664 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "León", region: "Guanajuato", postal: () => "37" + digits(3), phone: () => `+52 477 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "Mérida", region: "Yucatán", postal: () => "97" + digits(3), phone: () => `+52 999 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "Querétaro", region: "Querétaro", postal: () => "76" + digits(3), phone: () => `+52 442 ${digits(3)} ${digits(4)}`, street: streetMX },
  { city: "Cancún", region: "Quintana Roo", postal: () => "775" + digits(2), phone: () => `+52 998 ${digits(3)} ${digits(4)}`, street: streetMX },
];

const CO_BARRIOS = ["Chapinero", "El Poblado", "Laureles", "Belén", "Ciudad Jardín", "Bocagrande", "Cabecera", "El Prado", "Chicó", "Usaquén", "Envigado", "Sabaneta"];
function streetCO(): string {
  return `${pick(["Carrera", "Carrera", "Calle", "Avenida", "Diagonal", "Transversal"])} ${1 + randInt(120)} #${1 + randInt(99)}-${1 + randInt(98)}, ${pick(CO_BARRIOS)}`;
}
const phoneCO = () => `+57 3${pick(["00", "01", "10", "11", "12", "15", "20", "21", "50", "60"])} ${digits(3)} ${digits(4)}`;
const CO_CITIES: CityPool[] = [
  { city: "Bogotá", region: "Cundinamarca", postal: () => "11" + digits(4), phone: phoneCO, street: streetCO },
  { city: "Medellín", region: "Antioquia", postal: () => "05" + digits(4), phone: phoneCO, street: streetCO },
  { city: "Cali", region: "Valle del Cauca", postal: () => "76" + digits(4), phone: phoneCO, street: streetCO },
  { city: "Barranquilla", region: "Atlántico", postal: () => "08" + digits(4), phone: phoneCO, street: streetCO },
  { city: "Cartagena", region: "Bolívar", postal: () => "13" + digits(4), phone: phoneCO, street: streetCO },
  { city: "Bucaramanga", region: "Santander", postal: () => "68" + digits(4), phone: phoneCO, street: streetCO },
];

const AR_STREETS = ["Corrientes", "Florida", "Santa Fe", "de Mayo", "Defensa", "Córdoba", "Lavalle", "Rivadavia", "San Martín", "Oroño", "Pellegrini", "Belgrano", "Sarmiento", "Independencia"];
function streetAR(): string {
  return `${pick(["Avenida", "Avenida", "Calle", "Boulevard"])} ${pick(AR_STREETS)} ${100 + randInt(3800)}`;
}
const AR_CITIES: CityPool[] = [
  { city: "Buenos Aires", region: "CABA", postal: () => `C${1000 + randInt(500)}${letter()}${letter()}${letter()}`, phone: () => `+54 9 11 ${digits(4)}-${digits(4)}`, street: streetAR },
  { city: "Córdoba", region: "Córdoba", postal: () => String(5000 + randInt(300)), phone: () => `+54 9 351 ${digits(3)}-${digits(4)}`, street: streetAR },
  { city: "Rosario", region: "Santa Fe", postal: () => String(2000 + randInt(300)), phone: () => `+54 9 341 ${digits(3)}-${digits(4)}`, street: streetAR },
  { city: "Mendoza", region: "Mendoza", postal: () => String(5500 + randInt(200)), phone: () => `+54 9 261 ${digits(3)}-${digits(4)}`, street: streetAR },
  { city: "La Plata", region: "Buenos Aires", postal: () => String(1900 + randInt(100)), phone: () => `+54 9 221 ${digits(3)}-${digits(4)}`, street: streetAR },
  { city: "Mar del Plata", region: "Buenos Aires", postal: () => String(7600 + randInt(100)), phone: () => `+54 9 223 ${digits(3)}-${digits(4)}`, street: streetAR },
  { city: "San Miguel de Tucumán", region: "Tucumán", postal: () => String(4000 + randInt(100)), phone: () => `+54 9 381 ${digits(3)}-${digits(4)}`, street: streetAR },
];

const CL_STREETS = ["Libertador Bernardo O'Higgins", "Providencia", "Agustinas", "Apoquindo", "Huérfanos", "Vicuña Mackenna", "Moneda", "Las Condes", "Ahumada", "Irarrázaval", "Santa Rosa", "Portugal"];
const CL_COMUNAS = ["Santiago Centro", "Providencia", "Las Condes", "Ñuñoa", "La Florida", "Maipú", "Vitacura", "Recoleta", "Independencia", "San Miguel"];
function streetCL(): string {
  return `${pick(["Avenida", "Avenida", "Calle"])} ${pick(CL_STREETS)} ${100 + randInt(6800)}, ${pick(CL_COMUNAS)}`;
}
const phoneCL = () => `+56 9 ${digits(4)} ${digits(4)}`;
const CL_CITIES: CityPool[] = [
  { city: "Santiago", region: "Región Metropolitana", postal: () => pick(["750", "755", "758", "763", "765", "770", "775", "778", "780", "785", "832", "834", "838", "842", "850", "855", "858", "862", "866", "868", "870", "872"]) + digits(4), phone: phoneCL, street: streetCL },
  { city: "Valparaíso", region: "Valparaíso", postal: () => "234" + digits(4), phone: phoneCL, street: streetCL },
  { city: "Viña del Mar", region: "Valparaíso", postal: () => "252" + digits(4), phone: phoneCL, street: streetCL },
  { city: "Concepción", region: "Biobío", postal: () => "403" + digits(4), phone: phoneCL, street: streetCL },
  { city: "Antofagasta", region: "Antofagasta", postal: () => "124" + digits(4), phone: phoneCL, street: streetCL },
  { city: "La Serena", region: "Coquimbo", postal: () => "170" + digits(4), phone: phoneCL, street: streetCL },
  { city: "Temuco", region: "La Araucanía", postal: () => "478" + digits(4), phone: phoneCL, street: streetCL },
];

const PE_STREETS = ["Javier Prado", "Arequipa", "de la Unión", "Colonial", "Universitaria", "Schell", "Benavides", "Angamos", "Brasil", "La Marina"];
const PE_DISTRITOS = ["Miraflores", "San Isidro", "Surco", "Barranco", "San Miguel", "Los Olivos", "Jesús María", "San Borja", "La Molina", "Ate"];
function streetPE(): string {
  return `${pick(["Avenida", "Avenida", "Jirón", "Calle"])} ${pick(PE_STREETS)} ${100 + randInt(2400)}, ${pick(PE_DISTRITOS)}`;
}
const phonePE = () => `+51 9${digits(2)} ${digits(3)} ${digits(3)}`;
const PE_CITIES: CityPool[] = [
  { city: "Lima", region: "Lima", postal: () => "15" + digits(3), phone: phonePE, street: streetPE },
  { city: "Arequipa", region: "Arequipa", postal: () => "04" + digits(3), phone: phonePE, street: streetPE },
  { city: "Trujillo", region: "La Libertad", postal: () => "13" + digits(3), phone: phonePE, street: streetPE },
  { city: "Chiclayo", region: "Lambayeque", postal: () => "14" + digits(3), phone: phonePE, street: streetPE },
  { city: "Cusco", region: "Cusco", postal: () => "08" + digits(3), phone: phonePE, street: streetPE },
  { city: "Piura", region: "Piura", postal: () => "20" + digits(3), phone: phonePE, street: streetPE },
];

const US_STREETS_EN = ["Main St", "Oak Avenue", "Maple Drive", "Cedar Lane", "Elm Street", "Washington Blvd", "Lincoln Avenue", "Park Place", "Biscayne Boulevard", "Calle Ocho", "Sunset Boulevard", "River Road"];
function streetUS(): string {
  return `${100 + randInt(9800)} ${pick(US_STREETS_EN)}`;
}
const US_CITIES: CityPool[] = [
  { city: "Los Ángeles", region: "CA", postal: () => "900" + digits(2), phone: () => `+1 (213) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Houston", region: "TX", postal: () => "770" + digits(2), phone: () => `+1 (713) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Miami", region: "FL", postal: () => "331" + digits(2), phone: () => `+1 (305) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Nueva York", region: "NY", postal: () => "100" + digits(2), phone: () => `+1 (212) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Chicago", region: "IL", postal: () => "606" + digits(2), phone: () => `+1 (312) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Phoenix", region: "AZ", postal: () => "850" + digits(2), phone: () => `+1 (602) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "San Antonio", region: "TX", postal: () => "782" + digits(2), phone: () => `+1 (210) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Dallas", region: "TX", postal: () => "752" + digits(2), phone: () => `+1 (214) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "San Diego", region: "CA", postal: () => "921" + digits(2), phone: () => `+1 (619) ${digits(3)}-${digits(4)}`, street: streetUS },
  { city: "Orlando", region: "FL", postal: () => "328" + digits(2), phone: () => `+1 (407) ${digits(3)}-${digits(4)}`, street: streetUS },
];

export type CountryCode = "ES" | "MX" | "CO" | "AR" | "CL" | "PE" | "US";
export type GenderPref = "Aleatorio" | "Masculino" | "Femenino";

const COUNTRIES: Record<CountryCode, { name: string; cities: CityPool[]; suffixes: string[] }> = {
  ES: { name: "España", cities: ES_CITIES, suffixes: ["S.L.", "S.A."] },
  MX: { name: "México", cities: MX_CITIES, suffixes: ["S.A. de C.V.", "S. de R.L. de C.V."] },
  CO: { name: "Colombia", cities: CO_CITIES, suffixes: ["S.A.S.", "Ltda."] },
  AR: { name: "Argentina", cities: AR_CITIES, suffixes: ["S.A.", "S.R.L."] },
  CL: { name: "Chile", cities: CL_CITIES, suffixes: ["SpA", "Ltda."] },
  PE: { name: "Perú", cities: PE_CITIES, suffixes: ["S.A.C.", "E.I.R.L."] },
  US: { name: "Estados Unidos", cities: US_CITIES, suffixes: ["LLC", "Inc."] },
};

export interface Identity {
  fullName: string; firstName: string; lastName: string; gender: "Masculino" | "Femenino";
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

export function formatFecha(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(d);
}

export function generateIdentity(country: CountryCode, genderPref: GenderPref): Identity {
  const gender: "Masculino" | "Femenino" = genderPref === "Aleatorio" ? (randInt(2) === 0 ? "Masculino" : "Femenino") : genderPref;
  const def = COUNTRIES[country];
  const firstName = pick(gender === "Masculino" ? MALE : FEMALE);
  const apellido1 = pick(SURNAMES);
  let apellido2 = pick(SURNAMES);
  if (apellido2 === apellido1) apellido2 = pick(SURNAMES);
  const lastName = `${apellido1} ${apellido2}`;
  const c = pick(def.cities);
  const firstToken = firstName.split(" ")[0];
  const username = `${slugifyName(firstToken)}.${slugifyName(apellido1)}${randInt(10) === 0 ? "" : randInt(99)}`;
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
    occupation: pick(JOBS), company: `${pick(COMPANY_A)}${pick(COMPANY_B)} ${pick(def.suffixes)}`,
  };
}

export function identityText(idn: Identity): string {
  return [
    `Nombre: ${idn.fullName}`,
    `Sexo: ${idn.gender}`,
    `Dirección: ${idn.street}, ${idn.city}, ${idn.region} ${idn.postal}, ${idn.country}`,
    `Teléfono: ${idn.phone}`,
    `Correo electrónico: ${idn.email}`,
    `Usuario: ${idn.username}`,
    `Contraseña: ${idn.password}`,
    `Fecha de nacimiento: ${formatFecha(idn.birthday)} (edad ${idn.age})`,
    `Profesión: ${idn.occupation}`,
    `Empresa: ${idn.company}`,
  ].join("\n");
}

export function identitiesCSV(list: Identity[]): string {
  const head = "Nombre completo,Nombre,Apellidos,Sexo,Calle,Ciudad,Región,Código postal,País,Teléfono,Correo electrónico,Usuario,Contraseña,Fecha de nacimiento,Edad,Profesión,Empresa";
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
  return (msg.preview || "").trim() || "(Mensaje vacío)";
}
