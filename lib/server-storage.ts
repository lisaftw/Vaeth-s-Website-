// Enhanced server storage system with Discord API integration
import type { Server } from "./data-store"
import { fetchDiscordServerInfo, getDiscordIconUrl, updateServerMemberCounts } from "./discord-api"
import { getManualStats, getServerMemberCounts } from "./manual-stats"

// Main server configuration with Discord integration
export const MAIN_SERVER: Server = {
  name: "Unified Realms HQ",
  description:
    "The official headquarters of the Unified Realms Alliance. Join us for announcements, events, and community discussions with server owners from across the network.",
  members: 50, // Will be updated via Discord API
  invite: "https://discord.gg/yXTrkPPQAK",
  logo: "/logo.png",
  verified: true,
  dateAdded: "2024-01-01T00:00:00.000Z",
  tags: ["Official", "Headquarters", "Main"],
  representativeDiscordId: "unified_realms_official",
}

// Enhanced server interface with Discord data
export interface EnhancedServer extends Server {
  discordId?: string
  discordIcon?: string
  discordFeatures?: string[]
  lastUpdated?: string
  onlineMembers?: number
}

// Storage interface for website servers
export interface WebsiteServerStorage {
  getAllServers(): EnhancedServer[]
  getMainServer(): EnhancedServer
  getPartnerServers(): EnhancedServer[]
  getTotalMembers(): number
  getTotalServers(): number
  addServerToWebsite(server: Server): Promise<void>
  removeServerFromWebsite(index: number): boolean
  updateServerOnWebsite(index: number, server: Server): boolean
  refreshServerData(): Promise<void>
  getServerWithDiscordData(server: Server): Promise<EnhancedServer>
}

class ServerStorageManager implements WebsiteServerStorage {
  private partnerServers: EnhancedServer[] = []
  private mainServerData: EnhancedServer = { ...MAIN_SERVER }
  private lastRefresh: Date = new Date(0)
  private refreshInterval: number = 5 * 60 * 1000 // 5 minutes

  constructor() {
    // Initialize with main server Discord data fetch
    this.initializeMainServer()
  }

  private async initializeMainServer(): Promise<void> {
    try {
      // Get the current member count from manual stats
      const serverMemberCounts = getServerMemberCounts()
      const currentMemberCount = serverMemberCounts["Unified Realms HQ"] || 50

      const discordInfo = await fetchDiscordServerInfo(MAIN_SERVER.invite)
      if (discordInfo) {
        this.mainServerData = {
          ...MAIN_SERVER,
          members: currentMemberCount, // Use the manually managed count
          discordId: discordInfo.id,
          discordIcon: discordInfo.icon,
          discordFeatures: discordInfo.features,
          onlineMembers: discordInfo.approximatePresenceCount,
          lastUpdated: new Date().toISOString(),
          logo: discordInfo.icon ? getDiscordIconUrl(discordInfo.id, discordInfo.icon, 128) : MAIN_SERVER.logo,
        }
        console.log("Main server Discord data updated:", this.mainServerData)
      } else {
        // Fallback to manual stats if Discord API fails
        this.mainServerData = {
          ...MAIN_SERVER,
          members: currentMemberCount,
          lastUpdated: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error("Failed to initialize main server Discord data:", error)
      // Use manual stats as fallback
      const serverMemberCounts = getServerMemberCounts()
      this.mainServerData = {
        ...MAIN_SERVER,
        members: serverMemberCounts["Unified Realms HQ"] || 50,
        lastUpdated: new Date().toISOString(),
      }
    }
  }

  getAllServers(): EnhancedServer[] {
    // Auto-refresh if needed
    if (Date.now() - this.lastRefresh.getTime() > this.refreshInterval) {
      this.refreshServerData()
    }

    // Update main server with current manual stats
    const serverMemberCounts = getServerMemberCounts()
    this.mainServerData.members = serverMemberCounts["Unified Realms HQ"] || this.mainServerData.members

    return [this.mainServerData, ...this.partnerServers]
  }

  getMainServer(): EnhancedServer {
    // Update with current manual stats
    const serverMemberCounts = getServerMemberCounts()
    this.mainServerData.members = serverMemberCounts["Unified Realms HQ"] || this.mainServerData.members
    return this.mainServerData
  }

  getPartnerServers(): EnhancedServer[] {
    return [...this.partnerServers]
  }

  getTotalMembers(): number {
    const manualStats = getManualStats()
    return manualStats.totalMembers
  }

  getTotalServers(): number {
    const manualStats = getManualStats()
    return manualStats.totalServers
  }

  async addServerToWebsite(server: Server): Promise<void> {
    console.log("Adding server to website storage:", server)

    try {
      const enhancedServer = await this.getServerWithDiscordData(server)
      this.partnerServers.push(enhancedServer)
      console.log("Server added with Discord data:", enhancedServer)
      console.log("Total servers on website:", this.getTotalServers())
    } catch (error) {
      console.error("Error adding server with Discord data:", error)
      // Fallback: add server without Discord data
      const fallbackServer: EnhancedServer = {
        ...server,
        dateAdded: server.dateAdded || new Date().toISOString(),
        verified: server.verified || false,
        tags: server.tags || ["Partner"],
        lastUpdated: new Date().toISOString(),
      }
      this.partnerServers.push(fallbackServer)
    }
  }

  removeServerFromWebsite(index: number): boolean {
    if (index >= 0 && index < this.partnerServers.length) {
      const removed = this.partnerServers.splice(index, 1)[0]
      console.log("Removed server from website:", removed)
      return true
    }
    return false
  }

  updateServerOnWebsite(index: number, server: Server): boolean {
    if (index >= 0 && index < this.partnerServers.length) {
      const existingServer = this.partnerServers[index]
      this.partnerServers[index] = {
        ...server,
        dateAdded: existingServer.dateAdded,
        verified: existingServer.verified,
        discordId: existingServer.discordId,
        discordIcon: existingServer.discordIcon,
        discordFeatures: existingServer.discordFeatures,
        lastUpdated: new Date().toISOString(),
      }
      console.log("Updated server on website:", this.partnerServers[index])

      // Refresh Discord data for updated server
      this.getServerWithDiscordData(server).then((enhanced) => {
        this.partnerServers[index] = enhanced
      })

      return true
    }
    return false
  }

  async getServerWithDiscordData(server: Server): Promise<EnhancedServer> {
    try {
      const discordInfo = await fetchDiscordServerInfo(server.invite)
      if (discordInfo) {
        return {
          ...server,
          members: discordInfo.memberCount,
          discordId: discordInfo.id,
          discordIcon: discordInfo.icon,
          discordFeatures: discordInfo.features,
          onlineMembers: discordInfo.approximatePresenceCount,
          dateAdded: server.dateAdded || new Date().toISOString(),
          verified: server.verified || false,
          tags: server.tags || ["Partner"],
          lastUpdated: new Date().toISOString(),
          logo: discordInfo.icon ? getDiscordIconUrl(discordInfo.id, discordInfo.icon, 128) : server.logo,
        }
      }
    } catch (error) {
      console.error("Error fetching Discord data for server:", error)
    }

    // Fallback without Discord data
    return {
      ...server,
      dateAdded: server.dateAdded || new Date().toISOString(),
      verified: server.verified || false,
      tags: server.tags || ["Partner"],
      lastUpdated: new Date().toISOString(),
    }
  }

  async refreshServerData(): Promise<void> {
    console.log("Refreshing all server Discord data...")
    this.lastRefresh = new Date()

    try {
      // Refresh main server
      await this.initializeMainServer()

      // Refresh partner servers
      const updatedPartners = await updateServerMemberCounts(this.partnerServers)
      this.partnerServers = updatedPartners.map((server) => ({
        ...server,
        lastUpdated: new Date().toISOString(),
      }))

      console.log("Server data refresh completed")
    } catch (error) {
      console.error("Error refreshing server data:", error)
    }
  }

  // Sync with main data store
  syncWithDataStore(servers: Server[]): void {
    console.log("Syncing website storage with data store")
    // Convert servers to enhanced servers with existing Discord data
    this.partnerServers = servers.map((server) => {
      const existing = this.partnerServers.find((p) => p.invite === server.invite)
      if (existing) {
        return { ...existing, ...server }
      }
      return {
        ...server,
        dateAdded: server.dateAdded || new Date().toISOString(),
        verified: server.verified || false,
        tags: server.tags || ["Partner"],
        lastUpdated: new Date().toISOString(),
      }
    })
  }

  // Get website statistics
  getWebsiteStats() {
    const manualStats = getManualStats()
    return {
      totalServers: manualStats.totalServers,
      totalMembers: manualStats.totalMembers,
      partnerServers: this.partnerServers.length,
      mainServer: 1,
      securityScore: manualStats.securityScore,
      lastRefresh: this.lastRefresh.toISOString(),
      onlineMembers:
        this.partnerServers.reduce((total, server) => total + (server.onlineMembers || 0), 0) +
        (this.mainServerData.onlineMembers || 0),
    }
  }
}

// Export singleton instance
export const websiteStorage = new ServerStorageManager()

// Helper functions for easy access
export function getWebsiteServers(): EnhancedServer[] {
  return websiteStorage.getAllServers()
}

export function getWebsiteStats() {
  return websiteStorage.getWebsiteStats()
}

export async function addServerToWebsite(server: Server): Promise<void> {
  await websiteStorage.addServerToWebsite(server)
}

export function syncWebsiteWithDataStore(servers: Server[]): void {
  websiteStorage.syncWebsiteWithDataStore(servers)
}

export async function refreshAllServerData(): Promise<void> {
  await websiteStorage.refreshServerData()
}
