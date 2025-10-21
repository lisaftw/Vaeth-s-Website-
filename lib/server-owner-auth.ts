"use server"

import { supabase } from "./supabase"
import { cookies } from "next/headers"

export interface ServerOwner {
  id: string
  discord_id: string
  username: string
  email?: string
  created_at: string
  updated_at: string
}

export interface OwnerSession {
  ownerId: string
  discordId: string
  username: string
  expiresAt: string
}

/**
 * Creates or updates a server owner in the database
 */
export async function createOrUpdateServerOwner(
  discordId: string,
  username: string,
  email?: string,
): Promise<{ success: boolean; owner?: ServerOwner; error?: string }> {
  try {
    console.log("Creating/updating server owner:", { discordId, username })

    // Check if owner already exists
    const { data: existingOwner, error: checkError } = await supabase
      .from("server_owners")
      .select("*")
      .eq("discord_id", discordId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = not found, which is ok
      console.error("Error checking for existing owner:", checkError)
      return { success: false, error: checkError.message }
    }

    if (existingOwner) {
      // Update existing owner
      const { data: updatedOwner, error: updateError } = await supabase
        .from("server_owners")
        .update({
          username,
          email,
          updated_at: new Date().toISOString(),
        })
        .eq("discord_id", discordId)
        .select()
        .single()

      if (updateError) {
        console.error("Error updating owner:", updateError)
        return { success: false, error: updateError.message }
      }

      console.log("Owner updated successfully:", updatedOwner)
      return { success: true, owner: updatedOwner }
    } else {
      // Create new owner
      const { data: newOwner, error: insertError } = await supabase
        .from("server_owners")
        .insert({
          discord_id: discordId,
          username,
          email,
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating owner:", insertError)
        return { success: false, error: insertError.message }
      }

      console.log("Owner created successfully:", newOwner)
      return { success: true, owner: newOwner }
    }
  } catch (error) {
    console.error("Error in createOrUpdateServerOwner:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets a server owner by their Discord ID
 */
export async function getServerOwnerByDiscordId(
  discordId: string,
): Promise<{ success: boolean; owner?: ServerOwner; error?: string }> {
  try {
    const { data, error } = await supabase.from("server_owners").select("*").eq("discord_id", discordId).single()

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Owner not found" }
      }
      console.error("Error fetching owner:", error)
      return { success: false, error: error.message }
    }

    return { success: true, owner: data }
  } catch (error) {
    console.error("Error in getServerOwnerByDiscordId:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets all servers belonging to an owner
 */
export async function getServersByOwner(
  ownerId: string,
): Promise<{ success: boolean; servers?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase.from("servers").select("*").eq("owner_id", ownerId)

    if (error) {
      console.error("Error fetching servers:", error)
      return { success: false, error: error.message }
    }

    return { success: true, servers: data || [] }
  } catch (error) {
    console.error("Error in getServersByOwner:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Creates a session for a server owner (stores in cookie)
 */
export async function setOwnerSession(owner: ServerOwner): Promise<{ success: boolean; error?: string }> {
  try {
    const session: OwnerSession = {
      ownerId: owner.id,
      discordId: owner.discord_id,
      username: owner.username,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }

    const cookieStore = await cookies()
    cookieStore.set("owner_session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("Session created for owner:", owner.username)
    return { success: true }
  } catch (error) {
    console.error("Error setting owner session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Gets the current owner session from cookie
 */
export async function getOwnerSession(): Promise<{ success: boolean; session?: OwnerSession; error?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("owner_session")

    if (!sessionCookie) {
      return { success: false, error: "No session found" }
    }

    const session: OwnerSession = JSON.parse(sessionCookie.value)

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await clearOwnerSession()
      return { success: false, error: "Session expired" }
    }

    return { success: true, session }
  } catch (error) {
    console.error("Error getting owner session:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid session",
    }
  }
}

/**
 * Clears the owner session (logout)
 */
export async function clearOwnerSession(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("owner_session")
    return { success: true }
  } catch (error) {
    console.error("Error clearing session:", error)
    return { success: false }
  }
}

/**
 * Verifies that the current session owner has access to a specific server
 */
export async function verifyServerAccess(serverId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const sessionResult = await getOwnerSession()
    if (!sessionResult.success || !sessionResult.session) {
      return { success: false, error: "Not authenticated" }
    }

    // Get the server and check if it belongs to this owner
    const { data: server, error } = await supabase.from("servers").select("owner_id").eq("id", serverId).single()

    if (error) {
      console.error("Error checking server access:", error)
      return { success: false, error: "Server not found" }
    }

    if (server.owner_id !== sessionResult.session.ownerId) {
      return { success: false, error: "Access denied" }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in verifyServerAccess:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
