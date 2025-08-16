"use server"

import { redirect } from "next/navigation"
import { getServers } from "./get-servers"
import { getApplications } from "./get-applications"

export async function bulkVerifyServers(formData: FormData) {
  const password = formData.get("password") as string
  const serverIndices = formData.getAll("serverIndices") as string[]

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const servers = await getServers()

    serverIndices.forEach((indexStr) => {
      const index = Number.parseInt(indexStr)
      if (servers[index]) {
        servers[index].verified = true
      }
    })

    // In a real app, you'd save to database here
    redirect(`/admin?password=${password}&tab=servers&bulk_verified=true`)
  } catch (error) {
    console.error("Error bulk verifying servers:", error)
    redirect(`/admin?password=${password}&tab=servers&error=bulk_verify_failed`)
  }
}

export async function bulkRemoveServers(formData: FormData) {
  const password = formData.get("password") as string
  const serverIndices = formData.getAll("serverIndices") as string[]

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const servers = await getServers()

    // Sort indices in descending order to remove from end first
    const sortedIndices = serverIndices.map((indexStr) => Number.parseInt(indexStr)).sort((a, b) => b - a)

    sortedIndices.forEach((index) => {
      if (servers[index]) {
        servers.splice(index, 1)
      }
    })

    // In a real app, you'd save to database here
    redirect(`/admin?password=${password}&tab=servers&bulk_removed=true`)
  } catch (error) {
    console.error("Error bulk removing servers:", error)
    redirect(`/admin?password=${password}&tab=servers&error=bulk_remove_failed`)
  }
}

export async function bulkApproveApplications(formData: FormData) {
  const password = formData.get("password") as string
  const applicationIndices = formData.getAll("applicationIndices") as string[]

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const applications = await getApplications()

    applicationIndices.forEach((indexStr) => {
      const index = Number.parseInt(indexStr)
      if (applications[index]) {
        applications[index].status = "approved"
        applications[index].reviewedAt = new Date().toISOString()
      }
    })

    // In a real app, you'd save to database here
    redirect(`/admin?password=${password}&tab=applications&bulk_approved=true`)
  } catch (error) {
    console.error("Error bulk approving applications:", error)
    redirect(`/admin?password=${password}&tab=applications&error=bulk_approve_failed`)
  }
}

export async function bulkRejectApplications(formData: FormData) {
  const password = formData.get("password") as string
  const applicationIndices = formData.getAll("applicationIndices") as string[]

  if (password !== "unified2024") {
    redirect("/admin?error=invalid")
    return
  }

  try {
    const applications = await getApplications()

    applicationIndices.forEach((indexStr) => {
      const index = Number.parseInt(indexStr)
      if (applications[index]) {
        applications[index].status = "rejected"
        applications[index].reviewedAt = new Date().toISOString()
      }
    })

    // In a real app, you'd save to database here
    redirect(`/admin?password=${password}&tab=applications&bulk_rejected=true`)
  } catch (error) {
    console.error("Error bulk rejecting applications:", error)
    redirect(`/admin?password=${password}&tab=applications&error=bulk_reject_failed`)
  }
}
