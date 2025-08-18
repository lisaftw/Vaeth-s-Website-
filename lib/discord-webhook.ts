// Discord webhook integration for notifications

interface WebhookData {
  serverName: string
  description: string
  members: number
  discordInvite: string
  ownerName: string
  representativeId: string
}

export async function sendDiscordWebhook(data: WebhookData): Promise<void> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, skipping notification")
      return
    }

    console.log("Sending Discord webhook notification...")

    const embed = {
      title: "🏰 New Alliance Application",
      description: "A new server has applied to join the Unified Realms Alliance!",
      color: 0xff0000, // Red color
      fields: [
        {
          name: "🏷️ Server Name",
          value: data.serverName,
          inline: true,
        },
        {
          name: "👥 Members",
          value: data.members.toLocaleString(),
          inline: true,
        },
        {
          name: "👑 Owner",
          value: data.ownerName,
          inline: true,
        },
        {
          name: "📝 Description",
          value: data.description.length > 1024 ? data.description.substring(0, 1021) + "..." : data.description,
          inline: false,
        },
        {
          name: "🔗 Discord Invite",
          value: `[Join Server](${data.discordInvite})`,
          inline: true,
        },
        {
          name: "🆔 Representative",
          value: data.representativeId || "Not provided",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
        icon_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      },
    }

    const payload = {
      username: "Alliance Bot",
      avatar_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      embeds: [embed],
    }

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
    console.error("Error sending Discord webhook:", error)
    throw error
  }
}

export async function sendApprovalWebhook(serverName: string, approved: boolean): Promise<void> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, skipping notification")
      return
    }

    console.log(`Sending ${approved ? "approval" : "rejection"} webhook notification...`)

    const embed = {
      title: approved ? "✅ Application Approved" : "❌ Application Rejected",
      description: approved
        ? `${serverName} has been approved and added to the alliance!`
        : `${serverName}'s application has been rejected.`,
      color: approved ? 0x00ff00 : 0xff0000, // Green for approved, red for rejected
      fields: [
        {
          name: "🏷️ Server Name",
          value: serverName,
          inline: true,
        },
        {
          name: "📊 Status",
          value: approved ? "Approved ✅" : "Rejected ❌",
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
        icon_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      },
    }

    const payload = {
      username: "Alliance Bot",
      avatar_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      embeds: [embed],
    }

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

    console.log("Discord approval/rejection webhook sent successfully")
  } catch (error) {
    console.error("Error sending Discord approval/rejection webhook:", error)
    throw error
  }
}

export async function sendStatsUpdateWebhook(stats: {
  totalServers: number
  totalMembers: number
  securityScore: number
}): Promise<void> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      console.log("Discord webhook URL not configured, skipping notification")
      return
    }

    console.log("Sending stats update webhook notification...")

    const embed = {
      title: "📊 Alliance Statistics Updated",
      description: "The alliance statistics have been updated!",
      color: 0x0099ff, // Blue color
      fields: [
        {
          name: "🏰 Total Servers",
          value: stats.totalServers.toString(),
          inline: true,
        },
        {
          name: "👥 Total Members",
          value: stats.totalMembers.toLocaleString(),
          inline: true,
        },
        {
          name: "🛡️ Security Score",
          value: `${stats.securityScore}%`,
          inline: true,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
        icon_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      },
    }

    const payload = {
      username: "Alliance Bot",
      avatar_url: "https://your-domain.com/logo.png", // Replace with your actual logo URL
      embeds: [embed],
    }

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

    console.log("Discord stats update webhook sent successfully")
  } catch (error) {
    console.error("Error sending Discord stats update webhook:", error)
    throw error
  }
}
