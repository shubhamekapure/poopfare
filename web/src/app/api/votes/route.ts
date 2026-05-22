import { NextResponse } from "next/server";
import { castVote, getScores, votesBackend } from "@/lib/votes-store.server";
import type { LeaderboardTimeRange } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      personId?: string;
      matchupId?: string;
      side?: "a" | "b";
    };

    if (!body.personId || !body.matchupId || !body.side) {
      return NextResponse.json({ error: "Missing vote fields" }, { status: 400 });
    }

    const result = await castVote(body.personId, body.matchupId, body.side);
    return NextResponse.json(result);
  } catch (err) {
    console.error("POST /api/votes failed:", err);
    return NextResponse.json({ error: "Vote failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = (url.searchParams.get("range") ?? "all") as LeaderboardTimeRange;

  try {
    const scores = await getScores(range);
    return NextResponse.json(
      { scores, backend: votesBackend(), range },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err) {
    console.error("GET /api/votes failed:", err);
    return NextResponse.json({ error: "Failed to load scores" }, { status: 500 });
  }
}

export const runtime = "nodejs";
