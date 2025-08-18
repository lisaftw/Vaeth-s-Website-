"use server"

import { supabase } from "./supabase"

export interface ManualStats {
  totalServers: number
  totalMembers: number
  securityScore: number
}

export async function updateManualStats(stats: ManualStats): Promise<void> {
  try {
    console.log("=== UPDATING MANUAL STATS ===")
    console.log("Stats to update:", stats)

    // First, try to get existing stats
    const { data: existingStats, error: fetchError } = await supabase
      .from("manual_stats")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    console.log("Existing stats:", existingStats)
    console.log("Fetch error:", fetchError)

    const updateData = {
      total_servers: stats.totalServers,
      total_members: stats.totalMembers,
      security_score: stats.securityScore,
      updated_at: new Date().toISOString(),
    }

    if (existingStats && !fetchError) {
      // Update existing record
      console.log("Updating existing stats record")
      const { error: updateError } = await supabase.from("manual_stats").update(updateData).eq("id", existingStats.id)

      if (updateError) {
        console.error("Error updating stats:", updateError)
        throw new Error(`Failed to update stats: ${updateError.message}`)
      }
    } else {
      // Insert new record
      console.log("Inserting new stats record")
      const insertData = {
        ...updateData,
        created_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase.from("manual_stats").insert(insertData)

      if (insertError) {
        console.error("Error inserting stats:", insertError)
        throw new Error(`Failed to insert stats: ${insertError.message}`)
      }
    }

    console.log("Manual stats updated successfully")
    console.log("=== END UPDATE MANUAL STATS ===")
  } catch (error) {
    console.error("Error in updateManualStats:", error)
    throw error
  }
}

export async function getManualStats(): Promise<ManualStats> {
  try {
    const { data, error } = await supabase
      .from("manual_stats")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.log("No manual stats found, returning defaults")
      return {
        totalServers: 1,
        totalMembers: 250,
        securityScore: 100,
      }
    }

    return {
      totalServers: data.total_servers,
      totalMembers: data.total_members,
      securityScore: data.security_score,
    }
  } catch (error) {
    console.error("Error getting manual stats:", error)
    return {
      totalServers: 1,
      totalMembers: 250,
      securityScore: 100,
    }
  }
}
