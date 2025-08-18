"use server"

interface WebhookData {
  serverName: string
  description: string
  members: number
  discordInvite: string
  ownerName: string
  representativeId: string
}

export async function sendDiscordWebhook(data: WebhookData) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, skipping webhook")
      return
    }

    const embed = {
      title: "🆕 New Server Application",
      color: 0xff0000,
      fields: [
        {
          name: "Server Name",
          value: data.serverName,
          inline: true,
        },
        {
          name: "Members",
          value: data.members.toString(),
          inline: true,
        },
        {
          name: "Owner",
          value: data.ownerName,
          inline: true,
        },
        {
          name: "Representative",
          value: data.representativeId,
          inline: true,
        },
        {
          name: "Description",
          value: data.description.length > 1024 ? data.description.substring(0, 1021) + "..." : data.description,
          inline: false,
        },
        {
          name: "Discord Invite",
          value: data.discordInvite,
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
    }

    const payload = {
      embeds: [embed],
    }

    console.log("Sending Discord webhook:", payload)

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`)
    }

    console.log("Discord webhook sent successfully")
  } catch (error) {
    console.error("Discord webhook error:", error)
    throw error
  }
}
