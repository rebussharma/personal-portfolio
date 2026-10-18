"use client"

import type React from "react"
import { ChevronDown, ChevronRight, Edit, Trash2, X, Check, Search } from "lucide-react"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { escapeHtml, formatEntries, type TilEntry } from "@/lib/til"
import { addTilEntry, getTilEntries, updateTilEntry, deleteTilEntry, checkAdminKey } from "./actions" // Import Server Actions
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ActionResult = {
  success: boolean
  message?: string
  error?: string
}

const ADMIN_KEY_STORAGE = "til-admin-key"

export default function TilPage() {
  const [tilEntries, setTilEntries] = useState<TilEntry[]>([])
  const [tilContent, setTilContent] = useState("")
  const [tilSubject, setTilSubject] = useState("")
  const [tilTags, setTilTags] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<ActionResult | null>(null)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editSubject, setEditSubject] = useState("")
  const [editTags, setEditTags] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  // Admin mode: visit /til?admin=<key>. The key is verified on the server and never sent to the browser.
  useEffect(() => {
    const adminKey = new URLSearchParams(window.location.search).get("admin")
    if (!adminKey) return

    checkAdminKey(adminKey).then((valid) => {
      if (valid) {
        localStorage.setItem(ADMIN_KEY_STORAGE, adminKey)
        setIsAdmin(true)
      }
      // Clean up URL to remove the admin parameter
      window.history.replaceState({}, document.title, window.location.pathname)
    })
  }, [])

  const refreshEntries = useCallback(async () => {
    try {
      setTilEntries(formatEntries(await getTilEntries()))
    } catch (error) {
      console.error("Failed to fetch TIL entries:", error)
    }
  }, [])

  // Fetch initial data when the component mounts
  useEffect(() => {
    refreshEntries().finally(() => setIsLoading(false))
  }, [refreshEntries])

  const withAdminKey = (formData: FormData) => {
    formData.append("adminKey", localStorage.getItem(ADMIN_KEY_STORAGE) ?? "")
    return formData
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!tilContent.trim() || !tilSubject.trim()) return

    setIsSubmitting(true)
    try {
      const result = await addTilEntry(null, withAdminKey(new FormData(event.currentTarget)))
      setSubmitResult(result)
      if (result.success) {
        setTilContent("")
        setTilSubject("")
        setTilTags("")
        await refreshEntries()
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      setSubmitResult({ success: false, error: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle entry expansion
  const toggleEntryExpansion = (entryId: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(entryId)) {
        newSet.delete(entryId)
      } else {
        newSet.add(entryId)
      }
      return newSet
    })
  }

  // Start editing an entry
  const startEditing = (entry: TilEntry) => {
    setEditingEntry(entry.id)
    setEditSubject(entry.subject)
    setEditContent(entry.content)
    setEditTags(entry.tags.join(", "))
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingEntry(null)
    setEditSubject("")
    setEditContent("")
    setEditTags("")
  }

  // Save edited entry
  const saveEditedEntry = async (entryId: string) => {
    if (!editSubject.trim() || !editContent.trim()) return

    const formData = new FormData()
    formData.append("id", entryId)
    formData.append("subject", editSubject)
    formData.append("content", editContent)
    formData.append("tags", editTags)

    try {
      const result = await updateTilEntry(null, withAdminKey(formData))
      if (result.success) {
        await refreshEntries()
        cancelEditing()
      }
    } catch (error) {
      console.error("Error updating entry:", error)
    }
  }

  // Handle delete entry
  const handleDeleteEntry = async (entryId: string) => {
    const formData = new FormData()
    formData.append("id", entryId)

    try {
      const result = await deleteTilEntry(null, withAdminKey(formData))
      if (result.success) await refreshEntries()
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
    setDeleteDialogOpen(false)
    setEntryToDelete(null)
  }

  // Check if content should be truncated
  const shouldTruncateContent = (content: string) => content.length > 200

  // Truncate content
  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  // Open entry in new tab if very long. All values are escaped before being written into the document.
  const openEntryInNewTab = (entry: TilEntry) => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>${escapeHtml(entry.subject)}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
            .date { color: #666; font-size: 14px; margin-bottom: 10px; }
            .subject { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .content { margin-bottom: 20px; white-space: pre-wrap; }
            .tags { display: flex; gap: 8px; flex-wrap: wrap; }
            .tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="date">${escapeHtml(entry.date)}</div>
          <h1 class="subject">${escapeHtml(entry.subject)}</h1>
          <div class="content">${escapeHtml(entry.content)}</div>
          <div class="tags">
            ${entry.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
          </div>
        </body>
      </html>
    `
    const newWindow = window.open()
    if (newWindow) {
      newWindow.opener = null
      newWindow.document.write(html)
      newWindow.document.close()
    }
  }

  const allUniqueTags = useMemo(() => {
    const tags = new Set<string>()
    tilEntries.forEach((entry) => {
      entry.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [tilEntries])

  const filteredEntries = useMemo(() => {
    let filtered = tilEntries

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.subject.toLowerCase().includes(lowerCaseSearchTerm) ||
          entry.content.toLowerCase().includes(lowerCaseSearchTerm) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm)),
      )
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((entry) => selectedTags.every((selectedTag) => entry.tags.includes(selectedTag)))
    }

    return filtered
  }, [tilEntries, searchTerm, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const renderEntries = () => {
    if (isLoading) {
      return (
        <div className="grid gap-4" aria-busy="true" aria-label="Loading entries">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="p-4 border border-gray-200 dark:border-gray-700">
              <div className="motion-safe:animate-pulse space-y-3">
                <div className="h-3 w-32 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </Card>
          ))}
        </div>
      )
    }

    if (filteredEntries.length === 0) {
      return (
        <p className="text-gray-500 dark:text-gray-400">
          {tilEntries.length === 0 ? "No entries yet. Check back soon." : "No entries match your search or filters."}
        </p>
      )
    }

    return (
      <div className="grid gap-4">
        {filteredEntries.map((entry) => {
          const isTruncatable = shouldTruncateContent(entry.content)
          const isExpanded = expandedEntries.has(entry.id)
          const contentId = `til-content-${entry.id}`
          return (
            <Card key={entry.id} className="p-4 border border-gray-200 dark:border-gray-700 custom-shadow">
              <CardContent className="p-0">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {entry.date}
                    {entry.updatedDate && <> &nbsp; &nbsp; Updated: {entry.updatedDate}</>}
                  </p>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(entry)}
                          className="h-8 w-8 p-0"
                          aria-label={`Edit "${entry.subject}"`}
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEntryToDelete(entry.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          aria-label={`Delete "${entry.subject}"`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </>
                    )}
                    {isTruncatable && entry.content.length > 1000 && (
                      <Button variant="outline" size="sm" onClick={() => openEntryInNewTab(entry)} className="text-xs">
                        Open in New Tab
                      </Button>
                    )}
                  </div>
                </div>

                {editingEntry === entry.id ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`edit-subject-${entry.id}`} className="font-medium text-sm">
                        Subject
                      </label>
                      <Textarea
                        id={`edit-subject-${entry.id}`}
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        maxLength={300}
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-content-${entry.id}`} className="font-medium text-sm">
                        Details
                      </label>
                      <Textarea
                        id={`edit-content-${entry.id}`}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    <div>
                      <label htmlFor={`edit-tags-${entry.id}`} className="font-medium text-sm">
                        Tags
                      </label>
                      <Input
                        id={`edit-tags-${entry.id}`}
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="comma-separated"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveEditedEntry(entry.id)} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                        Save
                      </Button>
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-1" aria-hidden="true" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">{entry.subject}</h3>
                    <div id={contentId} className="mb-3">
                      {isTruncatable && !isExpanded ? (
                        <p>{truncateContent(entry.content)}</p>
                      ) : (
                        <p className="whitespace-pre-wrap">{entry.content}</p>
                      )}
                    </div>
                    {isTruncatable && (
                      <button
                        type="button"
                        onClick={() => toggleEntryExpansion(entry.id)}
                        aria-expanded={isExpanded}
                        aria-controls={contentId}
                        className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-primary dark:text-accent hover:underline underline-offset-4"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        )}
                        {isExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                    <ul className="flex flex-wrap gap-2" aria-label="Tags">
                      {entry.tags.map((tag) => (
                        <li key={tag}>
                          <Badge
                            variant="secondary"
                            className={
                              selectedTags.includes(tag) ? "bg-accent text-accent-foreground" : "bg-gray-200 dark:bg-gray-700"
                            }
                          >
                            {tag}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 p-6 md:p-8 bg-gray-50 dark:bg-gray-950 focus:outline-none"
    >
      {/* Left Section: Add TIL and Display Entries */}
      <div className="flex flex-col gap-8">
        {isAdmin ? (
          <Card className="p-6 border border-gray-200 dark:border-gray-700 custom-shadow">
            <CardHeader>
              <CardTitle>Add New TIL Entry</CardTitle>
              <CardDescription>What did I learn today? Tag it with relevant technologies.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-2 mb-4">
                  <label htmlFor="subject" className="font-medium">
                    Subject
                  </label>
                  <Textarea
                    id="subject"
                    name="subject"
                    placeholder="Subject of study"
                    value={tilSubject}
                    onChange={(e) => setTilSubject(e.target.value)}
                    required
                    maxLength={300}
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <label htmlFor="content" className="font-medium">
                    Details
                  </label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="e.g., Learned about React Server Components and their benefits for performance."
                    value={tilContent}
                    onChange={(e) => setTilContent(e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                </div>
                <div className="grid gap-2 mb-4">
                  <label htmlFor="tags" className="font-medium">
                    Tags (comma-separated)
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g., React, Next.js, Performance"
                    value={tilTags}
                    onChange={(e) => setTilTags(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add TIL"}
                </Button>
                <div role="status">
                  {submitResult?.error && <p className="text-red-500 text-sm mt-2">{submitResult.error}</p>}
                  {submitResult?.success && <p className="text-green-600 text-sm mt-2">{submitResult.message}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <section className="flex flex-col gap-4" aria-labelledby="til-heading">
          <h1 id="til-heading" className="text-2xl font-heading font-bold tracking-tighter">
            Today I Learned
          </h1>
          {renderEntries()}
        </section>
      </div>

      {/* Right Section: Search and Tags (shown above the entries on small screens) */}
      <aside className="order-first lg:order-none flex flex-col gap-6" aria-label="Search and filters">
        <Card className="p-6 border border-gray-200 dark:border-gray-700 custom-shadow">
          <CardHeader>
            <CardTitle>
              <h2>Search TIL</h2>
            </CardTitle>
            <CardDescription>Find entries by keyword or tag.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <Input
                type="search"
                aria-label="Search entries"
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-700 custom-shadow">
          <CardHeader>
            <CardTitle>
              <h2>Filter by Tags</h2>
            </CardTitle>
            <CardDescription>Select tags to filter entries.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {allUniqueTags.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No tags available yet.</p>
            ) : (
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="flex flex-wrap gap-2">
                  {allUniqueTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggleTag(tag)}
                        className={cn(
                          badgeVariants({ variant: isSelected ? "default" : "outline" }),
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-accent text-accent-foreground hover:bg-accent/90"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600",
                        )}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
            {selectedTags.length > 0 && (
              <Button variant="outline" onClick={() => setSelectedTags([])} className="mt-2">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the TIL entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => entryToDelete && handleDeleteEntry(entryToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
