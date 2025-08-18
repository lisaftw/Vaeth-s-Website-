// Simple in-memory data store for demo purposes
// In a real app, this would be a database

import { websiteStorage, syncWebsiteWithDataStore } from "./server-storage"

export interface Application {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  representativeDiscordId?: string
}

export interface Server {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  verified?: boolean
  dateAdded?: string
  tags?: string[]
  representativeDiscordId?: string
}

// Initialize with empty arrays
const applications: Application[] = []
const servers: Server[] = []

// Data access functions
export function getApplicationsData(): Application[] {
  console.log("=== GET APPLICATIONS DATA ===")
  console.log("Getting applications data, current count:", applications.length)
  console.log("Applications:", applications)
  return [...applications] // Return a copy
}

export function getServersData(): Server[] {
  console.log("=== GET SERVERS DATA ===")
  console.log("Getting servers data, current count:", servers.length)
  console.log("Servers:", servers)
  return [...servers] // Return a copy
}

export function addApplication(application: Application): void {
  console.log("=== ADD APPLICATION ===")
  console.log("Adding application to data store:", application)
  applications.push(application)
  console.log("Applications array after adding:", applications)
  console.log("Total applications now:", applications.length)
}

export function removeApplication(index: number): Application | null {
  console.log("=== REMOVE APPLICATION ===")
  console.log("Removing application at index:", index)
  if (index >= 0 && index < applications.length) {
    const removed = applications.splice(index, 1)[0]
    console.log("Removed application:", removed)
    return removed
  }
  console.log("Invalid index for removal:", index)
  return null
}

export async function addServer(server: Server): Promise<void> {
  console.log("=== ADD SERVER TO DATA STORE ===")
  console.log("Adding server to data store:", server)
  console.log("Current servers count before adding:", servers.length)

  servers.push(server)

  console.log("Server added to local array")
  console.log("Current servers count after adding:", servers.length)
  console.log("Updated servers array:", servers)

  try {
    // Sync with website storage (with Discord API integration)
    console.log("Syncing with website storage...")
    await websiteStorage.addServerToWebsite(server)
    console.log("Website storage sync completed")
  } catch (error) {
    console.error("Error syncing with website storage:", error)
    // Don't fail the operation if website sync fails
  }

  console.log("Total servers now:", servers.length)
  console.log("Total servers on website:", websiteStorage.getTotalServers())
  console.log("=== ADD SERVER TO DATA STORE COMPLETE ===")
}

export function removeServer(index: number): Server | null {
  console.log("=== REMOVE SERVER ===")
  console.log("Removing server at index:", index)
  if (index >= 0 && index < servers.length) {
    const removed = servers.splice(index, 1)[0]

    // Sync with website storage
    syncWebsiteWithDataStore(servers)

    console.log("Removed server:", removed)
    return removed
  }
  console.log("Invalid index for removal:", index)
  return null
}

export async function approveApplicationToServer(applicationIndex: number): Promise<boolean> {
  console.log("=== APPROVE APPLICATION ===")
  console.log("Approving application at index:", applicationIndex)
  if (applicationIndex >= 0 && applicationIndex < applications.length) {
    const application = applications[applicationIndex]
    console.log("Application to approve:", application)

    // Convert application to server
    const newServer: Server = {
      name: application.name,
      description: application.description,
      members: application.members,
      invite: application.invite,
      logo: application.logo,
      representativeDiscordId: application.representativeDiscordId,
      verified: false,
      dateAdded: new Date().toISOString(),
      tags: ["New Member"],
    }

    // Add to servers and remove from applications
    servers.push(newServer)
    applications.splice(applicationIndex, 1)

    try {
      // Sync with website storage (with Discord API integration)
      await websiteStorage.addServerToWebsite(newServer)
    } catch (error) {
      console.error("Error syncing approved server with website storage:", error)
    }

    console.log("Application approved and moved to servers")
    console.log("New server:", newServer)
    console.log("Remaining applications:", applications.length)
    console.log("Total servers:", servers.length)
    console.log("Total servers on website:", websiteStorage.getTotalServers())

    return true
  }
  console.log("Invalid application index for approval:", applicationIndex)
  return false
}

// Get total stats (now uses website storage with Discord API data)
export function getStats() {
  return websiteStorage.getWebsiteStats()
}
