"use server"

import { addServer as addServerToStore } from "@/lib/data-store"
import { revalidatePath } from "next/cache"
import { fetchDiscordServerInfo, getDiscordIconUrl } from "@/lib/discord-utils"

export async function addServer(formData: FormData) {
  try {
    console.log("[v0] Add server action called")

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string)
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string
    const leadDelegateName = formData.get("leadDelegateName") as string
    const leadDelegateId = formData.get("leadDelegateId") as string

    if (!name || !description || !members || !invite) {
      return {
        success: false,
        error: "All fields except logo and lead delegate are required",
      }
    }

    let discordIcon: string | undefined = undefined
    try {
      console.log("[v0] Fetching Discord server info for invite:", invite)
      const discordInfo = await fetchDiscordServerInfo(invite)

      if (discordInfo && discordInfo.icon) {
        discordIcon = getDiscordIconUrl(discordInfo.id, discordInfo.icon)
        console.log("[v0] Discord icon URL:", discordIcon)
      } else {
        console.log("[v0] No Discord icon found for server")
      }
    } catch (error) {
      console.error("[v0] Error fetching Discord info:", error)
      // Continue without Discord icon if fetch fails
    }

    const server = {
      name,
      description,
      members,
      invite,
      logo: logo || undefined,
      discordIcon, // Add Discord icon to server data
      verified: false,
      tags: ["Partner"],
      leadDelegateName: leadDelegateName || undefined,
      leadDelegateId: leadDelegateId || undefined,
    }

    console.log("[v0] Adding server:", server)

    await addServerToStore(server)

    // Invalidate cache for homepage and admin pages
    revalidatePath("/")
    revalidatePath("/admin")

    console.log("[v0] Server added and cache invalidated")

    return {
      success: true,
      message: "Server has been added successfully to the alliance.",
    }
  } catch (error) {
    console.error("[v0] Error in addServer action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error adding server",
    }
  }
}
