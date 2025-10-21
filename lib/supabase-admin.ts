import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  console.log("[v0] Creating admin client...")
  console.log("[v0] Supabase URL:", supabaseUrl ? "Set" : "Missing")
  console.log(
    "[v0] Service Role Key:",
    supabaseServiceKey ? "Set (length: " + supabaseServiceKey.length + ")" : "Missing",
  )

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase admin credentials")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
