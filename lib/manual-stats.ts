// Manual stats management system with Discord API integration
export interface ManualStats {
  totalServers: number
  totalMembers: number
  securityScore: number
  lastUpdated: string
}

// Default stats - these will be updated from Discord API
let manualStats: ManualStats = {
  totalServers: 1,
  totalMembers: 250, // Updated default to match Discord
  securityScore: 100,
  lastUpdated: new Date().toISOString(),
}

// Server member counts for individual management
const serverMemberCounts: { [serverName: string]: number } = {
  "Unified Realms HQ": 250, // Updated default
}

// Discord API integration for main server
const MAIN_SERVER_INVITE = "https://discord.gg/yXTrkPPQAK"
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1405214127168688139/mwiG9IpefUfBvEEVqVKXN3tMdjEiWimkNvIUX8Xex0rcpAqWyERrecN8C9AQ-7v1L1Ew"

async function fetchMainServerMembers(): Promise<number> {
  try {
    // Extract invite code from URL
    const inviteCode = MAIN_SERVER_INVITE.split("/").pop()
    if (!inviteCode) {
      console.error("Could not extract invite code from URL")
      return 250
    }

    console.log("Fetching Discord server info for invite code:", inviteCode)

    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
      headers: {
        "User-Agent": "UnifiedRealms/1.0",
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      console.error("Discord API error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Discord API error details:", errorText)
      return 250
    }

    const data = await response.json()
    console.log("Discord API response:", data)

    const memberCount = data.guild?.approximate_member_count || data.approximate_member_count || 250
    console.log("Extracted member count:", memberCount)

    // Send webhook notification about the successful update
    try {
      const webhookPayload = {
        embeds: [
          {
            title: "🔄 Unified Realms HQ Member Count Updated",
            description: `Successfully fetched latest member count from Discord API.`,
            fields: [
              {
                name: "📊 New Member Count",
                value: memberCount.toLocaleString(),
                inline: true,
              },
              {
                name: "🕒 Last Updated",
                value: new Date().toLocaleString(),
                inline: true,
              },
              {
                name: "🔗 Server",
                value: "Unified Realms HQ",
                inline: true,
              },
            ],
            color: 0x00ff00,
            timestamp: new Date().toISOString(),
            footer: {
              text: "Unified Realms Alliance Bot",
            },
          },
        ],
      }

      const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      })

      if (!webhookResponse.ok) {
        console.error("Webhook notification failed:", webhookResponse.status)
      } else {
        console.log("Webhook notification sent successfully")
      }
    } catch (webhookError) {
      console.error("Error sending webhook notification:", webhookError)
    }

    return memberCount
  } catch (error) {
    console.error("Error fetching main server members:", error)
    return 250 // Fallback to known value
  }
}

export function getManualStats(): ManualStats {
  return { ...manualStats }
}

export function updateManualStats(newStats: Partial<ManualStats>): void {
  manualStats = {
    ...manualStats,
    ...newStats,
    lastUpdated: new Date().toISOString(),
  }
  console.log("Manual stats updated:", manualStats)
}

export function getServerMemberCounts(): { [serverName: string]: number } {
  return { ...serverMemberCounts }
}

export function updateServerMemberCount(serverName: string, memberCount: number): void {
  const oldCount = serverMemberCounts[serverName] || 0
  serverMemberCounts[serverName] = memberCount
  console.log(`Updated ${serverName} member count from ${oldCount} to ${memberCount}`)

  // Auto-update total members
  const newTotal = calculateTotalMembersFromServers()
  updateManualStats({ totalMembers: newTotal })

  console.log(`Total members updated to: ${newTotal}`)
}

export function calculateTotalMembersFromServers(): number {
  const total = Object.values(serverMemberCounts).reduce((sum, count) => sum + count, 0)
  console.log("Calculated total members from servers:", total, "from counts:", serverMemberCounts)
  return total
}

export function addServerToMemberCounts(serverName: string, memberCount: number): void {
  serverMemberCounts[serverName] = memberCount
  console.log(`Added server ${serverName} with ${memberCount} members`)

  // Auto-update total members and server count
  const newTotal = calculateTotalMembersFromServers()
  const newServerCount = Object.keys(serverMemberCounts).length
  updateManualStats({
    totalMembers: newTotal,
    totalServers: newServerCount,
  })

  console.log(`Updated totals - Servers: ${newServerCount}, Members: ${newTotal}`)
}

export function removeServerFromMemberCounts(serverName: string): void {
  const removedCount = serverMemberCounts[serverName] || 0
  delete serverMemberCounts[serverName]
  console.log(`Removed server ${serverName} with ${removedCount} members`)

  // Auto-update total members and server count
  const newTotal = calculateTotalMembersFromServers()
  const newServerCount = Object.keys(serverMemberCounts).length
  updateManualStats({
    totalMembers: newTotal,
    totalServers: newServerCount,
  })

  console.log(`Updated totals after removal - Servers: ${newServerCount}, Members: ${newTotal}`)
}

export async function refreshMainServerData(): Promise<void> {
  try {
    console.log("Starting main server data refresh...")
    const memberCount = await fetchMainServerMembers()
    console.log("Fetched member count:", memberCount)

    updateServerMemberCount("Unified Realms HQ", memberCount)
    console.log("Main server data refresh completed with member count:", memberCount)
  } catch (error) {
    console.error("Error refreshing main server data:", error)
  }
}

// Initialize with Discord data on startup
console.log("Initializing manual stats system...")
refreshMainServerData()
  .then(() => {
    console.log("Initial Discord data fetch completed")
  })
  .catch((error) => {
    console.error("Initial Discord data fetch failed:", error)
  })

// Auto-refresh main server data every 10 minutes
setInterval(
  () => {
    console.log("Auto-refreshing main server data...")
    refreshMainServerData()
  },
  10 * 60 * 1000,
)
