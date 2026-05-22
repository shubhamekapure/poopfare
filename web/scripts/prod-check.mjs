#!/usr/bin/env node
/**
 * Smoke-check production readiness. Run after `npm run build`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const required = [
  "src/data/persons.json",
  "src/data/daily-villains.json",
  "public/manifest.json",
  "vercel.json",
  ".env.example",
];

let ok = true;

for (const f of required) {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) {
    console.error(`✗ missing ${f}`);
    ok = false;
  } else {
    console.log(`✓ ${f}`);
  }
}

const persons = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/persons.json"), "utf8"),
);
console.log(`✓ seed roster: ${persons.length} persons`);

const daily = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/daily-villains.json"), "utf8"),
);
const india = (daily.persons ?? []).filter((p) => p.country === "India").length;
console.log(
  `✓ daily batch: ${daily.persons?.length ?? 0} picks (${india} India, date ${daily.date || "unset"})`,
);

if (!ok) process.exit(1);
console.log("\nProduction check passed.");
