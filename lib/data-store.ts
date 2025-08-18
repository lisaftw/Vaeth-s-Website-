"use server"

import { supabase } from "./supabase"

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
    name: dbServer.name,
    description: dbServer.description,
    members: dbServer.members,
    invite: dbServer.invite,
    logo: dbServer.logo,
    verified: dbServer.verified || false,
    dateAdded: dbServer.created_at,
    tags: dbServer.tags || [],
    representativeDiscordId: dbServer.representative_discord_id,
  }
}

// Data access functions
export async function getApplicationsData(): Promise<Application[]> {
  try {
    console.log("Fetching applications from Supabase...")

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
    console.log("Removing application at index:", index)

    // Get all applications to find the one at the index
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for removal:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    if (!applications || applications.length === 0) {
      throw new Error("No applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToDelete = applications[index]
    const convertedApp = convertApplicationFromDB(applicationToDelete)

    const { error } = await supabase.from("applications").delete().eq("id", applicationToDelete.id)

    if (error) {
      console.error("Error removing application:", error)
      throw new Error(`Failed to remove application: ${error.message}`)
    }

    console.log("Application removed successfully from Supabase")
    return convertedApp
  } catch (error) {
    console.error("Error in removeApplication:", error)
    throw error
  }
}

export async function addServer(server: Server): Promise<void> {
  try {
    console.log("=== ADDING SERVER TO SUPABASE ===")
    console.log("Server data:", server)

    const insertData = {
      name: server.name,
      description: server.description,
      members: server.members,
      invite: server.invite,
      logo: server.logo,
      verified: server.verified || false,
      tags: server.tags || [],
      representative_discord_id: server.representativeDiscordId,
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

export async function removeServer(index: number): Promise<void> {
  try {
    console.log("Removing server at index:", index)

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
    console.log("Approving application at index:", index)

    // Get all applications
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for approval:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    if (!applications || applications.length === 0) {
      throw new Error("No applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToApprove = applications[index]

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

    // Try to update application status if column exists
    try {
      const { error: updateError } = await supabase
        .from("applications")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationToApprove.id)

      if (updateError) {
        console.log("Status column might not exist, deleting application instead")
        // If status update fails, delete the application
        await supabase.from("applications").delete().eq("id", applicationToApprove.id)
      }
    } catch (e) {
      // If status column doesn't exist, delete the application
      await supabase.from("applications").delete().eq("id", applicationToApprove.id)
    }

    console.log("Application approved successfully")
  } catch (error) {
    console.error("Error in approveApplication:", error)
    throw error
  }
}

export async function rejectApplication(index: number): Promise<void> {
  try {
    console.log("Rejecting application at index:", index)

    // Get all applications
    const { data: applications, error: fetchError } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })

    if (fetchError) {
      console.error("Error fetching applications for rejection:", fetchError)
      throw new Error(`Failed to fetch applications: ${fetchError.message}`)
    }

    if (!applications || applications.length === 0) {
      throw new Error("No applications found")
    }

    if (index < 0 || index >= applications.length) {
      throw new Error(`Invalid index: ${index}. Available applications: ${applications.length}`)
    }

    const applicationToReject = applications[index]

    // Try to update application status if column exists
    try {
      const { error } = await supabase
        .from("applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", applicationToReject.id)

      if (error) {
        console.log("Status column might not exist, deleting application instead")
        // If status update fails, delete the application
        await supabase.from("applications").delete().eq("id", applicationToReject.id)
      }
    } catch (e) {
      // If status column doesn't exist, delete the application
      await supabase.from("applications").delete().eq("id", applicationToReject.id)
    }

    console.log("Application rejected successfully")
  } catch (error) {
    console.error("Error in rejectApplication:", error)
    throw error
  }
}

// Get total stats from Supabase
export async function getStats() {
  try {
    const { data, error } = await supabase
      .from("manual_stats")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching stats:", error)
      return {
        totalServers: 1,
        totalMembers: 250,
        securityScore: 100,
        lastUpdated: new Date().toISOString(),
      }
    }

    return {
      totalServers: data.total_servers,
      totalMembers: data.total_members,
      securityScore: data.security_score,
      lastUpdated: data.updated_at,
    }
  } catch (error) {
    console.error("Error in getStats:", error)
    return {
      totalServers: 1,
      totalMembers: 250,
      securityScore: 100,
      lastUpdated: new Date().toISOString(),
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
