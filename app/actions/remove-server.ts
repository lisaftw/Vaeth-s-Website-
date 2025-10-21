"use server"

import { createAdminClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function removeServer(formData: FormData) {
  try {
    console.log("[v0] Remove server action called")

    const serverId = formData.get("serverId") as string

    if (!serverId) {
      console.error("[v0] No serverId provided")
      return {
        success: false,
        error: "Server ID is required",
      }
    }

    console.log("[v0] Attempting to delete server with ID:", serverId)

    const supabase = await createAdminClient()

    // Delete the server from database
    const { data, error } = await supabase.from("servers").delete().eq("id", serverId).select()

    if (error) {
      console.error("[v0] Supabase error removing server:", error)
      return {
        success: false,
        error: `Failed to remove server: ${error.message}`,
      }
    }

    console.log("[v0] Delete query executed, deleted data:", data)

    if (!data || data.length === 0) {
      console.error("[v0] No server was deleted - server ID might not exist:", serverId)
      return {
        success: false,
        error: "Server not found or already deleted",
      }
    }

    console.log("[v0] Server removed successfully:", data[0].name)

    // Invalidate cache for homepage and admin pages
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/leaderboard")

    return {
      success: true,
      message: `Server "${data[0].name}" has been removed successfully.`,
    }
  } catch (error) {
    console.error("[v0] Exception in removeServer action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error removing server",
    }
  }
}
