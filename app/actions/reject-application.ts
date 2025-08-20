"use server"

import { removeApplication } from "@/lib/data-store"

export async function rejectApplication(formData: FormData) {
  try {
    console.log("Reject application action called")

    const index = Number.parseInt(formData.get("index") as string)
    console.log("Rejecting application at index:", index)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        message: "Invalid application index",
      }
    }

    const removedApplication = await removeApplication(index)

    if (removedApplication) {
      return {
        success: true,
        message: `Application for "${removedApplication.name}" has been rejected and removed.`,
      }
    } else {
      return {
        success: false,
        message: "Failed to reject application",
      }
    }
  } catch (error) {
    console.error("Error in rejectApplication:", error)
    return {
      success: false,
      message: "Error rejecting application: " + String(error),
    }
  }
}
