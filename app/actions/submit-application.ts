"use server"

import { addApplication } from "@/lib/data-store"
import { sendDiscordWebhook } from "@/lib/discord-webhook"
import { redirect } from "next/navigation"

export async function submitApplication(formData: FormData) {
  try {
    console.log("Submit application action called")

    // Extract form data with correct field names
    const serverName = formData.get("serverName") as string
    const description = formData.get("description") as string
    const memberCount = formData.get("memberCount") as string
    const serverInvite = formData.get("serverInvite") as string
    const ownerName = formData.get("ownerName") as string
    const representativeDiscordId = formData.get("representativeDiscordId") as string

    console.log("Form data extracted:", {
      serverName,
      description,
      memberCount,
      serverInvite,
      ownerName,
      representativeDiscordId,
    })

    // Validate required fields
    if (!serverName || !description || !memberCount || !serverInvite || !ownerName) {
      console.error("Missing required fields")
      throw new Error("All required fields must be filled")
    }

    // Create application object
    const application = {
      name: serverName,
      description: description,
      members: Number.parseInt(memberCount) || 0,
      invite: serverInvite,
      representativeDiscordId: representativeDiscordId || ownerName,
      ownerName: ownerName,
    }

    console.log("Application object created:", application)

    // Add to Supabase
    await addApplication(application)
    console.log("Application added to Supabase")

    // Send Discord webhook (don't fail if this fails)
    try {
      await sendDiscordWebhook({
        serverName,
        description,
        members: Number.parseInt(memberCount) || 0,
        discordInvite: serverInvite,
        ownerName,
        representativeId: representativeDiscordId || ownerName,
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
