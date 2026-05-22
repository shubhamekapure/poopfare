import type { Person } from "@/lib/types";
import personsData from "@/data/persons.json";

export const persons: Person[] = personsData as Person[];

export function getPersonById(id: string): Person | undefined {
  return persons.find((p) => p.id === id);
}

export function getPersonBySlug(slug: string): Person | undefined {
  return persons.find((p) => p.slug === slug);
}

export function getPersonsByCountry(country: string): Person[] {
  if (country === "all") return persons;
  return persons.filter((p) => p.country === country);
}
