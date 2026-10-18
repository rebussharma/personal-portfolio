"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MonitorSmartphone, Github, Linkedin, Menu, X, FileText } from "lucide-react"
import { SlideModeToggle } from "@/components/slide-mode-toggle"
import { navLinks, siteConfig } from "@/lib/site"
import data from "@/app/data.json"

const linkClass =
  "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"

const iconLinkClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800 transition-colors"

// Hide the Experience link until there is experience content to show
const links = navLinks.filter((link) => link.label !== "Experience" || data.Experience.length > 0)

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 dark:bg-gray-950/80 dark:supports-[backdrop-filter]:bg-gray-950/70">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-lg" prefetch={false}>
          <MonitorSmartphone className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="whitespace-nowrap">{siteConfig.name}</span>
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${linkClass} inline-flex min-h-11 items-center rounded-md px-3 hover:bg-gray-100 dark:hover:bg-gray-800`}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {siteConfig.resumeUrl && (
            <a
              href={siteConfig.resumeUrl}
              className="hidden lg:inline-flex h-9 items-center gap-1.5 rounded-md bg-accent px-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 mr-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FileText className="h-4 w-4" aria-hidden="true" /> Résumé
            </a>
          )}
          <Link
            href={siteConfig.github}
            className={`${iconLinkClass} hidden sm:inline-flex`}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            href={siteConfig.linkedin}
            className={`${iconLinkClass} hidden sm:inline-flex`}
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="ml-1">
            <SlideModeToggle />
          </div>
          <button
            type="button"
            className={`${iconLinkClass} lg:hidden ml-1`}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile and tablet navigation */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Main" className="lg:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-2">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${linkClass} flex items-center min-h-11`}
                  prefetch={false}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/* Social links live in the header row from sm up, so this list only needs to show on phones (or for the résumé) */}
          <ul className={`flex gap-6 border-t border-gray-200 dark:border-gray-800 pt-2 mt-2 ${siteConfig.resumeUrl ? "" : "sm:hidden"}`}>
            {siteConfig.resumeUrl && (
              <li>
                <a href={siteConfig.resumeUrl} className={`${linkClass} flex items-center gap-1 min-h-11`} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-5 w-5" aria-hidden="true" /> Résumé
                </a>
              </li>
            )}
            <li className="sm:hidden">
              <Link href={siteConfig.github} className={`${linkClass} flex items-center gap-1 min-h-11`} prefetch={false} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" aria-hidden="true" /> GitHub
              </Link>
            </li>
            <li className="sm:hidden">
              <Link href={siteConfig.linkedin} className={`${linkClass} flex items-center gap-1 min-h-11`} prefetch={false} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" aria-hidden="true" /> LinkedIn
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
