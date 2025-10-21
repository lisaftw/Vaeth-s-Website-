import { type NextRequest, NextResponse } from "next/server"
import { createOrUpdateServerOwner, setOwnerSession, getServersByOwner } from "@/lib/server-owner-auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { discordId, username } = body

    if (!discordId || !username) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create or update the server owner
    const ownerResult = await createOrUpdateServerOwner(discordId, username)

    if (!ownerResult.success) {
      return NextResponse.json({ success: false, error: "Failed to authenticate" }, { status: 500 })
    }

    // Check if the owner has any servers
    const serversResult = await getServersByOwner(ownerResult.data.id)

    if (!serversResult.success || serversResult.data.length === 0) {
      return NextResponse.json(
        { success: false, error: "No servers found for this account. Please contact an administrator." },
        { status: 404 },
      )
    }

    // Set the session
    await setOwnerSession(discordId)

    return NextResponse.json({
      success: true,
      message: "Login successful",
      owner: ownerResult.data,
      serverCount: serversResult.data.length,
    })
  } catch (error) {
    console.error("Error in login route:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
