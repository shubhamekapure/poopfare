#!/usr/bin/env node
/**
 * Fetch today's top 10 poop-worthy figures from news headlines.
 * Run: npm run fetch:daily-villains
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  fetchDailyVillains,
  loadExistingNamesFromPersonsJson,
} from "./daily-villains-core.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../src/data/daily-villains.json");

async function main() {
  console.log(
    "Fetching daily villains from news headlines (GDELT + Google News)...\n",
  );
  const existing = loadExistingNamesFromPersonsJson();
  const batch = await fetchDailyVillains(existing);

  fs.writeFileSync(outPath, JSON.stringify(batch, null, 2));
  console.log(`\nWrote ${batch.persons.length} daily picks → ${outPath}`);
  console.log(`Source: ${batch.source ?? "news"}`);
  console.log(`India picks: ${batch.indiaCount ?? batch.persons.filter((p) => p.country === "India").length}`);
  console.log(`Batch date: ${batch.date}`);
  batch.persons.forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${p.country}) — ${p.crime}`);
  });

  if (batch.persons.length < 10) {
    console.warn(
      `\nWarning: only ${batch.persons.length}/10 found. News may be quiet — retry later.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
