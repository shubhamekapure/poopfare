import type { Matchup, Person, SessionChoice, UserState } from "@/lib/types";

export const DAILY_POOP = 10;
/** @deprecated use DAILY_POOP */
export const DAILY_COINS = DAILY_POOP;
/** When true, poop allowance never decrements and sessions don't end from scarcity */
export const UNLIMITED_POOP = true;
/** @deprecated use UNLIMITED_POOP */
export const UNLIMITED_COINS = UNLIMITED_POOP;
const STORAGE_KEY = "poopfare_state";

function todayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

function defaultState(): UserState {
  return {
    coinsRemaining: DAILY_POOP,
    lastResetDate: todayKey(),
    sessionChoices: [],
    personalContributions: {},
    onboardingComplete: false,
  };
}

export function loadUserState(): UserState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const state = JSON.parse(raw) as UserState;
    if (state.lastResetDate !== todayKey()) {
      return {
        ...defaultState(),
        onboardingComplete: state.onboardingComplete,
        personalContributions: state.personalContributions,
      };
    }
    if (UNLIMITED_POOP && state.coinsRemaining < DAILY_POOP) {
      state.coinsRemaining = DAILY_POOP;
    }
    return state;
  } catch {
    return defaultState();
  }
}

export function saveUserState(state: UserState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadScores(): Record<string, number> {
  /** @deprecated Use fetchLiveScores() / useLiveScores() for shared live totals */
  return {};
}

/** @deprecated local scores replaced by live API — kept for session-only state */
export function saveScores(_scores: Record<string, number>): void {}

/** @deprecated local matchup votes replaced by live API */
export function loadMatchupVotes(): Record<string, { a: number; b: number }> {
  return {};
}

/** @deprecated local matchup votes replaced by live API */
export function saveMatchupVotes(
  _votes: Record<string, { a: number; b: number }>,
): void {}

export function getMsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

export function formatCountdown(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

export function allocatePoop(
  state: UserState,
  matchup: Matchup,
  chosenPersonId: string,
  opponentPersonId: string,
): {
  newState: UserState;
  consensusPercent: number;
  updatedScores: Record<string, number>;
  updatedVotes: Record<string, { a: number; b: number }>;
} {
  /** @deprecated Use allocatePoopLive() — this stub only updates session state */
  const choice: SessionChoice = {
    matchupId: matchup.id,
    chosenPersonId,
    opponentPersonId,
    consensusPercent: 0,
    timestamp: Date.now(),
  };

  const contributions = { ...state.personalContributions };
  contributions[chosenPersonId] = (contributions[chosenPersonId] ?? 0) + 1;

  const newState: UserState = {
    ...state,
    coinsRemaining: UNLIMITED_POOP
      ? DAILY_POOP
      : state.coinsRemaining - 1,
    sessionChoices: [...state.sessionChoices, choice],
    personalContributions: contributions,
  };

  saveUserState(newState);

  return {
    newState,
    consensusPercent: 0,
    updatedScores: {},
    updatedVotes: {},
  };
}

/** @deprecated use allocatePoop */
export const allocateCoin = allocatePoop;

export function getPersonsWithScores(
  persons: Person[],
  scores: Record<string, number>,
): Person[] {
  return persons.map((p) => ({
    ...p,
    totalPoopScore: scores[p.id] ?? 0,
  }));
}
