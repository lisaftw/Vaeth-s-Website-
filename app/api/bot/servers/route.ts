import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Verify bot token
    const authHeader = request.headers.get("authorization")
    const botToken = process.env.BOT_API_TOKEN

    if (!authHeader || !botToken || authHeader !== `Bearer ${botToken}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get all servers with auto-update enabled
    const { data: servers, error } = await supabase
      .from("servers")
      .select("id, discord_id, name, members, auto_update_enabled")
      .eq("auto_update_enabled", true)

    if (error) {
      console.error("Error fetching servers for bot:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch servers" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      servers: servers || [],
      count: servers?.length || 0,
    })
  } catch (error) {
    console.error("Error in bot servers route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
