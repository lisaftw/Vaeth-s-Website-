// API client for bot to communicate with website
export class WebsiteAPIClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.WEBSITE_URL || "http://localhost:3000"
    this.apiKey = process.env.BOT_API_KEY || ""
  }

  private async request(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("[APIClient] Request failed:", error)
      throw error
    }
  }

  async updateBump(guildId: string, userId: string) {
    return this.request("/api/bot/sync", {
      action: "update_bump",
      data: { guildId, userId },
    })
  }

  async getServer(guildId: string) {
    return this.request("/api/bot/sync", {
      action: "get_server",
      data: { guildId },
    })
  }

  async updateStats(guildId: string, members: number, onlineMembers: number) {
    return this.request("/api/bot/sync", {
      action: "update_stats",
      data: { guildId, members, onlineMembers },
    })
  }
}
