import { NextResponse } from "next/server"
import { refreshAllServerData } from "@/lib/server-storage"

export async function POST() {
  try {
    console.log("Manual Discord data refresh requested")
    await refreshAllServerData()
    return NextResponse.json({ success: true, message: "Server data refreshed successfully" })
  } catch (error) {
    console.error("Error refreshing Discord data:", error)
    return NextResponse.json({ error: "Failed to refresh server data" }, { status: 500 })
  }
}
