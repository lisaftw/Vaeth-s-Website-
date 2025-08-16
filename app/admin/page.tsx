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
import { ModernLogo } from "@/components/modern-logo"
import { Shield, Crown, Lock } from "lucide-react"

const ADMIN_PASSWORD = "unified2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)

    // Check if already authenticated in session
    const sessionAuth = sessionStorage.getItem("admin-authenticated")
    if (sessionAuth === "true") {
      setIsAuthenticated(true)
      return
    }

    // Check URL parameter authentication
    const urlPassword = searchParams.get("password")
    if (urlPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin-authenticated", "true")
      // Clean up URL
      router.replace("/admin")
      return
    }
  }, [searchParams, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Client-side check first for immediate feedback
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        return
      }

      // Server-side verification as backup
      const formData = new FormData()
      formData.append("password", password)

      const result = await verifyPassword(formData)

      if (result.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Authentication error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-authenticated")
    setPassword("")
    setError("")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <AdminContent />
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.1),transparent_50%)]"></div>

      <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="mb-6">
            <ModernLogo size="md" animated={true} className="mx-auto" />
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-red-900/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Admin Access
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">Secure portal for alliance management</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-red-400 font-semibold flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Access Code
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800/50 border-red-900/50 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Enter admin password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-red-400" />
                  {error}
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-3 font-semibold shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Access Control Panel
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-red-900/30 text-center">
            <p className="text-gray-500 text-sm">Unauthorized access is strictly prohibited</p>
            <div className="flex items-center justify-center mt-2 text-red-400/70">
              <Shield className="w-4 h-4 mr-1" />
              <span className="text-xs font-mono">SECURE CONNECTION</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
