import { NextResponse } from "next/server"
import { getOwnerSession, getServersByOwner } from "@/lib/server-owner-auth"
import { canBumpServer } from "@/lib/bump-system"

export async function GET() {
  try {
    const sessionResult = await getOwnerSession()

    if (!sessionResult.success || !sessionResult.data) {
      return NextResponse.json({ canBump: false, error: "Not authenticated" }, { status: 401 })
    }

    const serversResult = await getServersByOwner(sessionResult.data.id)

    if (!serversResult.success || serversResult.data.length === 0) {
      return NextResponse.json({ canBump: false, error: "No servers found" }, { status: 404 })
    }

    const server = serversResult.data[0]
    const result = await canBumpServer(server.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error checking bump eligibility:", error)
    return NextResponse.json({ canBump: false, error: "Internal server error" }, { status: 500 })
  }
}
