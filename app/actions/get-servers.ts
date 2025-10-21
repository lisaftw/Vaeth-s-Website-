"use server"

import { getServersData } from "@/lib/data-store"

export interface ServerData {
  id: string
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

export async function getServers(): Promise<ServerData[]> {
  return await getServersData()
}
