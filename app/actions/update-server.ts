"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function updateServer(formData: FormData) {
  try {
    console.log("[v0] Update server action called")

    const serverId = formData.get("serverId") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string) || 0
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string
    const leadDelegateName = formData.get("leadDelegateName") as string
    const leadDelegateId = formData.get("leadDelegateId") as string

    console.log("[v0] Updating server:", serverId, {
      name,
      description,
      members,
      invite,
      logo,
      leadDelegateName,
      leadDelegateId,
    })

    if (!serverId) {
      return {
        success: false,
        error: "Server ID is required",
      }
    }

    // Validate required fields
    if (!name || !description || !members || !invite) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    const supabase = createAdminClient()

    // Update the server in Supabase
    const { data, error } = await supabase
      .from("servers")
      .update({
        name,
        description,
        members,
        invite,
        logo: logo || null,
        lead_delegate_name: leadDelegateName || null,
        lead_delegate_discord_id: leadDelegateId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverId)
      .select()

    if (error) {
      console.error("[v0] Error updating server:", error)
      return {
        success: false,
        error: `Failed to update server: ${error.message}`,
      }
    }

    console.log("[v0] Server updated successfully:", data)

    // Invalidate cache
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/leaderboard")

    return {
      success: true,
      message: `Server "${name}" has been updated successfully.`,
    }
  } catch (error) {
    console.error("[v0] Error in updateServer:", error)
    return {
      success: false,
      error: "Error updating server: " + String(error),
    }
  }
}
