import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
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
          justifyContent: "space-between",
          background: "#1e2733",
          color: "#e6e9eb",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700 }}>Sô criativa</div>
        <div style={{ fontSize: 86, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
          estúdio criativo feito para marcas pessoais
        </div>
        <div style={{ fontSize: 36, opacity: 1 }}>
          criação de conteúdo ✳ design ✳ identidade visual
        </div>
      </div>
    ),
    size,
  );
}
