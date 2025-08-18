"use server"

import { getServersData, type Server } from "@/lib/data-store"

export type { Server }

export async function getServers(): Promise<Server[]> {
  return await getServersData()
}
