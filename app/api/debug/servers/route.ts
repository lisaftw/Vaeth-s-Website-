import { NextResponse } from "next/server"
import { getWebsiteServers } from "@/lib/server-storage"
import { getServersData } from "@/lib/data-store"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("=== DEBUG API ROUTE ===")

    // Test Supabase connection
    const connectionTest = await testSupabaseConnection()
    console.log("Connection test result:", connectionTest)

    // Get raw server data
    const rawServers = await getServersData()
    console.log("Raw servers from database:", rawServers)

    // Get website servers
    const websiteServers = await getWebsiteServers()
    console.log("Website servers:", websiteServers)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      connectionTest,
      rawServersCount: rawServers.length,
      rawServers,
      websiteServersCount: websiteServers.length,
      websiteServers,
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
