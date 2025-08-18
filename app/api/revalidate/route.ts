import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()

    if (path) {
      revalidatePath(path)
    } else {
      // Revalidate all important paths
      revalidatePath("/")
      revalidatePath("/admin")
    }

    return NextResponse.json({
      success: true,
      message: "Cache invalidated",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
