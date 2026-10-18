"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeading } from "@/components/section-heading"
import { getTilEntries } from "@/app/til/actions"
import { formatEntries, type TilEntry } from "@/lib/til"

// Shows the latest TIL entries on the homepage; renders nothing until there is content.
export function LatestTil() {
  const [entries, setEntries] = useState<TilEntry[]>([])

  useEffect(() => {
    getTilEntries(3)
      .then((rows) => setEntries(formatEntries(rows)))
      .catch(() => setEntries([]))
  }, [])

  if (entries.length === 0) return null

  return (
    <section id="til" aria-labelledby="til-heading" className="w-full bg-gray-50 py-16 md:py-24 dark:bg-gray-900/40">
      <div className="container space-y-10 px-4 md:px-6">
        <SectionHeading
          id="til-heading"
          eyebrow="Today I Learned"
          title="Recent notes"
          description="Short notes on things I've picked up recently."
        />
        <ul className="grid gap-4 md:grid-cols-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Card className="h-full border border-gray-200 dark:border-gray-800">
                <CardContent className="p-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{entry.date}</p>
                  <h3 className="mt-1 font-semibold line-clamp-2">{entry.subject}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{entry.content}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <Button asChild className="h-11">
          <Link href="/til" prefetch={false}>
            Read all entries &rarr;
          </Link>
        </Button>
      </div>
    </section>
  )
}
