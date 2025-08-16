"use server"

import { approveApplicationToServer, getApplicationsData } from "@/lib/data-store"
import { sendApprovalWebhook } from "@/lib/discord-webhook"

export async function approveApplication(formData: FormData) {
  try {
    const index = Number.parseInt(formData.get("index") as string)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        error: "Invalid application index",
      }
    }

    // Get the application before approving to send webhook
    const applications = getApplicationsData()
    const application = applications[index]

    if (!application) {
      return {
        success: false,
        error: "Application not found",
      }
    }

    // Approve the application (moves it to servers)
    const success = approveApplicationToServer(index)

    if (!success) {
      return {
        success: false,
        error: "Failed to approve application",
      }
    }

    // Send Discord notification
    try {
      await sendApprovalWebhook(application.name, true)
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
    }

    return {
      success: true,
      message: `${application.name} has been approved and added to the alliance!`,
    }
  } catch (error) {
    console.error("Error approving application:", error)
    return {
      success: false,
      error: "Failed to approve application",
    }
  }
}
