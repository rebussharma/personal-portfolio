// app/docs/carfax/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic" // generate a fresh link per request

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_SECRET
  if (!url || !key) return new NextResponse("Not available", { status: 503 })

  const { data, error } = await createClient(url, key)
    .storage.from("docs")
    .createSignedUrl("mustang_carfax.pdf", 60)
  if (error || !data) return new NextResponse("File not found", { status: 404 })

  return NextResponse.redirect(data.signedUrl, {
    headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  })
}
