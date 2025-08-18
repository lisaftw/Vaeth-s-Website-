"use server"

import { removeServer as removeServerFromStore } from "@/lib/data-store"

export async function removeServer(formData: FormData) {
  try {
    console.log("Remove server action called")

    const index = Number.parseInt(formData.get("index") as string)
    console.log("Removing server at index:", index)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        error: "Invalid server index",
      }
    }

    await removeServerFromStore(index)

    return {
      success: true,
      message: "Server has been removed successfully.",
    }
  } catch (error) {
    console.error("Error in removeServer action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error removing server",
    }
  }
}
