"use server"

import { removeServer as removeServerFromStore, getServersData } from "@/lib/data-store"

export async function removeServer(formData: FormData) {
  try {
    const index = Number.parseInt(formData.get("index") as string)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        error: "Invalid server index",
      }
    }

    // Get the server before removing to get its name
    const servers = getServersData()
    const server = servers[index]

    if (!server) {
      return {
        success: false,
        error: "Server not found",
      }
    }

    // Remove the server
    const removedServer = removeServerFromStore(index)

    if (!removedServer) {
      return {
        success: false,
        error: "Failed to remove server",
      }
    }

    return {
      success: true,
      message: `${server.name} has been removed from the alliance.`,
    }
  } catch (error) {
    console.error("Error removing server:", error)
    return {
      success: false,
      error: "Failed to remove server",
    }
  }
}
