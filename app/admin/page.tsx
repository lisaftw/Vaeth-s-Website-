"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { verifyPassword } from "../actions/verify-password"
import AdminContent from "./admin-content"

const ADMIN_PASSWORD = "unified2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attemptCount, setAttemptCount] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated in session storage
    const authStatus = sessionStorage.getItem("admin-authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }

    // Check URL parameters for authentication
    const urlParams = new URLSearchParams(window.location.search)
    const urlPassword = urlParams.get("password")
    if (urlPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-authenticated", "true")
      // Clean up URL
      router.replace("/admin")
    }

    // Check for lockout status
    const lockoutTime = localStorage.getItem("admin-lockout")
    if (lockoutTime) {
      const lockoutExpiry = Number.parseInt(lockoutTime)
      if (Date.now() < lockoutExpiry) {
        setIsLocked(true)
        const remainingTime = Math.ceil((lockoutExpiry - Date.now()) / 1000 / 60)
        setError(`Account locked. Try again in ${remainingTime} minutes.`)
      } else {
        localStorage.removeItem("admin-lockout")
        localStorage.removeItem("admin-attempts")
      }
    }

    // Get attempt count
    const attempts = localStorage.getItem("admin-attempts")
    if (attempts) {
      setAttemptCount(Number.parseInt(attempts))
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLocked) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Client-side check first for immediate feedback
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        localStorage.removeItem("admin-attempts")
        localStorage.removeItem("admin-lockout")
        return
      }

      // Server-side verification as backup
      const formData = new FormData()
      formData.append("password", password)
      const result = await verifyPassword(formData)

      if (result.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        localStorage.removeItem("admin-attempts")
        localStorage.removeItem("admin-lockout")
      } else {
        // Handle failed attempt
        const newAttemptCount = attemptCount + 1
        setAttemptCount(newAttemptCount)
        localStorage.setItem("admin-attempts", newAttemptCount.toString())

        if (newAttemptCount >= 3) {
          // Lock account for 15 minutes
          const lockoutExpiry = Date.now() + 15 * 60 * 1000
          localStorage.setItem("admin-lockout", lockoutExpiry.toString())
          setIsLocked(true)
          setError("Too many failed attempts. Account locked for 15 minutes.")
        } else {
          setError(`Invalid access code. ${3 - newAttemptCount} attempts remaining.`)
        }
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-authenticated")
    setPassword("")
    setError("")
  }

  if (isAuthenticated) {
    return <AdminContent onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-300">Enter your access code to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Access Code
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter access code"
              required
              disabled={isLocked || isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLocked || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            {isLoading ? "Authenticating..." : isLocked ? "Account Locked" : "Access Admin Panel"}
          </button>
        </form>

        {attemptCount > 0 && attemptCount < 3 && !isLocked && (
          <div className="mt-4 text-center text-yellow-300 text-sm">{3 - attemptCount} attempts remaining</div>
        )}
      </div>
    </div>
  )
}
