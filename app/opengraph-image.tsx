import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${SITE_NAME} · ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #181818 0%, #277CFA 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.08em",
            opacity: 0.9,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            lineHeight: 1.4,
            opacity: 0.92,
            maxWidth: 820,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
