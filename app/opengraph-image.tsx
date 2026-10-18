import { ImageResponse } from "next/og"
import { siteConfig } from "@/lib/site"

export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0a2a5c 0%, #1e1b4b 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 700 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 40, marginTop: 16, color: "#c7d2fe" }}>Full-Stack Software Engineer</div>
        <div style={{ fontSize: 28, marginTop: 40, color: "#f4874b" }}>
          {`Spring Boot · Node.js · React · Next.js · ${siteConfig.location}`}
        </div>
      </div>
    ),
    size,
  )
}
