import { NextResponse } from "next/server"
import { getOwnerSession, getServersByOwner } from "@/lib/server-owner-auth"

export async function GET() {
  try {
    const sessionResult = await getOwnerSession()

    if (!sessionResult.success || !sessionResult.data) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const serversResult = await getServersByOwner(sessionResult.data.id)

    if (!serversResult.success || serversResult.data.length === 0) {
      return NextResponse.json({ success: false, error: "No servers found" }, { status: 404 })
    }

    // Return the first server for now (in the future, support multiple servers)
    return NextResponse.json({
      success: true,
      server: serversResult.data[0],
      owner: sessionResult.data,
    })
  } catch (error) {
    console.error("Error in my-server route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
