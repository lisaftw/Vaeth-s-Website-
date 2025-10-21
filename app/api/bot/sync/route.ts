import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// API endpoint for bot to sync data with website
export async function POST(request: Request) {
  try {
    // Verify the request is from the bot
    const authHeader = request.headers.get("authorization")

    if (authHeader !== `Bearer ${process.env.BOT_API_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "update_bump":
        return await handleUpdateBump(data)
      case "get_server":
        return await handleGetServer(data)
      case "update_stats":
        return await handleUpdateStats(data)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("[API] Error in bot sync:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

async function handleUpdateBump(data: any) {
  try {
    const { guildId, userId } = data

    const { error } = await supabase
      .from("servers")
      .update({
        last_bump: new Date().toISOString(),
        bump_count: supabase.rpc("increment", { row_id: guildId }),
        updated_at: new Date().toISOString(),
      })
      .eq("discord_id", guildId)

    if (error) {
      return NextResponse.json({ error: "Failed to update bump" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating bump:", error)
    return NextResponse.json({ error: "Failed to update bump" }, { status: 500 })
  }
}

async function handleGetServer(data: any) {
  try {
    const { guildId } = data

    const { data: server, error } = await supabase.from("servers").select("*").eq("discord_id", guildId).single()

    if (error) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    return NextResponse.json({ server })
  } catch (error) {
    console.error("[API] Error getting server:", error)
    return NextResponse.json({ error: "Failed to get server" }, { status: 500 })
  }
}

async function handleUpdateStats(data: any) {
  try {
    const { guildId, members, onlineMembers } = data

    const { error } = await supabase
      .from("servers")
      .update({
        members,
        online_members: onlineMembers,
        updated_at: new Date().toISOString(),
      })
      .eq("discord_id", guildId)

    if (error) {
      return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Error updating stats:", error)
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 })
  }
}

// Allow GET for health check
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() })
}
