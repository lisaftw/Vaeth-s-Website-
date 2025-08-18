"use server"

import { addServer as addServerToStore, debugDataStore } from "@/lib/data-store"
import { addServerToMemberCounts } from "@/lib/manual-stats"

export async function addServer(formData: FormData) {
  try {
    console.log("=== ADD SERVER ACTION STARTED ===")

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

    console.log("Server data to add:", serverData)

    // Validate required fields
    if (!serverData.name || !serverData.description || !serverData.members || !serverData.invite) {
      console.log("Validation failed - missing required fields")
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    console.log("Validation passed, adding server to Supabase...")

    // Add to Supabase
    await addServerToStore(serverData)

    console.log("Server added to Supabase, updating manual stats...")

    // Add to manual stats tracking
    await addServerToMemberCounts(serverData.name, serverData.members)

    console.log("Manual stats updated")

    // Debug the current state
    await debugDataStore()

    console.log("=== ADD SERVER ACTION COMPLETED ===")

    return {
      success: true,
      message: `${serverData.name} has been added to the alliance!`,
    }
  } catch (error) {
    console.error("Error adding server:", error)
    return {
      success: false,
      error: "Failed to add server: " + String(error),
    }
  }
}
