import type React from "react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/site"

const title = "Today I Learned"
const description = `Short notes from ${siteConfig.name} on things learned while building software.`

// openGraph/twitter are redeclared because nested metadata replaces (not merges) the parent's objects
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/til" },
  openGraph: {
    type: "website",
    url: "/til",
    siteName: siteConfig.name,
    title: `${title} | ${siteConfig.name}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
}

export default function TilLayout({ children }: { children: React.ReactNode }) {
  return children
}
