import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!")
  console.error("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          name: string
          description: string
          members: number
          invite: string
          logo: string | null
          representative_discord_id: string | null
          owner_name: string | null
          owner_id: string | null
          status: "pending" | "approved" | "rejected"
          created_at: string
          updated_at: string
          reviewed_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          members: number
          invite: string
          logo?: string | null
          representative_discord_id?: string | null
          owner_name?: string | null
          owner_id?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          members?: number
          invite?: string
          logo?: string | null
          representative_discord_id?: string | null
          owner_name?: string | null
          owner_id?: string | null
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          updated_at?: string
          reviewed_at?: string | null
        }
      }
      servers: {
        Row: {
          id: string
          name: string
          description: string
          members: number
          invite: string
          logo: string | null
          verified: boolean
          date_added: string
          tags: string[]
          representative_discord_id: string | null
          discord_id: string | null
          discord_icon: string | null
          discord_features: string[]
          online_members: number
          owner_id: string | null
          lead_delegate_discord_id: string | null
          lead_delegate_name: string | null
          last_bump: string | null
          bump_count: number
          auto_update_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          members: number
          invite: string
          logo?: string | null
          verified?: boolean
          date_added?: string
          tags?: string[]
          representative_discord_id?: string | null
          discord_id?: string | null
          discord_icon?: string | null
          discord_features?: string[]
          online_members?: number
          owner_id?: string | null
          lead_delegate_discord_id?: string | null
          lead_delegate_name?: string | null
          last_bump?: string | null
          bump_count?: number
          auto_update_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          members?: number
          invite?: string
          logo?: string | null
          verified?: boolean
          date_added?: string
          tags?: string[]
          representative_discord_id?: string | null
          discord_id?: string | null
          discord_icon?: string | null
          discord_features?: string[]
          online_members?: number
          owner_id?: string | null
          lead_delegate_discord_id?: string | null
          lead_delegate_name?: string | null
          last_bump?: string | null
          bump_count?: number
          auto_update_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      manual_stats: {
        Row: {
          id: string
          total_servers: number
          total_members: number
          security_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          total_servers: number
          total_members: number
          security_score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          total_servers?: number
          total_members?: number
          security_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      server_member_counts: {
        Row: {
          id: string
          server_name: string
          member_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          server_name: string
          member_count: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          server_name?: string
          member_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      server_owners: {
        Row: {
          id: string
          discord_id: string
          username: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          discord_id: string
          username: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          discord_id?: string
          username?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      server_bumps: {
        Row: {
          id: string
          server_id: string
          bumped_by: string
          bumped_at: string
          bump_type: string
        }
        Insert: {
          id?: string
          server_id: string
          bumped_by: string
          bumped_at?: string
          bump_type?: string
        }
        Update: {
          id?: string
          server_id?: string
          bumped_by?: string
          bumped_at?: string
          bump_type?: string
        }
      }
      server_update_logs: {
        Row: {
          id: string
          server_id: string
          updated_by: string
          field_updated: string
          old_value: string | null
          new_value: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          server_id: string
          updated_by: string
          field_updated: string
          old_value?: string | null
          new_value?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          server_id?: string
          updated_by?: string
          field_updated?: string
          old_value?: string | null
          new_value?: string | null
          updated_at?: string
        }
      }
    }
  }
}

export type Application = Database["public"]["Tables"]["applications"]["Row"]
export type Server = Database["public"]["Tables"]["servers"]["Row"]
export type ManualStats = Database["public"]["Tables"]["manual_stats"]["Row"]
export type ServerMemberCount = Database["public"]["Tables"]["server_member_counts"]["Row"]
export type ServerOwner = Database["public"]["Tables"]["server_owners"]["Row"]
export type ServerBump = Database["public"]["Tables"]["server_bumps"]["Row"]
export type ServerUpdateLog = Database["public"]["Tables"]["server_update_logs"]["Row"]

// Test connection function
export async function testSupabaseConnection() {
  try {
    console.log("Testing Supabase connection...")
    console.log("URL:", supabaseUrl)

    const { data, error } = await supabase.from("servers").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    console.log("Supabase connection successful. Server count:", data)
    return { success: true, count: data }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { success: false, error: String(error) }
  }
}
