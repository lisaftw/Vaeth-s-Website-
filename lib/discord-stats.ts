"use server"

import { supabase } from "./supabase"

interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  approximate_member_count?: number
  approximate_presence_count?: number
  features: string[]
}

interface DiscordInvite {
  code: string
  guild: DiscordGuild
  approximate_member_count?: number
  approximate_presence_count?: number
}

// Fetch Discord server stats from invite link
export async function fetchDiscordStats(inviteCode: string): Promise<{
  members?: number
  onlineMembers?: number
  icon?: string
  features?: string[]
} | null> {
  try {
    console.log(`[v0] Fetching Discord stats for invite: ${inviteCode}`)

    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.error(`[v0] Discord API error: ${response.status} ${response.statusText}`)
      return null
    }

    const data: DiscordInvite = await response.json()

    console.log(`[v0] Discord stats fetched:`, {
      name: data.guild.name,
      members: data.approximate_member_count,
      online: data.approximate_presence_count,
    })

    return {
      members: data.approximate_member_count,
      onlineMembers: data.approximate_presence_count,
      icon: data.guild.icon ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png` : undefined,
      features: data.guild.features,
    }
  } catch (error) {
    console.error(`[v0] Error fetching Discord stats:`, error)
    return null
  }
}

// Update a single server's stats
export async function updateServerStats(serverId: string): Promise<boolean> {
  try {
    console.log(`[v0] Updating stats for server: ${serverId}`)

    // Get server info
    const { data: server, error: fetchError } = await supabase.from("servers").select("*").eq("id", serverId).single()

    if (fetchError || !server) {
      console.error(`[v0] Server not found: ${serverId}`)
      return false
    }

    // Check if auto-update is enabled
    if (!server.auto_update_enabled) {
      console.log(`[v0] Auto-update disabled for server: ${server.name}`)
      return false
    }

    // Fetch Discord stats
    const stats = await fetchDiscordStats(server.invite)

    if (!stats) {
      console.error(`[v0] Failed to fetch stats for server: ${server.name}`)
      return false
    }

    // Update server in database
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (stats.members !== undefined) {
      updates.members = stats.members
    }

    if (stats.onlineMembers !== undefined) {
      updates.online_members = stats.onlineMembers
    }

    if (stats.icon) {
      updates.discord_icon = stats.icon
    }

    if (stats.features) {
      updates.discord_features = stats.features
    }

    const { error: updateError } = await supabase.from("servers").update(updates).eq("id", serverId)

    if (updateError) {
      console.error(`[v0] Error updating server stats:`, updateError)
      return false
    }

    console.log(`[v0] Successfully updated stats for: ${server.name}`)
    return true
  } catch (error) {
    console.error(`[v0] Error in updateServerStats:`, error)
    return false
  }
}

// Update all servers with auto-update enabled
export async function updateAllServerStats(): Promise<{ updated: number; failed: number }> {
  try {
    console.log(`[v0] Starting batch stats update...`)

    // Get all servers with auto-update enabled
    const { data: servers, error } = await supabase
      .from("servers")
      .select("id, name, invite, auto_update_enabled")
      .eq("auto_update_enabled", true)

    if (error) {
      console.error(`[v0] Error fetching servers:`, error)
      return { updated: 0, failed: 0 }
    }

    if (!servers || servers.length === 0) {
      console.log(`[v0] No servers with auto-update enabled`)
      return { updated: 0, failed: 0 }
    }

    console.log(`[v0] Found ${servers.length} servers to update`)

    let updated = 0
    let failed = 0

    // Update each server with a delay to avoid rate limiting
    for (const server of servers) {
      const success = await updateServerStats(server.id)
      if (success) {
        updated++
      } else {
        failed++
      }

      // Wait 1 second between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log(`[v0] Batch update complete: ${updated} updated, ${failed} failed`)

    return { updated, failed }
  } catch (error) {
    console.error(`[v0] Error in updateAllServerStats:`, error)
    return { updated: 0, failed: 0 }
  }
}

// Log stats update
export async function logStatsUpdate(serverId: string, success: boolean, error?: string) {
  try {
    await supabase.from("server_update_logs").insert({
      server_id: serverId,
      success,
      error_message: error,
      updated_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`[v0] Error logging stats update:`, error)
  }
}
