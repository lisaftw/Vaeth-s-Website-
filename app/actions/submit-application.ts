"use server"

import { addApplication } from "@/lib/data-store"
import { sendDiscordNotification } from "@/lib/discord-webhook"

export async function submitApplication(formData: FormData) {
  try {
    const applicationData = {
      name: formData.get("serverName") as string,
      description: formData.get("description") as string,
      members: Number.parseInt(formData.get("memberCount") as string) || 0,
      invite: formData.get("serverUrl") as string,
      logo: formData.get("logoUrl") as string,
      representativeDiscordId: formData.get("representative") as string,
    }

    // Validate required fields
    if (!applicationData.name || !applicationData.description || !applicationData.members || !applicationData.invite) {
      return {
        success: false,
        error: "Please fill in all required fields",
      }
    }

    // Add to data store
    addApplication(applicationData)

    // Send Discord webhook notification
    try {
      await sendDiscordNotification({
        name: applicationData.name,
        description: applicationData.description,
        members: applicationData.members,
        invite: applicationData.invite,
        logo: applicationData.logo || undefined,
        representativeDiscordId: applicationData.representativeDiscordId,
      })
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
      // Don't fail the application submission if webhook fails
    }

    return {
      success: true,
      message: "Application submitted successfully! You will be notified of the decision.",
    }
  } catch (error) {
    console.error("Error submitting application:", error)
    return {
      success: false,
      error: "Failed to submit application. Please try again.",
    }
  }
}
