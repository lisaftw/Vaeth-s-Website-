"use server"

import { getApplicationsData, type Application } from "@/lib/data-store"

export type { Application }

export async function getApplications(): Promise<Application[]> {
  return getApplicationsData()
}
