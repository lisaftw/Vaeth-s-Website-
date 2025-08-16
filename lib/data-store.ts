// Simple in-memory data store for demo purposes
// In a real app, this would be a database

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
  console.log("Getting applications data, current count:", applications.length)
  console.log("Applications:", applications)
  return [...applications] // Return a copy
}

export function getServersData(): Server[] {
  console.log("Getting servers data, current count:", servers.length)
  return [...servers] // Return a copy
}

export function addApplication(application: Application): void {
  console.log("Adding application to data store:", application)
  applications.push(application)
  console.log("Applications array after adding:", applications)
  console.log("Total applications now:", applications.length)
}

export function removeApplication(index: number): Application | null {
  console.log("Removing application at index:", index)
  if (index >= 0 && index < applications.length) {
    const removed = applications.splice(index, 1)[0]
    console.log("Removed application:", removed)
    return removed
  }
  console.log("Invalid index for removal:", index)
  return null
}

export function addServer(server: Server): void {
  console.log("Adding server to data store:", server)
  servers.push(server)
  console.log("Total servers now:", servers.length)
}

export function removeServer(index: number): Server | null {
  console.log("Removing server at index:", index)
  if (index >= 0 && index < servers.length) {
    const removed = servers.splice(index, 1)[0]
    console.log("Removed server:", removed)
    return removed
  }
  console.log("Invalid index for removal:", index)
  return null
}

export function approveApplicationToServer(applicationIndex: number): boolean {
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

    console.log("Application approved and moved to servers")
    console.log("New server:", newServer)
    console.log("Remaining applications:", applications.length)
    console.log("Total servers:", servers.length)

    return true
  }
  console.log("Invalid application index for approval:", applicationIndex)
  return false
}
