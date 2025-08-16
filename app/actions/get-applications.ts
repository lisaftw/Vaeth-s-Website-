"use server"

import { getApplicationsData, type Application } from "@/lib/data-store"

export type { Application }

export async function getApplications(): Promise<Application[]> {
  console.log("getApplications action called")
  const applications = getApplicationsData()
  console.log("Retrieved applications:", applications)
  return applications
}
