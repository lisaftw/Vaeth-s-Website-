"use server"

import { redirect } from "next/navigation"
import { addApplication, type Application } from "@/lib/data-store"
import { sendDiscordNotification } from "@/lib/discord-webhook"

export async function submitApplication(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const members = Number.parseInt(formData.get("members") as string)
  const invite = formData.get("invite") as string
  const logo = formData.get("logo") as string
  const representativeDiscordId = formData.get("representativeDiscordId") as string

  const newApplication: Application = {
    name,
    description,
    members,
    invite,
    logo: logo || undefined,
    representativeDiscordId,
  }

  // Add to applications store
  addApplication(newApplication)

  // Send Discord notification
  try {
    await sendDiscordNotification(newApplication)
    console.log("Discord notification sent successfully for:", name)
  } catch (error) {
    console.error("Failed to send Discord notification:", error)
    // Continue with the application process even if webhook fails
  }

  // Redirect to confirmation page with server name
  redirect(`/confirmation?server=${encodeURIComponent(name)}`)
}
