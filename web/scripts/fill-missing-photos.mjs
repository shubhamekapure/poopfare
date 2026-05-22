#!/usr/bin/env node
/** Re-fetch photos for entries missing photoUrl (uses seed for wiki titles). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { fetchPersonPhoto, sleep } from "./photo-fetcher.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const personsPath = path.join(__dirname, "../src/data/persons.json");
const seedPath = path.join(__dirname, "person-seed.json");

const persons = JSON.parse(fs.readFileSync(personsPath, "utf8"));
const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));

const wikiByName = new Map();
for (const c of seed.countries) {
  for (const p of c.people) wikiByName.set(p.name, p.wiki);
}

let fixed = 0;
const toFix = persons.filter((p) => !p.photoUrl);
console.log(`Refetching ${toFix.length} missing photos...\n`);

for (let i = 0; i < persons.length; i++) {
  const p = persons[i];
  const wiki = p.wiki ?? wikiByName.get(p.name) ?? p.name;
  if (!p.wiki) persons[i].wiki = wiki;

  if (p.photoUrl) continue;

  process.stdout.write(`[${fixed + 1}/${toFix.length}] ${p.name}... `);
  const photoUrl = await fetchPersonPhoto(p.name, wiki);
  if (photoUrl) {
    persons[i].photoUrl = photoUrl;
    fixed++;
    console.log("✓");
  } else {
    console.log("✗");
  }
  await sleep(450);
}

fs.writeFileSync(personsPath, JSON.stringify(persons, null, 2));
const total = persons.filter((p) => p.photoUrl).length;
console.log(`\nAdded ${fixed} photos. Total: ${total}/${persons.length}`);

const still = persons.filter((p) => !p.photoUrl);
if (still.length) {
  console.log("\nStill missing (fix wiki title in person-seed.json):");
  still.forEach((m) => console.log(`  - ${m.name}`));
}
