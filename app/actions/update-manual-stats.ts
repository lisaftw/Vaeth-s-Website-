"use server"

import { updateManualStats, updateServerMemberCount, refreshMainServerData, getManualStats } from "@/lib/manual-stats"

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1405214127168688139/mwiG9IpefUfBvEEVqVKXN3tMdjEiWimkNvIUX8Xex0rcpAqWyERrecN8C9AQ-7v1L1Ew"

async function sendOptionalDiscordWebhook(embed: any): Promise<void> {
  try {
    console.log("Attempting to send Discord webhook...")
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      console.warn(`Discord webhook failed: ${response.status} ${response.statusText}`)
      if (response.status === 404) {
        console.warn("Discord webhook URL appears to be invalid or deleted. Continuing without notifications.")
      }
    } else {
      console.log("Discord webhook sent successfully")
    }
  } catch (error) {
    console.warn("Discord webhook failed (non-critical):", error)
  }
}

export async function updateManualStatsAction(formData: FormData) {
  try {
    const totalServers = Number.parseInt(formData.get("totalServers") as string) || 1
    const totalMembers = Number.parseInt(formData.get("totalMembers") as string) || 250
    const securityScore = Number.parseInt(formData.get("securityScore") as string) || 100

    console.log("Updating manual stats:", { totalServers, totalMembers, securityScore })

    updateManualStats({
      totalServers,
      totalMembers,
      securityScore,
    })

    // Send optional webhook notification
    await sendOptionalDiscordWebhook({
      title: "📊 Alliance Stats Manually Updated",
      description: `Alliance statistics have been manually updated by an administrator.`,
      fields: [
        { name: "🏰 Total Servers", value: totalServers.toString(), inline: true },
        { name: "👥 Total Members", value: totalMembers.toLocaleString(), inline: true },
        { name: "🛡️ Security Score", value: `${securityScore}%`, inline: true },
      ],
      color: 0x00ff00,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message: "Alliance statistics updated successfully!",
    }
  } catch (error) {
    console.error("Error updating manual stats:", error)
    return {
      success: false,
      error: "Failed to update alliance statistics",
    }
  }
}

export async function updateServerMemberCountAction(formData: FormData) {
  try {
    const serverName = formData.get("serverName") as string
    const memberCount = Number.parseInt(formData.get("memberCount") as string) || 0

    console.log(`Updating ${serverName} member count to ${memberCount}`)

    updateServerMemberCount(serverName, memberCount)

    // Send optional webhook notification
    await sendOptionalDiscordWebhook({
      title: "🔄 Server Member Count Updated",
      description: `Member count for **${serverName}** has been manually updated.`,
      fields: [
        { name: "🏰 Server", value: serverName, inline: true },
        { name: "👥 New Member Count", value: memberCount.toLocaleString(), inline: true },
      ],
      color: 0x0099ff,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message: `${serverName} member count updated successfully!`,
    }
  } catch (error) {
    console.error("Error updating server member count:", error)
    return {
      success: false,
      error: "Failed to update server member count",
    }
  }
}

export async function refreshMainServerAction() {
  try {
    console.log("Manual refresh action triggered")
    await refreshMainServerData()

    const stats = getManualStats()
    console.log("Refresh completed, current stats:", stats)

    // Send optional webhook notification
    await sendOptionalDiscordWebhook({
      title: "🔄 Discord Data Refreshed",
      description: `Unified Realms HQ member count has been refreshed from Discord API.`,
      fields: [
        { name: "👥 Current Member Count", value: stats.totalMembers.toLocaleString(), inline: true },
        { name: "🕒 Last Updated", value: new Date().toLocaleString(), inline: true },
      ],
      color: 0x00ff00,
      timestamp: new Date().toISOString(),
    })

    return {
      success: true,
      message: `Unified Realms HQ data refreshed! Current member count: ${stats.totalMembers.toLocaleString()}`,
    }
  } catch (error) {
    console.error("Error refreshing main server:", error)
    return {
      success: false,
      error: "Failed to refresh main server data",
    }
  }
}
