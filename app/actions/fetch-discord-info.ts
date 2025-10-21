"use server"

import { fetchDiscordServerInfo, getDiscordIconUrl } from "@/lib/discord-utils"

export async function fetchDiscordInfo(inviteLink: string) {
  try {
    console.log("[v0] Fetching Discord info for:", inviteLink)

    const serverInfo = await fetchDiscordServerInfo(inviteLink)

    if (!serverInfo) {
      return {
        success: false,
        error: "Failed to fetch Discord server information. Please check the invite link.",
      }
    }

    const iconUrl = serverInfo.icon ? getDiscordIconUrl(serverInfo.id, serverInfo.icon) : null

    return {
      success: true,
      data: {
        name: serverInfo.name,
        description: serverInfo.description || "",
        members: serverInfo.approximate_member_count || 0,
        onlineMembers: serverInfo.approximate_presence_count || 0,
        iconUrl,
        discordId: serverInfo.id,
        features: serverInfo.features,
      },
    }
  } catch (error) {
    console.error("[v0] Error in fetchDiscordInfo:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
