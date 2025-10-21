"use server"

import { supabase } from "./supabase"

// Get servers sorted by bump time (most recent first)
export async function getServersByBumpOrder() {
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .order("last_bump", { ascending: false, nullsFirst: false })

    if (error) {
      console.error("Error fetching servers by bump order:", error)
      return []
    }

    console.log("[v0] Fetched servers by bump order:", data?.length || 0)
    return data || []
  } catch (error) {
    console.error("Error in getServersByBumpOrder:", error)
    return []
  }
}

// Get bump leaderboard
export async function getBumpLeaderboard(limit = 10) {
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("name, bump_count, members, last_bump, logo")
      .order("bump_count", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching bump leaderboard:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getBumpLeaderboard:", error)
    return []
  }
}
