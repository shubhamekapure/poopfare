/**
 * Daily villain discovery: news headlines (GDELT + Google News RSS) → Wikipedia enrich.
 * Wikipedia is used for photos/metadata only, not for "who's trending".
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchPersonPhoto, sleep } from "./photo-fetcher.mjs";

const UA = "PoopFare/1.0 (satire; educational; +https://poopfare.com)";
const DAILY_COUNT = 12;
const INDIA_MIN = 6;
const WIKI_DELAY_MS = 550;
const MAX_WIKI_LOOKUPS = 55;

const COUNTRY_CODES = {
  India: "IN",
  USA: "US",
  "United States": "US",
  England: "GB",
  "United Kingdom": "GB",
  Russia: "RU",
  Pakistan: "PK",
  France: "FR",
  Portugal: "PT",
  Germany: "DE",
  China: "CN",
  Brazil: "BR",
  Mexico: "MX",
  Japan: "JP",
  Australia: "AU",
  Canada: "CA",
  "South Africa": "ZA",
  Nigeria: "NG",
  Turkey: "TR",
  Italy: "IT",
  Spain: "ES",
  "Saudi Arabia": "SA",
};

const COUNTRY_ALIASES = {
  US: "USA",
  GB: "England",
  "United States of America": "USA",
  "United States": "USA",
  "People's Republic of China": "China",
  "Russian Federation": "Russia",
  Türkiye: "Turkey",
  "United Kingdom": "England",
  "United Kingdom of Great Britain and Northern Ireland": "England",
};

const NAME_BLOCKLIST = new Set(
  [
    "White House",
    "United States",
    "New York",
    "Los Angeles",
    "Supreme Court",
    "European Union",
    "Google News",
    "Prime Minister",
    "Donald Trump",
    "Elon Musk",
    "Joe Biden",
    "Red Cross",
    "Wall Street",
    "Silicon Valley",
    "Middle East",
    "South Korea",
    "North Korea",
    "Hong Kong",
    "San Francisco",
    "Las Vegas",
    "Real Estate",
    "Social Media",
    "Artificial Intelligence",
    "Breaking News",
    "Fox News",
    "Daily Mail",
    "The Guardian",
    "Associated Press",
    "Reuters",
    "BBC News",
  ].map((n) => normalizeName(n)),
);

const GDELT_QUERIES = [
  `(scandal OR indicted OR convicted OR fraud OR backlash OR outrage OR resign OR "steps down") sourcelang:english`,
  `(politician OR CEO OR celebrity) (arrest OR lawsuit OR probe OR investigation) sourcelang:english`,
];

const GDELT_INDIA_QUERIES = [
  `(scandal OR fraud OR corruption OR controversy OR arrest OR probe OR raid OR chargesheet OR "ED raid" OR CBI) sourcecountry:IN`,
  `(India OR Delhi OR Mumbai) (politician OR minister OR MP OR MLA OR CEO) (scandal OR fraud OR arrest OR investigation OR resign) sourcelang:english`,
  `(scam OR "money laundering" OR embezzle OR outrage) (India OR Indian) sourcelang:english`,
];

const GOOGLE_NEWS_FEEDS = [
  "https://news.google.com/rss/search?q=scandal+indicted+controversy+when:1d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=CEO+fraud+resign+when:1d&hl=en-US&gl=US&ceid=US:en",
  "https://news.google.com/rss/search?q=politician+investigation+when:1d&hl=en-US&gl=US&ceid=US:en",
];

const GOOGLE_NEWS_INDIA_FEEDS = [
  "https://news.google.com/rss/search?q=India+scandal+fraud+controversy+when:1d&hl=en-IN&gl=IN&ceid=IN:en",
  "https://news.google.com/rss/search?q=India+politician+arrest+investigation+when:1d&hl=en-IN&gl=IN&ceid=IN:en",
  "https://news.google.com/rss/search?q=ED+raid+CBI+India+when:1d&hl=en-IN&gl=IN&ceid=IN:en",
  "https://news.google.com/rss/search?q=India+celebrity+controversy+when:1d&hl=en-IN&gl=IN&ceid=IN:en",
  "https://news.google.com/rss/search?q=India+scam+chargesheet+when:1d&hl=en-IN&gl=IN&ceid=IN:en",
];

function todayKey() {
  return new Date().toLocaleDateString("en-CA");
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function decodeXml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .trim();
}

async function fetchJson(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json" },
      });
      if (res.status === 429) {
        await sleep(2000 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      return await res.json();
    } catch {
      await sleep(800);
    }
  }
  return null;
}

async function fetchText(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/rss+xml, text/xml" },
      });
      if (res.status === 429) {
        await sleep(2000 * (i + 1));
        continue;
      }
      if (!res.ok) return "";
      return await res.text();
    } catch {
      await sleep(800);
    }
  }
  return "";
}

async function fetchGdeltHeadlines(queries = GDELT_QUERIES) {
  const headlines = [];

  for (const query of queries) {
    const url = new URL("https://api.gdeltproject.org/api/v2/doc/doc");
    url.searchParams.set("query", query);
    url.searchParams.set("mode", "artlist");
    url.searchParams.set("maxrecords", "80");
    url.searchParams.set("format", "json");
    url.searchParams.set("sort", "datedesc");
    url.searchParams.set("timespan", "24h");

    const data = await fetchJson(url.toString());
    for (const art of data?.articles ?? []) {
      if (art?.title) headlines.push(decodeXml(art.title));
    }
    await sleep(1200);
  }

  return headlines;
}

async function fetchGdeltIndiaHeadlines() {
  return fetchGdeltHeadlines(GDELT_INDIA_QUERIES);
}

function parseGoogleNewsRss(xml) {
  const titles = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRe.exec(xml))) {
    const block = match[1];
    const titleMatch = block.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      let title = decodeXml(titleMatch[1]);
      title = title.replace(/\s*-\s*[^-]+$/, "").trim();
      if (title) titles.push(title);
    }
  }
  return titles;
}

async function fetchGoogleNewsHeadlines(feeds = GOOGLE_NEWS_FEEDS) {
  const headlines = [];
  for (const feed of feeds) {
    const xml = await fetchText(feed);
    headlines.push(...parseGoogleNewsRss(xml));
    await sleep(1500);
  }
  return headlines;
}

async function fetchGoogleNewsIndiaHeadlines() {
  return fetchGoogleNewsHeadlines(GOOGLE_NEWS_INDIA_FEEDS);
}

function extractNameCandidates(headline) {
  const cleaned = headline
    .replace(/['']/g, "'")
    .replace(/\([^)]*\)/g, " ")
    .replace(/["']/g, " ");

  const re =
    /\b([A-Z][a-z]+(?:[''][A-Z][a-z]+)?(?:\s+(?:[A-Z]\.?|[A-Z][a-z]+|De|Da|Van|Al|El|Bin)){0,3})\b/g;
  const found = [];
  let m;
  while ((m = re.exec(cleaned))) {
    const name = m[1].trim();
    if (name.split(/\s+/).length < 2) continue;
    if (NAME_BLOCKLIST.has(normalizeName(name))) continue;
    if (/^(The|And|But|For|With|From|After|Before|During|About)\b/.test(name)) {
      continue;
    }
    found.push(name);
  }
  return found;
}

const SCANDAL_RE =
  /scandal|indict|convict|fraud|backlash|outrage|resign|probe|investigation|lawsuit|arrest|guilty|misconduct|corruption|controversy|prison|sentenced|defraud|embezzle|sanction|raid|chargesheet|scam|CBI|ED raid|FIR|lokpal|bail denied|money laundering/i;

const POSITIVE_RE =
  /joins|celebrates|wins|award|honor|hero|donates|charity|wedding|birthday|reunion|musical send/i;

function scoreCandidates(headlines, { indiaBoost = false } = {}) {
  /** @type {Map<string, { name: string, score: number, headline: string, india: boolean }>} */
  const map = new Map();

  for (const headline of headlines) {
    if (POSITIVE_RE.test(headline) && !SCANDAL_RE.test(headline)) continue;
    if (!SCANDAL_RE.test(headline)) continue;

    const indiaHeadline =
      indiaBoost ||
      /\bIndia\b|\bIndian\b|\bDelhi\b|\bMumbai\b|\bCBI\b|\bED raid\b/i.test(
        headline,
      );

    for (const name of extractNameCandidates(headline).slice(0, 3)) {
      const lastName = name.split(/\s+/).pop() ?? name;
      if (!headline.toLowerCase().includes(lastName.toLowerCase())) continue;

      const key = normalizeName(name);
      const bump = indiaHeadline ? 3 : 0;
      const prev = map.get(key);
      if (prev) {
        prev.score += 2 + bump;
        prev.india = prev.india || indiaHeadline;
        if (headline.length > prev.headline.length) prev.headline = headline;
      } else {
        map.set(key, {
          name,
          score: 2 + bump,
          headline,
          india: indiaHeadline,
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => b.score - a.score);
}

function isRejectedTitle(title) {
  const t = title.toLowerCase();
  return (
    title.includes("(") ||
    t.includes("scheme") ||
    t.includes("movement") ||
    t.includes("party") ||
    t.includes("administration") ||
    t.includes("company") ||
    t.includes("inc.") ||
    t.includes(" ltd") ||
    t.includes("film") ||
    t.includes("movie") ||
    t.includes("album")
  );
}

async function fetchWikiSummary(title) {
  const encoded = encodeURIComponent(title.replace(/ /g, "_"));
  return fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`,
  );
}

async function resolveWikiPerson(name, { countryHint } = {}) {
  const direct = await fetchWikiSummary(name);
  if (direct?.type === "standard" && (await isHumanBiography(name, direct))) {
    return { title: direct.title ?? name, summary: direct };
  }

  const searchQueries = countryHint
    ? [`${name} ${countryHint}`, `${name} Indian`, name]
    : [name];

  for (const query of searchQueries) {
    const search = await fetchJson(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=5&format=json`,
    );
    for (const hit of search?.query?.search ?? []) {
      const summary = await fetchWikiSummary(hit.title);
      if (
        summary?.type === "standard" &&
        (await isHumanBiography(hit.title, summary))
      ) {
        return { title: hit.title, summary };
      }
      await sleep(200);
    }
  }
  return null;
}

function isIndianPerson(meta, summary) {
  if (meta.country === "India") return true;
  const desc = (summary?.description ?? "").toLowerCase();
  return desc.includes("indian");
}

async function isHumanBiography(title, summary) {
  if (!summary || summary.type === "disambiguation") return false;
  const desc = (summary.description ?? "").toLowerCase();
  const personHints = [
    "politician",
    "business",
    "actor",
    "actress",
    "singer",
    "musician",
    "ceo",
    "president",
    "minister",
    "player",
    "writer",
    "journalist",
    "entrepreneur",
    "billionaire",
    "celebrity",
    "model",
    "director",
    "comedian",
    "monarch",
    "footballer",
    "criminal",
    "convict",
    "executive",
  ];
  if (personHints.some((h) => desc.includes(h))) return true;

  const wikiTitle = title.replace(/ /g, "_");
  const catData = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=categories&cllimit=15&format=json`,
  );
  const page = Object.values(catData?.query?.pages ?? {})[0];
  const cats = (page?.categories ?? []).map((c) => c.title.toLowerCase());
  return cats.some(
    (c) =>
      c.includes("births") ||
      c.includes("living people") ||
      c.includes("politicians") ||
      c.includes("businesspeople") ||
      c.includes("actors"),
  );
}

async function fetchWikidataMeta(title, summary) {
  const wikiTitle = title.replace(/ /g, "_");
  const data = await fetchJson(
    `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageprops&ppprop=wikibase_item&format=json`,
  );
  const page = Object.values(data?.query?.pages ?? {})[0];
  const qid = page?.pageprops?.wikibase_item;

  let country = "USA";
  let gender = "Other";
  let category = "Celebrity";

  if (qid) {
    const entity = await fetchJson(
      `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`,
    );
    const claims = entity?.entities?.[qid]?.claims ?? {};

    const countryId = claims.P27?.[0]?.mainsnak?.datavalue?.value?.id;
    if (countryId) {
      const countryEntity = await fetchJson(
        `https://www.wikidata.org/wiki/Special:EntityData/${countryId}.json`,
      );
      const label =
        countryEntity?.entities?.[countryId]?.labels?.en?.value ?? "USA";
      country = COUNTRY_ALIASES[label] ?? label;
      if (!COUNTRY_CODES[country]) country = "USA";
    }

    const genderId = claims.P21?.[0]?.mainsnak?.datavalue?.value?.id;
    if (genderId === "Q6581097") gender = "Male";
    if (genderId === "Q6581072") gender = "Female";
  }

  const desc = (summary?.description ?? "").toLowerCase();
  if (
    desc.includes("politician") ||
    desc.includes("president") ||
    desc.includes("minister")
  ) {
    category = "Politician";
  } else if (
    desc.includes("business") ||
    desc.includes("ceo") ||
    desc.includes("entrepreneur")
  ) {
    category = "Corporate";
  }

  return { country, gender, category };
}

function headlineToCrime(headline, name) {
  let h = headline
    .replace(new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "")
    .replace(/^[\s:,-–—]+/, "")
    .replace(/[\s:,-–—]+$/, "")
    .trim();

  if (h.length > 20 && h.length <= 110) {
    return h.charAt(0).toUpperCase() + h.slice(1);
  }
  if (headline.length <= 110) return headline;
  return `Making headlines for all the wrong reasons — ${name}`;
}

function satiricalCharges(name, crime, headline) {
  return [
    crime,
    `Named in today's scandal coverage: "${headline.slice(0, 60)}${headline.length > 60 ? "…" : ""}"`,
    `${name.split(" ").pop()}ing the news cycle, PoopFare-style`,
  ].slice(0, 3);
}

function hashScore(name, countryCode) {
  let h = 0;
  const s = `${countryCode}:${name}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 8000 + (h % 120000);
}

function hashTrend(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 17 + name.charCodeAt(i)) >>> 0;
  return 15 + (h % 25);
}

async function discoverFromNews() {
  console.log("  → GDELT India (24h scandal headlines)…");
  const gdeltIndia = await fetchGdeltIndiaHeadlines();
  console.log(`    ${gdeltIndia.length} India headlines`);

  console.log("  → Google News India RSS (24h)…");
  const googleIndia = await fetchGoogleNewsIndiaHeadlines();
  console.log(`    ${googleIndia.length} India headlines`);

  console.log("  → GDELT global (24h)…");
  const gdelt = await fetchGdeltHeadlines();
  console.log(`    ${gdelt.length} global headlines`);

  console.log("  → Google News global RSS (24h)…");
  const google = await fetchGoogleNewsHeadlines();
  console.log(`    ${google.length} global headlines`);

  const indiaHeadlines = [...new Set([...gdeltIndia, ...googleIndia])];
  const globalHeadlines = [...new Set([...gdelt, ...google])];

  const indiaCandidates = scoreCandidates(indiaHeadlines, { indiaBoost: true });
  const globalCandidates = scoreCandidates(globalHeadlines);

  console.log(
    `  → ${indiaCandidates.length} India candidates, ${globalCandidates.length} global`,
  );

  return { indiaCandidates, globalCandidates };
}

async function pickFromPool(
  candidates,
  limit,
  existingNames,
  { countryHint, requireIndian = false, regionTag = "global" },
) {
  const picked = [];
  let wikiLookups = 0;

  for (const cand of candidates) {
    if (picked.length >= limit) break;
    if (wikiLookups >= MAX_WIKI_LOOKUPS) break;
    if (existingNames.has(normalizeName(cand.name))) continue;

    wikiLookups++;
    const resolved = await resolveWikiPerson(cand.name, { countryHint });
    if (!resolved) {
      await sleep(WIKI_DELAY_MS);
      continue;
    }

    const displayName = resolved.summary.title ?? cand.name;
    if (existingNames.has(normalizeName(displayName))) {
      await sleep(WIKI_DELAY_MS);
      continue;
    }
    if (isRejectedTitle(displayName)) {
      await sleep(WIKI_DELAY_MS);
      continue;
    }
    if (!SCANDAL_RE.test(cand.headline)) {
      await sleep(WIKI_DELAY_MS);
      continue;
    }

    let meta = await fetchWikidataMeta(resolved.title, resolved.summary);
    if (requireIndian && !isIndianPerson(meta, resolved.summary)) {
      await sleep(WIKI_DELAY_MS);
      continue;
    }
    if (regionTag === "india" && meta.country !== "India" && isIndianPerson(meta, resolved.summary)) {
      meta = { ...meta, country: "India" };
    }

    const countryCode = COUNTRY_CODES[meta.country] ?? "US";
    const crime = headlineToCrime(cand.headline, displayName);
    const photoUrl = await fetchPersonPhoto(displayName, resolved.title);

    picked.push({
      id: `daily-${countryCode.toLowerCase()}-${slugify(displayName)}`,
      name: displayName,
      slug: `${countryCode.toLowerCase()}-${slugify(displayName)}`,
      wiki: resolved.title,
      photoUrl,
      country: meta.country,
      countryCode,
      nationality: meta.country,
      gender: meta.gender,
      category: meta.category,
      severityTier: "Villain of the Week",
      charges: satiricalCharges(displayName, crime, cand.headline),
      crime,
      totalPoopScore: hashScore(displayName, countryCode),
      weeklyTrend: hashTrend(displayName),
      isDailyPick: true,
      dailyBatchDate: todayKey(),
      newsScore: cand.score,
      region: regionTag,
    });

    existingNames.add(normalizeName(displayName));
    await sleep(WIKI_DELAY_MS);
  }

  return picked;
}

/**
 * @param {Set<string>} existingNames normalized names already in roster
 */
export async function fetchDailyVillains(existingNames = new Set()) {
  const names = new Set(existingNames);
  const { indiaCandidates, globalCandidates } = await discoverFromNews();

  console.log(`  → Picking up to ${INDIA_MIN} India + ${DAILY_COUNT - INDIA_MIN} global…`);

  const indiaPicked = await pickFromPool(
    indiaCandidates,
    INDIA_MIN,
    names,
    { countryHint: "India", requireIndian: true, regionTag: "india" },
  );

  let indiaExtra = [];
  if (indiaPicked.length < INDIA_MIN) {
    indiaExtra = await pickFromPool(
      indiaCandidates,
      INDIA_MIN - indiaPicked.length,
      names,
      { countryHint: "India", requireIndian: false, regionTag: "india" },
    );
  }

  const allIndia = [...indiaPicked, ...indiaExtra];
  const globalLimit = DAILY_COUNT - allIndia.length;

  const globalPicked = await pickFromPool(
    [...globalCandidates, ...indiaCandidates],
    globalLimit,
    names,
    { regionTag: "global" },
  );

  const persons = [...allIndia, ...globalPicked].slice(0, DAILY_COUNT);
  const indiaCount = persons.filter((p) => p.country === "India").length;

  return {
    date: todayKey(),
    fetchedAt: new Date().toISOString(),
    source: "gdelt+google-news",
    indiaCount,
    persons,
  };
}

export function loadExistingNamesFromPersonsJson() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const personsPath = path.join(__dirname, "../src/data/persons.json");
  const dailyPath = path.join(__dirname, "../src/data/daily-villains.json");

  const names = new Set();
  if (fs.existsSync(personsPath)) {
    for (const p of JSON.parse(fs.readFileSync(personsPath, "utf8"))) {
      names.add(normalizeName(p.name));
    }
  }
  if (fs.existsSync(dailyPath)) {
    const daily = JSON.parse(fs.readFileSync(dailyPath, "utf8"));
    for (const p of daily.persons ?? []) {
      names.add(normalizeName(p.name));
    }
  }
  return names;
}

export { todayKey, DAILY_COUNT, INDIA_MIN, normalizeName };
