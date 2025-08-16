"use server"

import {
  updateManualStats,
  updateServerMemberCount,
  refreshMainServerData,
  sendStatsUpdateNotification,
} from "@/lib/manual-stats"

export async function updateManualStatsAction(formData: FormData) {
  try {
    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 0
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 0
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 0

    const newStats = {
      totalServers,
      totalMembers,
      securityScore,
    }

    updateManualStats(newStats)

    // Send optional notification
    await sendStatsUpdateNotification(newStats)

    return {
      success: true,
      message: "Alliance statistics updated successfully",
    }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return {
      success: false,
      error: "Failed to update statistics",
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
      message: `Updated ${serverName} member count to ${memberCount}`,
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

    if (result.success) {
      return {
        success: true,
        message: `Refreshed Unified Realms HQ: ${result.memberCount} members (Total: ${result.totalMembers})`,
      }
    } else {
      return {
        success: false,
        error: result.error || "Failed to refresh main server data",
      }
    }
  } catch (error) {
    console.error("Error refreshing main server:", error)
    return {
      success: false,
      error: "Failed to refresh main server data",
    }
  }
}
