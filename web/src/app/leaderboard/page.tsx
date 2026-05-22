"use client";

import { useEffect, useMemo, useState } from "react";
import { PersonModal } from "@/components/PersonModal";
import { PersonAvatar } from "@/components/PersonAvatar";
import { getAllPersons } from "@/lib/person-pool";
import {
  isDailyBatchStale,
  refreshDailyPersons,
} from "@/lib/daily-villains";
import {
  getPersonsWithScores,
  loadUserState,
} from "@/lib/storage";
import { useLiveScores } from "@/lib/use-live-scores";
import { sortByTimeRange, timeRangeLabel } from "@/lib/leaderboard-sort";
import type { LeaderboardFilters, Person } from "@/lib/types";

const medals = ["💩🥇", "💩🥈", "💩🥉"];

export default function LeaderboardPage() {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    country: "all",
    gender: "all",
    timeRange: "all",
    category: "all",
  });
  const liveScores = useLiveScores(filters.timeRange, 5000);
  const [contributions, setContributions] = useState<Record<string, number>>({});

  const [selected, setSelected] = useState<Person | null>(null);

  const [poolTick, setPoolTick] = useState(0);

  useEffect(() => {
    const refresh = async () => {
      if (isDailyBatchStale()) {
        await refreshDailyPersons();
      }
      setContributions(loadUserState().personalContributions);
      setPoolTick((t) => t + 1);
    };
    refresh();
    window.addEventListener("poopfare-nominations-updated", refresh);
    window.addEventListener("poopfare-daily-villains-updated", refresh);
    return () => {
      window.removeEventListener("poopfare-nominations-updated", refresh);
      window.removeEventListener("poopfare-daily-villains-updated", refresh);
    };
  }, []);

  const allPersons = useMemo(() => getAllPersons(), [poolTick]);

  const countries = useMemo(() => {
    const list = [...new Set(allPersons.map((p) => p.country))].sort();
    return ["all", ...list];
  }, [allPersons]);
  const categories = useMemo(
    () => ["all", ...new Set(allPersons.map((p) => p.category))],
    [allPersons],
  );

  const ranked = useMemo(() => {
    let list = getPersonsWithScores(allPersons, liveScores);

    if (filters.country !== "all") {
      list = list.filter((p) => p.country === filters.country);
    }
    if (filters.gender !== "all") {
      list = list.filter((p) => p.gender === filters.gender);
    }
    if (filters.category !== "all") {
      list = list.filter((p) => p.category === filters.category);
    }

    return sortByTimeRange(list, filters.timeRange).filter(
      (p) => p.totalPoopScore > 0,
    );
  }, [allPersons, liveScores, filters]);

  const selectedRank =
    selected ? ranked.findIndex((p) => p.id === selected.id) + 1 : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
        Global Rankings
      </p>
      <h1 className="font-display mt-1 text-3xl font-black text-stone-900 sm:text-4xl">
        World&apos;s Richest in Poop
      </h1>
      <p className="mt-2 text-stone-600">
        Live global votes — updates every few seconds.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <select
          value={filters.country}
          onChange={(e) =>
            setFilters((f) => ({ ...f, country: e.target.value }))
          }
          className="rounded-full border border-amber-200/60 bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Filter by country"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All countries" : c}
            </option>
          ))}
        </select>
        <select
          value={filters.gender}
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
          className="rounded-full border border-amber-200/60 bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Filter by gender"
        >
          <option value="all">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filters.timeRange}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              timeRange: e.target.value as LeaderboardFilters["timeRange"],
            }))
          }
          className="rounded-full border border-amber-200/60 bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Filter by time range"
        >
          <option value="all">All time</option>
          <option value="week">This week</option>
          <option value="today">Today</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((f) => ({ ...f, category: e.target.value }))
          }
          className="rounded-full border border-amber-200/60 bg-white px-3 py-2 text-sm font-medium shadow-sm ring-1 ring-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Filter by category"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-xs text-stone-400">{timeRangeLabel(filters.timeRange)}</p>

      {ranked.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-stone-200 bg-white p-8 text-center text-stone-500">
          No villains match these filters. The world&apos;s worst are hiding
          somewhere else.
        </p>
      ) : (
      <ul className="mt-6 space-y-2">
        {ranked.map((person, index) => {
          const rank = index + 1;
          const medal = rank <= 3 ? medals[rank - 1] : null;
          const userPoop = contributions[person.id] ?? 0;

          return (
            <li key={person.id}>
              <button
                type="button"
                onClick={() => setSelected(person)}
                className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left shadow-sm transition hover:shadow-md ${
                  rank <= 3
                    ? "border-amber-300/60 bg-gradient-to-r from-amber-50/80 to-white hover:border-amber-400"
                    : "border-stone-200/80 bg-white hover:border-amber-300"
                }`}
              >
                <span className="w-10 text-center text-lg font-bold text-stone-400">
                  {medal ?? `#${rank}`}
                </span>
                <PersonAvatar person={person} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-stone-900">
                    {person.name}
                    {person.isNominee && (
                      <span className="ml-1.5 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                        Nominee
                      </span>
                    )}
                    {person.isDailyPick && (
                      <span className="ml-1.5 inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800">
                        New today
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-stone-500">
                    {person.country} · {person.category}
                    {userPoop > 0 && ` · Your contribution: ${userPoop} 💩`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-stone-900">
                    {person.totalPoopScore.toLocaleString()} 💩
                  </p>
                  <p className="text-xs font-medium text-stone-400">live</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      )}

      {selected && selectedRank > 0 && (
        <PersonModal
          person={selected}
          rank={selectedRank}
          userContribution={contributions[selected.id] ?? 0}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
