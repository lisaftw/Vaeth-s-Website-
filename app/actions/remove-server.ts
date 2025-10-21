"use server"

import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function removeServer(formData: FormData) {
  try {
    console.log("Remove server action called")

    const serverId = formData.get("serverId") as string

    if (!serverId) {
      return {
        success: false,
        error: "Server ID is required",
      }
    }

    console.log("Removing server with ID:", serverId)

    // Delete the server from database
    const { error } = await supabase.from("servers").delete().eq("id", serverId)

    if (error) {
      console.error("Supabase error removing server:", error)
      return {
        success: false,
        error: `Failed to remove server: ${error.message}`,
      }
    }

    console.log("Server removed successfully")

    // Invalidate cache for homepage and admin pages
    revalidatePath("/")
    revalidatePath("/admin")

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
