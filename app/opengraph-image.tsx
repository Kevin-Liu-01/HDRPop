import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Why LinkedIn Logos Look Brighter Than the Rest of The Page — HDR Pop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function localImage(fileName: string, mimeType: string) {
  const data = await readFile(join(process.cwd(), "public", fileName), "base64");
  return `data:${mimeType};base64,${data}`;
}

export default async function OpenGraphImage() {
  const [hdrPopLogo, linkedInLogo, ghostLogo] = await Promise.all([
    localImage("hdr-pop-logo-source.jpg", "image/jpeg"),
    localImage("linkedin-in-logo.png", "image/png"),
    localImage("ghost-source.png", "image/png"),
  ]);

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
            <img src={hdrPopLogo} width={42} height={42} alt="" />
            <div style={{ display: "flex", fontSize: 24, fontWeight: 700 }}>HDR/POP</div>
          </div>
          <div style={{ display: "flex", color: "#626871", fontSize: 18, letterSpacing: "1px" }}>
            OPEN-SOURCE HDR IMAGE TOOL
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              width: 770,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "40px 58px 42px",
              background: "#ffffff",
              borderRight: "2px solid #9aa1a9",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 25 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  display: "flex",
                  overflow: "hidden",
                  borderRadius: 6,
                }}
              >
                <img src={linkedInLogo} width={40} height={40} alt="" />
              </div>
              <div style={{ display: "flex", color: "#626871", fontSize: 18 }}>
                THE EXTRA-BRIGHT IMAGE TRICK
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 50,
                lineHeight: 1.06,
                letterSpacing: "-1.6px",
                fontWeight: 700,
              }}
            >
              <div style={{ display: "flex" }}>Why LinkedIn Logos</div>
              <div style={{ display: "flex" }}>Look Brighter Than the Rest</div>
              <div style={{ display: "flex" }}>of The Page</div>
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
            <div
              style={{
                display: "flex",
                padding: 8,
                border: "2px solid #9aa1a9",
                background: "#ffffff",
              }}
            >
              <img src={ghostLogo} width={266} height={266} alt="" />
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
              ORIGINAL PQ-TAGGED GHOST
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
          <div style={{ display: "flex", fontWeight: 700 }}>OPEN ON A MAC / IPHONE / IPAD XDR DISPLAY!</div>
          <div style={{ display: "flex", color: "#535961" }}>hdr.kevinliu.studio</div>
        </div>
      </div>
    ),
    size,
  );
}
