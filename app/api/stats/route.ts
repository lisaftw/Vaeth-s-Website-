import { NextResponse } from "next/server"
import { getManualStats, refreshMainServerFromDiscord } from "@/lib/manual-stats"

export async function GET() {
  try {
    console.log("=== STATS API ROUTE CALLED ===")

    // Try to refresh Discord data (optional, don't fail if it doesn't work)
    try {
      console.log("Attempting to refresh Discord data...")
      const refreshResult = await refreshMainServerFromDiscord()
      console.log("Discord refresh result:", refreshResult)
    } catch (refreshError) {
      console.warn("Discord refresh failed (non-critical):", refreshError)
    }

    // Get current stats
    console.log("Getting manual stats...")
    const stats = getManualStats()
    console.log("Retrieved stats:", stats)

    const response = {
      totalServers: stats.totalServers || 1,
      totalMembers: stats.totalMembers || 250,
      securityScore: stats.securityScore || 100,
      lastUpdated: stats.lastUpdated || new Date().toISOString(),
    }

    console.log("API returning stats:", response)

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("=== STATS API ERROR ===")
    console.error("Error in stats API:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    // Return fallback data with error status
    const fallbackResponse = {
      totalServers: 1,
      totalMembers: 250,
      securityScore: 100,
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }

    console.log("Returning fallback response:", fallbackResponse)

    return NextResponse.json(fallbackResponse, {
      status: 200, // Return 200 instead of 500 to prevent client errors
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  }
}
