import { NextResponse } from "next/server"
import { getOwnerSession, getServersByOwner } from "@/lib/server-owner-auth"
import { bumpServer } from "@/lib/bump-system"

export async function POST() {
  try {
    const sessionResult = await getOwnerSession()

    if (!sessionResult.success || !sessionResult.data) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const serversResult = await getServersByOwner(sessionResult.data.id)

    if (!serversResult.success || serversResult.data.length === 0) {
      return NextResponse.json({ success: false, message: "No servers found" }, { status: 404 })
    }

    const server = serversResult.data[0]
    const result = await bumpServer(server.id, sessionResult.data.discordId, "manual")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error bumping server:", error)
    return NextResponse.json({ success: false, message: "Failed to bump server" }, { status: 500 })
  }
}
