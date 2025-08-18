"use server"

import { addServer as addServerToStore } from "@/lib/data-store"

export async function addServer(formData: FormData) {
  try {
    console.log("=== ADD SERVER ACTION START ===")
    console.log("Form data received:", {
      name: formData.get("name"),
      description: formData.get("description"),
      members: formData.get("members"),
      invite: formData.get("invite"),
      logo: formData.get("logo"),
      tags: formData.get("tags"),
      representativeDiscordId: formData.get("representativeDiscordId"),
    })

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

    console.log("Processed server data:", serverData)

    // Validate required fields
    if (!serverData.name || !serverData.description || !serverData.members || !serverData.invite) {
      console.log("Validation failed - missing required fields")
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    console.log("Validation passed, adding server to store...")

    // Add to data store
    await addServerToStore(serverData)

    console.log("Server added successfully to data store")
    console.log("=== ADD SERVER ACTION END ===")

    return {
      success: true,
      message: `${serverData.name} has been added to the alliance!`,
    }
  } catch (error) {
    console.error("=== ADD SERVER ACTION ERROR ===")
    console.error("Error adding server:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return {
      success: false,
      error: "Failed to add server: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}
