"use server"

import { updateManualStats, updateServerMemberCount, refreshMainServerFromDiscord } from "@/lib/manual-stats"

export async function updateManualStatsAction(formData: FormData) {
  try {
    console.log("=== UPDATE MANUAL STATS ACTION ===")

    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 0
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 0
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 0

    console.log("Updating stats:", { totalServers, totalMembers, securityScore })

    updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    return {
      success: true,
      message: "Alliance statistics updated successfully!",
    }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return {
      success: false,
      error: "Failed to update statistics: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

export async function updateServerMemberCountAction(formData: FormData) {
  try {
    console.log("=== UPDATE SERVER MEMBER COUNT ACTION ===")

    const serverName = formData.get("serverName") as string
    const memberCount = Number.parseInt(formData.get("memberCount") as string) || 0

    console.log("Updating server member count:", { serverName, memberCount })

    if (!serverName) {
      return {
        success: false,
        error: "Server name is required",
      }
    }

    updateServerMemberCount(serverName, memberCount)

    return {
      success: true,
      message: `Updated ${serverName} member count to ${memberCount.toLocaleString()}`,
    }
  } catch (error) {
    console.error("Error updating server member count:", error)
    return {
      success: false,
      error: "Failed to update server member count: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}

export async function refreshMainServerAction() {
  try {
    console.log("=== REFRESH MAIN SERVER ACTION ===")

    const result = await refreshMainServerFromDiscord()

    return result
  } catch (error) {
    console.error("Error refreshing main server:", error)
    return {
      success: false,
      error: "Failed to refresh main server: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}
