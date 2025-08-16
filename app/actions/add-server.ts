"use server"

import { redirect } from "next/navigation"
import { addServer as addServerToStore, type Server } from "@/lib/data-store"

export async function addServer(formData: FormData) {
  const password = formData.get("password") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string)
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string
    const tags = formData.get("tags") as string
    const verified = formData.get("verified") === "on"
    const representativeDiscordId = formData.get("representativeDiscordId") as string

    const newServer: Server = {
      name,
      description,
      members,
      invite,
      logo: logo || undefined,
      representativeDiscordId: representativeDiscordId || undefined,
      verified,
      dateAdded: new Date().toISOString(),
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
    }

    addServerToStore(newServer)

    redirect(`/admin?password=${password}&tab=servers&added=true`)
  } catch (error) {
    console.error("Error adding server:", error)
    redirect(`/admin?password=${password}&tab=add-server&error=add_failed`)
  }
}
