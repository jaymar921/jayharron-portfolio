import { request } from "./api/client";

/**
 * Says hello to the visitor in their own language on the boot screen.
 *
 * The country comes from GET /api/geo, which reads the edge header Vercel
 * already attaches. When that is slow, missing (local dev) or blocked, the
 * browser's timezone and language stand in for it. Nothing here is stored or
 * sent anywhere.
 */

/**
 * Time of day greetings per language. `noon` falls back to `afternoon`, and a
 * language with a single all-day greeting only sets `hello`. Every phrase was
 * picked to be gender neutral, since the screen cannot know who is reading.
 */
const GREETINGS = {
  en: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    welcome: "Welcome, make yourself at home.",
  },
  fil: {
    morning: "Magandang umaga!",
    noon: "Magandang tanghali!",
    afternoon: "Magandang hapon!",
    evening: "Magandang gabi!",
    welcome: "Maligayang pagdating.",
  },
  es: {
    morning: "¡Hola, buenos días!",
    afternoon: "¡Hola, buenas tardes!",
    evening: "¡Hola, buenas noches!",
    welcome: "Te doy la bienvenida.",
  },
  pt: {
    morning: "Olá, bom dia!",
    afternoon: "Olá, boa tarde!",
    evening: "Olá, boa noite!",
    welcome: "Boas-vindas!",
  },
  fr: {
    morning: "Bonjour !",
    afternoon: "Bonjour !",
    evening: "Bonsoir !",
    welcome: "Bienvenue.",
  },
  de: {
    morning: "Guten Morgen!",
    afternoon: "Guten Tag!",
    evening: "Guten Abend!",
    welcome: "Willkommen.",
  },
  it: {
    morning: "Buongiorno!",
    afternoon: "Buon pomeriggio!",
    evening: "Buonasera!",
    welcome: "Ti do il benvenuto.",
  },
  nl: {
    morning: "Goedemorgen!",
    afternoon: "Goedemiddag!",
    evening: "Goedenavond!",
    welcome: "Welkom.",
  },
  ja: {
    morning: "おはようございます",
    afternoon: "こんにちは",
    evening: "こんばんは",
    welcome: "ようこそ",
  },
  ko: { hello: "안녕하세요", welcome: "환영합니다" },
  "zh-Hans": {
    morning: "早上好",
    afternoon: "下午好",
    evening: "晚上好",
    welcome: "欢迎",
  },
  "zh-Hant": { hello: "你好", welcome: "歡迎" },
  id: {
    morning: "Selamat pagi!",
    noon: "Selamat siang!",
    afternoon: "Selamat sore!",
    evening: "Selamat malam!",
    welcome: "Selamat datang.",
  },
  ms: {
    morning: "Selamat pagi!",
    noon: "Selamat tengah hari!",
    afternoon: "Selamat petang!",
    evening: "Selamat malam!",
    welcome: "Selamat datang.",
  },
  vi: { hello: "Xin chào!", welcome: "Chào mừng bạn." },
  th: { hello: "สวัสดี", welcome: "ยินดีต้อนรับ" },
  hi: { hello: "नमस्ते", welcome: "स्वागत है" },
  ru: {
    morning: "Доброе утро!",
    afternoon: "Добрый день!",
    evening: "Добрый вечер!",
    welcome: "Добро пожаловать.",
  },
  uk: {
    morning: "Доброго ранку!",
    afternoon: "Добрий день!",
    evening: "Добрий вечір!",
    welcome: "Ласкаво просимо.",
  },
  pl: {
    morning: "Dzień dobry!",
    afternoon: "Dzień dobry!",
    evening: "Dobry wieczór!",
    welcome: "Witaj.",
  },
  tr: {
    morning: "Günaydın!",
    afternoon: "İyi günler!",
    evening: "İyi akşamlar!",
    welcome: "Hoş geldiniz.",
  },
  ar: {
    morning: "صباح الخير",
    afternoon: "مساء الخير",
    evening: "مساء الخير",
    welcome: "أهلاً وسهلاً",
    dir: "rtl",
  },
  sv: {
    morning: "God morgon!",
    afternoon: "God eftermiddag!",
    evening: "God kväll!",
    welcome: "Välkommen.",
  },
  nb: {
    morning: "God morgen!",
    afternoon: "God ettermiddag!",
    evening: "God kveld!",
    welcome: "Velkommen.",
  },
  da: {
    morning: "Godmorgen!",
    afternoon: "God eftermiddag!",
    evening: "Godaften!",
    welcome: "Velkommen.",
  },
  fi: {
    morning: "Hyvää huomenta!",
    afternoon: "Hyvää päivää!",
    evening: "Hyvää iltaa!",
    welcome: "Tervetuloa.",
  },
  el: {
    morning: "Καλημέρα!",
    afternoon: "Καλησπέρα!",
    evening: "Καλησπέρα!",
    welcome: "Καλώς ήρθατε.",
  },
};

/** Countries whose main language has an entry above. Anything else is English. */
const COUNTRY_LANGUAGE = {
  PH: "fil",
  ...Object.fromEntries(
    "ES MX AR CO CL PE VE EC GT CU BO DO HN PY SV NI CR PA UY PR"
      .split(" ")
      .map((code) => [code, "es"]),
  ),
  ...Object.fromEntries("BR PT AO MZ".split(" ").map((code) => [code, "pt"])),
  ...Object.fromEntries("FR MC".split(" ").map((code) => [code, "fr"])),
  ...Object.fromEntries("DE AT LI".split(" ").map((code) => [code, "de"])),
  ...Object.fromEntries("IT SM".split(" ").map((code) => [code, "it"])),
  NL: "nl",
  JP: "ja",
  KR: "ko",
  CN: "zh-Hans",
  ...Object.fromEntries("TW HK MO".split(" ").map((code) => [code, "zh-Hant"])),
  ID: "id",
  ...Object.fromEntries("MY BN".split(" ").map((code) => [code, "ms"])),
  VN: "vi",
  TH: "th",
  IN: "hi",
  RU: "ru",
  UA: "uk",
  PL: "pl",
  TR: "tr",
  ...Object.fromEntries(
    "SA AE EG QA KW BH OM JO LB IQ MA DZ TN LY YE"
      .split(" ")
      .map((code) => [code, "ar"]),
  ),
  SE: "sv",
  NO: "nb",
  DK: "da",
  FI: "fi",
  ...Object.fromEntries("GR CY".split(" ").map((code) => [code, "el"])),
};

/**
 * Timezones that pin a country down well enough to stand in for the edge
 * header. Plenty of Filipino browsers run in en-US, so the language alone
 * would greet most visitors from home in English.
 */
const TIMEZONE_COUNTRY = {
  "Asia/Manila": "PH",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Taipei": "TW",
  "Asia/Hong_Kong": "HK",
  "Asia/Jakarta": "ID",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Saigon": "VN",
  "Asia/Bangkok": "TH",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Africa/Cairo": "EG",
  "Europe/Madrid": "ES",
  "Europe/Lisbon": "PT",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Vienna": "AT",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Warsaw": "PL",
  "Europe/Istanbul": "TR",
  "Europe/Moscow": "RU",
  "Europe/Kyiv": "UA",
  "Europe/Kiev": "UA",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Athens": "GR",
  "America/Mexico_City": "MX",
  "America/Sao_Paulo": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Santiago": "CL",
  "America/Lima": "PE",
};

/** Browser language tags that name a language under another code. */
const LANGUAGE_ALIASES = { tl: "fil", no: "nb", nn: "nb" };

function browserLanguages() {
  if (typeof navigator === "undefined") return [];
  return navigator.languages?.length ? navigator.languages : [navigator.language];
}

function countryFromTimezone() {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_COUNTRY[zone] ?? null;
  } catch {
    return null;
  }
}

/** "es-MX" says Mexico; a bare "es" says nothing about where. */
function countryFromLanguage() {
  for (const tag of browserLanguages()) {
    const region = /^[a-z]{2,3}(?:-[A-Za-z]{4})?-([A-Z]{2})\b/.exec(tag ?? "");
    if (region) return region[1];
  }
  return null;
}

function languageFromBrowser() {
  for (const tag of browserLanguages()) {
    if (!tag) continue;
    const lower = tag.toLowerCase();
    if (lower.startsWith("zh")) {
      return /-(tw|hk|mo|hant)/.test(lower) ? "zh-Hant" : "zh-Hans";
    }
    const base = lower.split("-")[0];
    const lang = LANGUAGE_ALIASES[base] ?? base;
    if (GREETINGS[lang]) return lang;
  }
  return null;
}

function periodOf(hour) {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 13) return "noon";
  if (hour >= 13 && hour < 18) return "afternoon";
  return "evening";
}

function countryName(code) {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

/**
 * Everything the boot screen needs to greet one visitor. `edgeCountry` is the
 * answer from the API when there is one; without it the browser's own hints
 * decide.
 */
export function resolveGreeting(edgeCountry = null, now = new Date()) {
  const country = edgeCountry ?? countryFromTimezone() ?? countryFromLanguage();
  const lang =
    (country && COUNTRY_LANGUAGE[country]) ??
    (country ? "en" : languageFromBrowser()) ??
    "en";

  const phrases = GREETINGS[lang];
  const hour = now.getHours();
  const period = periodOf(hour);
  // Without a word for midday, eleven o'clock is still morning.
  const fallback = hour < 12 ? phrases.morning : phrases.afternoon;
  const greeting =
    phrases.hello ?? (period === "noon" ? phrases.noon ?? fallback : phrases[period]);

  return {
    country,
    countryName: countryName(country),
    lang,
    dir: phrases.dir ?? "ltr",
    greeting,
    welcome: phrases.welcome,
  };
}

/**
 * Asks the API where the visitor is, giving up quickly: the boot screen is
 * only on screen for a few seconds and a guess is better than a late answer.
 */
export async function fetchVisitorCountry({ timeoutMs = 1500 } = {}) {
  try {
    const payload = await request("/api/geo", { timeoutMs });
    const code = typeof payload?.country === "string" ? payload.country : null;
    return code && /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}
