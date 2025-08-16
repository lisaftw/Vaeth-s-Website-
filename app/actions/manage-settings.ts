"use server"

import { redirect } from "next/navigation"

interface Settings {
  siteName: string
  siteDescription: string
  discordInvite: string
  maintenanceMode: boolean
  registrationOpen: boolean
  maxServersPerUser: number
  autoApproval: boolean
  webhookUrl: string
  theme: "dark" | "light"
  featuredServersLimit: number
}

// Mock settings store - in a real app, this would be a database
let settings: Settings = {
  siteName: "Unified Realms Alliance",
  siteDescription: "A growing alliance of Discord servers united in purpose",
  discordInvite: "https://discord.gg/unifiedrealms",
  maintenanceMode: false,
  registrationOpen: true,
  maxServersPerUser: 3,
  autoApproval: false,
  webhookUrl: "",
  theme: "dark",
  featuredServersLimit: 6,
}

export async function manageSettings(formData: FormData) {
  const password = formData.get("password") as string
  const action = formData.get("action") as string

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    switch (action) {
      case "update":
        settings = {
          siteName: (formData.get("siteName") as string) || settings.siteName,
          siteDescription: (formData.get("siteDescription") as string) || settings.siteDescription,
          discordInvite: (formData.get("discordInvite") as string) || settings.discordInvite,
          maintenanceMode: formData.get("maintenanceMode") === "true",
          registrationOpen: formData.get("registrationOpen") === "true",
          maxServersPerUser: Number.parseInt(formData.get("maxServersPerUser") as string) || settings.maxServersPerUser,
          autoApproval: formData.get("autoApproval") === "true",
          webhookUrl: (formData.get("webhookUrl") as string) || settings.webhookUrl,
          theme: (formData.get("theme") as "dark" | "light") || settings.theme,
          featuredServersLimit:
            Number.parseInt(formData.get("featuredServersLimit") as string) || settings.featuredServersLimit,
        }
        break

      case "reset":
        settings = {
          siteName: "Unified Realms Alliance",
          siteDescription: "A growing alliance of Discord servers united in purpose",
          discordInvite: "https://discord.gg/unifiedrealms",
          maintenanceMode: false,
          registrationOpen: true,
          maxServersPerUser: 3,
          autoApproval: false,
          webhookUrl: "",
          theme: "dark",
          featuredServersLimit: 6,
        }
        break
    }

    // In a real app, this would save to a database
    console.log("Managing settings:", settings)

    redirect(`/admin?password=${password}&tab=settings&success=${action}`)
  } catch (error) {
    console.error("Error managing settings:", error)
    redirect(`/admin?password=${password}&tab=settings&error=${action}_failed`)
  }
}

export async function getSettings() {
  return settings
}
