"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { PoopStack } from "@/components/PoopStack";
import { PersonCard } from "@/components/PersonCard";
import { PersonModal } from "@/components/PersonModal";
import { SessionProgress } from "@/components/SessionProgress";
import { VsBadge } from "@/components/VsBadge";
import { allocatePoopLive } from "@/lib/votes-api";
import { useLiveScores } from "@/lib/use-live-scores";
import { loadUserState } from "@/lib/storage";
import { getPersonById, getAllPersons } from "@/lib/person-pool";
import { isDailyBatchStale, refreshDailyPersons } from "@/lib/daily-villains";
import { pickRandomMatchup } from "@/lib/matchups";
import type { Matchup, Person } from "@/lib/types";

type Phase = "choosing" | "reveal";

const ADVANCE_MS = 1000;

function LoadingArena() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block h-3 w-3 rounded-full bg-amber-600"
            style={{
              animation: `loadingBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="font-display text-lg font-semibold text-amber-900">
        Preparing your next moral crisis...
      </p>
      <p className="text-sm text-stone-500">Two villains enter. One gets the 💩.</p>
    </div>
  );
}

export default function PlayPage() {
  const router = useRouter();
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveScores = useLiveScores("all", 5000);
  const [sessionCount, setSessionCount] = useState(0);
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [matchupKey, setMatchupKey] = useState(0);
  const [voting, setVoting] = useState(false);
  const [phase, setPhase] = useState<Phase>("choosing");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [consensus, setConsensus] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [modalPerson, setModalPerson] = useState<Person | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const loadNextMatchup = useCallback((usedPairKeys: Set<string>) => {
    const pool = getAllPersons();
    setMatchup(pickRandomMatchup(usedPairKeys, pool));
    setMatchupKey((k) => k + 1);
    setPhase("choosing");
    setChosenId(null);
    setConsensus(null);
    setToast(null);
  }, []);

  const advanceSession = useCallback(
    (state: ReturnType<typeof loadUserState>) => {
      const used = new Set(state.sessionChoices.map((c) => c.matchupId));
      loadNextMatchup(used);
    },
    [loadNextMatchup],
  );

  useEffect(() => {
    const init = async () => {
      if (isDailyBatchStale()) {
        await refreshDailyPersons();
      }
      const state = loadUserState();
      setSessionCount(state.sessionChoices.length);

      const used = new Set(state.sessionChoices.map((c) => c.matchupId));
      loadNextMatchup(used);
    };

    init();

    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, [loadNextMatchup]);

  const handleSelect = async (personId: string) => {
    if (!matchup || phase !== "choosing" || voting) return;

    const opponentId =
      personId === matchup.personAId ? matchup.personBId : matchup.personAId;
    const state = loadUserState();
    setVoting(true);
    const result = await allocatePoopLive(state, matchup, personId, opponentId);
    setVoting(false);

    if (!result) {
      setToast("Vote failed — try again");
      return;
    }

    const person = getPersonById(personId);
    setSessionCount(result.newState.sessionChoices.length);
    setChosenId(personId);
    setConsensus(result.consensusPercent);
    setToast(`💩 delivered to ${person?.name}`);
    setPhase("reveal");

    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      advanceSession(result.newState);
    }, ADVANCE_MS);
  };

  const copyMatchupUrl = async () => {
    if (!matchup) return;
    const url = `${window.location.origin}/matchup/${matchup.slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleExit = () => {
    if (window.confirm("Leave your session?")) router.push("/");
  };

  if (!matchup) {
    return <LoadingArena />;
  }

  const personA = getPersonById(matchup.personAId)!;
  const personB = getPersonById(matchup.personBId)!;
  const isReveal = phase === "reveal";

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      {/* Session header */}
      <div className="mb-4 space-y-3 sm:mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
              The Arena
            </p>
            <h1 className="font-display truncate text-xl font-black text-stone-900 sm:text-3xl">
              Who deserves it more?
            </h1>
            <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
              Tap a face. No abstaining. No take-backs.
            </p>
          </div>
          <PoopStack remaining={10} compact sessionAllocated={sessionCount} />
        </div>
        <SessionProgress allocatedCount={sessionCount} />
      </div>

      {toast && (
        <div
          className="mb-4 flex justify-center animate-toast-in"
          role="status"
        >
          <span className="rounded-full bg-gradient-to-r from-amber-800 to-amber-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-amber-900/20 sm:text-base">
            {toast}
          </span>
        </div>
      )}

      {/* Matchup arena */}
      <div
        key={matchupKey}
        className="poop-arena rounded-3xl p-3 sm:p-6 animate-matchup-in"
      >
        <div className="flex items-stretch gap-1 sm:gap-4">
          <PersonCard
            person={personA}
            score={liveScores[personA.id] ?? 0}
            onSelect={() => handleSelect(personA.id)}
            onInfo={() => setModalPerson(personA)}
            disabled={isReveal || voting}
            selected={chosenId === personA.id}
            rejected={isReveal && chosenId !== personA.id}
            consensus={chosenId === personA.id ? consensus : null}
          />
          <VsBadge />
          <PersonCard
            person={personB}
            score={liveScores[personB.id] ?? 0}
            onSelect={() => handleSelect(personB.id)}
            onInfo={() => setModalPerson(personB)}
            disabled={isReveal || voting}
            selected={chosenId === personB.id}
            rejected={isReveal && chosenId !== personB.id}
            consensus={chosenId === personB.id ? consensus : null}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={copyMatchupUrl}
          className="poop-chip px-4 py-2 transition hover:bg-amber-100 hover:ring-amber-300"
        >
          {copiedUrl ? "✓ Link copied!" : "🔗 Copy matchup link"}
        </button>
        <Link
          href="/leaderboard"
          className="poop-chip px-4 py-2 transition hover:bg-amber-100"
        >
          🏆 Leaderboard
        </Link>
        <Link
          href="/summary"
          className="poop-chip px-4 py-2 transition hover:bg-amber-100"
        >
          📋 Session summary
        </Link>
        <button
          type="button"
          onClick={handleExit}
          className="poop-chip px-4 py-2 transition hover:bg-amber-100"
        >
          Save & exit
        </button>
      </div>

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
