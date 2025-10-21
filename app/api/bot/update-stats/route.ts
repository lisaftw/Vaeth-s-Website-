import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Verify bot token
    const authHeader = request.headers.get("authorization")
    const botToken = process.env.BOT_API_TOKEN

    if (!authHeader || !botToken || authHeader !== `Bearer ${botToken}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { serverId, memberCount, onlineMembers } = body

    if (!serverId || memberCount === undefined) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if auto-update is enabled for this server
    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("auto_update_enabled, name")
      .eq("discord_id", serverId)
      .single()

    if (fetchError || !server) {
      return NextResponse.json({ success: false, error: "Server not found" }, { status: 404 })
    }

    if (!server.auto_update_enabled) {
      return NextResponse.json({ success: false, error: "Auto-update disabled for this server" }, { status: 403 })
    }

    // Update server stats
    const updateData: any = {
      members: memberCount,
      updated_at: new Date().toISOString(),
    }

    if (onlineMembers !== undefined) {
      updateData.online_members = onlineMembers
    }

    const { error: updateError } = await supabase.from("servers").update(updateData).eq("discord_id", serverId)

    if (updateError) {
      console.error("Error updating server stats:", updateError)
      return NextResponse.json({ success: false, error: "Failed to update stats" }, { status: 500 })
    }

    console.log(`Bot updated stats for ${server.name}: ${memberCount} members`)

    return NextResponse.json({
      success: true,
      message: `Stats updated for ${server.name}`,
      memberCount,
      onlineMembers,
    })
  } catch (error) {
    console.error("Error in bot update-stats route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
