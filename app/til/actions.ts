"use server"

import { revalidatePath } from "next/cache"
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Clients are created lazily so missing env vars degrade the TIL feature instead of
// throwing at import time (this module is also imported by the homepage).
let publicClient: SupabaseClient | null = null
let adminClient: SupabaseClient | null = null

// Regular client (for public reads)
function getPublicClient() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!SUPABASE_URL || !key) return null
  return (publicClient ??= createClient(SUPABASE_URL, key))
}

// Admin client (bypasses RLS); only used after the admin key has been verified
function getAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_SECRET
  if (!SUPABASE_URL || !key) return null
  return (adminClient ??= createClient(SUPABASE_URL, key))
}

const NOT_CONFIGURED = { success: false, error: "TIL storage is not configured." } as const


interface AddTilEntryResult {
  success: boolean
  message?: string
  error?: string
}

// Verify admin key (constant-time comparison)
function verifyAdminKey(adminKey: string | null): boolean {
  const expected = process.env.ADMIN_SECRET_KEY
  if (!expected || !adminKey || adminKey.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ adminKey.charCodeAt(i)
  }
  return mismatch === 0
}

export async function checkAdminKey(adminKey: string): Promise<boolean> {
  return verifyAdminKey(adminKey)
}

export async function addTilEntry(
  prevState: AddTilEntryResult | null,
  formData: FormData
): Promise<AddTilEntryResult> {
  const adminKey = formData.get("adminKey") as string | null
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: "Unauthorized" }
  }

  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const tagsString = (formData.get("tags") as string | null) ?? ""

  if ((!content || content.trim() === "") || (!subject || subject.trim() === "")) {
    return { success: false, error: "Content cannot be empty." }
  }

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

  const supabaseAdmin = getAdminClient()
  if (!supabaseAdmin) return NOT_CONFIGURED

  const { error } = await supabaseAdmin
    .from("til_entries")
    .insert([{ subject, content, tags }])
    .select()

  if (error) {
    console.error("Error adding TIL entry:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/til")
  return { success: true, message: "TIL entry added successfully!" }
}

export async function updateTilEntry(
  prevState: AddTilEntryResult | null,
  formData: FormData
): Promise<AddTilEntryResult> {
  const adminKey = formData.get("adminKey") as string | null
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: "Unauthorized" }
  }

  const id = formData.get("id") as string
  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const tagsString = (formData.get("tags") as string | null) ?? ""

  if ((!content || content.trim() === "") || (!subject || subject.trim() === "")) {
    return { success: false, error: "Content cannot be empty." }
  }

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

  const supabaseAdmin = getAdminClient()
  if (!supabaseAdmin) return NOT_CONFIGURED

  const { error } = await supabaseAdmin
    .from("til_entries")
    .update({ subject, content, tags })
    .eq('id', id)
    .select()

  if (error) {
    console.error("Error updating TIL entry:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/til")
  return { success: true, message: "TIL entry updated successfully!" }
}

export async function deleteTilEntry(
  prevState: AddTilEntryResult | null,
  formData: FormData
): Promise<AddTilEntryResult> {
  const adminKey = formData.get("adminKey") as string | null
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: "Unauthorized" }
  }

  const id = formData.get("id") as string

  const supabaseAdmin = getAdminClient()
  if (!supabaseAdmin) return NOT_CONFIGURED

  const { error } = await supabaseAdmin
    .from("til_entries")
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting TIL entry:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/til")
  return { success: true, message: "TIL entry deleted successfully!" }
}

export async function getTilEntries(limit?: number) {
  const supabase = getPublicClient()
  if (!supabase) return []

  let query = supabase
    .from("til_entries")
    .select("*")
    .order("updated_at", { ascending: false })
  if (limit) query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching TIL entries:", error)
    return []
  }
  return data ?? []
}