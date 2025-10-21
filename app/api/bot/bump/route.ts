import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { bumpServer } from "@/lib/bump-system"

export async function POST(request: NextRequest) {
  try {
    // Verify bot token
    const authHeader = request.headers.get("authorization")
    const botToken = process.env.BOT_API_TOKEN

    if (!authHeader || !botToken || authHeader !== `Bearer ${botToken}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { serverId, userId } = body

    if (!serverId || !userId) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get server by Discord ID
    const { data: server, error: fetchError } = await supabase
      .from("servers")
      .select("id, name")
      .eq("discord_id", serverId)
      .single()

    if (fetchError || !server) {
      return NextResponse.json({ success: false, error: "Server not found" }, { status: 404 })
    }

    // Bump the server
    const result = await bumpServer(server.id, userId, "bot")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in bot bump route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
