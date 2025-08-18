"use server"

import { supabase } from "@/lib/supabase"

export async function updateServer(formData: FormData) {
  try {
    console.log("Update server action called")

    const index = Number.parseInt(formData.get("index") as string)
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string) || 0
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string

    console.log("Updating server at index:", index, { name, description, members, invite, logo })

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        message: "Invalid server index",
      }
    }

    // Validate required fields
    if (!name || !description || !members || !invite) {
      return {
        success: false,
        message: "Please fill in all required fields",
      }
    }

    // Get all servers to find the one at the index
    const { data: dbServers, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError || !dbServers || index >= dbServers.length) {
      console.error("Error fetching server for update:", fetchError)
      return {
        success: false,
        message: "Server not found",
      }
    }

    const serverToUpdate = dbServers[index]

    // Update the server in Supabase
    const { error } = await supabase
      .from("servers")
      .update({
        name,
        description,
        members,
        invite,
        logo: logo || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverToUpdate.id)

    if (error) {
      console.error("Error updating server:", error)
      return {
        success: false,
        message: "Failed to update server",
      }
    }

    console.log("Server updated successfully")

    return {
      success: true,
      message: `Server "${name}" has been updated successfully.`,
    }
  } catch (error) {
    console.error("Error in updateServer:", error)
    return {
      success: false,
      message: "Error updating server: " + String(error),
    }
  }
}
