"use server"

import { updateManualStats, updateServerMemberCount, refreshMainServerData } from "@/lib/manual-stats"

export async function updateManualStatsAction(formData: FormData) {
  try {
    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 0
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 0
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 0

    updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    return {
      success: true,
      message: "Manual stats updated successfully",
    }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return {
      success: false,
      error: "Failed to update manual stats",
    }
  }
}

export async function updateServerMemberCountAction(formData: FormData) {
  try {
    const serverName = formData.get("serverName") as string
    const memberCount = Number.parseInt(formData.get("memberCount") as string) || 0

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
      error: "Failed to update server member count",
    }
  }
}

export async function refreshMainServerAction() {
  try {
    const result = await refreshMainServerData()
    return result
  } catch (error) {
    console.error("Error refreshing main server:", error)
    return {
      success: false,
      error: "Failed to refresh main server data",
    }
  }
}
