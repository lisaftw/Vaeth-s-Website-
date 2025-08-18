"use server"

import { updateManualStats } from "@/lib/manual-stats"
import { revalidatePath } from "next/cache"

export async function updateManualStatsAction(formData: FormData) {
  try {
    console.log("Update manual stats action called")

    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 1
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 250
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 100

    console.log("Updating stats:", { totalServers, totalMembers, securityScore })

    await updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    // Revalidate paths to clear cache
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/api/stats")

    console.log("Stats updated successfully")

    return {
      success: true,
      message: "Statistics updated successfully!",
    }
  } catch (error) {
    console.error("Error in updateManualStatsAction:", error)
    return {
      success: false,
      message: "Error updating statistics: " + String(error),
    }
  }
}
