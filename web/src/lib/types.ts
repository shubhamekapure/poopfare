export type Category = "Politician" | "Corporate" | "Celebrity" | "Historical";
export type SeverityTier = "Timeless Offender" | "Villain of the Week" | "Legacy Evil";
export type Gender = "Male" | "Female" | "Other";

export interface Person {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  wiki?: string;
  country: string;
  countryCode: string;
  nationality: string;
  gender: Gender;
  category: Category;
  severityTier: SeverityTier;
  charges: string[];
  crime: string;
  totalPoopScore: number;
  weeklyTrend: number;
  /** User-submitted nomination, not in the official seed roster */
  isNominee?: boolean;
  nominatedAt?: number;
  /** Auto-added from Wikipedia daily pageviews */
  isDailyPick?: boolean;
  dailyBatchDate?: string;
}

export interface NominationInput {
  name: string;
  country: string;
  category: Category;
  gender: Gender;
  crime: string;
  wiki?: string;
}

export interface Matchup {
  id: string;
  slug: string;
  personAId: string;
  personBId: string;
  aVotes: number;
  bVotes: number;
}

export interface SessionChoice {
  matchupId: string;
  chosenPersonId: string;
  opponentPersonId: string;
  consensusPercent: number;
  timestamp: number;
}

export interface UserState {
  coinsRemaining: number;
  lastResetDate: string;
  sessionChoices: SessionChoice[];
  personalContributions: Record<string, number>;
  onboardingComplete: boolean;
}

export type LeaderboardTimeRange = "today" | "week" | "all";
export type LeaderboardFilters = {
  country: string;
  gender: string;
  timeRange: LeaderboardTimeRange;
  category: string;
};
