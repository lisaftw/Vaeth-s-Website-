"use server"

import { getServersData, removeServer, addServer } from "@/lib/data-store"

export async function updateServer(formData: FormData) {
  try {
    const index = Number.parseInt(formData.get("index") as string)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        error: "Invalid server index",
      }
    }

    const servers = getServersData()
    if (index >= servers.length) {
      return {
        success: false,
        error: "Server not found",
      }
    }

    const updatedServerData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      members: Number.parseInt(formData.get("members") as string) || 0,
      invite: formData.get("invite") as string,
      logo: formData.get("logo") as string,
      verified: servers[index].verified, // Keep existing verification status
      dateAdded: servers[index].dateAdded, // Keep original date
      tags: servers[index].tags, // Keep existing tags
      representativeDiscordId: formData.get("representativeDiscordId") as string,
    }

    // Validate required fields
    if (
      !updatedServerData.name ||
      !updatedServerData.description ||
      !updatedServerData.members ||
      !updatedServerData.invite
    ) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Remove old server and add updated one
    removeServer(index)
    addServer(updatedServerData)

    return {
      success: true,
      message: `${updatedServerData.name} has been updated!`,
    }
  } catch (error) {
    console.error("Error updating server:", error)
    return {
      success: false,
      error: "Failed to update server",
    }
  }
}
