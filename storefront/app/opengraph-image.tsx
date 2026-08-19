import { ImageResponse } from "next/og";
import { SITE_TAGLINE } from "@/lib/site";

// Default share-preview image, generated at request time. Applies to every route
// that doesn't define its own opengraph-image. Uses a system serif so no font
// file needs bundling.
export const alt = "Taygerian — Ceylon fine jewellery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1c1b19",
          color: "#f4f1ea",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 54,
            height: 1,
            background: "#b07c66",
            marginBottom: 44,
          }}
        />
        <div
          style={{
            fontSize: 92,
            letterSpacing: 22,
            paddingLeft: 22,
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Taygerian
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 27,
            letterSpacing: 6,
            paddingLeft: 6,
            textTransform: "uppercase",
            color: "#b9b1a4",
          }}
        >
          {SITE_TAGLINE}
        </div>
        <div
          style={{
            width: 54,
            height: 1,
            background: "#b07c66",
            marginTop: 44,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
