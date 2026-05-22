import { NextResponse } from "next/server";
import dailyData from "@/data/daily-villains.json";
import type { DailyVillainsBatch } from "@/lib/daily-villains";

const batch = dailyData as DailyVillainsBatch;

export async function GET() {
  return NextResponse.json(batch, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export const runtime = "nodejs";
