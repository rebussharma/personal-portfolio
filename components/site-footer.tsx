import Link from "next/link"
import { Github, Linkedin, Mail, FileText, MapPin } from "lucide-react"
import { ScrollToTop } from "@/components/scroll-to-top"
import { siteConfig } from "@/lib/site"

const linkClass =
  "text-xs hover:underline underline-offset-4 flex items-center gap-1 min-h-11 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"

export function SiteFooter() {
  return (
    <footer className="w-full shrink-0 border-t bg-white dark:bg-gray-900">
      <div className="container flex flex-col items-center gap-2 px-4 pt-8 text-center md:px-6">
        <p className="font-heading text-lg font-bold">Let&apos;s work together</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Open to new opportunities and collaborations.{" "}
          <Link href="/#contact" className="font-medium underline underline-offset-4 hover:text-primary" prefetch={false}>
            Get in touch
          </Link>
        </p>
      </div>
      <div className="container flex flex-col gap-2 sm:flex-row py-6 items-center px-4 md:px-6">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {siteConfig.location}
          </p>
        </div>
        <nav aria-label="Footer" className="sm:ml-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {siteConfig.email && (
            <a href={`mailto:${siteConfig.email}`} className={linkClass}>
              <Mail className="h-4 w-4" aria-hidden="true" /> Email
            </a>
          )}
          {siteConfig.resumeUrl && (
            <a href={siteConfig.resumeUrl} className={linkClass} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" aria-hidden="true" /> Résumé
            </a>
          )}
          <Link href={siteConfig.github} className={linkClass} prefetch={false} target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4" aria-hidden="true" /> GitHub
          </Link>
          <Link href={siteConfig.linkedin} className={linkClass} prefetch={false} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
          </Link>
          <ScrollToTop />
        </nav>
      </div>
    </footer>
  )
}
