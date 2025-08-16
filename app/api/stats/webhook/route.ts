import { type NextRequest, NextResponse } from "next/server"
import { updateManualStats, updateServerMemberCount } from "@/lib/manual-stats"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different types of webhook updates
    if (body.type === "stats_update") {
      updateManualStats({
        totalServers: body.totalServers,
        totalMembers: body.totalMembers,
        securityScore: body.securityScore,
      })

      return NextResponse.json({ success: true, message: "Stats updated via webhook" })
    }

    if (body.type === "server_member_update") {
      updateServerMemberCount(body.serverName, body.memberCount)

      return NextResponse.json({ success: true, message: "Server member count updated via webhook" })
    }

    // Default response for other webhook types
    return NextResponse.json({ success: true, message: "Webhook received" })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 500 })
  }
}
