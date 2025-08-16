import { NextResponse } from "next/server"
import { refreshMainServerData, getManualStats } from "@/lib/manual-stats"

export async function POST() {
  try {
    console.log("Manual refresh requested via API")
    await refreshMainServerData()
    const stats = getManualStats()

    console.log("Refresh completed, returning stats:", stats)

    return NextResponse.json({
      success: true,
      message: "Main server data refreshed successfully from Discord API",
      stats,
    })
  } catch (error) {
    console.error("Error refreshing main server data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh main server data",
      },
      { status: 500 },
    )
  }
}
