"use server"

import { redirect } from "next/navigation"
import { addApplication } from "@/lib/data-store"
import { sendDiscordWebhook } from "@/lib/discord-webhook"
import { revalidatePath } from "next/cache"

export async function submitApplication(formData: FormData) {
  try {
    console.log("=== SUBMIT APPLICATION ACTION ===")

    // Extract form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const members = Number.parseInt(formData.get("members") as string)
    const invite = formData.get("invite") as string
    const logo = formData.get("logo") as string
    const representativeId = formData.get("representativeId") as string
    const ownerName = formData.get("ownerName") as string

    console.log("Form data received:", {
      name,
      description,
      members,
      invite,
      logo,
      representativeId,
      ownerName,
    })

    // Validate required fields
    if (!name || !description || !members || !invite || !representativeId || !ownerName) {
      console.error("Missing required fields")
      redirect("/apply?error=missing_fields")
      return
    }

    if (isNaN(members) || members <= 0) {
      console.error("Invalid member count")
      redirect("/apply?error=invalid_members")
      return
    }

    // Create application object
    const application = {
      name,
      description,
      members,
      invite,
      logo: logo || undefined,
      representativeDiscordId: representativeId,
      ownerName,
      submittedAt: new Date().toISOString(),
    }

    console.log("Application object:", application)

    // Add to database
    await addApplication(application)

    // Send Discord webhook notification (optional)
    try {
      await sendDiscordWebhook({
        content: `🆕 **New Server Application**\n**Server:** ${name}\n**Members:** ${members.toLocaleString()}\n**Owner:** ${ownerName}\n**Representative:** <@${representativeId}>\n**Invite:** ${invite}`,
      })
    } catch (webhookError) {
      console.error("Discord webhook failed:", webhookError)
      // Don't fail the entire application if webhook fails
    }

    // Revalidate admin page to show new application
    revalidatePath("/admin")

    console.log("Application submitted successfully")
    console.log("=== END SUBMIT APPLICATION ===")

    // Redirect to confirmation page
    redirect("/confirmation")
  } catch (error) {
    console.error("Error in submitApplication:", error)

    // Check if it's a duplicate error
    if (error instanceof Error && error.message.includes("already exists")) {
      redirect("/apply?error=duplicate")
      return
    }

    redirect("/apply?error=submission_failed")
  }
}
