"use server"

import { updateManualStats } from "@/lib/manual-stats"

export async function updateManualStatsAction(formData: FormData) {
  try {
    console.log("Update manual stats action called")

    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 1
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 250
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 100

    console.log("Updating stats:", { totalServers, totalMembers, securityScore })

    const success = await updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
      lastUpdated: new Date().toISOString(),
    })

    if (success) {
      return {
        success: true,
        message: "Statistics updated successfully!",
      }
    } else {
      return {
        success: false,
        message: "Failed to update statistics",
      }
    }
  } catch (error) {
    console.error("Error in updateManualStatsAction:", error)
    return {
      success: false,
      message: "Error updating statistics: " + String(error),
    }
  }
}
