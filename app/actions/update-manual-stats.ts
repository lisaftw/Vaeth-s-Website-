"use server"

import { updateManualStats } from "@/lib/manual-stats"

export async function updateManualStatsAction(formData: FormData) {
  try {
    const totalServers = Number.parseInt(formData.get("totalServers") as string)
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string)
    const securityScore = Number.parseInt(formData.get("securityScore") as string)

    if (isNaN(totalServers) || isNaN(totalMembers) || isNaN(securityScore)) {
      return { success: false, error: "Invalid input values" }
    }

    updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    return { success: true, message: "Stats updated successfully" }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return { success: false, error: "Failed to update stats" }
  }
}
