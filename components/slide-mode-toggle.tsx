"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react" // Import useState and useEffect

export function SlideModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false) // State to track if component is mounted on client

  // useEffect runs only on the client after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  // If not mounted (i.e., on the server or before client hydration), render a static button
  if (!mounted) {
    return (
      <button
        className="relative flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-colors duration-300 bg-gray-200 dark:bg-gray-700"
        aria-label="Toggle theme"
        disabled // Disable interaction until mounted
      >
        {/* Render a default icon or nothing to avoid layout shift */}
        <Sun className="h-6 w-6 text-gray-900 dark:text-gray-50" />
      </button>
    )
  }

  // Once mounted on the client, render the full interactive component
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex h-8 w-16 cursor-pointer items-center rounded-full p-1 transition-colors duration-300",
        isDarkMode ? "bg-primary" : "bg-gray-200", // Track background color, use primary for dark
      )}
      aria-label="Toggle theme"
    >
      {/* Sun icon - visible in light mode, slides left */}
      <Sun
        className={cn(
          "absolute h-6 w-6 rounded-full p-1 transition-all duration-300",
          isDarkMode
            ? "translate-x-8 opacity-0 text-gray-50" // In dark mode, move right and hide
            : "translate-x-0 opacity-100 bg-accent text-accent-foreground", // In light mode, stay left, visible, use accent background
        )}
      />
      {/* Moon icon - visible in dark mode, slides right */}
      <Moon
        className={cn(
          "absolute h-6 w-6 rounded-full p-1 transition-all duration-300",
          isDarkMode
            ? "translate-x-8 opacity-100 bg-accent text-accent-foreground" // In dark mode, move right, visible, use accent background
            : "translate-x-0 opacity-0 text-gray-700", // In light mode, stay left and hide
        )}
      />
    </button>
  )
}
