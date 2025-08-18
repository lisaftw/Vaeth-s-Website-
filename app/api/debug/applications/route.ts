import { NextResponse } from "next/server"
import { getApplicationsData } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("=== DEBUG APPLICATIONS API ===")

    const applications = await getApplicationsData()

    const debugInfo = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      applicationsCount: applications.length,
      applications: applications.map((app, index) => ({
        index,
        name: app.name,
        description: app.description,
        members: app.members,
        invite: app.invite,
        logo: app.logo,
        representativeDiscordId: app.representativeDiscordId,
        ownerName: app.ownerName,
        status: app.status,
        submittedAt: app.submittedAt,
        reviewedAt: app.reviewedAt,
      })),
    }

    console.log("Debug info:", debugInfo)

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Error in debug applications API:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
