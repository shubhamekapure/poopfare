"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonAvatar } from "@/components/PersonAvatar";
import { PersonModal } from "@/components/PersonModal";
import {
  getDailyPersons,
  isDailyBatchStale,
  refreshDailyPersons,
} from "@/lib/daily-villains";
import type { Person } from "@/lib/types";

export function DailyVillainsSection() {
  const [picks, setPicks] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Person | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (isDailyBatchStale()) {
        await refreshDailyPersons();
      }
      setPicks(getDailyPersons());
      setLoading(false);
    };

    load();
    const handler = () => setPicks(getDailyPersons());
    window.addEventListener("poopfare-daily-villains-updated", handler);
    return () =>
      window.removeEventListener("poopfare-daily-villains-updated", handler);
  }, []);

  if (loading) {
    return (
      <section className="mt-14">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
          Today&apos;s intake
        </p>
        <h2 className="font-display mt-1 text-2xl font-black text-stone-900">
          Fresh poopanthropists
        </h2>
        <p className="mt-4 text-sm text-stone-500">
          Scanning today&apos;s scandal headlines for fresh poopanthropists…
        </p>
      </section>
    );
  }

  if (picks.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
            Auto-curated daily
          </p>
          <h2 className="font-display mt-1 text-2xl font-black text-stone-900">
            Today&apos;s fresh poopanthropists
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Today&apos;s scandal coverage — new faces from India & global news wires.
            Wikipedia fills in photos.
          </p>
        </div>
        <Link
          href="/play"
          className="shrink-0 text-sm font-bold text-amber-800 underline decoration-amber-300 underline-offset-4 hover:text-amber-950"
        >
          Match them up →
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {picks.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => setSelected(person)}
            className="poop-card group rounded-2xl p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
              {person.country === "India" ? "🇮🇳 New today" : "New today"}
            </span>
            <div className="flex justify-center">
              <PersonAvatar
                person={person}
                size="md"
                className="ring-2 ring-amber-200 group-hover:ring-amber-400"
              />
            </div>
            <p className="mt-2 line-clamp-1 text-xs font-bold text-stone-900">
              {person.name}
            </p>
            <p className="line-clamp-2 text-[10px] italic text-stone-500">
              {person.crime}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <PersonModal
          person={selected}
          rank={0}
          userContribution={0}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
