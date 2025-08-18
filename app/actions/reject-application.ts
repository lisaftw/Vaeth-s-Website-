"use server"

import { rejectApplication as rejectApplicationFromStore } from "@/lib/data-store"
import { revalidatePath } from "next/cache"

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

    await rejectApplicationFromStore(index)

    // Invalidate cache to ensure fresh data
    revalidatePath("/admin")
    revalidatePath("/")

    console.log("Application rejected successfully")

    return {
      success: true,
      message: "Application has been rejected and removed.",
    }
  } catch (error) {
    console.error("Error in rejectApplication:", error)
    return {
      success: false,
      message: "Error rejecting application: " + String(error),
    }
  }
}
