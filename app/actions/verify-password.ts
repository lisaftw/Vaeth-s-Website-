"use server"

const ADMIN_PASSWORD = "UnifiedRealms2024!"
const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

// In-memory storage for failed attempts (in production, use a database)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function verifyPassword(formData: FormData) {
  try {
    const password = formData.get("password") as string
    const clientIP = (formData.get("clientIP") as string) || "unknown"

    console.log("Password verification attempt from:", clientIP)

    // Check if IP is locked out
    const attempts = failedAttempts.get(clientIP)
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000)
        return {
          success: false,
          error: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
          locked: true,
        }
      } else {
        // Reset attempts after lockout period
        failedAttempts.delete(clientIP)
      }
    }

    if (password === ADMIN_PASSWORD) {
      console.log("Password verification successful")
      // Reset failed attempts on successful login
      failedAttempts.delete(clientIP)
      return {
        success: true,
        message: "Authentication successful",
      }
    } else {
      console.log("Password verification failed")

      // Track failed attempt
      const currentAttempts = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      currentAttempts.count += 1
      currentAttempts.lastAttempt = Date.now()
      failedAttempts.set(clientIP, currentAttempts)

      const remainingAttempts = MAX_ATTEMPTS - currentAttempts.count

      if (remainingAttempts <= 0) {
        return {
          success: false,
          error: `Account locked due to too many failed attempts. Try again in 15 minutes.`,
          locked: true,
        }
      }

      return {
        success: false,
        error: `Invalid password. ${remainingAttempts} attempts remaining.`,
        remainingAttempts,
      }
    }
  } catch (error) {
    console.error("Error verifying password:", error)
    return {
      success: false,
      error: "Authentication error occurred",
    }
  }
}
