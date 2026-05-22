import type { NominationInput, Person } from "@/lib/types";
import { persons as seedPersons } from "@/data/persons";
import { COUNTRIES } from "@/lib/matchups";

const NOMINATIONS_KEY = "poopfare_nominations";
export const MAX_NOMINATIONS = 10;

export const COUNTRY_CODES: Record<string, string> = {
  India: "IN",
  USA: "US",
  England: "GB",
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

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function loadNominations(): Person[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOMINATIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Person[];
  } catch {
    return [];
  }
}

export function saveNominations(nominations: Person[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOMINATIONS_KEY, JSON.stringify(nominations));
}

export function findDuplicateName(name: string, extra: Person[] = []): boolean {
  const norm = normalizeName(name);
  const pool = [...seedPersons, ...loadNominations(), ...extra];
  return pool.some((p) => normalizeName(p.name) === norm);
}

export async function fetchNomineePhoto(
  name: string,
  wiki?: string,
): Promise<string | null> {
  const params = new URLSearchParams({ name: name.trim() });
  if (wiki?.trim()) params.set("wiki", wiki.trim());
  try {
    const res = await fetch(`/api/person-photo?${params}`);
    if (!res.ok) return null;
    const data = (await res.json()) as { photoUrl?: string };
    return data.photoUrl ?? null;
  } catch {
    return null;
  }
}

export function validateNomination(input: NominationInput): string | null {
  const name = input.name.trim();
  const crime = input.crime.trim();

  if (name.length < 2) return "Name must be at least 2 characters.";
  if (crime.length < 8)
    return "Tell us what they did — at least a short sentence.";
  if (!COUNTRIES.includes(input.country as (typeof COUNTRIES)[number])) {
    return "Pick a country from the list.";
  }
  if (findDuplicateName(name)) {
    return "That person is already in the PoopFare roster (or you nominated them).";
  }
  if (loadNominations().length >= MAX_NOMINATIONS) {
    return `You can nominate up to ${MAX_NOMINATIONS} people. Remove one to add another.`;
  }
  return null;
}

export function buildNomineePerson(
  input: NominationInput,
  photoUrl: string | null,
): Person {
  const name = input.name.trim();
  const countryCode = COUNTRY_CODES[input.country] ?? "XX";
  const baseSlug = slugify(name);
  const slug = `${countryCode.toLowerCase()}-${baseSlug}`;
  const id = `nom-${slug}`;

  return {
    id,
    name,
    slug,
    photoUrl,
    wiki: input.wiki?.trim() || undefined,
    country: input.country,
    countryCode,
    nationality: input.country,
    gender: input.gender,
    category: input.category,
    severityTier: "Villain of the Week",
    charges: [input.crime.trim()],
    crime: input.crime.trim(),
    totalPoopScore: 5000,
    weeklyTrend: 18,
    isNominee: true,
    nominatedAt: Date.now(),
  };
}

export async function submitNomination(
  input: NominationInput,
): Promise<{ person?: Person; error?: string }> {
  const error = validateNomination(input);
  if (error) return { error };

  const photoUrl = await fetchNomineePhoto(input.name, input.wiki);
  const person = buildNomineePerson(input, photoUrl);
  const nominations = loadNominations();
  nominations.push(person);
  saveNominations(nominations);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("poopfare-nominations-updated"));
  }

  return { person };
}

export function removeNomination(id: string): void {
  const next = loadNominations().filter((p) => p.id !== id);
  saveNominations(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("poopfare-nominations-updated"));
  }
}
