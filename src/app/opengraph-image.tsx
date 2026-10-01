import { ImageResponse } from "next/og";

export const alt = "Srujan Mirji — AI Engineer & Product Builder";
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
          justifyContent: "space-between",
          backgroundColor: "#050505",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          border: "1px solid #262626",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: "#FF5A1F",
              }}
            />
            <span
              style={{
                color: "#8A8A8A",
                fontSize: "18px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              PORTFOLIO // 2026
            </span>
          </div>
          <span
            style={{
              color: "#D8FF3E",
              fontSize: "18px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            SRUJANMIRJI.IN
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "80px",
              fontWeight: 900,
              color: "#F3F1EC",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Srujan Mirji
          </h1>
          <p
            style={{
              fontSize: "30px",
              color: "#8A8A8A",
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.35,
              maxWidth: "960px",
            }}
          >
            AI Engineer &amp; Product Builder designing autonomous systems, intelligent tools, and refined digital experiences.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "28px",
            borderTop: "1px solid #1F1F1F",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            <span style={{ color: "#F3F1EC", fontSize: "18px" }}>Autonomous Systems</span>
            <span style={{ color: "#525252", fontSize: "18px" }}>/</span>
            <span style={{ color: "#F3F1EC", fontSize: "18px" }}>Full-Stack Engineering</span>
            <span style={{ color: "#525252", fontSize: "18px" }}>/</span>
            <span style={{ color: "#F3F1EC", fontSize: "18px" }}>Creative Web</span>
          </div>
          <span style={{ color: "#8A8A8A", fontSize: "16px" }}>B.Tech AI &amp; Data Science</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
