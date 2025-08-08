


"use server"

import { revalidatePath } from "next/cache"
import { createClient } from '@supabase/supabase-js'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL

// Regular client (for public reads)
const supabase = createClient(
  URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
console.log("&&&&&&&&& here", supabase);

// Admin client (bypasses RLS)
const supabaseAdmin = createClient(
  URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_SECRET! // This bypasses RLS
)

console.log("&&&&&&&&& Theere", supabaseAdmin);


interface AddTilEntryResult {
  success: boolean
  message?: string
  error?: string
}

// Verify admin key
function verifyAdminKey(adminKey: string): boolean {
  return adminKey === process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
}

export async function addTilEntry(
  prevState: AddTilEntryResult | null,
  formData: FormData
): Promise<AddTilEntryResult> {
  const adminKey = formData.get("adminKey") as string
    console.log("###### INSERT admin Key ACTIONS", adminKey);

  if (!verifyAdminKey(adminKey)) {
        console.log(" &&&&& INSERT admin Key ACTIONS", adminKey);

    return { success: false, error: "Unauthorized" }
  }

  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const tagsString = formData.get("tags") as string

  if ((!content || content.trim() === "") || (!subject || subject.trim() === "")) {
    return { success: false, error: "Content cannot be empty." }
  }

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

  const { data, error } = await supabaseAdmin
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
  const adminKey = formData.get("adminKey") as string
  console.log("###### UPDATE admin Key ACTIONS", adminKey);
  
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: "Unauthorized" }
  }

  const id = formData.get("id") as string
  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const tagsString = formData.get("tags") as string

  if ((!content || content.trim() === "") || (!subject || subject.trim() === "")) {
    return { success: false, error: "Content cannot be empty." }
  }

  const tags = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")

  const { data, error } = await supabaseAdmin
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
  const adminKey = formData.get("adminKey") as string
  
  if (!verifyAdminKey(adminKey)) {
    return { success: false, error: "Unauthorized" }
  }

  const id = formData.get("id") as string

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

export async function getTilEntries() {
  const { data, error } = await supabase
    .from("til_entries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching TIL entries:", error)
    return []
  }
  return data
}