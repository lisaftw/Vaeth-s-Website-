"use server"

import { getServersData, getStats } from "./data-store"

export interface WebsiteServer {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  verified?: boolean
  dateAdded?: string
  tags?: string[]
  isMainServer?: boolean
}

// Main server configuration
const MAIN_SERVER = {
  name: "Unified Realms",
  description: "The main hub of our alliance - where all realms unite for strategic collaboration and growth.",
  members: 250, // This will be updated with real data
  invite: "yXTrkPPQAK",
  logo: "/logo.png",
  verified: true,
  dateAdded: "2024-01-01",
  tags: ["Main", "Hub", "Alliance"],
  isMainServer: true,
}

export async function getWebsiteServers(): Promise<WebsiteServer[]> {
  try {
    console.log("Getting website servers...")

    // Get partner servers from database (await the async call)
    const partnerServers = await getServersData()
    console.log("Partner servers from DB:", partnerServers)

    // Get current stats for main server (await the async call)
    const stats = await getStats()
    console.log("Stats for main server:", stats)

    // Create main server with updated member count
    const mainServer: WebsiteServer = {
      ...MAIN_SERVER,
      members: stats?.totalMembers || MAIN_SERVER.members,
    }

    // Convert partner servers to website format
    const convertedPartnerServers: WebsiteServer[] = Array.isArray(partnerServers)
      ? partnerServers.map((server) => ({
          name: server.name,
          description: server.description,
          members: server.members,
          invite: server.invite,
          logo: server.logo,
          verified: server.verified || false,
          dateAdded: server.dateAdded,
          tags: server.tags || ["Partner"],
          isMainServer: false,
        }))
      : []

    // Combine main server with partner servers
    const allServers = [mainServer, ...convertedPartnerServers]

    console.log("Final website servers array:", allServers)
    return allServers
  } catch (error) {
    console.error("Error in getWebsiteServers:", error)

    // Return at least the main server if there's an error
    return [
      {
        ...MAIN_SERVER,
        members: 250, // fallback member count
      },
    ]
  }
}

// Helper function to get just partner servers
export async function getPartnerServers(): Promise<WebsiteServer[]> {
  try {
    const servers = await getServersData()
    return Array.isArray(servers)
      ? servers.map((server) => ({
          name: server.name,
          description: server.description,
          members: server.members,
          invite: server.invite,
          logo: server.logo,
          verified: server.verified || false,
          dateAdded: server.dateAdded,
          tags: server.tags || ["Partner"],
          isMainServer: false,
        }))
      : []
  } catch (error) {
    console.error("Error getting partner servers:", error)
    return []
  }
}

// Helper function to get server count
export async function getServerCount(): Promise<number> {
  try {
    const servers = await getWebsiteServers()
    return Array.isArray(servers) ? servers.length : 1
  } catch (error) {
    console.error("Error getting server count:", error)
    return 1
  }
}
