export interface DiscordServerInfo {
  id: string
  name: string
  icon: string | null
  splash: string | null
  description: string | null
  features: string[]
  approximate_member_count?: number
  approximate_presence_count?: number
}

export async function fetchDiscordServerInfo(inviteLink: string): Promise<DiscordServerInfo | null> {
  try {
    // Extract invite code from various Discord invite URL formats
    const inviteCode = extractInviteCode(inviteLink)

    if (!inviteCode) {
      console.error("Invalid Discord invite link")
      return null
    }

    console.log("[v0] Fetching Discord server info for invite:", inviteCode)

    // Use Discord's public API to fetch invite information
    const response = await fetch(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch Discord server info:", response.status, response.statusText)
      return null
    }

    const data = await response.json()
    console.log("[v0] Discord server info fetched:", data)

    return {
      id: data.guild?.id || "",
      name: data.guild?.name || "",
      icon: data.guild?.icon || null,
      splash: data.guild?.splash || null,
      description: data.guild?.description || null,
      features: data.guild?.features || [],
      approximate_member_count: data.approximate_member_count,
      approximate_presence_count: data.approximate_presence_count,
    }
  } catch (error) {
    console.error("Error fetching Discord server info:", error)
    return null
  }
}

export function extractInviteCode(inviteLink: string): string | null {
  try {
    // Handle various Discord invite URL formats:
    // - https://discord.gg/CODE
    // - https://discord.com/invite/CODE
    // - discord.gg/CODE
    // - Just CODE

    const patterns = [
      /discord\.gg\/([a-zA-Z0-9-]+)/,
      /discord\.com\/invite\/([a-zA-Z0-9-]+)/,
      /discordapp\.com\/invite\/([a-zA-Z0-9-]+)/,
    ]

    for (const pattern of patterns) {
      const match = inviteLink.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    // If no pattern matches, assume it's just the code
    if (/^[a-zA-Z0-9-]+$/.test(inviteLink.trim())) {
      return inviteLink.trim()
    }

    return null
  } catch (error) {
    console.error("Error extracting invite code:", error)
    return null
  }
}

export function getDiscordIconUrl(guildId: string, iconHash: string, size = 256): string {
  // Discord CDN URL format for server icons
  return `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=${size}`
}

export function getDiscordSplashUrl(guildId: string, splashHash: string, size = 512): string {
  // Discord CDN URL format for server splash images
  return `https://cdn.discordapp.com/splashes/${guildId}/${splashHash}.png?size=${size}`
}
