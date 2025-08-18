"use server"

import { addServer as addServerToStore } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

export async function addServer(formData: FormData) {
  try {
    console.log("Add server action called")

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string)
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string

    if (!name || !description || !members || !invite) {
      return {
        success: false,
        error: "All fields except logo are required",
      }
    }

    const server = {
      name,
      description,
      members,
      invite,
      logo: logo || undefined,
      verified: false,
      tags: ["Partner"],
    }

    console.log("Adding server:", server)

    await addServerToStore(server)

    // Invalidate cache for homepage and admin pages
    revalidatePath("/")
    revalidatePath("/admin")

    console.log("Server added and cache invalidated")

    return {
      success: true,
      message: "Server has been added successfully to the alliance.",
    }
  } catch (error) {
    console.error("Error in addServer action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error adding server",
    }
  }
}
