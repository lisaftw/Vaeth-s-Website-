"use client"
import { useState, useEffect } from "react"
import { verifyPassword } from "@/app/actions/verify-password"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock } from "lucide-react"
import AdminContent from "./admin-content"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isLocked, setIsLocked] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("admin_session")
    const sessionTime = sessionStorage.getItem("admin_session_time")

    if (session === "authenticated" && sessionTime) {
      const sessionAge = Date.now() - Number.parseInt(sessionTime)
      const maxAge = 30 * 60 * 1000 // 30 minutes

      if (sessionAge < maxAge) {
        setIsAuthenticated(true)
      } else {
        // Session expired
        sessionStorage.removeItem("admin_session")
        sessionStorage.removeItem("admin_session_time")
      }
    }
  }, [])

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Add client IP (in a real app, you'd get this from headers)
      formData.append("clientIP", "client_ip")

      const result = await verifyPassword(formData)

      if (result.success) {
        setIsAuthenticated(true)
        // Store session
        sessionStorage.setItem("admin_session", "authenticated")
        sessionStorage.setItem("admin_session_time", Date.now().toString())
      } else {
        setError(result.error || "Authentication failed")
        setIsLocked(result.locked || false)
      }
    } catch (error) {
      setError("Authentication error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_session")
    sessionStorage.removeItem("admin_session_time")
  }

  if (isAuthenticated) {
    return <AdminContent onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/50 border-red-900/30 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
          <p className="text-gray-400">Enter credentials to continue</p>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Enter admin password"
                required
                disabled={isLoading || isLocked}
                className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                <Lock className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
