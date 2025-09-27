"use client"

import type React from "react"
import { ArrowUp, ChevronDown, ChevronRight, Edit, Trash2, X, Check } from "lucide-react" // Import new icons

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import Link from "next/link"
import { Code, Github, Linkedin } from "lucide-react"
import { SlideModeToggle } from "@/components/slide-mode-toggle"
import { addTilEntry, getTilEntries, updateTilEntry, deleteTilEntry } from "./actions" // Import Server Actions
import { useActionState } from "react" // Import useActionState for form submission
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

interface TilEntry {
  id: string
  subject: string
  content: string
  tags: string[]
  date: string
  updatedDate: string
}

type AddTilEntryResult = {
  success: boolean
  message?: string
  error?: string
}

// This is a client component, but it will receive initial data from a Server Component wrapper
export default function TilPage() {
  const [tilEntries, setTilEntries] = useState<TilEntry[]>([])
  const [tilContent, setTilContent] = useState("")
  const [tilSubject, setTilSubject] = useState("")
  const [tilTags, setTilTags] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ isAdmin?: boolean } | null>(null)
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set())
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editSubject, setEditSubject] = useState("")
  const [editTags, setEditTags] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)
  const [adminSecretKey, setAdminSecretKey] = useState("");

  
  const initialState: AddTilEntryResult | null = null

  // Use useActionState for form submission with Server Actions
  const [state, formAction, isPending] = useActionState(
    addTilEntry,
    null
  )
  
  useEffect(() => {
    fetch("/api/get-secret")
      .then(res => res.json())
      .then(data => setAdminSecretKey(data.ADMIN_SECRET_KEY))
      .catch(err => console.error("Error fetching secret:", err));
    const urlParams = new URLSearchParams(window.location.search)
    const adminKey = urlParams.get('admin')
    
    // Replace 'your-secret-key' with your actual secret
    if (adminKey === adminSecretKey) {
      localStorage.setItem('til-admin', 'true')
      localStorage.setItem('til-admin-key', adminKey) // Store the actual key

      setUser({ isAdmin: true })
      
      // Clean up URL to remove the admin parameter
      window.history.replaceState({}, document.title, window.location.pathname)
    } 
    //else if (localStorage.getItem('til-admin') === 'true') {v// for later when prod is live
    //   setUser({ isAdmin: true })
    // } // 
  }, [adminSecretKey])

    console.log("admin: ", user?.isAdmin)

  // Fetch initial data when the component mounts
  useEffect(() => {
    const fetchInitialEntries = async () => {
      try {
        setIsLoading(true)
        const entries = await getTilEntries()
        const formattedEntries = entries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          updatedDate: entry.updated_at ? new Date(entry.updated_at).toLocaleDateString("en-US", {
            year: "numeric", 
            month: "long",
            day: "numeric",
          }): null,
        }))
        setTilEntries(formattedEntries)
      } catch (error) {
        console.error('Failed to fetch TIL entries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialEntries()
  }, [])

  // Handle successful form submission - refresh data and clear form
  useEffect(() => {
    console.log('State changed:', state)
    console.log('isPending:', isPending)
    
    if (state?.success) {
      console.log('Success detected, clearing form and refreshing data')
      // Clear form on success
      setTilContent("")
      setTilSubject("")
      setTilTags("")
      
      // Add a small delay to ensure revalidatePath completes
      const refreshEntries = async () => {
        try {
          // Small delay to ensure server-side revalidation completes
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const updatedEntries = await getTilEntries()
          console.log('Fetched updated entries:', updatedEntries)
          const formattedUpdatedEntries = updatedEntries.map((entry: any) => ({
            ...entry,
            date: new Date(entry.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }))
          setTilEntries(formattedUpdatedEntries)
        } catch (error) {
          console.error('Failed to refresh entries after submission:', error)
        }
      }
      
      refreshEntries()
    }
    
    if (state?.error) {
      console.error('Server action error:', state.error)
    }
  }, [state, isPending])

  // Handle form submission - prevent default and use formAction properly
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Always prevent default to stop page refresh
    
    console.log('Form submit triggered')
    console.log('Content:', tilContent)
    console.log('subject:', tilSubject);
    
    console.log('Tags:', tilTags)
    
    if (!tilContent.trim() || !tilSubject.trim()) {
      console.log('Subject or Content is empty, not submitting')
      return
    }
    
    console.log('Calling formAction with form data')
    const formData = new FormData(event.currentTarget)
    
    // Log form data contents
    for (const [key, value] of formData.entries()) {
      console.log(`FormData ${key}: ${value}`)
    }
    const adminKey = localStorage.getItem('til-admin-key') || ''
    formData.append('adminKey', adminKey)
    try {
      // Call the server action directly
      const result = await addTilEntry(null, formData)
      console.log('Server action result:', result)
      
      if (result.success) {
        // Clear form immediately
        setTilContent("")
        setTilSubject("")
        setTilTags("")
        
        // Refresh the entries list
        console.log('Refreshing entries...')
        const updatedEntries = await getTilEntries()
        console.log('Fresh entries from DB:', updatedEntries)
        
        const formattedUpdatedEntries = updatedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          updatedDate: new Date(entry.updated_at).toLocaleDateString("en-US", {
            year: "numeric", 
            month: "long",
            day: "numeric",
          }),
        }))
        setTilEntries(formattedUpdatedEntries)
        console.log('UI updated with new entries')
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    }
  }

  // Toggle entry expansion
  const toggleEntryExpansion = (entryId: string) => {
    setExpandedEntries(prev => {
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
    setEditTags(entry.tags.join(', '))
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
    if (!editSubject.trim() || !editContent.trim()) {
      return
    }

    const formData = new FormData()
    formData.append('id', entryId)
    formData.append('subject', editSubject)
    formData.append('content', editContent)
    formData.append('tags', editTags)
    
    const adminKey = localStorage.getItem('til-admin-key') || ''
    formData.append('adminKey', adminKey)

    try {
      const result = await updateTilEntry(null, formData)
      if (result.success) {
        // Refresh entries
        const updatedEntries = await getTilEntries()
        const formattedUpdatedEntries = updatedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          updatedDate: new Date(entry.updated_at).toLocaleDateString("en-US", {
            year: "numeric", 
            month: "long",
            day: "numeric",
          }),
        }))
        setTilEntries(formattedUpdatedEntries)
        cancelEditing()
      }
    } catch (error) {
      console.error('Error updating entry:', error)
    }
  }

  // Handle delete entry
  const handleDeleteEntry = async (entryId: string) => {
    const formData = new FormData()
    formData.append('id', entryId)
    
    const adminKey = localStorage.getItem('til-admin-key') || ''
    formData.append('adminKey', adminKey)

    try {
      const result = await deleteTilEntry(null, formData)
      if (result.success) {
        // Refresh entries
        const updatedEntries = await getTilEntries()
        const formattedUpdatedEntries = updatedEntries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          updatedDate: new Date(entry.updated_at).toLocaleDateString("en-US", {
            year: "numeric", 
            month: "long",
            day: "numeric",
          })
        }))
        setTilEntries(formattedUpdatedEntries)
      }
    } catch (error) {
      console.error('Error deleting entry:', error)
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

  // Open entry in new tab if very long
  const openEntryInNewTab = (entry: TilEntry) => {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${entry.subject}</title>
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
          <div class="date">${entry.date}</div>
          <div class="subject">${entry.subject}</div>
          <div class="content">${entry.content}</div>
          <div class="tags">
            ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        </body>
      </html>
    `
    const newWindow = window.open()
    if (newWindow) {
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

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-50 dark:bg-gray-950">
      <header className="flex flex-col border-b bg-white dark:bg-gray-900">
        {/* First Row: Name, Social Icons, Dark Mode Toggle */}
        <div className="px-4 lg:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-lg" prefetch={false}>
            <Code className="h-6 w-6 text-primary" />
            <span>Ribash Sharma</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/your-github"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com/in/your-linkedin"
              className="text-sm font-medium hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only">LinkedIn</span>
            </Link>
            <SlideModeToggle />
          </div>
        </div>
        {/* Second Row: Main Navigation */}
        <div className="w-full py-2 px-4 lg:px-6 flex justify-center border-t border-gray-200 dark:border-gray-800">
          <nav className="flex gap-4 sm:gap-6">
            <Link
              href="/"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="/til"
              className="text-sm font-medium hover:underline underline-offset-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              prefetch={false}
            >
              TIL
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 p-6 md:p-8">
        {/* Left Section: Add TIL and Display Entries */}
        <div className="flex flex-col gap-8">
          {user?.isAdmin ? (
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
                      name="subject" // Add name attribute for FormData
                      placeholder="Subject of study"
                      value={tilSubject}
                      onChange={(e) => setTilSubject(
                        e.target.value
                      )}
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
                      name="content" // Add name attribute for FormData
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
                      name="tags" // Add name attribute for FormData
                      placeholder="e.g., React, Next.js, Performance"
                      value={tilTags}
                      onChange={(e) => setTilTags(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isPending}
                  >
                    {isPending ? "Adding..." : "Add TIL"}
                  </Button>
                  {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
                  {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
                </form>
              </CardContent>
            </Card>
          ) : null}

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-heading font-bold tracking-tighter">My TIL Entries</h2>
            {filteredEntries.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No entries. I will add something here soon.</p>
            ) : (
              <div className="grid gap-4">
                {filteredEntries.map((entry) => (
                  <Card key={entry.id} className="p-4 border border-gray-200 dark:border-gray-700 custom-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created: {entry.date}
                          {entry.updatedDate && (
                            <> &nbsp; &nbsp; Updated: {entry.updatedDate}</>
                          )}
                        </p>                        
                        <div className="flex items-center gap-2">
                          {user?.isAdmin && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(entry)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEntryToDelete(entry.id)
                                  setDeleteDialogOpen(true)
                                }}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {shouldTruncateContent(entry.content) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleEntryExpansion(entry.id)}
                                className="h-8 w-8 p-0"
                              >
                                {expandedEntries.has(entry.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              {entry.content.length > 1000 && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEntryInNewTab(entry)}
                                  className="text-xs"
                                >
                                  Open in New Tab
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {editingEntry === entry.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="font-medium text-sm">Subject</label>
                            <Textarea
                              value={editSubject}
                              onChange={(e) => setEditSubject(e.target.value)}
                              maxLength={300}
                            />
                          </div>
                          <div>
                            <label className="font-medium text-sm">Details</label>
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[120px]"
                            />
                          </div>
                          <div>
                            <label className="font-medium text-sm">Tags</label>
                            <Input
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              placeholder="comma-separated"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => saveEditedEntry(entry.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </Button>
                            <Button
                              onClick={cancelEditing}
                              variant="outline"
                              size="sm"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold mb-2 cursor-pointer" onClick={() => {
                            if (shouldTruncateContent(entry.content)) {
                              toggleEntryExpansion(entry.id)
                            }
                          }}>
                            {entry.subject}
                          </h3>
                          <div className="mb-3 cursor-pointer" onClick={() => {
                            if (shouldTruncateContent(entry.content)) {
                              toggleEntryExpansion(entry.id)
                            }
                          }}>
                            {shouldTruncateContent(entry.content) && !expandedEntries.has(entry.id) ? (
                              <p>{truncateContent(entry.content)}</p>
                            ) : (
                              <p style={{ whiteSpace: 'pre-wrap' }}>{entry.content}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className={
                                  selectedTags.includes(tag)
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-gray-200 dark:bg-gray-700"
                                }
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Section: Search and Tags */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 border border-gray-200 dark:border-gray-700 custom-shadow">
            <CardHeader>
              <CardTitle>Search TIL</CardTitle>
              <CardDescription>Find entries by keyword or tag.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
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
              <CardTitle>Filter by Tags</CardTitle>
              <CardDescription>Click tags to filter entries.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {allUniqueTags.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No tags available yet.</p>
              ) : (
                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                  <div className="flex flex-wrap gap-2">
                    {allUniqueTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        onClick={() => toggleTag(tag)}
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag)
                            ? "bg-accent text-accent-foreground hover:bg-accent/90"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {tag}
                      </Badge>
                    ))}
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
        </div>
      </main>

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

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-900">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Ribash Sharma. Powered by v0 by vercel. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="https://github.com/rebussharma"
            className="text-xs hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="h-4 w-4" /> GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/ribash-sharma"
            className="text-xs hover:underline underline-offset-4 flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            prefetch={false}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="h-10 w-10 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Go to top"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </nav>
      </footer>
    </div>
  )
}