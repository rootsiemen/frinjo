// Astronomy for the Big Three calculator — Jean Meeus, "Astronomical
// Algorithms" low-precision series. Sun accurate to ~0.01°, Moon to ~0.3°,
// which fixes the sign correctly except within ~0.3° of a sign cusp (the UI
// flags cusp results honestly). Everything runs in the visitor's browser.

export interface SignInfo {
  name: string;
  glyph: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  ruler: string;
  dates: string;
  sun: string;
  moon: string;
  rising: string;
}

export const SIGNS: SignInfo[] = [
  {
    name: "Aries", glyph: "♈", element: "Fire", ruler: "Mars", dates: "Mar 21 – Apr 19",
    sun: "You lead with instinct. Aries Suns are self-starting, direct and quick to act — happiest when there is a goal to chase and no one slowing the pace.",
    moon: "You process feelings fast and out loud. An Aries Moon needs movement, honesty and room to cool down on its own — never the silent treatment.",
    rising: "People meet your spark first: Aries Rising comes across as bold, energetic and straight-talking, with a presence that fills the doorway before you say a word.",
  },
  {
    name: "Taurus", glyph: "♉", element: "Earth", ruler: "Venus", dates: "Apr 20 – May 20",
    sun: "You build slowly and keep what you build. Taurus Suns are patient, sensual and stubborn about quality — comfort is not a luxury to you, it is the point.",
    moon: "You calm down through the senses: good food, familiar places, a steady routine. A Taurus Moon needs security it can touch before it can relax.",
    rising: "People meet your calm first: Taurus Rising reads as grounded, warm and unhurried, with an easy physical presence that makes others slow down too.",
  },
  {
    name: "Gemini", glyph: "♊", element: "Air", ruler: "Mercury", dates: "May 21 – Jun 20",
    sun: "Your mind runs on questions. Gemini Suns are curious, quick and allergic to boredom — variety is not a distraction for you, it is fuel.",
    moon: "You think your feelings before you feel them. A Gemini Moon needs conversation, new input and someone who will talk it through at midnight.",
    rising: "People meet your wit first: Gemini Rising comes across as bright, chatty and adaptable, collecting people and ideas in every room.",
  },
  {
    name: "Cancer", glyph: "♋", element: "Water", ruler: "Moon", dates: "Jun 21 – Jul 22",
    sun: "You lead with care. Cancer Suns are protective, intuitive and quietly tenacious — home and the people in it are the center everything else orbits.",
    moon: "You feel in tides. A Cancer Moon has a long emotional memory and needs a safe base, familiar faces and permission to retreat into the shell sometimes.",
    rising: "People meet your gentleness first: Cancer Rising reads as kind, approachable and a little guarded until trust is earned — then you are all in.",
  },
  {
    name: "Leo", glyph: "♌", element: "Fire", ruler: "Sun", dates: "Jul 23 – Aug 22",
    sun: "You are here to shine, honestly and warmly. Leo Suns are expressive, loyal and generous — recognition matters because it tells you the light reached someone.",
    moon: "You recharge on appreciation and play. A Leo Moon needs to feel seen by the people it loves, and wilts under indifference more than criticism.",
    rising: "People meet your warmth first: Leo Rising walks in with presence — expressive, proud and magnetic, with a style that is unmistakably your own.",
  },
  {
    name: "Virgo", glyph: "♍", element: "Earth", ruler: "Mercury", dates: "Aug 23 – Sep 22",
    sun: "You improve things. Virgo Suns are precise, useful and quietly proud of doing a job properly — competence is your love language.",
    moon: "You settle by sorting: lists, order, a plan. A Virgo Moon feels safest when life is organised, and shows love through a thousand small practical acts.",
    rising: "People meet your polish first: Virgo Rising comes across as capable, observant and put-together — the one who noticed the detail everyone else missed.",
  },
  {
    name: "Libra", glyph: "♎", element: "Air", ruler: "Venus", dates: "Sep 23 – Oct 22",
    sun: "You are built for balance and beauty. Libra Suns are diplomatic, aesthetic and partnership-minded — you think in 'we' before 'I'.",
    moon: "You need harmony to rest. A Libra Moon is unsettled by conflict and cold shoulders, and recharges through beauty, company and being understood.",
    rising: "People meet your charm first: Libra Rising reads as graceful, friendly and easy to like, with an instinct for making any room feel more civilised.",
  },
  {
    name: "Scorpio", glyph: "♏", element: "Water", ruler: "Pluto", dates: "Oct 23 – Nov 21",
    sun: "You go deep or not at all. Scorpio Suns are intense, private and transformative — you would rather have one true thing than a hundred pleasant ones.",
    moon: "You feel everything at full volume, mostly in private. A Scorpio Moon needs absolute trust and emotional honesty, and remembers every breach of both.",
    rising: "People meet your intensity first: Scorpio Rising has a magnetic, unreadable presence — calm on the surface, clearly running deep underneath.",
  },
  {
    name: "Sagittarius", glyph: "♐", element: "Fire", ruler: "Jupiter", dates: "Nov 22 – Dec 21",
    sun: "You are aimed at the horizon. Sagittarius Suns are restless, honest and philosophical — freedom and meaning are needs, not preferences.",
    moon: "You cheer up by moving: a trip, a new idea, a bigger picture. A Sagittarius Moon cannot stand feeling fenced in, emotionally or otherwise.",
    rising: "People meet your enthusiasm first: Sagittarius Rising comes across as open, funny and adventurous, with a laugh that arrives before you do.",
  },
  {
    name: "Capricorn", glyph: "♑", element: "Earth", ruler: "Saturn", dates: "Dec 22 – Jan 19",
    sun: "You climb. Capricorn Suns are disciplined, dry-humoured and built for the long game — respect is earned, and you intend to earn it.",
    moon: "You feel safest with a plan and a purpose. A Capricorn Moon processes emotion privately and practically, and shows love by providing, reliably.",
    rising: "People meet your composure first: Capricorn Rising reads as serious, capable and self-contained — older than your years, in the best way.",
  },
  {
    name: "Aquarius", glyph: "♒", element: "Air", ruler: "Uranus", dates: "Jan 20 – Feb 18",
    sun: "You think in systems and futures. Aquarius Suns are original, principled and friendly-but-detached — the group matters to you, and so does standing apart from it.",
    moon: "You need space and strangeness to feel at home. An Aquarius Moon processes feelings intellectually first, and recharges with friends, ideas and causes.",
    rising: "People meet your originality first: Aquarius Rising comes across as unconventional, curious and slightly ahead of the room — never quite what they expected.",
  },
  {
    name: "Pisces", glyph: "♓", element: "Water", ruler: "Neptune", dates: "Feb 19 – Mar 20",
    sun: "You feel your way through life. Pisces Suns are compassionate, imaginative and porous to every mood in the room — art and rest are necessities.",
    moon: "You dream vividly and absorb everything. A Pisces Moon needs solitude, music and softness to reset, and feels others' pain as if it were its own.",
    rising: "People meet your softness first: Pisces Rising reads as dreamy, kind and hard to pin down, with an otherworldly calm that puts people at ease.",
  },
];

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const norm360 = (d: number) => ((d % 360) + 360) % 360;

export interface Placement {
  sign: SignInfo;
  longitude: number;
  degreeInSign: number; // 0–30
  cusp: boolean; // within 0.5° of a sign boundary
}

function toPlacement(longitude: number): Placement {
  const lon = norm360(longitude);
  const idx = Math.floor(lon / 30);
  const degreeInSign = lon - idx * 30;
  return {
    sign: SIGNS[idx],
    longitude: lon,
    degreeInSign,
    cusp: degreeInSign < 0.5 || degreeInSign > 29.5,
  };
}

/** Ecliptic longitude of the Sun (degrees), Meeus low precision (~0.01°). */
export function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = norm360(280.46646 + T * (36000.76983 + 0.0003032 * T));
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const C =
    (1.914602 - T * (0.004817 + 0.000014 * T)) * Math.sin(rad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(rad(2 * M)) +
    0.000289 * Math.sin(rad(3 * M));
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  return norm360(trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega)));
}

/** Ecliptic longitude of the Moon (degrees), Meeus truncated series (~0.3°). */
export function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm360(218.3164477 + 481267.88123421 * T);
  const D = norm360(297.8501921 + 445267.1114034 * T);
  const M = norm360(357.5291092 + 35999.0502909 * T);
  const Mp = norm360(134.9633964 + 477198.8675055 * T);
  const F = norm360(93.272095 + 483202.0175233 * T);
  const lon =
    Lp +
    6.289 * Math.sin(rad(Mp)) +
    1.274 * Math.sin(rad(2 * D - Mp)) +
    0.658 * Math.sin(rad(2 * D)) +
    0.214 * Math.sin(rad(2 * Mp)) -
    0.186 * Math.sin(rad(M)) -
    0.114 * Math.sin(rad(2 * F)) -
    0.11 * Math.sin(rad(2 * D - 2 * Mp)) +
    0.056 * Math.sin(rad(2 * D + Mp)) -
    0.034 * Math.sin(rad(3 * Mp));
  return norm360(lon);
}

/** Ascendant longitude (degrees) from UTC date, latitude and east longitude. */
export function ascendantLongitude(dateUtc: Date, lat: number, lonEast: number): number {
  const jd = dateUtc.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  // Greenwich mean sidereal time, degrees
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545) + T * T * (0.000387933 - T / 38710000);
  gmst = norm360(gmst);
  const lst = norm360(gmst + lonEast);
  const eps = rad(23.4392911 - (46.815 * T + 0.00059 * T * T - 0.001813 * T * T * T) / 3600);
  const ramc = rad(lst);
  // The atan2 form resolves the quadrant itself and yields the eastern
  // horizon point (verified against published ephemeris examples).
  const asc = deg(
    Math.atan2(
      Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(eps) + Math.tan(rad(lat)) * Math.sin(eps))
    )
  );
  return norm360(asc);
}

export interface BigThree {
  sun: Placement;
  moon: Placement;
  rising: Placement | null;
}

export function computeBigThree(dateUtc: Date, lat?: number, lonEast?: number): BigThree {
  const jd = dateUtc.getTime() / 86400000 + 2440587.5;
  return {
    sun: toPlacement(sunLongitude(jd)),
    moon: toPlacement(moonLongitude(jd)),
    rising:
      lat !== undefined && lonEast !== undefined
        ? toPlacement(ascendantLongitude(dateUtc, lat, lonEast))
        : null,
  };
}

/**
 * UTC offset (minutes) of an IANA timezone at a given local wall time.
 * Uses Intl to read the zone's wall clock for a guessed UTC instant and
 * corrects once — accurate for all modern dates.
 */
export function tzOffsetMinutes(timeZone: string, year: number, month: number, day: number, hour: number, minute: number): number {
  const guessUtc = Date.UTC(year, month - 1, day, hour, minute);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(guessUtc)).map((p) => [p.type, p.value]));
  const wallAsUtc = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour) % 24, Number(parts.minute), Number(parts.second)
  );
  // offset = wall - utc for the guess instant
  return Math.round((wallAsUtc - guessUtc) / 60000);
}

/** Convert a local birth date/time in an IANA zone to a UTC Date. */
export function localToUtc(
  timeZone: string, year: number, month: number, day: number, hour: number, minute: number
): Date {
  let offset = tzOffsetMinutes(timeZone, year, month, day, hour, minute);
  let utc = Date.UTC(year, month - 1, day, hour, minute) - offset * 60000;
  // Re-check the offset at the corrected instant (DST edges) and refine once.
  const d = new Date(utc);
  const offset2 = tzOffsetMinutes(timeZone, d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
  if (offset2 !== offset) {
    utc = Date.UTC(year, month - 1, day, hour, minute) - offset2 * 60000;
  }
  return new Date(utc);
}

export function formatDegree(degreeInSign: number): string {
  const d = Math.floor(degreeInSign);
  const m = Math.floor((degreeInSign - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}
