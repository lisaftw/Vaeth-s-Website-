"use server"

import { redirect } from "next/navigation"
import { addApplication } from "@/lib/data-store"
import { sendDiscordWebhook } from "@/lib/discord-webhook"

export async function submitApplication(formData: FormData) {
  try {
    console.log("=== SUBMIT APPLICATION ACTION ===")

    // Log all form data for debugging
    console.log("All form data entries:")
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    // Extract form data with proper field names
    const name = formData.get("serverName") as string
    const description = formData.get("description") as string
    const memberCountStr = formData.get("memberCount") as string
    const invite = formData.get("serverInvite") as string
    const logo = formData.get("logoUrl") as string
    const representativeDiscordId = formData.get("representativeId") as string
    const ownerName = formData.get("ownerName") as string

    console.log("Form data extracted:", {
      name,
      description,
      memberCountStr,
      invite,
      logo,
      representativeDiscordId,
      ownerName,
    })

    // Validate required fields
    if (!name || !description || !memberCountStr || !invite) {
      console.error("Missing required fields")
      throw new Error("Missing required fields")
    }

    const members = Number.parseInt(memberCountStr, 10)
    if (isNaN(members) || members <= 0) {
      console.error("Invalid member count:", memberCountStr)
      throw new Error("Invalid member count")
    }

    // Create application object
    const application = {
      name: name.trim(),
      description: description.trim(),
      members,
      invite: invite.trim(),
      logo: logo?.trim() || undefined,
      representativeDiscordId: representativeDiscordId?.trim() || undefined,
      ownerName: ownerName?.trim() || undefined,
      submittedAt: new Date().toISOString(),
    }

    console.log("Application object:", application)

    // Save to database
    await addApplication(application)
    console.log("Application saved to database successfully")

    // Try to send Discord webhook (don't fail if this doesn't work)
    try {
      await sendDiscordWebhook({
        title: "New Alliance Application",
        description: `**${application.name}** has applied to join the alliance`,
        fields: [
          { name: "Server Name", value: application.name, inline: true },
          { name: "Members", value: application.members.toLocaleString(), inline: true },
          { name: "Description", value: application.description },
          { name: "Discord Invite", value: application.invite },
          ...(application.representativeDiscordId
            ? [{ name: "Representative ID", value: application.representativeDiscordId, inline: true }]
            : []),
          ...(application.ownerName ? [{ name: "Server Owner", value: application.ownerName, inline: true }] : []),
        ],
        color: 0x00ff00,
      })
      console.log("Discord webhook sent successfully")
    } catch (webhookError) {
      console.error("Discord webhook failed (continuing anyway):", webhookError)
    }

    console.log("=== APPLICATION SUBMITTED SUCCESSFULLY ===")
  } catch (error) {
    console.error("Error in submitApplication:", error)
    throw error
  }

  // Redirect to confirmation page
  redirect("/confirmation")
}
