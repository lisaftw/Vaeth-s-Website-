"use server"

import { supabase } from "./supabase"
import crypto from "crypto"

export interface AuthToken {
  id: string
  server_id: string
  token: string
  representative_discord_id: string
  created_at: string
  expires_at: string
  last_used_at?: string
}

// Generate a secure random token
export async function generateToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex")
}

// Create an auth token for a server representative
export async function createAuthToken(serverId: string, representativeDiscordId: string): Promise<string> {
  try {
    const token = await generateToken()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 90) // Token valid for 90 days

    const { data, error } = await supabase
      .from("auth_tokens")
      .insert({
        server_id: serverId,
        token,
        representative_discord_id: representativeDiscordId,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating auth token:", error)
      throw new Error("Failed to create authentication token")
    }

    return token
  } catch (error) {
    console.error("Error in createAuthToken:", error)
    throw error
  }
}

// Verify a token and return the associated server
export async function verifyAuthToken(
  token: string,
): Promise<{ serverId: string; representativeDiscordId: string } | null> {
  try {
    const { data, error } = await supabase
      .from("auth_tokens")
      .select("server_id, representative_discord_id, expires_at")
      .eq("token", token)
      .single()

    if (error || !data) {
      return null
    }

    // Check if token is expired
    if (new Date(data.expires_at) < new Date()) {
      return null
    }

    // Update last used timestamp
    await supabase.from("auth_tokens").update({ last_used_at: new Date().toISOString() }).eq("token", token)

    return {
      serverId: data.server_id,
      representativeDiscordId: data.representative_discord_id,
    }
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Get server by ID
export async function getServerById(serverId: string) {
  try {
    const { data, error } = await supabase.from("servers").select("*").eq("id", serverId).single()

    if (error) {
      console.error("Error fetching server:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getServerById:", error)
    return null
  }
}

// Update server information
export async function updateServerById(serverId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from("servers")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverId)
      .select()
      .single()

    if (error) {
      console.error("Error updating server:", error)
      throw new Error("Failed to update server")
    }

    return data
  } catch (error) {
    console.error("Error in updateServerById:", error)
    throw error
  }
}

// Request a new token via Discord ID verification
export async function requestAuthToken(serverName: string, representativeDiscordId: string): Promise<string | null> {
  try {
    // Find server by name and representative Discord ID
    const { data: server, error } = await supabase
      .from("servers")
      .select("id, representative_discord_id")
      .eq("name", serverName)
      .eq("representative_discord_id", representativeDiscordId)
      .single()

    if (error || !server) {
      console.error("Server not found or Discord ID mismatch")
      return null
    }

    // Create and return new token
    const token = await createAuthToken(server.id, representativeDiscordId)
    return token
  } catch (error) {
    console.error("Error in requestAuthToken:", error)
    return null
  }
}
