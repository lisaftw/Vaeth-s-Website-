"use server"

import { updateManualStats } from "@/lib/manual-stats"
import { revalidatePath } from "next/cache"

export async function updateManualStatsAction(formData: FormData) {
  try {
    console.log("=== UPDATE MANUAL STATS ACTION ===")

    const totalServers = Number.parseInt(formData.get("totalServers") as string, 10)
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string, 10)
    const securityScore = Number.parseInt(formData.get("securityScore") as string, 10)

    console.log("Stats to update:", { totalServers, totalMembers, securityScore })

    if (isNaN(totalServers) || isNaN(totalMembers) || isNaN(securityScore)) {
      throw new Error("Invalid input values")
    }

    if (totalServers < 1 || totalMembers < 1 || securityScore < 0 || securityScore > 100) {
      throw new Error("Values out of valid range")
    }

    await updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    // Clear cache to ensure fresh data
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/api/stats")

    console.log("Stats updated successfully")

    return {
      success: true,
      message: "Statistics updated successfully",
    }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update statistics",
    }
  }
}
