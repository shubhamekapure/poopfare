"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShareButtons } from "@/components/ShareButtons";
import { getPersonById } from "@/lib/person-pool";
import { loadUserState } from "@/lib/storage";
import type { SessionChoice } from "@/lib/types";

export default function SummaryPage() {
  const [choices, setChoices] = useState<SessionChoice[]>([]);

  useEffect(() => {
    setChoices(loadUserState().sessionChoices);
  }, []);

  const mostControversial = choices.reduce<SessionChoice | null>((best, c) => {
    if (!best) return c;
    const dist = Math.abs(c.consensusPercent - 50);
    const bestDist = Math.abs(best.consensusPercent - 50);
    return dist < bestDist ? c : best;
  }, null);

  const topPick = getPersonById(mostControversial?.chosenPersonId ?? "");
  const shareText =
    choices.length > 0
      ? `Today I donated ${choices.length} 💩 to the people who deserve it most. My top pick: ${topPick?.name}. Do your part.`
      : "I completed my daily PoopFare duty. Do your part.";

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Session Complete
        </p>
        <h1 className="mt-2 text-3xl font-black text-stone-900">
          Today you condemned:
        </h1>

        {choices.length === 0 ? (
          <p className="mt-6 text-stone-600">
            No one is safe from accountability. Check back at midnight.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {choices.map((c) => {
              const chosen = getPersonById(c.chosenPersonId);
              const opponent = getPersonById(c.opponentPersonId);
              const isControversial = c.matchupId === mostControversial?.matchupId;
              return (
                <li
                  key={`${c.matchupId}-${c.timestamp}`}
                  className={`rounded-xl px-4 py-3 ${
                    isControversial
                      ? "border-2 border-amber-400 bg-amber-100"
                      : "border border-stone-200 bg-white"
                  }`}
                >
                  <p className="font-semibold text-stone-900">
                    {chosen?.name} over {opponent?.name}
                  </p>
                  <p className="text-sm text-stone-500">
                    {c.consensusPercent}% agreed with you
                    {isControversial && " · Most controversial pick 🔥"}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        <div
          id="share-card"
          className="mt-8 overflow-hidden rounded-2xl border-2 border-amber-700 bg-gradient-to-br from-amber-800 to-stone-900 p-6 text-white shadow-xl"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-200">
            PoopFare Share Card
          </p>
          <p className="mt-3 text-2xl font-black leading-tight">
            {choices.length > 0
              ? `I donated ${choices.length} 💩 today.`
              : "I did my daily duty."}
          </p>
          {topPick && (
            <p className="mt-2 text-lg text-amber-100">
              Top pick: <span className="font-bold text-white">{topPick.name}</span>
            </p>
          )}
          <p className="mt-4 text-sm text-amber-200/80">poopfare.com</p>
        </div>

        <div className="mt-6">
          <ShareButtons text={shareText} url="https://poopfare.com" />
        </div>

        <Link
          href="/leaderboard"
          className="mt-4 block rounded-full border-2 border-stone-900 py-3 text-center font-semibold text-stone-900 hover:bg-stone-100"
        >
          View leaderboard
        </Link>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-stone-500 hover:text-amber-800"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
