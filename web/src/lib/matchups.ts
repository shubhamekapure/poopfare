import type { Person, Matchup } from "@/lib/types";
import { persons as seedPersons } from "@/data/persons";

export const COUNTRIES = [
  "India",
  "USA",
  "England",
  "Russia",
  "Pakistan",
  "France",
  "Portugal",
  "Germany",
  "China",
  "Brazil",
  "Mexico",
  "Japan",
  "Australia",
  "Canada",
  "South Africa",
  "Nigeria",
  "Turkey",
  "Italy",
  "Spain",
  "Saudi Arabia",
] as const;

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("--");
}

function findInPool(pool: Person[], id: string): Person | undefined {
  return pool.find((p) => p.id === id);
}

export function createMatchup(
  personAId: string,
  personBId: string,
  pool: Person[] = seedPersons,
): Matchup {
  const personA = findInPool(pool, personAId)!;
  const personB = findInPool(pool, personBId)!;
  const [left, right] =
    personA.slug < personB.slug ? [personA, personB] : [personB, personA];
  const slug = `${left.slug}-vs-${right.slug}`;
  return {
    id: pairKey(left.id, right.id),
    slug,
    personAId: left.id,
    personBId: right.id,
    aVotes: 0,
    bVotes: 0,
  };
}

export function getMatchupBySlug(slug: string, pool: Person[] = seedPersons): Matchup | null {
  const sep = "-vs-";
  const idx = slug.indexOf(sep);
  if (idx === -1) return null;
  const aSlug = slug.slice(0, idx);
  const bSlug = slug.slice(idx + sep.length);
  const a = pool.find((p) => p.slug === aSlug);
  const b = pool.find((p) => p.slug === bSlug);
  if (!a || !b) return null;
  return createMatchup(a.id, b.id, pool);
}

export function pickRandomMatchup(
  usedPairKeys: Set<string>,
  pool: Person[] = seedPersons,
): Matchup {
  if (pool.length < 2) {
    throw new Error("Need at least 2 persons for a matchup");
  }
  for (let attempt = 0; attempt < 80; attempt++) {
    const i = Math.floor(Math.random() * pool.length);
    let j = Math.floor(Math.random() * pool.length);
    while (j === i) j = Math.floor(Math.random() * pool.length);
    const key = pairKey(pool[i].id, pool[j].id);
    if (!usedPairKeys.has(key)) return createMatchup(pool[i].id, pool[j].id, pool);
  }
  const i = Math.floor(Math.random() * (pool.length - 1));
  return createMatchup(pool[i].id, pool[i + 1].id, pool);
}
