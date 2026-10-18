"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className="h-11 w-11 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Go to top"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
    </Button>
  )
}
