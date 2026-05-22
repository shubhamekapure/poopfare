"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PoopStack } from "@/components/PoopStack";
import { PersonCard } from "@/components/PersonCard";
import { PersonModal } from "@/components/PersonModal";
import { ShareButtons } from "@/components/ShareButtons";
import { getPersonById, getAllPersons } from "@/lib/person-pool";
import { getMatchupBySlug } from "@/lib/matchups";
import { loadUserState } from "@/lib/storage";
import { allocatePoopLive, fetchMatchupVotes } from "@/lib/votes-api";
import { useLiveScores } from "@/lib/use-live-scores";
import type { Person } from "@/lib/types";

export default function MatchupSharePage() {
  const params = useParams();
  const slug = params.slug as string;
  const pool = getAllPersons();
  const matchup = getMatchupBySlug(slug, pool);
  const liveScores = useLiveScores("all", 5000);

  const [poopRemaining, setPoopRemaining] = useState(10);
  const [votes, setVotes] = useState<{ a: number; b: number } | null>(null);
  const [done, setDone] = useState(false);
  const [voting, setVoting] = useState(false);
  const [consensus, setConsensus] = useState(0);
  const [chosenName, setChosenName] = useState("");
  const [modalPerson, setModalPerson] = useState<Person | null>(null);

  const refreshVotes = useCallback(async () => {
    if (!matchup) return;
    const next = await fetchMatchupVotes(matchup.id);
    setVotes(next);
  }, [matchup]);

  useEffect(() => {
    const state = loadUserState();
    setPoopRemaining(state.coinsRemaining);
    refreshVotes();
    const id = setInterval(refreshVotes, 4000);
    return () => clearInterval(id);
  }, [refreshVotes]);

  if (!matchup) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Matchup not found</h1>
        <Link href="/play" className="mt-4 inline-block text-amber-800 underline">
          Start a new session
        </Link>
      </div>
    );
  }

  const personA = getPersonById(matchup.personAId)!;
  const personB = getPersonById(matchup.personBId)!;
  const total = (votes?.a ?? 0) + (votes?.b ?? 0);
  const aPct = total ? Math.round(((votes?.a ?? 0) / total) * 100) : 50;
  const bPct = 100 - aPct;
  const contested = total > 0 && Math.abs(aPct - 50) <= 2;

  const handleSelect = async (personId: string) => {
    if (done || voting) return;
    const opponentId =
      personId === matchup.personAId ? matchup.personBId : matchup.personAId;
    const state = loadUserState();
    setVoting(true);
    const result = await allocatePoopLive(state, matchup, personId, opponentId);
    setVoting(false);
    if (!result) return;

    const person = getPersonById(personId);
    setPoopRemaining(result.newState.coinsRemaining);
    setVotes(result.matchupVotes);
    setConsensus(result.consensusPercent);
    setChosenName(person?.name ?? "");
    setDone(true);
  };

  const shareText = `${personA.name} vs ${personB.name} is ${aPct}% / ${bPct}%. The world can't decide. Can you?`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/matchup/${slug}`
      : `https://poopfare.com/matchup/${slug}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
          Shared Matchup
        </p>
        <h1 className="mt-2 text-2xl font-black text-stone-900 sm:text-3xl">
          {personA.name} vs {personB.name}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {total.toLocaleString()} live votes · {aPct}% / {bPct}%
        </p>
        {contested && (
          <p className="mt-2 font-medium text-amber-800">
            🔥 Still contested — {aPct}% / {bPct}%
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <PoopStack remaining={poopRemaining} compact />
      </div>

      {done ? (
        <div className="mt-6 rounded-2xl bg-amber-50 p-6 text-center">
          <p className="font-semibold text-amber-900">
            Your 💩 went to {chosenName}. {consensus}% agreed with you.
          </p>
          <div className="mt-4">
            <ShareButtons text={shareText} url={shareUrl} />
          </div>
          <Link
            href="/play"
            className="mt-4 inline-block text-sm text-amber-800 hover:underline"
          >
            Continue your session →
          </Link>
        </div>
      ) : (
        <div className="mt-8 flex items-stretch gap-2 sm:gap-5">
          <PersonCard
            person={personA}
            score={liveScores[personA.id] ?? 0}
            onSelect={() => handleSelect(personA.id)}
            onInfo={() => setModalPerson(personA)}
            disabled={voting}
          />
          <div className="flex shrink-0 items-center text-lg font-black text-stone-300 sm:text-2xl">
            VS
          </div>
          <PersonCard
            person={personB}
            score={liveScores[personB.id] ?? 0}
            onSelect={() => handleSelect(personB.id)}
            onInfo={() => setModalPerson(personB)}
            disabled={voting}
          />
        </div>
      )}

      {!done && (
        <div className="mt-6">
          <ShareButtons text={shareText} url={shareUrl} />
        </div>
      )}

      {modalPerson && (
        <PersonModal
          person={{
            ...modalPerson,
            totalPoopScore: liveScores[modalPerson.id] ?? 0,
          }}
          rank={0}
          userContribution={
            loadUserState().personalContributions[modalPerson.id] ?? 0
          }
          onClose={() => setModalPerson(null)}
        />
      )}
    </div>
  );
}
