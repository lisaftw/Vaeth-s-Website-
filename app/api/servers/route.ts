import { NextResponse } from "next/server"
import { getWebsiteServers } from "@/lib/server-storage"

export async function GET() {
  try {
    const servers = getWebsiteServers()
    return NextResponse.json(servers)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
  }
}
