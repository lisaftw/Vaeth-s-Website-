"use server"

import { redirect } from "next/navigation"
import { addApplication } from "@/lib/data-store"
import { sendDiscordNotification } from "@/lib/discord-webhook"

export async function submitApplication(formData: FormData) {
  try {
    const applicationData = {
      name: formData.get("serverName") as string,
      description: formData.get("description") as string,
      members: Number.parseInt(formData.get("memberCount") as string) || 0,
      invite: formData.get("serverInvite") as string,
      ownerName: formData.get("ownerName") as string,
      representativeDiscordId: formData.get("representativeDiscordId") as string,
    }

    // Validate required fields
    if (
      !applicationData.name ||
      !applicationData.description ||
      !applicationData.members ||
      !applicationData.invite ||
      !applicationData.ownerName ||
      !applicationData.representativeDiscordId
    ) {
      throw new Error("Please fill in all required fields")
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
        representativeDiscordId: applicationData.representativeDiscordId,
      })
      console.log("Discord notification sent successfully for:", applicationData.name)
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
      // Don't fail the application submission if webhook fails
    }

    // Redirect to confirmation page
    redirect("/confirmation")
  } catch (error) {
    console.error("Error submitting application:", error)
    throw new Error("Failed to submit application. Please try again.")
  }
}
