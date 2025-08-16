"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { verifyPassword } from "@/app/actions/verify-password"
import AdminContent from "./admin-content"

const ADMIN_PASSWORD = "unified2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if already authenticated in session
    const sessionAuth = sessionStorage.getItem("admin-authenticated")
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
      setDebugInfo("Authenticated from session storage")
      return
    }

    // Check URL parameter authentication
    const urlPassword = searchParams.get("password")
    if (urlPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-authenticated", "true")
      setDebugInfo("Authenticated from URL parameter")
      // Clean up URL
      router.replace("/admin")
      return
    }

    setDebugInfo("No existing authentication found")
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setDebugInfo("Attempting authentication...")

    try {
      // Client-side check first for immediate feedback
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        setDebugInfo("Authentication successful (client-side)")
        return
      }

      // Server-side verification as backup
      const formData = new FormData()
      formData.append("password", password)

      const result = await verifyPassword(formData)

      if (result.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        setDebugInfo("Authentication successful (server-side)")
      } else {
        setError(result.error || "Authentication failed")
        setDebugInfo("Authentication failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Authentication error occurred")
      setDebugInfo("Authentication error: " + String(error))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-authenticated")
    setPassword("")
    setError("")
    setDebugInfo("Logged out")
  }

  if (isAuthenticated) {
    return <AdminContent onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">Enter the admin password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </form>

          {/* Development helper */}
          <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
            <div className="font-semibold mb-1">Development Info:</div>
            <div>
              Password: <code className="bg-white px-1 rounded">unified2024</code>
            </div>
            <div className="mt-1 text-gray-600">Debug: {debugInfo}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
