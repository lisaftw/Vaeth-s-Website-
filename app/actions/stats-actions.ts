"use server"

import { updateServerStats, updateAllServerStats, fetchDiscordStats } from "@/lib/discord-stats"
import { supabase } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function updateSingleServerStats(serverId: string) {
  try {
    const success = await updateServerStats(serverId)

    if (success) {
      revalidatePath("/")
      revalidatePath("/admin")
      return { success: true, message: "Server stats updated successfully" }
    }

    return { success: false, error: "Failed to update server stats" }
  } catch (error) {
    console.error("Error updating server stats:", error)
    return { success: false, error: "An error occurred while updating stats" }
  }
}

export async function updateAllStats() {
  try {
    const result = await updateAllServerStats()

    revalidatePath("/")
    revalidatePath("/admin")

    return {
      success: true,
      message: `Updated ${result.updated} servers, ${result.failed} failed`,
      ...result,
    }
  } catch (error) {
    console.error("Error updating all stats:", error)
    return { success: false, error: "An error occurred while updating stats" }
  }
}

export async function toggleAutoUpdate(serverId: string, enabled: boolean) {
  try {
    const { error } = await supabase
      .from("servers")
      .update({
        auto_update_enabled: enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverId)

    if (error) {
      console.error("Error toggling auto-update:", error)
      return { success: false, error: "Failed to update auto-update setting" }
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: `Auto-update ${enabled ? "enabled" : "disabled"} successfully`,
    }
  } catch (error) {
    console.error("Error in toggleAutoUpdate:", error)
    return { success: false, error: "An error occurred" }
  }
}

export async function previewDiscordStats(inviteCode: string) {
  try {
    const stats = await fetchDiscordStats(inviteCode)

    if (!stats) {
      return { success: false, error: "Failed to fetch Discord stats" }
    }

    return { success: true, stats }
  } catch (error) {
    console.error("Error previewing stats:", error)
    return { success: false, error: "An error occurred" }
  }
}
