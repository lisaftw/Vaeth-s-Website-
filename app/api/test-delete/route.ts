import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { serverId } = await request.json()

    console.log("[v0] Test delete endpoint called with serverId:", serverId)

    if (!serverId) {
      return NextResponse.json({ success: false, error: "Server ID required" }, { status: 400 })
    }

    const supabase = createAdminClient()

    // First, check if the server exists
    const { data: existingServer, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .eq("id", serverId)
      .single()

    console.log("[v0] Existing server:", existingServer)
    console.log("[v0] Fetch error:", fetchError)

    if (fetchError) {
      return NextResponse.json({ success: false, error: `Fetch error: ${fetchError.message}` }, { status: 500 })
    }

    if (!existingServer) {
      return NextResponse.json({ success: false, error: "Server not found" }, { status: 404 })
    }

    // Now try to delete it
    const { data: deletedData, error: deleteError } = await supabase
      .from("servers")
      .delete()
      .eq("id", serverId)
      .select()

    console.log("[v0] Deleted data:", deletedData)
    console.log("[v0] Delete error:", deleteError)

    if (deleteError) {
      return NextResponse.json({ success: false, error: `Delete error: ${deleteError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Server deleted successfully",
      deletedServer: deletedData?.[0],
    })
  } catch (error) {
    console.error("[v0] Test delete exception:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
