import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt =
  "ירין אליה אברהם — תכנון ועיצוב פנים לוילות ובתי יוקרה";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// Render the card once at build time (required by `output: "export"`; a no-op
// for the standalone build).
export const dynamic = "force-static";

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
          alignItems: "center",
          backgroundColor: "#0a0a12",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(94,106,210,0.45), transparent 60%), radial-gradient(circle at 85% 80%, rgba(113,112,255,0.25), transparent 55%)",
          color: "#f4f4f8",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: -0.5,
            direction: "rtl",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: "#5e6ad2",
              color: "#ffffff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {siteConfig.monogram}
          </div>
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 44,
            maxWidth: 980,
            textAlign: "center",
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: -1,
            lineHeight: 1.15,
            direction: "rtl",
          }}
        >
          תכנון ועיצוב פנים לבית החלומות שלכם
        </div>
        <div
          style={{
            marginTop: 32,
            maxWidth: 860,
            textAlign: "center",
            fontSize: 28,
            lineHeight: 1.4,
            color: "#a8a8bd",
            direction: "rtl",
          }}
        >
          ליווי פרימיום אישי לוילות ובתי יוקרה במרכז ובצפון — מבנייה ועד שיפוץ.
        </div>
        <div
          style={{
            marginTop: 52,
            display: "flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.16)",
            backgroundColor: "rgba(255,255,255,0.05)",
            fontSize: 24,
            color: "#c8c8de",
          }}
        >
          {siteConfig.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
