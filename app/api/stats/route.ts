import { NextResponse } from "next/server"
import { getManualStats } from "@/lib/manual-stats"

export async function GET() {
  try {
    const stats = await getManualStats()

    return NextResponse.json({
      totalServers: stats.totalServers,
      totalMembers: stats.totalMembers,
      securityScore: stats.securityScore,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in stats API:", error)
    return NextResponse.json(
      {
        totalServers: 1,
        totalMembers: 250,
        securityScore: 100,
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
