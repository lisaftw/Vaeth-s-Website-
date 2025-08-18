import { type NextRequest, NextResponse } from "next/server"
import { updateManualStats, updateServerMemberCount } from "@/lib/manual-stats"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle different types of webhook updates
    if (body.type === "stats_update") {
      const success = await updateManualStats({
        totalServers: body.totalServers,
        totalMembers: body.totalMembers,
        securityScore: body.securityScore,
      })

      if (success) {
        return NextResponse.json({ success: true, message: "Stats updated via webhook" })
      } else {
        return NextResponse.json({ success: false, error: "Failed to update stats" }, { status: 500 })
      }
    }

    if (body.type === "server_member_update") {
      const success = await updateServerMemberCount(body.serverName, body.memberCount)

      if (success) {
        return NextResponse.json({ success: true, message: "Server member count updated via webhook" })
      } else {
        return NextResponse.json({ success: false, error: "Failed to update server member count" }, { status: 500 })
      }
    }

    // Default response for other webhook types
    return NextResponse.json({ success: true, message: "Webhook received" })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ success: false, error: "Failed to process webhook" }, { status: 500 })
  }
}
