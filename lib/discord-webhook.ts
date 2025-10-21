export interface WebhookField {
  name: string
  value: string
  inline?: boolean
}

export interface WebhookData {
  title: string
  description: string
  fields?: WebhookField[]
  color?: number
  timestamp?: string
}

export async function sendDiscordWebhook(data: WebhookData): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log("Discord webhook URL not configured, skipping webhook")
    return
  }

  try {
    console.log("Sending Discord webhook:", data)

    const embed = {
      title: data.title,
      description: data.description,
      color: data.color || 0x0099ff,
      fields: data.fields || [],
      timestamp: data.timestamp || new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
      },
    }

    const payload = {
      embeds: [embed],
    }

    console.log("Webhook payload:", JSON.stringify(payload, null, 2))

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Discord webhook failed:", response.status, errorText)
      throw new Error(`Discord webhook failed: ${response.status} ${errorText}`)
    }

    console.log("Discord webhook sent successfully")
  } catch (error) {
    console.error("Error sending Discord webhook:", error)
    throw error
  }
}

export async function sendDiscordNotification(application: {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  representativeDiscordId?: string
}): Promise<boolean> {
  try {
    const webhookData: WebhookData = {
      title: "🆕 New Server Application",
      description: `**${application.name}** has applied to join the alliance!`,
      color: 0xff0000, // Red color for Unified Realms
      fields: [
        {
          name: "Description",
          value: application.description,
          inline: false,
        },
        {
          name: "Members",
          value: application.members.toString(),
          inline: true,
        },
        {
          name: "Invite",
          value: application.invite,
          inline: true,
        },
      ],
    }

    if (application.representativeDiscordId) {
      webhookData.fields?.push({
        name: "Representative",
        value: `<@${application.representativeDiscordId}>`,
        inline: true,
      })
    }

    if (application.logo) {
      webhookData.thumbnail = {
        url: application.logo,
      }
    }

    await sendDiscordWebhook(webhookData)
    return true
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}
