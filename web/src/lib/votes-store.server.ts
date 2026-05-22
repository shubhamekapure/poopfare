import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import type { LeaderboardTimeRange } from "@/lib/types";

export interface MatchupVoteCounts {
  a: number;
  b: number;
}

interface FileVoteStore {
  all: Record<string, number>;
  today: Record<string, Record<string, number>>;
  week: Record<string, Record<string, number>>;
  matchups: Record<string, MatchupVoteCounts>;
}

const FILE_PATH = path.join(process.cwd(), "data", "live-votes.json");

function todayKey(): string {
  return new Date().toLocaleDateString("en-CA");
}

function weekKey(): string {
  const now = new Date();
  const jan1 = new Date(now.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((now.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7,
  );
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function redisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function emptyFileStore(): FileVoteStore {
  return { all: {}, today: {}, week: {}, matchups: {} };
}

function readFileStore(): FileVoteStore {
  try {
    if (!fs.existsSync(FILE_PATH)) return emptyFileStore();
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8")) as FileVoteStore;
  } catch {
    return emptyFileStore();
  }
}

function writeFileStore(store: FileVoteStore): void {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2));
}

function scoreKey(range: LeaderboardTimeRange): string {
  if (range === "today") return `today:${todayKey()}`;
  if (range === "week") return `week:${weekKey()}`;
  return "all";
}

async function incrementFileVote(
  personId: string,
  matchupId: string,
  side: "a" | "b",
): Promise<{ matchupVotes: MatchupVoteCounts; personScore: number }> {
  const store = readFileStore();
  const date = todayKey();
  const week = weekKey();

  store.all[personId] = (store.all[personId] ?? 0) + 1;
  store.today[date] ??= {};
  store.today[date][personId] = (store.today[date][personId] ?? 0) + 1;
  store.week[week] ??= {};
  store.week[week][personId] = (store.week[week][personId] ?? 0) + 1;

  store.matchups[matchupId] ??= { a: 0, b: 0 };
  store.matchups[matchupId][side] += 1;

  writeFileStore(store);

  return {
    matchupVotes: store.matchups[matchupId],
    personScore: store.all[personId],
  };
}

async function getFileScores(
  range: LeaderboardTimeRange,
): Promise<Record<string, number>> {
  const store = readFileStore();
  if (range === "today") return store.today[todayKey()] ?? {};
  if (range === "week") return store.week[weekKey()] ?? {};
  return store.all;
}

async function getFileMatchupVotes(
  matchupId: string,
): Promise<MatchupVoteCounts> {
  const store = readFileStore();
  return store.matchups[matchupId] ?? { a: 0, b: 0 };
}

export async function castVote(
  personId: string,
  matchupId: string,
  side: "a" | "b",
): Promise<{
  matchupVotes: MatchupVoteCounts;
  personScore: number;
  consensusPercent: number;
}> {
  const redis = redisClient();

  if (!redis) {
    const result = await incrementFileVote(personId, matchupId, side);
    const total = result.matchupVotes.a + result.matchupVotes.b;
    const chosen = side === "a" ? result.matchupVotes.a : result.matchupVotes.b;
    return {
      ...result,
      consensusPercent: total ? Math.round((chosen / total) * 100) : 100,
    };
  }

  const date = todayKey();
  const week = weekKey();
  const pipeline = redis.pipeline();
  pipeline.incr(`score:all:${personId}`);
  pipeline.incr(`score:today:${date}:${personId}`);
  pipeline.incr(`score:week:${week}:${personId}`);
  pipeline.hincrby(`matchup:${matchupId}`, side, 1);
  pipeline.hgetall(`matchup:${matchupId}`);

  const results = await pipeline.exec();
  const personScore = Number(results[0]) || 0;
  const rawMatchup = (results[4] ?? {}) as Record<string, string | number>;
  const matchupVotes: MatchupVoteCounts = {
    a: Number(rawMatchup.a ?? 0),
    b: Number(rawMatchup.b ?? 0),
  };
  const total = matchupVotes.a + matchupVotes.b;
  const chosen = side === "a" ? matchupVotes.a : matchupVotes.b;

  return {
    matchupVotes,
    personScore,
    consensusPercent: total ? Math.round((chosen / total) * 100) : 100,
  };
}

export async function getScores(
  range: LeaderboardTimeRange = "all",
): Promise<Record<string, number>> {
  const redis = redisClient();
  if (!redis) return getFileScores(range);

  const key = scoreKey(range);
  if (range === "all") {
    const keys = await redis.keys("score:all:*");
    if (!keys.length) return {};
    const values = await redis.mget<(number | null)[]>(...keys);
    const scores: Record<string, number> = {};
    keys.forEach((k, i) => {
      const personId = k.replace("score:all:", "");
      scores[personId] = Number(values[i] ?? 0);
    });
    return scores;
  }

  const prefix = range === "today" ? `score:today:${todayKey()}:` : `score:week:${weekKey()}:`;
  const keys = await redis.keys(`${prefix}*`);
  if (!keys.length) return {};
  const values = await redis.mget<(number | null)[]>(...keys);
  const scores: Record<string, number> = {};
  keys.forEach((k, i) => {
    scores[k.slice(prefix.length)] = Number(values[i] ?? 0);
  });
  return scores;
}

export async function getMatchupVotes(
  matchupId: string,
): Promise<MatchupVoteCounts> {
  const redis = redisClient();
  if (!redis) return getFileMatchupVotes(matchupId);

  const raw = await redis.hgetall<Record<string, number>>(`matchup:${matchupId}`);
  return {
    a: Number(raw?.a ?? 0),
    b: Number(raw?.b ?? 0),
  };
}

export function votesBackend(): "redis" | "file" {
  return redisClient() ? "redis" : "file";
}
