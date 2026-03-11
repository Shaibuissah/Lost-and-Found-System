import { NextResponse } from "next/server"

// OAuth callback is no longer used; just redirect to login
export async function GET() {
  return NextResponse.redirect(`/auth/login`)
}
