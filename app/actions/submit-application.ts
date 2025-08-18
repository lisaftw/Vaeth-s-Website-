"use server"

import { addApplication } from "@/lib/data-store"
import { sendDiscordWebhook } from "@/lib/discord-webhook"
import { redirect } from "next/navigation"

export async function submitApplication(formData: FormData) {
  try {
    console.log("Submit application action called")

    // Extract form data
    const serverName = formData.get("serverName") as string
    const description = formData.get("description") as string
    const members = formData.get("members") as string
    const discordInvite = formData.get("discordInvite") as string
    const ownerName = formData.get("ownerName") as string
    const representativeId = formData.get("representativeId") as string

    console.log("Form data extracted:", {
      serverName,
      description,
      members,
      discordInvite,
      ownerName,
      representativeId,
    })

    // Validate required fields
    if (!serverName || !description || !members || !discordInvite || !ownerName) {
      console.error("Missing required fields")
      throw new Error("All required fields must be filled")
    }

    // Create application object
    const application = {
      name: serverName,
      description: description,
      members: Number.parseInt(members) || 0,
      invite: discordInvite,
      representativeDiscordId: representativeId || ownerName,
    }

    console.log("Application object created:", application)

    // Add to Supabase
    await addApplication(application)
    console.log("Application added to Supabase")

    // Send Discord webhook
    try {
      await sendDiscordWebhook({
        serverName,
        description,
        members: Number.parseInt(members) || 0,
        discordInvite,
        ownerName,
        representativeId: representativeId || ownerName,
      })
      console.log("Discord webhook sent successfully")
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
      // Don't fail the entire submission if webhook fails
    }

    console.log("Redirecting to confirmation page")
  } catch (error) {
    console.error("Error in submit application:", error)
    throw error
  }

  // Redirect to confirmation page
  redirect("/confirmation")
}
