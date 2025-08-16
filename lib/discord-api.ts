// Discord API integration for fetching server information and member counts

export interface DiscordServerInfo {
  id: string
  name: string
  description?: string
  memberCount: number
  icon?: string
  banner?: string
  features: string[]
  approximateMemberCount?: number
  approximatePresenceCount?: number
}

export interface DiscordInviteInfo {
  code: string
  guild: {
    id: string
    name: string
    description?: string
    icon?: string
    banner?: string
    features: string[]
    approximate_member_count?: number
    approximate_presence_count?: number
  }
}

// Extract invite code from Discord URL
export function extractInviteCode(inviteUrl: string): string | null {
  const patterns = [
    /discord\.gg\/([a-zA-Z0-9]+)/,
    /discord\.com\/invite\/([a-zA-Z0-9]+)/,
    /discordapp\.com\/invite\/([a-zA-Z0-9]+)/,
  ]

  for (const pattern of patterns) {
    const match = inviteUrl.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Fetch server info from Discord invite
export async function fetchDiscordServerInfo(inviteUrl: string): Promise<DiscordServerInfo | null> {
  try {
    const inviteCode = extractInviteCode(inviteUrl)
    if (!inviteCode) {
      console.error("Invalid Discord invite URL:", inviteUrl)
      return null
    }

    console.log("Fetching Discord server info for invite:", inviteCode)

    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
      headers: {
        "User-Agent": "UnifiedRealms/1.0",
      },
    })

    if (!response.ok) {
      console.error("Discord API error:", response.status, response.statusText)
      return null
    }

    const data: DiscordInviteInfo = await response.json()

    const serverInfo: DiscordServerInfo = {
      id: data.guild.id,
      name: data.guild.name,
      description: data.guild.description,
      memberCount: data.guild.approximate_member_count || 0,
      icon: data.guild.icon,
      banner: data.guild.banner,
      features: data.guild.features,
      approximateMemberCount: data.guild.approximate_member_count,
      approximatePresenceCount: data.guild.approximate_presence_count,
    }

    console.log("Successfully fetched Discord server info:", serverInfo)
    return serverInfo
  } catch (error) {
    console.error("Error fetching Discord server info:", error)
    return null
  }
}

// Get Discord server icon URL
export function getDiscordIconUrl(serverId: string, iconHash?: string, size = 128): string {
  if (!iconHash) {
    // Return default Discord icon
    return `/placeholder.svg?height=${size}&width=${size}&text=${encodeURIComponent("Discord Server")}`
  }

  const format = iconHash.startsWith("a_") ? "gif" : "png"
  return `https://cdn.discordapp.com/icons/${serverId}/${iconHash}.${format}?size=${size}`
}

// Get Discord server banner URL
export function getDiscordBannerUrl(serverId: string, bannerHash?: string, size = 512): string | null {
  if (!bannerHash) return null

  const format = bannerHash.startsWith("a_") ? "gif" : "png"
  return `https://cdn.discordapp.com/banners/${serverId}/${bannerHash}.${format}?size=${size}`
}

// Batch fetch multiple server infos
export async function fetchMultipleServerInfos(inviteUrls: string[]): Promise<(DiscordServerInfo | null)[]> {
  console.log("Fetching info for multiple servers:", inviteUrls.length)

  const promises = inviteUrls.map((url) => fetchDiscordServerInfo(url))
  const results = await Promise.allSettled(promises)

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value
    } else {
      console.error(`Failed to fetch server info for ${inviteUrls[index]}:`, result.reason)
      return null
    }
  })
}

// Update server member counts
export async function updateServerMemberCounts(servers: Array<{ invite: string; [key: string]: any }>) {
  console.log("Updating member counts for servers:", servers.length)

  const updatedServers = await Promise.all(
    servers.map(async (server) => {
      const discordInfo = await fetchDiscordServerInfo(server.invite)
      if (discordInfo) {
        return {
          ...server,
          members: discordInfo.memberCount,
          discordId: discordInfo.id,
          discordIcon: discordInfo.icon,
          discordFeatures: discordInfo.features,
          lastUpdated: new Date().toISOString(),
        }
      }
      return server
    }),
  )

  console.log("Updated server member counts")
  return updatedServers
}
