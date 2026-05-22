import type { LeaderboardTimeRange, Person } from "@/lib/types";

/** Sort by live vote totals (range already applied when scores were fetched). */
export function sortByTimeRange(
  list: Person[],
  _timeRange: LeaderboardTimeRange,
): Person[] {
  return [...list].sort((a, b) => b.totalPoopScore - a.totalPoopScore);
}

export function timeRangeLabel(timeRange: LeaderboardTimeRange): string {
  switch (timeRange) {
    case "today":
      return "Live votes cast today";
    case "week":
      return "Live votes this week";
    default:
      return "Live all-time poop score";
  }
}
