"use server"

import { removeApplication, getApplicationsData } from "@/lib/data-store"
import { sendApprovalWebhook } from "@/lib/discord-webhook"

export async function rejectApplication(formData: FormData) {
  try {
    const index = Number.parseInt(formData.get("index") as string)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        error: "Invalid application index",
      }
    }

    // Get the application before rejecting to send webhook
    const applications = getApplicationsData()
    const application = applications[index]

    if (!application) {
      return {
        success: false,
        error: "Application not found",
      }
    }

    // Remove the application
    const removedApplication = removeApplication(index)

    if (!removedApplication) {
      return {
        success: false,
        error: "Failed to reject application",
      }
    }

    // Send Discord notification
    try {
      await sendApprovalWebhook(application.name, false)
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
    }

    return {
      success: true,
      message: `${application.name} has been rejected.`,
    }
  } catch (error) {
    console.error("Error rejecting application:", error)
    return {
      success: false,
      error: "Failed to reject application",
    }
  }
}
