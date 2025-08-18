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
          representative_discord_id?: string | null
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
          representative_discord_id?: string | null
          created_at?: string
          updated_at?: string
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
    }
  }
}

export type Application = Database["public"]["Tables"]["applications"]["Row"]
export type Server = Database["public"]["Tables"]["servers"]["Row"]
export type ManualStats = Database["public"]["Tables"]["manual_stats"]["Row"]
export type ServerMemberCount = Database["public"]["Tables"]["server_member_counts"]["Row"]

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
