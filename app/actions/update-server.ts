"use server"

import { redirect } from "next/navigation"
import { getServers } from "./get-servers"

export async function updateServer(formData: FormData) {
  const password = formData.get("password") as string
  const index = Number.parseInt(formData.get("index") as string)

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const servers = await getServers()

    if (servers[index]) {
      const name = formData.get("name") as string
      const description = formData.get("description") as string
      const members = Number.parseInt(formData.get("members") as string)
      const invite = formData.get("invite") as string
      const logo = formData.get("logo") as string
      const tags = formData.get("tags") as string
      const verified = formData.get("verified") === "on"

      servers[index] = {
        ...servers[index],
        name,
        description,
        members,
        invite,
        logo: logo || undefined,
        verified,
        tags: tags
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : [],
      }

      // In a real app, you'd save to database here
      redirect(`/admin?password=${password}&tab=servers&updated=true`)
    }
  } catch (error) {
    console.error("Error updating server:", error)
    redirect(`/admin?password=${password}&tab=servers&error=update_failed`)
  }
}
