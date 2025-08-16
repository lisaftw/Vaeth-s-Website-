interface DiscordWebhookPayload {
  embeds: Array<{
    title: string
    description: string
    color: number
    fields: Array<{
      name: string
      value: string
      inline?: boolean
    }>
    footer: {
      text: string
    }
    timestamp: string
    thumbnail?: {
      url: string
    }
  }>
}

export async function sendDiscordNotification(application: {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  representativeDiscordId?: string
}) {
  const webhookUrl =
    "https://discord.com/api/webhooks/1405214127168688139/mwiG9IpefUfBvEEVqVKXN3tMdjEiWimkNvIUX8Xex0rcpAqWyERrecN8C9AQ-7v1L1Ew"

  const embed = {
    title: "🚀 New Alliance Application Received!",
    description: `**${application.name}** has applied to join the Unified Realms Alliance`,
    color: 0xff0000, // Red color matching your theme
    fields: [
      {
        name: "📋 Server Name",
        value: application.name,
        inline: true,
      },
      {
        name: "👥 Member Count",
        value: application.members.toString(),
        inline: true,
      },
      {
        name: "🔗 Discord Invite",
        value: application.invite,
        inline: false,
      },
      {
        name: "📝 Description",
        value:
          application.description.length > 1024
            ? application.description.substring(0, 1021) + "..."
            : application.description,
        inline: false,
      },
    ],
    footer: {
      text: "Unified Realms Alliance • Application System",
    },
    timestamp: new Date().toISOString(),
  }

  // Add representative Discord ID if provided
  if (application.representativeDiscordId) {
    embed.fields.push({
      name: "👤 Representative Discord ID",
      value: application.representativeDiscordId,
      inline: true,
    })
  }

  // Add logo thumbnail if provided
  if (application.logo) {
    ;(embed as any).thumbnail = {
      url: application.logo,
    }
  }

  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("Discord webhook failed:", response.status, response.statusText)
      return false
    }

    console.log("Discord notification sent successfully")
    return true
  } catch (error) {
    console.error("Error sending Discord webhook:", error)
    return false
  }
}
