import { ImageResponse } from "next/og";

export const alt = "HDR Pop — the extra-bright image trick";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rays = [0, 45, 90, 135, 180, 225, 270];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f4f5f7",
          color: "#111214",
          fontFamily: "Arial, sans-serif",
          border: "2px solid #9aa1a9",
        }}
      >
        <div
          style={{
            height: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 62px",
            borderBottom: "2px solid #9aa1a9",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: "#050505",
                color: "#e9ff73",
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              ↗
            </div>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>HDR/POP</div>
          </div>
          <div style={{ display: "flex", color: "#626871", fontSize: 20 }}>
            A DISPLAY-NATIVE FIELD NOTE
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              width: "62%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "38px 66px 40px 62px",
              borderRight: "2px solid #9aa1a9",
            }}
          >
            <div
              style={{
                display: "flex",
                maxWidth: 670,
                fontSize: 60,
                lineHeight: 1.04,
                letterSpacing: "-2px",
                fontWeight: 700,
              }}
            >
              Why one image looked brighter than the rest of the screen
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 32,
                maxWidth: 620,
                color: "#575d65",
                fontSize: 25,
                lineHeight: 1.35,
              }}
            >
              A live SDR ↔ HDR comparison and conversion tool.
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eef0f2",
            }}
          >
            <div
              style={{
                width: 330,
                height: 330,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                borderRadius: 38,
                background: "#050505",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 184,
                  height: 184,
                  display: "flex",
                  border: "7px solid #343940",
                  borderRadius: 34,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: -24,
                  top: -102,
                  width: 72,
                  height: 290,
                  display: "flex",
                  background: "#e9ff73",
                  transform: "rotate(43deg)",
                  borderRadius: 36,
                }}
              />
              {rays.map((angle) => (
                <div
                  key={angle}
                  style={{
                    position: "absolute",
                    left: 159,
                    top: 62,
                    width: 12,
                    height: 62,
                    display: "flex",
                    background: "#ffffff",
                    borderRadius: 8,
                    transformOrigin: "6px 103px",
                    transform: `rotate(${angle}deg)`,
                  }}
                />
              ))}
              <div
                style={{
                  width: 92,
                  height: 92,
                  display: "flex",
                  position: "absolute",
                  borderRadius: 999,
                  background: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            height: 66,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 62px",
            borderTop: "2px solid #9aa1a9",
            background: "#f8ffdf",
            fontSize: 20,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700 }}>TRY IT ON A MAC XDR DISPLAY</div>
          <div style={{ display: "flex", color: "#535961" }}>hdr.kevinliu.studio</div>
        </div>
      </div>
    ),
    size,
  );
}
