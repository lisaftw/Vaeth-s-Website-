import { updateAllServerStats } from "@/lib/discord-stats"
import { NextResponse } from "next/server"

// This endpoint can be called by a cron job (e.g., Vercel Cron)
export async function GET(request: Request) {
  try {
    // Verify the request is from a cron job (optional: add authorization header check)
    const authHeader = request.headers.get("authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] Cron job triggered: updating all server stats")

    const result = await updateAllServerStats()

    return NextResponse.json({
      success: true,
      updated: result.updated,
      failed: result.failed,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Error in cron job:", error)
    return NextResponse.json(
      {
        error: "Failed to update stats",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Allow POST as well for manual triggers
export async function POST(request: Request) {
  return GET(request)
}
