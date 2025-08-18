"use server"

const ADMIN_PASSWORD = "unified2024"
const MAX_ATTEMPTS = 3
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

// In-memory storage for failed attempts (in production, use a database)
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function verifyPassword(formData: FormData) {
  try {
    const password = formData.get("password") as string
    const clientIP = (formData.get("clientIP") as string) || "unknown"

    console.log("Password verification attempt for IP:", clientIP)

    // Check if IP is locked out
    const attempts = failedAttempts.get(clientIP)
    if (attempts && attempts.count >= MAX_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
      if (timeSinceLastAttempt < LOCKOUT_TIME) {
        const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 60000)
        return {
          success: false,
          error: `Account locked. Try again in ${remainingTime} minutes.`,
          locked: true,
        }
      } else {
        // Reset attempts after lockout period
        failedAttempts.delete(clientIP)
      }
    }

    if (password === ADMIN_PASSWORD) {
      // Clear failed attempts on successful login
      failedAttempts.delete(clientIP)
      console.log("Password verification successful")

      return {
        success: true,
        message: "Authentication successful",
      }
    } else {
      // Track failed attempt
      const currentAttempts = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 }
      currentAttempts.count += 1
      currentAttempts.lastAttempt = Date.now()
      failedAttempts.set(clientIP, currentAttempts)

      console.log(`Password verification failed for IP: ${clientIP}, attempts: ${currentAttempts.count}`)

      if (currentAttempts.count >= MAX_ATTEMPTS) {
        return {
          success: false,
          error: "Too many failed attempts. Account locked for 15 minutes.",
          locked: true,
        }
      }

      return {
        success: false,
        error: `Invalid password. ${MAX_ATTEMPTS - currentAttempts.count} attempts remaining.`,
        attemptsRemaining: MAX_ATTEMPTS - currentAttempts.count,
      }
    }
  } catch (error) {
    console.error("Error verifying password:", error)
    return {
      success: false,
      error: "Authentication failed",
    }
  }
}
