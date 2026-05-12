import { NextResponse } from "next/server"

export async function GET() {
  const fileUrl =
    "https://todhrnlwunqduzjbhejl.supabase.co/storage/v1/object/sign/docs/CARFAX%20Vehicle%20History%20Report%20for%20this%202014%20FORD%20MUSTANG%20V6%20PREMIUM_%201ZVBP8AM9E5311258.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xY2VkZTVkYS1jMzY2LTRjOWUtOTViOS01YmQ4OWVlZGJhNmEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJkb2NzL0NBUkZBWCBWZWhpY2xlIEhpc3RvcnkgUmVwb3J0IGZvciB0aGlzIDIwMTQgRk9SRCBNVVNUQU5HIFY2IFBSRU1JVU1fIDFaVkJQOEFNOUU1MzExMjU4LnBkZiIsImlhdCI6MTc3ODYxMTU3NCwiZXhwIjoxODEwMTQ3NTc0fQ.jKUGQCY0_fqJnLcxOdOA6P-oCba6O1D8gwwFPCbaobo"

  const res = await fetch(fileUrl)

  if (!res.ok) {
    return new NextResponse("File not found", { status: 404 })
  }

  const blob = await res.blob()

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=carfax.pdf",
    },
  })
}