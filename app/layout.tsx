import type React from "react"
import type { Metadata } from "next"
import { Outfit, Roboto } from "next/font/google" // Import new fonts
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit", // Define CSS variable for Outfit
  display: "swap",
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto", // Define CSS variable for Roboto
  weight: ["300", "400", "500", "700"], // Specify weights for Roboto
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ribash Sharma",
  icons: "/icon/title.svg",
  description: "Software Development Engineer Based in Austin, Texas"}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} ${outfit.variable}`}>
        {" "}
        {/* Apply both font variables */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
