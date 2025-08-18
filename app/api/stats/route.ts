import { NextResponse } from "next/server"
import { getManualStats } from "@/lib/manual-stats"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("Stats API called - fetching current stats from Supabase...")

    // Get current stats from Supabase
    const stats = await getManualStats()

    console.log("API returning stats:", stats)

    // Return the stats with proper headers to prevent caching
    return NextResponse.json(
      {
        totalServers: stats.totalServers,
        totalMembers: stats.totalMembers,
        securityScore: stats.securityScore,
        lastUpdated: stats.lastUpdated,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    console.error("Error in stats API:", error)

    // Return fallback data with error status
    return NextResponse.json(
      {
        totalServers: 1,
        totalMembers: 250,
        securityScore: 100,
        lastUpdated: new Date().toISOString(),
        error: "Failed to fetch current stats",
      },
      {
        status: 200, // Return 200 instead of 500 to prevent client errors
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
