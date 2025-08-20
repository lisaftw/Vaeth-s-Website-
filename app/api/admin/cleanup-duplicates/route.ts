import { NextResponse } from "next/server"
import { cleanupDuplicateApplications } from "@/lib/data-store"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    // Verify admin password
    if (password !== "unified2024") {
      return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 })
    }

    const deletedCount = await cleanupDuplicateApplications()

    return NextResponse.json({
      success: true,
      message: `Successfully cleaned up ${deletedCount} duplicate applications`,
      deletedCount,
    })
  } catch (error) {
    console.error("Cleanup duplicates API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error cleaning up duplicates: " + String(error),
      },
      { status: 500 },
    )
  }
}
