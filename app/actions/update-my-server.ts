"use server"

import { supabase } from "@/lib/supabase"
import { getOwnerSession } from "@/lib/server-owner-auth"
import { revalidatePath } from "next/cache"

export interface UpdateServerData {
  name?: string
  description?: string
  invite?: string
  logo?: string
  members?: number
  leadDelegateName?: string
  leadDelegateDiscordId?: string
  autoUpdateEnabled?: boolean
}

export async function updateMyServer(
  serverId: string,
  updates: UpdateServerData,
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log("Updating server:", serverId, updates)

    // Verify session
    const sessionResult = await getOwnerSession()
    if (!sessionResult.success || !sessionResult.session) {
      return {
        success: false,
        message: "Not authenticated",
        error: "Please log in to update your server",
      }
    }

    const session = sessionResult.session

    // Get the server and verify ownership
    const { data: server, error: fetchError } = await supabase.from("servers").select("*").eq("id", serverId).single()

    if (fetchError || !server) {
      console.error("Error fetching server:", fetchError)
      return {
        success: false,
        message: "Server not found",
        error: fetchError?.message,
      }
    }

    // Verify that this owner has access to this server
    if (server.owner_id !== session.ownerId) {
      return {
        success: false,
        message: "Access denied",
        error: "You don't have permission to update this server",
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.invite !== undefined) updateData.invite = updates.invite
    if (updates.logo !== undefined) updateData.logo = updates.logo
    if (updates.members !== undefined) updateData.members = updates.members
    if (updates.leadDelegateName !== undefined) updateData.lead_delegate_name = updates.leadDelegateName
    if (updates.leadDelegateDiscordId !== undefined) updateData.lead_delegate_discord_id = updates.leadDelegateDiscordId
    if (updates.autoUpdateEnabled !== undefined) updateData.auto_update_enabled = updates.autoUpdateEnabled

    // Update the server
    const { data: updatedServer, error: updateError } = await supabase
      .from("servers")
      .update(updateData)
      .eq("id", serverId)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating server:", updateError)
      return {
        success: false,
        message: "Failed to update server",
        error: updateError.message,
      }
    }

    // Log the updates
    for (const [field, newValue] of Object.entries(updateData)) {
      if (field === "updated_at") continue

      const oldValue = server[field as keyof typeof server]

      // Only log if value actually changed
      if (oldValue !== newValue) {
        await supabase.from("server_update_logs").insert({
          server_id: serverId,
          updated_by: session.discordId,
          field_updated: field,
          old_value: oldValue?.toString() || null,
          new_value: newValue?.toString() || null,
        })
      }
    }

    console.log("Server updated successfully:", updatedServer.name)

    // Revalidate cache
    revalidatePath("/")
    revalidatePath("/my-server")

    return {
      success: true,
      message: "Server updated successfully!",
    }
  } catch (error) {
    console.error("Error in updateMyServer:", error)
    return {
      success: false,
      message: "Failed to update server",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function getMyServers(): Promise<{ success: boolean; servers?: any[]; error?: string }> {
  try {
    const sessionResult = await getOwnerSession()
    if (!sessionResult.success || !sessionResult.session) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const session = sessionResult.session

    const { data: servers, error } = await supabase
      .from("servers")
      .select("*")
      .eq("owner_id", session.ownerId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching servers:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      servers: servers || [],
    }
  } catch (error) {
    console.error("Error in getMyServers:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
