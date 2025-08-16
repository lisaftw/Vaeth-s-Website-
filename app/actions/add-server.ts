"use server"

import { addServer as addServerToStore } from "@/lib/data-store"

export async function addServer(formData: FormData) {
  try {
    const serverData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      members: Number.parseInt(formData.get("members") as string) || 0,
      invite: formData.get("invite") as string,
      logo: formData.get("logo") as string,
      verified: formData.get("verified") === "on",
      dateAdded: new Date().toISOString(),
      tags: formData.get("tags")
        ? (formData.get("tags") as string)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      representativeDiscordId: formData.get("representativeDiscordId") as string,
    }

    // Validate required fields
    if (!serverData.name || !serverData.description || !serverData.members || !serverData.invite) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Add to data store
    addServerToStore(serverData)

    return {
      success: true,
      message: `${serverData.name} has been added to the alliance!`,
    }
  } catch (error) {
    console.error("Error adding server:", error)
    return {
      success: false,
      error: "Failed to add server",
    }
  }
}
