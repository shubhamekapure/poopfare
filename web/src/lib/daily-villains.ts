import type { Person } from "@/lib/types";
import dailyData from "@/data/daily-villains.json";

const STORAGE_KEY = "poopfare_daily_villains";

export interface DailyVillainsBatch {
  date: string;
  fetchedAt: string;
  persons: Person[];
}

function todayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

export function getStaticDailyBatch(): DailyVillainsBatch {
  return dailyData as DailyVillainsBatch;
}

export function getDailyBatchDate(): string {
  const cached = loadCachedDailyBatch();
  if (cached?.date) return cached.date;
  return getStaticDailyBatch().date ?? "";
}

export function isDailyBatchToday(): boolean {
  return getDailyBatchDate() === todayKey();
}

export function loadCachedDailyBatch(): DailyVillainsBatch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const batch = JSON.parse(raw) as DailyVillainsBatch;
    if (!batch.persons?.length) return null;
    return batch;
  } catch {
    return null;
  }
}

export function saveCachedDailyBatch(batch: DailyVillainsBatch): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batch));
}

/** Latest daily picks — shows most recent batch even if deploy lagged a day. */
export function getDailyPersons(): Person[] {
  const cached = loadCachedDailyBatch();
  if (cached?.persons?.length) return cached.persons;

  const staticBatch = getStaticDailyBatch();
  if (staticBatch.persons?.length) return staticBatch.persons;

  return [];
}

export async function refreshDailyPersons(): Promise<Person[]> {
  try {
    const res = await fetch("/api/daily-villains", { cache: "no-store" });
    if (!res.ok) return getDailyPersons();
    const batch = (await res.json()) as DailyVillainsBatch;
    if (batch.persons?.length) {
      saveCachedDailyBatch(batch);
      window.dispatchEvent(new CustomEvent("poopfare-daily-villains-updated"));
      return batch.persons;
    }
    return getDailyPersons();
  } catch {
    return getDailyPersons();
  }
}

export function isDailyBatchStale(): boolean {
  const persons = getDailyPersons();
  if (!persons.length) return true;
  return getDailyBatchDate() !== todayKey();
}
