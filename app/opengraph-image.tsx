import { ImageResponse } from "next/og";

export const alt = "Why a LinkedIn logo looked brighter than the rest of my screen — HDR Pop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function LinkedInMark({ small = false }: { small?: boolean }) {
  const markSize = small ? 40 : 56;

  return (
    <div
      style={{
        width: markSize,
        height: markSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: small ? 7 : 9,
        background: "#0a66c2",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        fontSize: small ? 27 : 39,
        fontWeight: 700,
        letterSpacing: "-2px",
        paddingRight: 3,
      }}
    >
      in
    </div>
  );
}

function GhostMark() {
  return (
    <svg width="266" height="266" viewBox="0 0 240 240" aria-hidden="true">
      <rect width="240" height="240" rx="30" fill="#050505" />
      <path
        d="M31 158c-9-18-11-46-7-72 5-39 32-64 69-64 40 0 61 27 72 61 10 31 34 50 63 62v55c-28-7-58 0-88 1-50 2-91-9-109-43Z"
        fill="#fff"
      />
      <ellipse cx="75" cy="83" rx="9" ry="15" fill="#050505" />
      <ellipse cx="122" cy="83" rx="9" ry="15" fill="#050505" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f5f6f7",
          color: "#101113",
          fontFamily: "Arial, sans-serif",
          border: "2px solid #9aa1a9",
        }}
      >
        <div
          style={{
            height: 82,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 58px",
            borderBottom: "2px solid #9aa1a9",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 7,
                background: "#050505",
                color: "#e9ff73",
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              +
            </div>
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700 }}>HDR/POP</div>
          </div>
          <div style={{ display: "flex", color: "#626871", fontSize: 18, letterSpacing: "1px" }}>
            FIELD NOTE + CONVERTER
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              width: 754,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 58px 42px",
              background: "#ffffff",
              borderRight: "2px solid #9aa1a9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <LinkedInMark small />
              <div style={{ display: "flex", color: "#626871", fontSize: 18 }}>
                INSPIRED BY A LINKEDIN PROFILE
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 53,
                lineHeight: 1.05,
                letterSpacing: "-1.8px",
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex" }}>Why a LinkedIn logo</div>
              <div style={{ display: "flex" }}>looked brighter than the</div>
              <div style={{ display: "flex" }}>rest of my screen</div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 25,
                color: "#565c64",
                fontSize: 22,
                lineHeight: 1.35,
              }}
            >
              Recreate the XDR effect, then see why screenshots hide it.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              background: "#eef0f2",
            }}
          >
            <div
              style={{
                position: "absolute",
                right: -58,
                top: -108,
                width: 104,
                height: 330,
                display: "flex",
                background: "#e9ff73",
                transform: "rotate(43deg)",
                borderRadius: 52,
              }}
            />
            <div style={{ display: "flex", padding: 8, border: "2px solid #9aa1a9", background: "#ffffff" }}>
              <GhostMark />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginTop: 20,
                color: "#343940",
                fontSize: 17,
              }}
            >
              <div style={{ width: 10, height: 10, display: "flex", borderRadius: 99, background: "#5a7d19" }} />
              PQ-TAGGED GHOST
            </div>
          </div>
        </div>

        <div
          style={{
            height: 62,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 58px",
            borderTop: "2px solid #9aa1a9",
            background: "#f8ffdf",
            fontSize: 18,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>OPEN ON A MAC XDR DISPLAY</div>
          <div style={{ display: "flex", color: "#535961" }}>hdr.kevinliu.studio</div>
        </div>
      </div>
    ),
    size,
  );
}
