"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function updateServer(formData: FormData) {
  try {
    console.log("[v0] ===== UPDATE SERVER ACTION STARTED =====")
    console.log("[v0] FormData entries:")
    for (const [key, value] of formData.entries()) {
      console.log(`[v0]   ${key}:`, value)
    }

    const serverId = formData.get("serverId") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string) || 0
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string
    const leadDelegateId = formData.get("leadDelegateId") as string

    console.log("[v0] Parsed values:", {
      serverId,
      name,
      description: description?.substring(0, 50) + "...",
      members,
      invite,
      logo,
      leadDelegateId,
    })

    if (!serverId) {
      console.error("[v0] ERROR: Server ID is missing!")
      return {
        success: false,
        error: "Server ID is required",
      }
    }

    // Validate required fields
    if (!name || !description || !members || !invite) {
      console.error("[v0] ERROR: Missing required fields")
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    console.log("[v0] Creating admin Supabase client...")
    const supabase = createAdminClient()

    const updateData = {
      name,
      description,
      members,
      invite,
      logo: logo || null,
      representative_discord_id: leadDelegateId || null,
      updated_at: new Date().toISOString(),
    }

    console.log("[v0] Updating server in database with data:", updateData)

    // Update the server in Supabase
    const { data, error } = await supabase.from("servers").update(updateData).eq("id", serverId).select()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return {
        success: false,
        error: `Failed to update server: ${error.message}`,
      }
    }

    console.log("[v0] Supabase update successful, returned data:", data)

    if (!data || data.length === 0) {
      console.error("[v0] WARNING: No rows were updated. Server ID might not exist:", serverId)
      return {
        success: false,
        error: "Server not found or no changes were made",
      }
    }

    console.log("[v0] Revalidating paths...")
    // Invalidate cache
    revalidatePath("/")
    revalidatePath("/admin")
    revalidatePath("/leaderboard")

    console.log("[v0] ===== UPDATE SERVER ACTION COMPLETED SUCCESSFULLY =====")
    return {
      success: true,
      message: `Server "${name}" has been updated successfully.`,
    }
  } catch (error) {
    console.error("[v0] EXCEPTION in updateServer:", error)
    return {
      success: false,
      error: "Error updating server: " + String(error),
    }
  }
}
