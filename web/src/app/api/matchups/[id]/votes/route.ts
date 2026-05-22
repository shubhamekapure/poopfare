import { NextResponse } from "next/server";
import { getMatchupVotes } from "@/lib/votes-store.server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const votes = await getMatchupVotes(decodeURIComponent(id));
    const total = votes.a + votes.b;
    return NextResponse.json(
      {
        ...votes,
        total,
        aPercent: total ? Math.round((votes.a / total) * 100) : 50,
        bPercent: total ? Math.round((votes.b / total) * 100) : 50,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (err) {
    console.error("GET /api/matchups votes failed:", err);
    return NextResponse.json({ error: "Failed to load matchup" }, { status: 500 });
  }
}

export const runtime = "nodejs";
