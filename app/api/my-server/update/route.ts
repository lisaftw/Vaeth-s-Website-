import { type NextRequest, NextResponse } from "next/server"
import { getOwnerSession } from "@/lib/server-owner-auth"
import { updateMyServer } from "@/app/actions/update-my-server"

export async function POST(request: NextRequest) {
  try {
    const sessionResult = await getOwnerSession()

    if (!sessionResult.success || !sessionResult.data) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()

    const result = await updateMyServer(
      {
        serverId: body.id,
        name: body.name,
        description: body.description,
        invite: body.invite,
        logo: body.logo,
        leadDelegateName: body.leadDelegateName,
        leadDelegateDiscordId: body.leadDelegateDiscordId,
        autoUpdateEnabled: body.autoUpdateEnabled,
      },
      sessionResult.data.discordId,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating server:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
