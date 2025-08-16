// Manual stats management for the alliance
let manualStats = {
  totalServers: 1,
  totalMembers: 250,
  securityScore: 100,
}

const serverMemberCounts: { [key: string]: number } = {
  "Unified Realms HQ": 250,
}

// Discord API configuration
const DISCORD_GUILD_ID = "1405214127168688139"
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

export function getManualStats() {
  return { ...manualStats }
}

export function updateManualStats(newStats: Partial<typeof manualStats>) {
  manualStats = { ...manualStats, ...newStats }
  console.log("Manual stats updated:", manualStats)
}

export function getServerMemberCounts() {
  return { ...serverMemberCounts }
}

export function updateServerMemberCount(serverName: string, memberCount: number) {
  serverMemberCounts[serverName] = memberCount

  // Recalculate total members
  const totalMembers = Object.values(serverMemberCounts).reduce((sum, count) => sum + count, 0)
  manualStats.totalMembers = totalMembers

  console.log(`Updated ${serverName} to ${memberCount} members. Total: ${totalMembers}`)
}

export function addServerToMemberCounts(serverName: string, memberCount: number) {
  serverMemberCounts[serverName] = memberCount

  // Recalculate total members
  const totalMembers = Object.values(serverMemberCounts).reduce((sum, count) => sum + count, 0)
  manualStats.totalMembers = totalMembers

  console.log(`Added ${serverName} with ${memberCount} members. Total: ${totalMembers}`)
}

export function removeServerFromMemberCounts(serverName: string) {
  delete serverMemberCounts[serverName]

  // Recalculate total members
  const totalMembers = Object.values(serverMemberCounts).reduce((sum, count) => sum + count, 0)
  manualStats.totalMembers = totalMembers

  console.log(`Removed ${serverName}. Total members: ${totalMembers}`)
}

// Optional webhook notification function
async function sendOptionalWebhook(message: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      console.log("No webhook URL configured, skipping notification")
      return
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        username: "Alliance Stats Bot",
        avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png",
      }),
    })

    if (!response.ok) {
      console.warn(`Webhook notification failed: ${response.status} - ${response.statusText}`)
    } else {
      console.log("Webhook notification sent successfully")
    }
  } catch (error) {
    console.warn("Webhook notification failed:", error)
  }
}

// Fetch main server member count from Discord API
async function fetchMainServerMembers(): Promise<number> {
  try {
    if (!DISCORD_BOT_TOKEN) {
      console.warn("No Discord bot token configured, using fallback count")
      return 250
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
    })

    if (!response.ok) {
      console.warn(`Discord API request failed: ${response.status} - ${response.statusText}`)
      return 250
    }

    const guild = await response.json()
    return guild.member_count || 250
  } catch (error) {
    console.warn("Failed to fetch Discord member count:", error)
    return 250
  }
}

// Refresh main server data from Discord
export async function refreshMainServerData() {
  try {
    console.log("Refreshing main server data from Discord...")

    const memberCount = await fetchMainServerMembers()
    updateServerMemberCount("Unified Realms HQ", memberCount)

    // Send optional webhook notification
    await sendOptionalWebhook(
      `🔄 **Stats Updated**\n` +
        `Unified Realms HQ: **${memberCount.toLocaleString()}** members\n` +
        `Total Alliance Members: **${manualStats.totalMembers.toLocaleString()}**`,
    )

    return {
      success: true,
      memberCount,
      totalMembers: manualStats.totalMembers,
    }
  } catch (error) {
    console.error("Error refreshing main server data:", error)
    return {
      success: false,
      error: String(error),
    }
  }
}

// Send stats update notification
export async function sendStatsUpdateNotification(stats: typeof manualStats) {
  const message =
    `📊 **Alliance Stats Updated**\n` +
    `Total Servers: **${stats.totalServers}**\n` +
    `Total Members: **${stats.totalMembers.toLocaleString()}**\n` +
    `Security Score: **${stats.securityScore}%**`

  await sendOptionalWebhook(message)
}
