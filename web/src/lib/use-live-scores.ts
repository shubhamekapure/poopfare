"use client";

import { useCallback, useEffect, useState } from "react";
import type { LeaderboardTimeRange } from "@/lib/types";
import { fetchLiveScores } from "@/lib/votes-api";

export function useLiveScores(
  range: LeaderboardTimeRange = "all",
  pollMs = 5000,
): Record<string, number> {
  const [scores, setScores] = useState<Record<string, number>>({});

  const refresh = useCallback(async () => {
    const next = await fetchLiveScores(range);
    setScores(next);
  }, [range]);

  useEffect(() => {
    refresh();
    if (pollMs <= 0) return;
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  return scores;
}
