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

// Empty arrays - no mock data
const applications: Application[] = []
const servers: Server[] = []

// Data access functions
export function getApplicationsData(): Application[] {
  return [...applications] // Return a copy
}

export function getServersData(): Server[] {
  return [...servers] // Return a copy
}

export function addApplication(application: Application): void {
  applications.push(application)
}

export function removeApplication(index: number): Application | null {
  if (index >= 0 && index < applications.length) {
    return applications.splice(index, 1)[0]
  }
  return null
}

export function addServer(server: Server): void {
  servers.push(server)
}

export function removeServer(index: number): Server | null {
  if (index >= 0 && index < servers.length) {
    return servers.splice(index, 1)[0]
  }
  return null
}

export function approveApplicationToServer(applicationIndex: number): boolean {
  if (applicationIndex >= 0 && applicationIndex < applications.length) {
    const application = applications[applicationIndex]

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

    return true
  }
  return false
}
