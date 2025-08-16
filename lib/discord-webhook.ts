export interface WebhookData {
  serverName: string
  description: string
  memberCount: number
  serverUrl: string
  representative: string
  logoUrl?: string
}

export async function sendDiscordWebhook(data: WebhookData): Promise<boolean> {
  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1405214127168688139/mwiG9IpefUfBvEEVqVKXN3tMdjEiWimkNvIUX8Xex0rcpAqWyERrecN8C9AQ-7v1L1Ew"

  try {
    const embed = {
      title: "🚀 New Server Application",
      description: `**${data.serverName}** has applied to join the Unified Realms Alliance!`,
      color: 0xef4444, // Red color
      fields: [
        {
          name: "📝 Description",
          value: data.description || "No description provided",
          inline: false,
        },
        {
          name: "👥 Member Count",
          value: data.memberCount.toLocaleString(),
          inline: true,
        },
        {
          name: "🔗 Server Link",
          value: data.serverUrl ? `[Join Server](${data.serverUrl})` : "No link provided",
          inline: true,
        },
        {
          name: "👤 Representative",
          value: data.representative || "Not specified",
          inline: true,
        },
      ],
      thumbnail: data.logoUrl ? { url: data.logoUrl } : undefined,
      timestamp: new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
        icon_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_ZZQV2t3djhNcqgTdlNZvRStoTDYo/R0nIRm0vxPL7t3HhwG7BoQ/public/logo.png",
      },
    }

    const payload = {
      username: "Alliance Bot",
      avatar_url:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_ZZQV2t3djhNcqgTdlNZvRStoTDYo/R0nIRm0vxPL7t3HhwG7BoQ/public/logo.png",
      embeds: [embed],
    }

    const response = await fetch(WEBHOOK_URL, {
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

    console.log("Discord webhook sent successfully")
    return true
  } catch (error) {
    console.error("Error sending Discord webhook:", error)
    return false
  }
}

// Legacy function name for backward compatibility
export async function sendDiscordNotification(application: {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  representativeDiscordId?: string
}): Promise<boolean> {
  return sendDiscordWebhook({
    serverName: application.name,
    description: application.description,
    memberCount: application.members,
    serverUrl: application.invite,
    representative: application.representativeDiscordId || "Not specified",
    logoUrl: application.logo,
  })
}

export async function sendApprovalWebhook(serverName: string, approved: boolean): Promise<boolean> {
  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1405214127168688139/mwiG9IpefUfBvEEVqVKXN3tMdjEiWimkNvIUX8Xex0rcpAqWyERrecN8C9AQ-7v1L1Ew"

  try {
    const embed = {
      title: approved ? "✅ Application Approved!" : "❌ Application Rejected",
      description: `**${serverName}** has been ${approved ? "approved and welcomed to" : "rejected from"} the Unified Realms Alliance.`,
      color: approved ? 0x00ff00 : 0xff0000, // Green for approved, red for rejected
      timestamp: new Date().toISOString(),
      footer: {
        text: "Unified Realms Alliance",
        icon_url:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_ZZQV2t3djhNcqgTdlNZvRStoTDYo/R0nIRm0vxPL7t3HhwG7BoQ/public/logo.png",
      },
    }

    const payload = {
      username: "Alliance Bot",
      avatar_url:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_ZZQV2t3djhNcqgTdlNZvRStoTDYo/R0nIRm0vxPL7t3HhwG7BoQ/public/logo.png",
      embeds: [embed],
    }

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return response.ok
  } catch (error) {
    console.error("Error sending approval webhook:", error)
    return false
  }
}
