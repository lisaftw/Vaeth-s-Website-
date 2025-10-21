"use server"

import { supabase } from "./supabase"

export interface BumpResult {
  success: boolean
  message: string
  nextBumpTime?: string
  bumpCount?: number
  error?: string
}

export interface CanBumpResult {
  canBump: boolean
  nextBumpTime?: string
  timeRemaining?: string
  lastBumpBy?: string
}

const BUMP_COOLDOWN_HOURS = 2

/**
 * Checks if a server can be bumped (cooldown check)
 */
export async function canBumpServer(serverId: string): Promise<CanBumpResult> {
  try {
    // Get the server's last bump time
    const { data: server, error } = await supabase
      .from("servers")
      .select("last_bump, bump_count")
      .eq("id", serverId)
      .single()

    if (error) {
      console.error("Error checking bump status:", error)
      return { canBump: false }
    }

    if (!server.last_bump) {
      // Never been bumped, can bump
      return { canBump: true }
    }

    const lastBumpTime = new Date(server.last_bump)
    const now = new Date()
    const timeSinceLastBump = now.getTime() - lastBumpTime.getTime()
    const cooldownMs = BUMP_COOLDOWN_HOURS * 60 * 60 * 1000

    if (timeSinceLastBump < cooldownMs) {
      // Still in cooldown
      const nextBumpTime = new Date(lastBumpTime.getTime() + cooldownMs)
      const timeRemainingMs = nextBumpTime.getTime() - now.getTime()
      const hoursRemaining = Math.floor(timeRemainingMs / (60 * 60 * 1000))
      const minutesRemaining = Math.floor((timeRemainingMs % (60 * 60 * 1000)) / (60 * 1000))

      return {
        canBump: false,
        nextBumpTime: nextBumpTime.toISOString(),
        timeRemaining: `${hoursRemaining}h ${minutesRemaining}m`,
      }
    }

    // Cooldown passed, can bump
    return { canBump: true }
  } catch (error) {
    console.error("Error in canBumpServer:", error)
    return { canBump: false }
  }
}

/**
 * Bumps a server (updates position and logs the bump)
 */
export async function bumpServer(
  serverId: string,
  bumpedBy: string,
  bumpType: "manual" | "bot" | "auto" = "manual",
): Promise<BumpResult> {
  try {
    console.log(`Attempting to bump server ${serverId} by ${bumpedBy}`)

    // Check if server can be bumped
    const canBump = await canBumpServer(serverId)
    if (!canBump.canBump) {
      return {
        success: false,
        message: `Server is on cooldown. Next bump available in ${canBump.timeRemaining}`,
        nextBumpTime: canBump.nextBumpTime,
      }
    }

    const now = new Date().toISOString()

    // Update server with new bump time and increment count
    const { data: updatedServer, error: updateError } = await supabase
      .from("servers")
      .update({
        last_bump: now,
        bump_count: supabase.raw("bump_count + 1"),
        updated_at: now,
      })
      .eq("id", serverId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating server bump:", updateError)
      return {
        success: false,
        message: "Failed to bump server",
        error: updateError.message,
      }
    }

    // Log the bump in server_bumps table
    const { error: logError } = await supabase.from("server_bumps").insert({
      server_id: serverId,
      bumped_by: bumpedBy,
      bumped_at: now,
      bump_type: bumpType,
    })

    if (logError) {
      console.error("Error logging bump:", logError)
      // Don't fail the bump if logging fails
    }

    // Calculate next bump time
    const nextBumpTime = new Date(new Date(now).getTime() + BUMP_COOLDOWN_HOURS * 60 * 60 * 1000)

    console.log(`Server bumped successfully. New bump count: ${updatedServer.bump_count}`)

    return {
      success: true,
      message: "Server bumped successfully!",
      nextBumpTime: nextBumpTime.toISOString(),
      bumpCount: updatedServer.bump_count,
    }
  } catch (error) {
    console.error("Error in bumpServer:", error)
    return {
      success: false,
      message: "Failed to bump server",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets bump history for a server
 */
export async function getBumpHistory(
  serverId: string,
  limit = 10,
): Promise<{ success: boolean; bumps?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("server_bumps")
      .select("*")
      .eq("server_id", serverId)
      .order("bumped_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching bump history:", error)
      return { success: false, error: error.message }
    }

    return { success: true, bumps: data || [] }
  } catch (error) {
    console.error("Error in getBumpHistory:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets bump statistics for a server
 */
export async function getBumpStats(serverId: string): Promise<{
  success: boolean
  stats?: {
    totalBumps: number
    lastBump?: string
    lastBumpBy?: string
    averageBumpsPerDay: number
  }
  error?: string
}> {
  try {
    const { data: bumps, error } = await supabase
      .from("server_bumps")
      .select("*")
      .eq("server_id", serverId)
      .order("bumped_at", { ascending: false })

    if (error) {
      console.error("Error fetching bump stats:", error)
      return { success: false, error: error.message }
    }

    if (!bumps || bumps.length === 0) {
      return {
        success: true,
        stats: {
          totalBumps: 0,
          averageBumpsPerDay: 0,
        },
      }
    }

    // Calculate average bumps per day
    const firstBump = new Date(bumps[bumps.length - 1].bumped_at)
    const now = new Date()
    const daysSinceFirstBump = Math.max((now.getTime() - firstBump.getTime()) / (24 * 60 * 60 * 1000), 1)
    const averageBumpsPerDay = bumps.length / daysSinceFirstBump

    return {
      success: true,
      stats: {
        totalBumps: bumps.length,
        lastBump: bumps[0].bumped_at,
        lastBumpBy: bumps[0].bumped_by,
        averageBumpsPerDay: Number.parseFloat(averageBumpsPerDay.toFixed(2)),
      },
    }
  } catch (error) {
    console.error("Error in getBumpStats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets all servers sorted by last bump (most recent first)
 */
export async function getServersByBumpOrder(): Promise<{ success: boolean; servers?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("servers")
      .select("*")
      .order("last_bump", { ascending: false, nullsFirst: false })

    if (error) {
      console.error("Error fetching servers by bump order:", error)
      return { success: false, error: error.message }
    }

    return { success: true, servers: data || [] }
  } catch (error) {
    console.error("Error in getServersByBumpOrder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
