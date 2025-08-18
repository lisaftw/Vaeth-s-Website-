import { NextResponse } from "next/server"
import { getApplicationsData } from "@/lib/data-store"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("=== DEBUG APPLICATIONS API ===")

    // Test Supabase connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from("applications")
      .select("count", { count: "exact", head: true })

    console.log("Supabase connection test:", { connectionTest, connectionError })

    // Get raw applications data
    const { data: rawApplications, error: rawError } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("Raw applications data:", rawApplications)
    console.log("Raw applications error:", rawError)

    // Get processed applications data
    const processedApplications = await getApplicationsData()
    console.log("Processed applications:", processedApplications)

    const debugInfo = {
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      connectionTest: connectionError ? { error: connectionError } : { success: true },
      rawApplicationsCount: rawApplications?.length || 0,
      rawApplications: rawApplications || [],
      processedApplicationsCount: processedApplications.length,
      processedApplications,
      hasDiscordWebhook: !!process.env.DISCORD_WEBHOOK_URL,
    }

    console.log("=== END DEBUG APPLICATIONS ===")

    return NextResponse.json(debugInfo)
  } catch (error) {
    console.error("Debug applications API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
