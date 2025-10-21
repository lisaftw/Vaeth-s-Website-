"use server"

import { requestAuthToken, verifyAuthToken, getServerById, updateServerById } from "@/lib/auth-tokens"
import { revalidatePath } from "next/cache"

export async function requestToken(serverName: string, representativeDiscordId: string) {
  try {
    const token = await requestAuthToken(serverName, representativeDiscordId)

    if (!token) {
      return {
        success: false,
        error: "Server not found or Discord ID does not match. Please contact an administrator.",
      }
    }

    return {
      success: true,
      token,
    }
  } catch (error) {
    console.error("Error requesting token:", error)
    return {
      success: false,
      error: "An error occurred while generating your access token.",
    }
  }
}

export async function verifyToken(token: string) {
  try {
    const result = await verifyAuthToken(token)

    if (!result) {
      return {
        success: false,
        error: "Invalid or expired token.",
      }
    }

    const server = await getServerById(result.serverId)

    if (!server) {
      return {
        success: false,
        error: "Server not found.",
      }
    }

    return {
      success: true,
      server,
      representativeDiscordId: result.representativeDiscordId,
    }
  } catch (error) {
    console.error("Error verifying token:", error)
    return {
      success: false,
      error: "An error occurred while verifying your token.",
    }
  }
}

export async function updateMyServer(token: string, updates: any) {
  try {
    const verification = await verifyAuthToken(token)

    if (!verification) {
      return {
        success: false,
        error: "Invalid or expired token.",
      }
    }

    // Validate updates - only allow certain fields to be updated
    const allowedFields = ["description", "invite", "logo", "lead_delegate_discord_id", "lead_delegate_name"]
    const sanitizedUpdates: any = {}

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        sanitizedUpdates[field] = updates[field]
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return {
        success: false,
        error: "No valid fields to update.",
      }
    }

    await updateServerById(verification.serverId, sanitizedUpdates)

    revalidatePath("/")
    revalidatePath("/manage")

    return {
      success: true,
      message: "Server updated successfully!",
    }
  } catch (error) {
    console.error("Error updating server:", error)
    return {
      success: false,
      error: "An error occurred while updating your server.",
    }
  }
}
