import { NextResponse } from "next/server";

export async function GET() {
  const SUPABASE_SERVICE_ROLE_SECRET = process.env.SUPABASE_SERVICE_ROLE_SECRET;
  const EMAIL_SERVICE_ID = process.env.EMAIL_SERVICE_ID;
  const EMAIL_TRMPLATE_ID = process.env.EMAIL_TRMPLATE_ID;
  const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;
  return NextResponse.json({ 
    SUPABASE_SERVICE_ROLE_SECRET,
    EMAIL_SERVICE_ID,
    EMAIL_TRMPLATE_ID,
    ADMIN_SECRET_KEY  
  });
}
