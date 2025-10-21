"use server"

import { createClient } from "@/lib/supabase/server"

// Legacy interfaces for backward compatibility
export interface Application {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  representativeDiscordId?: string
  ownerName?: string
  status?: "pending" | "approved" | "rejected"
  submittedAt?: string
  reviewedAt?: string
}

export interface Server {
  id: string // UUID from database
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  verified?: boolean
  dateAdded?: string
  tags?: string[]
  representativeDiscordId?: string
  leadDelegateName?: string
  leadDelegateId?: string
}

// Convert database row to legacy format
function convertApplicationFromDB(dbApp: any): Application {
  console.log("Converting application from DB:", dbApp)

  const converted = {
    name: dbApp.name,
    description: dbApp.description,
    members: dbApp.members,
    invite: dbApp.invite,
    logo: dbApp.logo,
    representativeDiscordId: dbApp.representative_discord_id,
    ownerName: dbApp.owner_name,
    status: dbApp.status || "pending",
    submittedAt: dbApp.created_at,
    reviewedAt: dbApp.reviewed_at,
  }

  console.log("Converted application:", converted)
  return converted
}

function convertServerFromDB(dbServer: any): Server {
  return {
    id: dbServer.id, // Include the database ID
    name: dbServer.name,
    description: dbServer.description,
    members: dbServer.members,
    invite: dbServer.invite,
    logo: dbServer.logo,
    verified: dbServer.verified || false,
    dateAdded: dbServer.created_at,
    tags: dbServer.tags || [],
    representativeDiscordId: dbServer.representative_discord_id,
    leadDelegateName: dbServer.lead_delegate_name,
    leadDelegateId: dbServer.lead_delegate_discord_id,
  }
}

// Data access functions
export async function getApplicationsData(): Promise<Application[]> {
  try {
    console.log("Fetching applications from Supabase...")

    const supabase = await createClient()

    const { data, error } = await supabase.from("applications").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching applications:", error)
      return []
    }

    console.log("Raw applications data:", data)

    // Filter for pending applications (or all if no status column)
    const applications =
      data?.map(convertApplicationFromDB).filter((app) => !app.status || app.status === "pending") || []

    console.log("Fetched applications:", applications.length)
    applications.forEach((app, index) => {
      console.log(`Application ${index}:`, {
        name: app.name,
        representativeDiscordId: app.representativeDiscordId,
        ownerName: app.ownerName,
      })
    })

    return applications
  } catch (error) {
    console.error("Error in getApplicationsData:", error)
    return []
  }
}

export async function getServersData(): Promise<Server[]> {
  try {
    console.log("=== FETCHING SERVERS FROM SUPABASE ===")
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("Environment:", process.env.NODE_ENV)

    const supabase = await createClient()

    const { data, error } = await supabase.from("servers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching servers:", error)
      return []
    }

    console.log("Raw server data from Supabase:", data)

    const servers = data?.map(convertServerFromDB) || []
    console.log("Converted servers:", servers)
    console.log("Total servers found:", servers.length)

    // Log each server for debugging
    servers.forEach((server, index) => {
      console.log(`Server ${index + 1}:`, {
        name: server.name,
        members: server.members,
        invite: server.invite,
        verified: server.verified,
      })
    })

    console.log("=== END SERVERS FETCH ===")
    return servers
  } catch (error) {
    console.error("Error in getServersData:", error)
    return []
  }
}

export async function addApplication(application: Application): Promise<void> {
  try {
    console.log("=== ADDING APPLICATION TO SUPABASE ===")
    console.log("Application data:", application)

    const supabase = await createClient()

    // Check for existing application with same name and invite to prevent duplicates
    const { data: existingApps, error: checkError } = await supabase
      .from("applications")
      .select("id, name, invite")
      .eq("name", application.name)
      .eq("invite", application.invite)

    if (checkError) {
      console.error("Error checking for duplicates:", checkError)
    } else if (existingApps && existingApps.length > 0) {
      console.log("Duplicate application found, skipping insert")
      throw new Error("An application with this name and invite already exists")
    }

    const insertData: any = {
      name: application.name,
      description: application.description,
      members: application.members,
      invite: application.invite,
      created_at: new Date().toISOString(),
    }

    // Add optional fields if they exist
    if (application.logo) {
      insertData.logo = application.logo
    }

    if (application.representativeDiscordId) {
      insertData.representative_discord_id = application.representativeDiscordId
      console.log("Adding representative_discord_id:", application.representativeDiscordId)
    }

    if (application.ownerName) {
      insertData.owner_name = application.ownerName
      console.log("Adding owner_name:", application.ownerName)
    }

    // Try to add status if column exists
    try {
      insertData.status = "pending"
    } catch (e) {
      // Status column might not exist, continuing without it
      console.log("Status column might not exist, continuing without it")
    }

    console.log("Final insert data:", insertData)

    const { data, error } = await supabase.from("applications").insert(insertData).select()

    if (error) {
      console.error("Supabase error adding application:", error)
      throw new Error(`Failed to add application: ${error.message}`)
    }

    console.log("Application added successfully to Supabase:", data)
    console.log("=== END ADD APPLICATION ===")
  } catch (error) {
    console.error("Error in addApplication:", error)
    throw error
  }
}

export async function removeApplication(index: number): Promise<Application | null> {
  try {
    console.log("=== REMOVING APPLICATION ===")
    console.log("Removing application at index:", index)

    const supabase = await createClient()

    // Get all pending applications to find the one at the index
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for removal:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    console.log("Found applications for removal:", applications?.length || 0)

    if (!applications || applications.length === 0) {
      throw new Error("No pending applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToDelete = applications[index]
    console.log("Deleting application:", applicationToDelete.name, "ID:", applicationToDelete.id)

    const { error } = await supabase.from("applications").delete().eq("id", applicationToDelete.id)

    if (error) {
      console.error("Error removing application:", error)
      throw new Error(`Failed to remove application: ${error.message}`)
    }

    console.log("Application removed successfully from Supabase")
    console.log("=== END REMOVE APPLICATION ===")

    return convertApplicationFromDB(applicationToDelete)
  } catch (error) {
    console.error("Error in removeApplication:", error)
    throw error
  }
}

export async function addServer(server: Server): Promise<void> {
  try {
    console.log("=== ADDING SERVER TO SUPABASE ===")
    console.log("Server data:", server)

    const supabase = await createClient()

    const insertData = {
      name: server.name,
      description: server.description,
      members: server.members,
      invite: server.invite,
      logo: server.logo,
      verified: server.verified || false,
      tags: server.tags || [],
      representative_discord_id: server.representativeDiscordId,
      lead_delegate_name: server.leadDelegateName,
      lead_delegate_discord_id: server.leadDelegateId,
      created_at: new Date().toISOString(),
    }

    console.log("Insert data:", insertData)

    const { data, error } = await supabase.from("servers").insert(insertData).select()

    if (error) {
      console.error("Supabase error adding server:", error)
      throw new Error(`Failed to add server: ${error.message}`)
    }

    console.log("Server added successfully to Supabase:", data)
    console.log("=== END ADD SERVER ===")
  } catch (error) {
    console.error("Error in addServer:", error)
    throw error
  }
}

export async function removeServerById(serverId: string): Promise<void> {
  try {
    console.log("[v0] Removing server with ID:", serverId)

    const supabase = await createClient()

    const { error } = await supabase.from("servers").delete().eq("id", serverId)

    if (error) {
      console.error("[v0] Error removing server:", error)
      throw new Error(`Failed to remove server: ${error.message}`)
    }

    console.log("[v0] Server removed successfully from Supabase")
  } catch (error) {
    console.error("[v0] Error in removeServerById:", error)
    throw error
  }
}

export async function updateServerById(serverId: string, updates: Partial<Server>): Promise<void> {
  try {
    console.log("[v0] Updating server with ID:", serverId, updates)

    const supabase = await createClient()

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (updates.name !== undefined) updateData.name = updates.name
    if (updates.description !== undefined) updateData.description = updates.description
    if (updates.members !== undefined) updateData.members = updates.members
    if (updates.invite !== undefined) updateData.invite = updates.invite
    if (updates.logo !== undefined) updateData.logo = updates.logo
    if (updates.verified !== undefined) updateData.verified = updates.verified
    if (updates.tags !== undefined) updateData.tags = updates.tags
    if (updates.representativeDiscordId !== undefined)
      updateData.representative_discord_id = updates.representativeDiscordId
    if (updates.leadDelegateName !== undefined) updateData.lead_delegate_name = updates.leadDelegateName
    if (updates.leadDelegateId !== undefined) updateData.lead_delegate_discord_id = updates.leadDelegateId

    console.log("[v0] Update data:", updateData)

    const { error } = await supabase.from("servers").update(updateData).eq("id", serverId)

    if (error) {
      console.error("[v0] Error updating server:", error)
      throw new Error(`Failed to update server: ${error.message}`)
    }

    console.log("[v0] Server updated successfully in Supabase")
  } catch (error) {
    console.error("[v0] Error in updateServerById:", error)
    throw error
  }
}

export async function removeServer(index: number): Promise<void> {
  try {
    console.log("Removing server at index:", index)

    const supabase = await createClient()

    // Get all servers to find the one at the index
    const { data: servers, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching servers for removal:", fetchError)
      throw new Error(`Failed to fetch servers: ${fetchError.message}`)
    }

    if (!servers || servers.length === 0) {
      throw new Error("No servers found")
    }

    if (index < 0 || index >= servers.length) {
      console.error(`Invalid server index: ${index}. Available servers: ${servers.length}`)
      console.error(
        "Available servers:",
        servers.map((s, i) => `${i}: ${s.name}`),
      )
      throw new Error(`Invalid index: ${index}. Available servers: ${servers.length}`)
    }

    const serverToDelete = servers[index]
    console.log(`Deleting server: ${serverToDelete.name} (ID: ${serverToDelete.id})`)

    const { error } = await supabase.from("servers").delete().eq("id", serverToDelete.id)

    if (error) {
      console.error("Error removing server:", error)
      throw new Error(`Failed to remove server: ${error.message}`)
    }

    console.log("Server removed successfully from Supabase")
  } catch (error) {
    console.error("Error in removeServer:", error)
    throw error
  }
}

export async function updateServer(index: number, server: Server): Promise<void> {
  try {
    console.log("Updating server at index:", index, server)

    const supabase = await createClient()

    // Get all servers to find the one at the index
    const { data: servers, error: fetchError } = await supabase
      .from("servers")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching servers for update:", fetchError)
      throw new Error(`Failed to fetch servers: ${fetchError.message}`)
    }

    if (!servers || servers.length === 0) {
      throw new Error("No servers found")
    }

    if (index < 0 || index >= servers.length) {
      throw new Error(`Invalid index: ${index}. Available servers: ${servers.length}`)
    }

    const serverToUpdate = servers[index]

    const { error } = await supabase
      .from("servers")
      .update({
        name: server.name,
        description: server.description,
        members: server.members,
        invite: server.invite,
        logo: server.logo,
        verified: server.verified || false,
        tags: server.tags || [],
        representative_discord_id: server.representativeDiscordId,
        lead_delegate_name: server.leadDelegateName,
        lead_delegate_discord_id: server.leadDelegateId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", serverToUpdate.id)

    if (error) {
      console.error("Error updating server:", error)
      throw new Error(`Failed to update server: ${error.message}`)
    }

    console.log("Server updated successfully in Supabase")
  } catch (error) {
    console.error("Error in updateServer:", error)
    throw error
  }
}

export async function approveApplication(index: number): Promise<void> {
  try {
    console.log("=== APPROVING APPLICATION ===")
    console.log("Approving application at index:", index)

    const supabase = await createClient()

    // Get all pending applications
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for approval:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    if (!applications || applications.length === 0) {
      throw new Error("No pending applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToApprove = applications[index]
    console.log("Approving application:", applicationToApprove.name)

    // Add to servers table
    const { error: addError } = await supabase.from("servers").insert({
      name: applicationToApprove.name,
      description: applicationToApprove.description,
      members: applicationToApprove.members,
      invite: applicationToApprove.invite,
      logo: applicationToApprove.logo,
      verified: false,
      tags: ["Partner"],
      representative_discord_id: applicationToApprove.representative_discord_id,
    })

    if (addError) {
      console.error("Error adding approved server:", addError)
      throw new Error(`Failed to add approved server: ${addError.message}`)
    }

    // Update application status to approved
    const { error: updateError } = await supabase
      .from("applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationToApprove.id)

    if (updateError) {
      console.error("Error updating application status:", updateError)
      // Don't throw error here, server was already added successfully
    }

    console.log("Application approved successfully")
    console.log("=== END APPROVE APPLICATION ===")
  } catch (error) {
    console.error("Error in approveApplication:", error)
    throw error
  }
}

export async function rejectApplication(index: number): Promise<void> {
  try {
    console.log("=== REJECTING APPLICATION ===")
    console.log("Rejecting application at index:", index)

    const supabase = await createClient()

    // Get all pending applications
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for rejection:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    if (!applications || applications.length === 0) {
      throw new Error("No pending applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToReject = applications[index]
    console.log("Rejecting application:", applicationToReject.name)

    // Update application status to rejected
    const { error } = await supabase
      .from("applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", applicationToReject.id)

    if (error) {
      console.error("Error rejecting application:", error)
      throw new Error(`Failed to reject application: ${error.message}`)
    }

    console.log("Application rejected successfully")
    console.log("=== END REJECT APPLICATION ===")
  } catch (error) {
    console.error("Error in rejectApplication:", error)
    throw error
  }
}

// Get total stats from Supabase - Fixed to use correct column names
export async function getStats() {
  try {
    console.log("=== FETCHING STATS FROM SUPABASE ===")

    const supabase = await createClient()
    console.log("Supabase client configured:", !!supabase)

    // First check if manual_stats table exists and has data
    const { data, error } = await supabase
      .from("manual_stats")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("Supabase error fetching stats:", error)
      console.log("Falling back to calculated stats due to error:", error.message)

      // Return calculated stats with error info
      return await calculateStatsFromTables()
    }

    // If no data found, calculate from tables
    if (!data || data.length === 0) {
      console.log("No stats data found in manual_stats table, calculating from tables")
      return await calculateStatsFromTables()
    }

    const statsData = data[0]
    console.log("Retrieved manual stats data:", statsData)

    return {
      totalServers: statsData.total_servers || 1,
      totalMembers: statsData.total_members || 250,
      securityScore: statsData.security_score || 100,
      lastUpdated: statsData.updated_at || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Critical error in getStats:", error)
    return await calculateStatsFromTables()
  }
}

// Helper function to calculate stats from actual tables
async function calculateStatsFromTables() {
  try {
    console.log("Calculating stats from database tables...")

    const supabase = await createClient()

    // Get server count and total members from servers table (no status column filter)
    const { data: serversData, error: serversError } = await supabase.from("servers").select("members")

    let totalServers = 1 // Default to 1 (main server)
    let totalMembers = 250 // Default member count

    if (!serversError && serversData) {
      totalServers = serversData.length + 1 // +1 for main server
      const partnerMembers = serversData.reduce((sum, server) => sum + (server.members || 0), 0)
      totalMembers = partnerMembers + 250 // Add main server members
      console.log("Calculated from servers table:", { totalServers, totalMembers })
    } else {
      console.error("Error fetching servers for calculation:", serversError)
    }

    return {
      totalServers,
      totalMembers,
      securityScore: 100,
      lastUpdated: new Date().toISOString(),
      error: serversError ? "Using fallback data due to database error" : "Calculated from database",
    }
  } catch (error) {
    console.error("Error calculating stats from tables:", error)
    return {
      totalServers: 1,
      totalMembers: 250,
      securityScore: 100,
      lastUpdated: new Date().toISOString(),
      error: `Critical error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function approveApplicationToServer(index: number): Promise<boolean> {
  try {
    await approveApplication(index)
    return true
  } catch (error) {
    console.error("Error in approveApplicationToServer:", error)
    return false
  }
}

// Clean up duplicate applications
export async function cleanupDuplicateApplications(): Promise<number> {
  try {
    console.log("=== CLEANING UP DUPLICATE APPLICATIONS ===")

    const supabase = await createClient()

    // Get all applications
    const { data: applications, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: true }) // Oldest first

    if (error) {
      console.error("Error fetching applications for cleanup:", error)
      return 0
    }

    if (!applications || applications.length === 0) {
      console.log("No applications found")
      return 0
    }

    // Group by name and invite to find duplicates
    const seen = new Map<string, any>()
    const duplicates: any[] = []

    for (const app of applications) {
      const key = `${app.name}|${app.invite}`
      if (seen.has(key)) {
        duplicates.push(app)
      } else {
        seen.set(key, app)
      }
    }

    console.log(`Found ${duplicates.length} duplicate applications`)

    // Delete duplicates
    let deletedCount = 0
    for (const duplicate of duplicates) {
      const { error: deleteError } = await supabase.from("applications").delete().eq("id", duplicate.id)

      if (deleteError) {
        console.error("Error deleting duplicate:", deleteError)
      } else {
        deletedCount++
        console.log(`Deleted duplicate: ${duplicate.name}`)
      }
    }

    console.log(`Cleaned up ${deletedCount} duplicate applications`)
    console.log("=== END CLEANUP ===")
    return deletedCount
  } catch (error) {
    console.error("Error in cleanupDuplicateApplications:", error)
    return 0
  }
}

// Debug function
export async function debugDataStore(): Promise<void> {
  try {
    console.log("=== DATA STORE DEBUG ===")

    const servers = await getServersData()
    const applications = await getApplicationsData()

    console.log("Current servers:", servers.length)
    servers.forEach((server, index) => {
      console.log(`  ${index}: ${server.name} (${server.members} members)`)
    })

    console.log("Current applications:", applications.length)
    applications.forEach((app, index) => {
      console.log(`  ${index}: ${app.name} (${app.status || "no status"})`)
    })

    console.log("=== END DEBUG ===")
  } catch (error) {
    console.error("Error in debugDataStore:", error)
  }
}
