import { ImageResponse } from "next/og";
import { getMatchupBySlug } from "@/lib/matchups";
import { getPersonById } from "@/data/persons";

export const runtime = "edge";
export const alt = "PoopFare Matchup";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const matchup = getMatchupBySlug(slug);
  const a = matchup ? getPersonById(matchup.personAId) : null;
  const b = matchup ? getPersonById(matchup.personBId) : null;

  const title = a && b ? `${a.name} vs ${b.name}` : "PoopFare Matchup";
  const subtitle =
    a && b ? "Who deserves your 💩 more?" : "Make your poop count.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #78350f 0%, #1c1917 100%)",
          color: "white",
          padding: 48,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>💩</div>
        <div style={{ fontSize: 28, opacity: 0.8, marginBottom: 12 }}>
          PoopFare
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85 }}>
          {subtitle}
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.6 }}>
          poopfare.com
        </div>
      </div>
    ),
    { ...size },
  );
}
