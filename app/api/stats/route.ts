import { NextResponse } from "next/server"
import { getManualStats, refreshMainServerData } from "@/lib/manual-stats"

export async function GET() {
  try {
    // Force refresh the Discord data to get the latest count
    await refreshMainServerData()

    const stats = getManualStats()

    console.log("API returning stats:", stats)

    return NextResponse.json({
      totalServers: stats.totalServers,
      totalMembers: stats.totalMembers,
      securityScore: stats.securityScore,
      lastUpdated: stats.lastUpdated,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      {
        totalServers: 1,
        totalMembers: 250, // Updated fallback
        securityScore: 100,
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
