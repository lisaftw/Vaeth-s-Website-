"use server"

import { approveApplicationToServer } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

export async function approveApplication(formData: FormData) {
  try {
    console.log("Approve application action called")

    const index = Number.parseInt(formData.get("index") as string)
    console.log("Approving application at index:", index)

    if (isNaN(index) || index < 0) {
      return {
        success: false,
        message: "Invalid application index",
      }
    }

    const success = await approveApplicationToServer(index)

    if (success) {
      // Invalidate cache to ensure fresh data
      revalidatePath("/admin")
      revalidatePath("/")

      return {
        success: true,
        message: "Application approved and server added successfully!",
      }
    } else {
      return {
        success: false,
        message: "Failed to approve application",
      }
    }
  } catch (error) {
    console.error("Error in approveApplication:", error)
    return {
      success: false,
      message: "Error approving application: " + String(error),
    }
  }
}
