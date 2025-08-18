import { NextResponse } from "next/server"
import { getStats } from "@/lib/data-store"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    console.log("=== STATS API ROUTE ===")

    const stats = await getStats()
    console.log("Retrieved stats:", stats)

    const response = {
      success: true,
      totalServers: stats.totalServers,
      totalMembers: stats.totalMembers,
      securityScore: stats.securityScore,
      lastUpdated: stats.lastUpdated,
      timestamp: new Date().toISOString(),
    }

    console.log("Returning stats response:", response)
    console.log("=== END STATS API ===")

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in stats API:", error)
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
