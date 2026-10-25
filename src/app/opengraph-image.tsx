import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share image, generated at build time. */
export default function OpengraphImage() {
  const arcs = [
    { r: 230, o: 0.9 },
    { r: 150, o: 0.7 },
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(60% 80% at 80% 30%, #2a1f66 0%, #07060D 70%)",
          color: "#F5F4FA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, border: "2px solid #ff3d6e", borderRadius: 999, padding: "8px 18px", color: "#ff8aa8", fontSize: 22, letterSpacing: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff3d6e" }} /> LIVE
          </div>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#A09CB5" }}>PARK LIVE NETWORK</div>
        </div>
        <svg width="520" height="520" viewBox="-260 -260 520 520" style={{ position: "absolute", right: 40, top: 55 }}>
          {arcs.map((a) => (
            <g key={a.r} opacity={a.o} stroke="#4FE3FF" strokeWidth="14" fill="none" strokeLinecap="round">
              <path d={`M${-a.r * 0.77} ${-a.r * 0.64} A${a.r} ${a.r} 0 0 0 ${-a.r * 0.77} ${a.r * 0.64}`} />
              <path d={`M${a.r * 0.77} ${-a.r * 0.64} A${a.r} ${a.r} 0 0 1 ${a.r * 0.77} ${a.r * 0.64}`} />
            </g>
          ))}
          <path d="M-40 -55 L70 0 L-40 55 Z" fill="none" stroke="#3D8BFF" strokeWidth="14" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 112, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9 }}>
            {(site.hero.lines[0] ?? "").toUpperCase()}
          </div>
          <div style={{ fontSize: 104, fontStyle: "italic", lineHeight: 1, color: "#8f7bff" }}>{site.hero.lines[1] ?? ""}</div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#A09CB5" }}>{site.hero.tail}</div>
        </div>
      </div>
    ),
    size,
  );
}
