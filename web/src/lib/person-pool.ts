import { persons as seedPersons } from "@/data/persons";
import { getDailyPersons } from "@/lib/daily-villains";
import { loadNominations } from "@/lib/nominations";
import type { Person } from "@/lib/types";

export { seedPersons };

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function dedupePersons(lists: Person[][]): Person[] {
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const out: Person[] = [];

  for (const list of lists) {
    for (const p of list) {
      const norm = normalizeName(p.name);
      if (seenIds.has(p.id) || seenNames.has(norm)) continue;
      seenIds.add(p.id);
      seenNames.add(norm);
      out.push(p);
    }
  }
  return out;
}

export function getAllPersons(): Person[] {
  if (typeof window === "undefined") {
    return dedupePersons([seedPersons, getDailyPersons()]);
  }
  const nominees = loadNominations();
  const daily = getDailyPersons();
  return dedupePersons([seedPersons, daily, nominees]);
}

export function getPersonById(id: string): Person | undefined {
  return getAllPersons().find((p) => p.id === id);
}

export function getPersonBySlug(slug: string): Person | undefined {
  return getAllPersons().find((p) => p.slug === slug);
}

export function getPersonsByCountry(country: string): Person[] {
  const pool = getAllPersons();
  if (country === "all") return pool;
  return pool.filter((p) => p.country === country);
}

export function getTodaysDailyPicks(): Person[] {
  return getDailyPersons();
}
