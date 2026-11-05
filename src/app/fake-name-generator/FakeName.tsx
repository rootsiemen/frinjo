"use client";

import { useMemo, useState } from "react";

const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-stone-900 placeholder-stone-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition";
const labelCls = "block text-sm font-bold text-stone-800 mb-2";

/* ---------------- crypto randomness ---------------- */
export function randInt(maxExclusive: number): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % maxExclusive;
}
export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(arr.length)];
}
function digits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += String(randInt(10));
  return s;
}
function letter(): string {
  return "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[randInt(26)];
}

/* ---------------- data pools ---------------- */
const US_MALE = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", "Kenneth", "Kevin", "Brian", "George", "Timothy", "Ronald", "Edward", "Jeffrey", "Ryan", "Jacob", "Gary", "Nicholas", "Eric", "Jonathan", "Stephen", "Larry", "Justin", "Scott", "Brandon", "Benjamin", "Samuel"];
const US_FEMALE = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Lisa", "Betty", "Margaret", "Sandra", "Ashley", "Kimberly", "Emily", "Donna", "Michelle", "Carol", "Amanda", "Dorothy", "Melissa", "Deborah", "Stephanie", "Rebecca", "Laura", "Sharon", "Cynthia", "Kathleen", "Amy", "Angela", "Ruth", "Anna", "Brenda", "Pamela", "Nicole", "Emma", "Samantha"];
const ANGLO_LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];
const UK_MALE = ["Oliver", "George", "Harry", "Jack", "Jacob", "Noah", "Charlie", "Muhammad", "Thomas", "Oscar", "James", "William", "Henry", "Leo", "Alfie", "Joshua", "Freddie", "Archie", "Isaac", "Tommy"];
const UK_FEMALE = ["Olivia", "Amelia", "Isla", "Ava", "Grace", "Sophie", "Freya", "Ivy", "Ella", "Mia", "Evie", "Lily", "Florence", "Willow", "Poppy", "Charlotte", "Evelyn", "Daisy", "Millie", "Matilda"];
const PK_MALE = ["Muhammad", "Ali", "Ahmed", "Usman", "Bilal", "Hassan", "Hussain", "Hamza", "Omar", "Imran", "Shahid", "Tariq", "Waqas", "Asad", "Zain", "Faisal", "Kamran", "Adnan", "Rizwan", "Naveed", "Shoaib", "Arslan", "Danish", "Farhan", "Irfan", "Kashif", "Salman", "Tayyab", "Umair", "Yasir"];
const PK_FEMALE = ["Fatima", "Ayesha", "Maryam", "Zainab", "Amina", "Hira", "Sana", "Mahnoor", "Iqra", "Nida", "Rabia", "Sadia", "Shazia", "Farah", "Mehwish", "Anam", "Kiran", "Hina", "Saima", "Uzma", "Amna", "Noor", "Rimsha", "Laiba", "Areeba", "Sidra", "Tayyaba", "Bushra", "Samina", "Nosheen"];
const PK_LAST = ["Khan", "Ahmed", "Ali", "Malik", "Hussain", "Shah", "Iqbal", "Butt", "Chaudhry", " Sheikh", "Raza", "Aslam", "Akhtar", "Mahmood", "Siddiqui", "Farooqui", "Ansari", "Qureshi", "Baig", "Mirza", "Gill", "Rana", "Tariq", "Nawaz", "Saleem", "Arif", "Javed", "Hanif", "Rashid", "Aziz"].map((s) => s.trim());

interface CityPool { city: string; region: string; postal: () => string }
const US_CITIES: CityPool[] = [
  { city: "New York", region: "NY", postal: () => "100" + digits(2) }, { city: "Los Angeles", region: "CA", postal: () => "900" + digits(2) },
  { city: "Chicago", region: "IL", postal: () => "606" + digits(2) }, { city: "Houston", region: "TX", postal: () => "770" + digits(2) },
  { city: "Phoenix", region: "AZ", postal: () => "850" + digits(2) }, { city: "Denver", region: "CO", postal: () => "802" + digits(2) },
  { city: "Austin", region: "TX", postal: () => "733" + digits(2) }, { city: "Seattle", region: "WA", postal: () => "981" + digits(2) },
  { city: "Miami", region: "FL", postal: () => "331" + digits(2) }, { city: "Boston", region: "MA", postal: () => "021" + digits(2) },
  { city: "Portland", region: "OR", postal: () => "972" + digits(2) }, { city: "Atlanta", region: "GA", postal: () => "303" + digits(2) },
];
const UK_CITIES: CityPool[] = [
  { city: "London", region: "Greater London", postal: () => `SW${1 + randInt(19)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Manchester", region: "Greater Manchester", postal: () => `M${1 + randInt(40)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Birmingham", region: "West Midlands", postal: () => `B${1 + randInt(40)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Leeds", region: "West Yorkshire", postal: () => `LS${1 + randInt(28)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Glasgow", region: "Scotland", postal: () => `G${1 + randInt(50)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Bristol", region: "South West", postal: () => `BS${1 + randInt(30)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Liverpool", region: "Merseyside", postal: () => `L${1 + randInt(30)} ${1 + randInt(9)}${letter()}${letter()}` },
  { city: "Sheffield", region: "South Yorkshire", postal: () => `S${1 + randInt(35)} ${1 + randInt(9)}${letter()}${letter()}` },
];
const CA_CITIES: CityPool[] = [
  { city: "Toronto", region: "ON", postal: () => `M${4 + randInt(5)}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
  { city: "Vancouver", region: "BC", postal: () => `V${5 + randInt(2)}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
  { city: "Calgary", region: "AB", postal: () => `T${2}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
  { city: "Ottawa", region: "ON", postal: () => `K${1}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
  { city: "Montreal", region: "QC", postal: () => `H${2}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
  { city: "Edmonton", region: "AB", postal: () => `T${5}${letter()} ${randInt(10)}${letter()}${randInt(10)}` },
];
const AU_CITIES: CityPool[] = [
  { city: "Sydney", region: "NSW", postal: () => "2" + digits(3) }, { city: "Melbourne", region: "VIC", postal: () => "3" + digits(3) },
  { city: "Brisbane", region: "QLD", postal: () => "4" + digits(3) }, { city: "Perth", region: "WA", postal: () => "6" + digits(3) },
  { city: "Adelaide", region: "SA", postal: () => "5" + digits(3) }, { city: "Hobart", region: "TAS", postal: () => "7" + digits(3) },
];
const PK_CITIES: CityPool[] = [
  { city: "Karachi", region: "Sindh", postal: () => "74" + digits(3) }, { city: "Lahore", region: "Punjab", postal: () => "54" + digits(3) },
  { city: "Islamabad", region: "ICT", postal: () => "44" + digits(3) }, { city: "Faisalabad", region: "Punjab", postal: () => "38" + digits(3) },
  { city: "Rawalpindi", region: "Punjab", postal: () => "46" + digits(3) }, { city: "Multan", region: "Punjab", postal: () => "60" + digits(3) },
  { city: "Peshawar", region: "KPK", postal: () => "25" + digits(3) }, { city: "Quetta", region: "Balochistan", postal: () => "87" + digits(3) },
  { city: "Hyderabad", region: "Sindh", postal: () => "71" + digits(3) }, { city: "Sialkot", region: "Punjab", postal: () => "51" + digits(3) },
];

const US_STREETS = ["Main St", "Oak Avenue", "Maple Drive", "Cedar Lane", "Elm Street", "Washington Blvd", "Lincoln Avenue", "Park Place", "Hillcrest Road", "Sunset Boulevard", "River Road", "Highland Avenue"];
const UK_STREETS = ["High Street", "Church Road", "Station Road", "Victoria Road", "Kingsway", "Queens Avenue", "Mill Lane", "Green Lane", "Park Road", "London Road", "Manor Drive", "School Lane"];
const PK_STREETS = ["Main Boulevard", "Jinnah Avenue", "Model City Road", "Canal Road", "University Road", "Shahrah-e-Faisal", "Mall Road", "Satellite Town Road", "Bypass Road", "College Road", "Ghazi Road", "Link Road"];
const JOBS = ["Software Developer", "Teacher", "Nurse", "Accountant", "Sales Manager", "Electrician", "Graphic Designer", "Marketing Specialist", "Customer Service Representative", "Truck Driver", "Chef", "Pharmacist", "Civil Engineer", "Data Analyst", "Office Administrator", "Mechanic", "Real Estate Agent", "Journalist", "Physiotherapist", "Store Manager", "Web Designer", "Bank Clerk", "Police Officer", "Architect", "HR Officer", "Delivery Driver", "Dental Assistant", "Fitness Trainer"];
const COMPANY_A = ["North", "Blue", "Prime", "Swift", "Bright", "United", "Global", "Summit", "Harbor", "Silver", "Golden", "Metro"];
const COMPANY_B = ["Peak", "Bridge", "Stone", "Wave", "Field", "Gate", "Point", "Line", "Works", "Labs", "Nest", "Forge"];
const EMAIL_DOMAINS = ["abahi.tech", "abahi.page", "abahi.me"];

export type CountryCode = "US" | "UK" | "CA" | "AU" | "PK";
export interface Identity {
  fullName: string; firstName: string; lastName: string; gender: "Male" | "Female";
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

export function generateIdentity(country: CountryCode, genderPref: "Any" | "Male" | "Female"): Identity {
  const gender: "Male" | "Female" = genderPref === "Any" ? (randInt(2) === 0 ? "Male" : "Female") : genderPref;
  let firstName: string, lastName: string, cityPool: CityPool[], streets: string[], phone: string, countryName: string;
  if (country === "PK") {
    firstName = pick(gender === "Male" ? PK_MALE : PK_FEMALE); lastName = pick(PK_LAST);
    cityPool = PK_CITIES; streets = PK_STREETS; countryName = "Pakistan";
    phone = `+92 3${randInt(10)}${randInt(10)} ${digits(7)}`;
  } else if (country === "UK") {
    firstName = pick(gender === "Male" ? UK_MALE : UK_FEMALE); lastName = pick(ANGLO_LAST);
    cityPool = UK_CITIES; streets = UK_STREETS; countryName = "United Kingdom";
    phone = `+44 7${digits(3)} ${digits(6)}`;
  } else if (country === "CA") {
    firstName = pick(gender === "Male" ? US_MALE : US_FEMALE); lastName = pick(ANGLO_LAST);
    cityPool = CA_CITIES; streets = US_STREETS; countryName = "Canada";
    phone = `+1 (${pick(["416", "604", "403", "613", "514", "780"])}) ${digits(3)}-${digits(4)}`;
  } else if (country === "AU") {
    firstName = pick(gender === "Male" ? US_MALE : US_FEMALE); lastName = pick(ANGLO_LAST);
    cityPool = AU_CITIES; streets = US_STREETS; countryName = "Australia";
    phone = `+61 4${digits(2)} ${digits(3)} ${digits(3)}`;
  } else {
    firstName = pick(gender === "Male" ? US_MALE : US_FEMALE); lastName = pick(ANGLO_LAST);
    cityPool = US_CITIES; streets = US_STREETS; countryName = "United States";
    phone = `+1 (${pick(["212", "310", "312", "713", "602", "303", "512", "206", "305", "617", "503", "404"])}) ${digits(3)}-${digits(4)}`;
  }
  const c = pick(cityPool);
  const house = country === "UK" ? `${1 + randInt(220)}` : `${100 + randInt(9800)}`;
  const street = `${house} ${pick(streets)}`;
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, "")}${randInt(10) === 0 ? "" : randInt(99)}`;
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
    street, city: c.city, region: c.region, postal: c.postal(), country: countryName,
    phone, email, username, password, birthday, age: ageFromDob(dob),
    occupation: pick(JOBS), company: `${pick(COMPANY_A)}${pick(COMPANY_B)} ${pick(["LLC", "Inc", "Ltd", "Group", "Solutions"])}`,
  };
}

export function identityText(idn: Identity): string {
  return [
    `Name: ${idn.fullName}`,
    `Gender: ${idn.gender}`,
    `Address: ${idn.street}, ${idn.city}, ${idn.region} ${idn.postal}, ${idn.country}`,
    `Phone: ${idn.phone}`,
    `Email: ${idn.email}`,
    `Username: ${idn.username}`,
    `Password: ${idn.password}`,
    `Birthday: ${idn.birthday} (age ${idn.age})`,
    `Occupation: ${idn.occupation}`,
    `Company: ${idn.company}`,
  ].join("\n");
}

export function identitiesCSV(list: Identity[]): string {
  const head = "Full Name,First Name,Last Name,Gender,Street,City,Region,Postal Code,Country,Phone,Email,Username,Password,Birthday,Age,Occupation,Company";
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const rows = list.map((i) => [i.fullName, i.firstName, i.lastName, i.gender, i.street, i.city, i.region, i.postal, i.country, i.phone, i.email, i.username, i.password, i.birthday, i.age, i.occupation, i.company].map(esc).join(","));
  return [head, ...rows].join("\n");
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

export default function FakeName() {
  const [country, setCountry] = useState<CountryCode>("US");
  const [gender, setGender] = useState<"Any" | "Male" | "Female">("Any");
  const [mode, setMode] = useState<"identity" | "full" | "first" | "last">("identity");
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(1);
  const [copied, setCopied] = useState("");

  const identities = useMemo(() => {
    void seed;
    return Array.from({ length: count }, () => generateIdentity(country, gender));
  }, [country, gender, count, seed]);

  const namesOnly = useMemo(() => {
    if (mode === "identity") return [];
    return identities.map((i) => (mode === "full" ? i.fullName : mode === "first" ? i.firstName : i.lastName));
  }, [identities, mode]);

  async function copyText(text: string, tag: string) {
    try { await navigator.clipboard.writeText(text); setCopied(tag); setTimeout(() => setCopied(""), 1500); } catch { /* clipboard unavailable */ }
  }

  const field = (label: string, value: string) => (
    <p key={label} className="flex justify-between gap-3 text-sm border-b border-stone-100 py-1.5 last:border-0">
      <span className="font-bold text-stone-400 uppercase text-[11px] tracking-wider pt-0.5">{label}</span>
      <span className="font-semibold text-stone-800 text-right">{value}</span>
    </p>
  );

  return (
    <>
      <section className="py-14 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl border border-stone-200 bg-stone-50/60 p-6 sm:p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className={labelCls} htmlFor="fn-country">Country</label>
                <select id="fn-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value as CountryCode)}>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="PK">Pakistan</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn-gender">Gender</label>
                <select id="fn-gender" className={inputCls} value={gender} onChange={(e) => setGender(e.target.value as typeof gender)}>
                  <option value="Any">Any</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn-mode">Output</label>
                <select id="fn-mode" className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
                  <option value="identity">Full identity</option>
                  <option value="full">Names only — full</option>
                  <option value="first">Names only — first</option>
                  <option value="last">Names only — last</option>
                </select>
              </div>
              <div>
                <label className={labelCls} htmlFor="fn-count">How many (1–100)</label>
                <input id="fn-count" type="number" min={1} max={100} className={inputCls} value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(100, Math.floor(Number(e.target.value) || 1))))} />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => setSeed((s) => s + 1)} className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold px-7 py-3 transition">
                Generate {count > 1 ? `${count} identities` : "identity"}
              </button>
              {mode === "identity" ? (
                <>
                  <button type="button" onClick={() => download("fake-identities.csv", identitiesCSV(identities), "text/csv")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Download CSV</button>
                  <button type="button" onClick={() => download("fake-identities.json", JSON.stringify(identities, null, 2), "application/json")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Download JSON</button>
                  <button type="button" onClick={() => download("fake-identities.txt", identities.map(identityText).join("\n\n"), "text/plain")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">Download TXT</button>
                </>
              ) : (
                <button type="button" onClick={() => copyText(namesOnly.join("\n"), "all")} className="rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-bold text-stone-700 hover:border-orange-400 transition">
                  {copied === "all" ? "Copied!" : "Copy all names"}
                </button>
              )}
            </div>
            <p className="mt-4 text-sm text-stone-400">No daily limit, no sign-up. Everything is generated in your browser with cryptographic randomness — nothing is sent to a server. The email on every identity is a live temp address on our own Temp Mail domains (tempmaill.tech) — its inbox is public and auto-deletes in an hour, so use it for test signups and OTP flows, never for anything private. Identities are for testing, design and writing, never for impersonation or real accounts.</p>
          </div>

          {mode !== "identity" ? (
            <div className="mt-8 rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
              <ol className="space-y-1.5">
                {namesOnly.map((n, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 last:border-0">
                    <span className="font-semibold text-stone-800"><span className="text-stone-400 font-bold mr-3">{i + 1}.</span>{n}</span>
                    <button type="button" onClick={() => copyText(n, `n${i}`)} className="text-xs font-bold text-orange-700 hover:text-orange-800">{copied === `n${i}` ? "Copied!" : "Copy"}</button>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {identities.map((idn, i) => (
                <article key={i} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-stone-900">{idn.fullName}</h3>
                      <p className="text-sm text-stone-500">{idn.occupation} · {idn.company}</p>
                    </div>
                    <button type="button" onClick={() => copyText(identityText(idn), `c${i}`)} className="shrink-0 rounded-full bg-stone-900 text-white px-4 py-2 text-xs font-bold hover:bg-stone-800 transition">
                      {copied === `c${i}` ? "Copied!" : "Copy all"}
                    </button>
                  </div>
                  <div className="mt-4">
                    {field("Gender", idn.gender)}
                    {field("Address", `${idn.street}, ${idn.city}, ${idn.region} ${idn.postal}`)}
                    {field("Country", idn.country)}
                    {field("Phone", idn.phone)}
                    {field("Email", idn.email)}
                    {field("Username", idn.username)}
                    {field("Password", idn.password)}
                    {field("Birthday", `${idn.birthday} (age ${idn.age})`)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-orange-50/60">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-stone-900">How realistic are the combinations?</h2>
          <div className="mt-4 space-y-4 text-stone-600 leading-relaxed">
            <p>
              Every field is drawn from a <strong className="text-stone-900">country-matched pool</strong>: US identities pair SSA-popular
              first names with Census-common surnames and real city/state/ZIP patterns; UK identities use ONS-popular names and
              genuine postcode formats (an outward code, a space, then an inward code); Canadian postal codes follow the
              letter-digit alternation; Australian numbers fall in the right state ranges; and Pakistani identities use local
              name pools with real city postal ranges (Karachi 74xxx, Lahore 54xxx, Faisalabad 38xxx) and the +92 3XX mobile
              format. Phone area codes match the generated city&apos;s region wherever the format includes one.
            </p>
            <p>
              Two deliberate design choices: <strong className="text-stone-900">emails use our own Temp Mail domains</strong>{" "}
              (abahi.tech, abahi.page, abahi.me — the domains of tempmaill.tech), so a test signup or verification code sent to a
              generated address really arrives and can be read by opening that inbox on tempmaill.tech — but the inbox is public
              and auto-deletes within an hour, which keeps generated identities useless for anything private; and{" "}
              <strong className="text-stone-900">no national ID, SSN or card numbers are ever produced</strong> — if a test needs a payment
              value, use your payment provider&apos;s published sandbox test numbers. The generator exists for form testing,
              database seeding, design mockups and fiction; using it to impersonate someone or open real accounts is fraud.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
