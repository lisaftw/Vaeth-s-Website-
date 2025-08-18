import { supabase } from "./supabase"

export interface ManualStats {
  totalServers: number
  totalMembers: number
  securityScore: number
  lastUpdated: string
}

export interface ServerMemberCount {
  serverName: string
  memberCount: number
  lastUpdated: string
}

export async function getManualStats(): Promise<ManualStats> {
  try {
    const { data, error } = await supabase
      .from("manual_stats")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching manual stats:", error)
      return {
        totalServers: 1,
        totalMembers: 250,
        securityScore: 100,
        lastUpdated: new Date().toISOString(),
      }
    }

    return {
      totalServers: data.total_servers,
      totalMembers: data.total_members,
      securityScore: data.security_score,
      lastUpdated: data.updated_at,
    }
  } catch (error) {
    console.error("Error in getManualStats:", error)
    return {
      totalServers: 1,
      totalMembers: 250,
      securityScore: 100,
      lastUpdated: new Date().toISOString(),
    }
  }
}

export async function updateManualStats(stats: Omit<ManualStats, "lastUpdated">): Promise<void> {
  try {
    const { error } = await supabase.from("manual_stats").upsert({
      total_servers: stats.totalServers,
      total_members: stats.totalMembers,
      security_score: stats.securityScore,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error updating manual stats:", error)
      throw new Error(`Failed to update stats: ${error.message}`)
    }

    console.log("Manual stats updated successfully")
  } catch (error) {
    console.error("Error in updateManualStats:", error)
    throw error
  }
}

export async function getServerMemberCounts(): Promise<ServerMemberCount[]> {
  try {
    const { data, error } = await supabase
      .from("server_member_counts")
      .select("*")
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching server member counts:", error)
      return []
    }

    return (
      data?.map((row) => ({
        serverName: row.server_name,
        memberCount: row.member_count,
        lastUpdated: row.updated_at,
      })) || []
    )
  } catch (error) {
    console.error("Error in getServerMemberCounts:", error)
    return []
  }
}

export async function addServerToMemberCounts(serverName: string, memberCount: number): Promise<void> {
  try {
    const { error } = await supabase.from("server_member_counts").upsert({
      server_name: serverName,
      member_count: memberCount,
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error adding server to member counts:", error)
      throw new Error(`Failed to add server member count: ${error.message}`)
    }

    console.log("Server member count added successfully")
  } catch (error) {
    console.error("Error in addServerToMemberCounts:", error)
    throw error
  }
}

export async function updateServerMemberCount(serverName: string, memberCount: number): Promise<void> {
  try {
    const { error } = await supabase
      .from("server_member_counts")
      .update({
        member_count: memberCount,
        updated_at: new Date().toISOString(),
      })
      .eq("server_name", serverName)

    if (error) {
      console.error("Error updating server member count:", error)
      throw new Error(`Failed to update server member count: ${error.message}`)
    }

    console.log("Server member count updated successfully")
  } catch (error) {
    console.error("Error in updateServerMemberCount:", error)
    throw error
  }
}
