import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

interface BumpResult {
  success: boolean
  message: string
  cooldownRemaining?: number
  bumpCount?: number
  nextBumpTime?: Date
}

export class BumpService {
  private static COOLDOWN_HOURS = Number.parseInt(process.env.BUMP_COOLDOWN_HOURS || "2")

  // Check if server is registered
  static async isServerRegistered(guildId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.from("servers").select("id").eq("discord_id", guildId).single()

      return !error && !!data
    } catch (error) {
      console.error("[BumpService] Error checking registration:", error)
      return false
    }
  }

  // Get server info
  static async getServerInfo(guildId: string) {
    try {
      const { data, error } = await supabase.from("servers").select("*").eq("discord_id", guildId).single()

      if (error) {
        console.error("[BumpService] Error fetching server:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("[BumpService] Error in getServerInfo:", error)
      return null
    }
  }

  // Check if server can bump
  static async canBump(guildId: string): Promise<{ canBump: boolean; cooldownRemaining?: number }> {
    try {
      const server = await this.getServerInfo(guildId)

      if (!server) {
        return { canBump: false }
      }

      if (!server.last_bump) {
        return { canBump: true }
      }

      const lastBumpTime = new Date(server.last_bump)
      const now = new Date()
      const hoursSinceLastBump = (now.getTime() - lastBumpTime.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastBump >= this.COOLDOWN_HOURS) {
        return { canBump: true }
      }

      const cooldownRemaining = Math.ceil(this.COOLDOWN_HOURS - hoursSinceLastBump)
      return { canBump: false, cooldownRemaining }
    } catch (error) {
      console.error("[BumpService] Error checking bump cooldown:", error)
      return { canBump: false }
    }
  }

  // Perform bump
  static async bump(guildId: string, userId: string): Promise<BumpResult> {
    try {
      // Check if server is registered
      const isRegistered = await this.isServerRegistered(guildId)
      if (!isRegistered) {
        return {
          success: false,
          message: "This server is not registered with the Unified Realms alliance. Use `/register` to join!",
        }
      }

      // Check cooldown
      const { canBump, cooldownRemaining } = await this.canBump(guildId)
      if (!canBump && cooldownRemaining) {
        const hours = Math.floor(cooldownRemaining)
        const minutes = Math.round((cooldownRemaining - hours) * 60)
        return {
          success: false,
          message: `Your server is on cooldown! You can bump again in ${hours}h ${minutes}m.`,
          cooldownRemaining,
        }
      }

      // Update server bump info
      const now = new Date()
      const { data, error } = await supabase
        .from("servers")
        .update({
          last_bump: now.toISOString(),
          bump_count: supabase.rpc("increment", { row_id: guildId }),
          updated_at: now.toISOString(),
        })
        .eq("discord_id", guildId)
        .select()
        .single()

      if (error) {
        console.error("[BumpService] Error updating bump:", error)
        return {
          success: false,
          message: "Failed to bump server. Please try again later.",
        }
      }

      // Log the bump
      await this.logBump(guildId, userId)

      const nextBumpTime = new Date(now.getTime() + this.COOLDOWN_HOURS * 60 * 60 * 1000)

      return {
        success: true,
        message: `Server bumped successfully! Your server has been moved to the top of the alliance listing.`,
        bumpCount: (data.bump_count || 0) + 1,
        nextBumpTime,
      }
    } catch (error) {
      console.error("[BumpService] Error in bump:", error)
      return {
        success: false,
        message: "An error occurred while bumping your server.",
      }
    }
  }

  // Log bump activity
  static async logBump(guildId: string, userId: string) {
    try {
      await supabase.from("server_bumps").insert({
        server_id: guildId,
        bumped_by: userId,
        bumped_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[BumpService] Error logging bump:", error)
    }
  }

  // Get bump stats
  static async getBumpStats(guildId: string) {
    try {
      const server = await this.getServerInfo(guildId)

      if (!server) {
        return null
      }

      // Get total bumps
      const { count: totalBumps } = await supabase
        .from("server_bumps")
        .select("*", { count: "exact", head: true })
        .eq("server_id", guildId)

      // Get ranking (based on bump count)
      const { data: allServers } = await supabase.from("servers").select("id, bump_count").order("bump_count", {
        ascending: false,
      })

      let ranking = 0
      if (allServers) {
        ranking = allServers.findIndex((s) => s.id === server.id) + 1
      }

      return {
        serverName: server.name,
        bumpCount: server.bump_count || 0,
        lastBump: server.last_bump,
        totalBumps: totalBumps || 0,
        ranking,
        members: server.members,
      }
    } catch (error) {
      console.error("[BumpService] Error getting bump stats:", error)
      return null
    }
  }

  // Get leaderboard
  static async getLeaderboard(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("servers")
        .select("name, bump_count, members, last_bump")
        .order("bump_count", { ascending: false })
        .limit(limit)

      if (error) {
        console.error("[BumpService] Error fetching leaderboard:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("[BumpService] Error in getLeaderboard:", error)
      return []
    }
  }
}
