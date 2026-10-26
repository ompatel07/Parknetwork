import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social share image, generated at build time. */
export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-256.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={250} height={250} alt="" style={{ position: "absolute", right: 70, top: 48 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#4FE3FF" }}>{site.hero.eyebrow.toUpperCase()}</div>
          <div style={{ marginTop: 12, fontSize: 84, fontWeight: 800, letterSpacing: -3, lineHeight: 0.92 }}>PARK LIVE NETWORK</div>
          <div style={{ marginTop: 14, fontSize: 46, fontStyle: "italic", color: "#8f7bff" }}>Live Streaming & Audio Chat Management</div>
          <div style={{ marginTop: 22, fontSize: 26, color: "#A09CB5" }}>Agencies · Hosts · Creators · Platforms — worldwide</div>
        </div>
      </div>
    ),
    size,
  );
}
