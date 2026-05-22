import type { LeaderboardTimeRange, Matchup, SessionChoice, UserState } from "@/lib/types";
import { DAILY_POOP, UNLIMITED_POOP, saveUserState } from "@/lib/storage";

export interface VoteResult {
  consensusPercent: number;
  personScore: number;
  matchupVotes: { a: number; b: number };
}

export async function fetchLiveScores(
  range: LeaderboardTimeRange = "all",
): Promise<Record<string, number>> {
  try {
    const res = await fetch(`/api/votes?range=${range}`, { cache: "no-store" });
    if (!res.ok) return {};
    const data = (await res.json()) as { scores?: Record<string, number> };
    return data.scores ?? {};
  } catch {
    return {};
  }
}

export async function fetchMatchupVotes(
  matchupId: string,
): Promise<{ a: number; b: number }> {
  try {
    const res = await fetch(
      `/api/matchups/${encodeURIComponent(matchupId)}/votes`,
      { cache: "no-store" },
    );
    if (!res.ok) return { a: 0, b: 0 };
    const data = (await res.json()) as { a: number; b: number };
    return { a: data.a ?? 0, b: data.b ?? 0 };
  } catch {
    return { a: 0, b: 0 };
  }
}

export async function submitVote(
  personId: string,
  matchup: Matchup,
): Promise<VoteResult | null> {
  const side = personId === matchup.personAId ? "a" : "b";
  try {
    const res = await fetch("/api/votes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personId,
        matchupId: matchup.id,
        side,
      }),
    });
    if (!res.ok) return null;
    return (await res.json()) as VoteResult;
  } catch {
    return null;
  }
}

export async function allocatePoopLive(
  state: UserState,
  matchup: Matchup,
  chosenPersonId: string,
  opponentPersonId: string,
): Promise<{
  newState: UserState;
  consensusPercent: number;
  personScore: number;
  matchupVotes: { a: number; b: number };
} | null> {
  const vote = await submitVote(chosenPersonId, matchup);
  if (!vote) return null;

  const choice: SessionChoice = {
    matchupId: matchup.id,
    chosenPersonId,
    opponentPersonId,
    consensusPercent: vote.consensusPercent,
    timestamp: Date.now(),
  };

  const contributions = { ...state.personalContributions };
  contributions[chosenPersonId] = (contributions[chosenPersonId] ?? 0) + 1;

  const newState: UserState = {
    ...state,
    coinsRemaining: UNLIMITED_POOP ? DAILY_POOP : state.coinsRemaining - 1,
    sessionChoices: [...state.sessionChoices, choice],
    personalContributions: contributions,
  };

  saveUserState(newState);

  return {
    newState,
    consensusPercent: vote.consensusPercent,
    personScore: vote.personScore,
    matchupVotes: vote.matchupVotes,
  };
}
