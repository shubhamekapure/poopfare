#!/usr/bin/env node
/**
 * Fetches real portrait photos for all persons (Wikipedia + Wikidata + search).
 * Run: node scripts/generate-persons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchPersonPhoto, sleep } from "./photo-fetcher.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedPath = path.join(__dirname, "person-seed.json");
const outPath = path.join(__dirname, "../src/data/persons.json");

const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function hashScore(name, country) {
  let h = 0;
  const s = `${country}:${name}`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return 400000 + (h % 4600000);
}

function hashTrend(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 17 + name.charCodeAt(i)) >>> 0;
  return (h % 41) - 20;
}

async function main() {
  const persons = [];
  let idx = 0;
  let found = 0;

  for (const country of seed.countries) {
    for (const p of country.people) {
      idx++;
      const id = `${country.code.toLowerCase()}-${slugify(p.name)}`;
      process.stdout.write(`[${idx}/200] ${p.name}... `);

      const photoUrl = await fetchPersonPhoto(p.name, p.wiki);
      if (photoUrl) found++;
      console.log(photoUrl ? "✓" : "✗");

      persons.push({
        id,
        name: p.name,
        slug: `${country.code.toLowerCase()}-${slugify(p.name)}`,
        wiki: p.wiki,
        photoUrl,
        country: country.name,
        countryCode: country.code,
        nationality: country.name,
        gender: p.gender,
        category: p.category,
        severityTier: p.severityTier,
        charges: p.charges,
        crime: p.crime,
        totalPoopScore: hashScore(p.name, country.code),
        weeklyTrend: hashTrend(p.name),
      });

      await sleep(350);
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(persons, null, 2));
  console.log(`\nWrote ${persons.length} persons → ${outPath}`);
  console.log(`Photos: ${found}/${persons.length}`);

  const missing = persons.filter((x) => !x.photoUrl);
  if (missing.length) {
    console.log("\nStill missing:");
    missing.forEach((m) => console.log(`  - ${m.name} (wiki: ${m.wiki})`));
  }
}

main().catch(console.error);
