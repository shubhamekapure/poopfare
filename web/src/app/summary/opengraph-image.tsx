import { ImageResponse } from "next/og";

export const alt = "PoopFare — Session Complete";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ fontSize: 64, marginBottom: 24 }}>💩</div>
        <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 16 }}>
          PoopFare
        </div>
        <div style={{ fontSize: 52, fontWeight: 800, textAlign: "center" }}>
          Today I did my duty.
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.85 }}>
          The world&apos;s worst deserve your worst.
        </div>
        <div style={{ fontSize: 24, marginTop: 40, opacity: 0.6 }}>
          poopfare.com
        </div>
      </div>
    ),
    { ...size },
  );
}
