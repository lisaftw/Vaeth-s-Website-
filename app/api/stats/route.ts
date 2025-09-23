import { NextResponse } from "next/server"
import { getStats } from "@/lib/data-store"

export async function GET() {
  try {
    console.log("Stats API route called")
    const stats = await getStats()

    console.log("Stats retrieved:", stats)

    // Always return a successful response with stats data
    return NextResponse.json({
      success: true,
      data: stats,
      error: stats.error || null,
      isError: stats.isError || false,
    })
  } catch (error) {
    console.error("Critical error in stats API route:", error)

    // Return fallback stats even on critical error
    return NextResponse.json({
      success: false,
      data: {
        totalServers: 0,
        totalMembers: 0,
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
      },
      error: "Service temporarily unavailable",
      isError: true,
    })
  }
}
