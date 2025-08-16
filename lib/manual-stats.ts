// Manual stats management for the Unified Realms alliance
let manualStats = {
  totalServers: 1,
  totalMembers: 250,
  securityScore: 100,
}

const serverMemberCounts: { [key: string]: number } = {
  "Unified Realms HQ": 250,
}

// Optional webhook notification function
async function sendOptionalWebhook(message: string) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) {
      console.warn("Discord webhook URL not configured, skipping notification")
      return
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        username: "Unified Realms Bot",
        avatar_url: "https://cdn.discordapp.com/icons/1234567890/avatar.png",
      }),
    })

    if (!response.ok) {
      console.warn(`Webhook notification failed: ${response.status}`)
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
    const guildId = "1234567890" // Unified Realms HQ guild ID
    const botToken = process.env.DISCORD_BOT_TOKEN

    if (!botToken) {
      console.warn("Discord bot token not configured, using fallback count")
      return 250
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    })

    if (!response.ok) {
      console.warn(`Discord API error: ${response.status}`)
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
export async function refreshMainServerData(): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    console.log("Refreshing main server data from Discord...")
    const memberCount = await fetchMainServerMembers()

    // Update the main server count
    serverMemberCounts["Unified Realms HQ"] = memberCount

    // Recalculate total members
    const totalMembers = calculateTotalMembersFromServers()
    manualStats.totalMembers = totalMembers

    console.log(`Updated Unified Realms HQ: ${memberCount} members`)
    console.log(`Total alliance members: ${totalMembers}`)

    // Send optional webhook notification
    await sendOptionalWebhook(
      `📊 **Stats Updated**\n` +
        `🏰 Unified Realms HQ: **${memberCount.toLocaleString()}** members\n` +
        `👥 Total Alliance: **${totalMembers.toLocaleString()}** members`,
    )

    return {
      success: true,
      message: `Successfully updated main server data. Current count: ${memberCount.toLocaleString()} members`,
    }
  } catch (error) {
    console.error("Error refreshing main server data:", error)
    return {
      success: false,
      message: "Failed to refresh main server data",
      error: String(error),
    }
  }
}

// Get current manual stats
export function getManualStats() {
  return { ...manualStats }
}

// Update manual stats
export function updateManualStats(newStats: Partial<typeof manualStats>) {
  manualStats = { ...manualStats, ...newStats }
  console.log("Manual stats updated:", manualStats)
}

// Get server member counts
export function getServerMemberCounts() {
  return { ...serverMemberCounts }
}

// Update individual server member count
export function updateServerMemberCount(serverName: string, memberCount: number) {
  serverMemberCounts[serverName] = memberCount
  // Recalculate total members
  const totalMembers = calculateTotalMembersFromServers()
  manualStats.totalMembers = totalMembers
  console.log(`Updated ${serverName}: ${memberCount} members, Total: ${totalMembers}`)
}

// Add server to member counts tracking
export function addServerToMemberCounts(serverName: string, memberCount: number) {
  serverMemberCounts[serverName] = memberCount
  // Recalculate total members
  const totalMembers = calculateTotalMembersFromServers()
  manualStats.totalMembers = totalMembers
  console.log(`Added ${serverName} with ${memberCount} members to tracking`)
}

// Remove server from member counts tracking
export function removeServerFromMemberCounts(serverName: string) {
  delete serverMemberCounts[serverName]
  // Recalculate total members
  const totalMembers = calculateTotalMembersFromServers()
  manualStats.totalMembers = totalMembers
  console.log(`Removed ${serverName} from tracking`)
}

// Calculate total members from all tracked servers
export function calculateTotalMembersFromServers(): number {
  return Object.values(serverMemberCounts).reduce((total, count) => total + count, 0)
}
