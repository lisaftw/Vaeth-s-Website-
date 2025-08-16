"use client"

import type React from "react"

import { CardDescription } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { verifyPassword } from "./actions/verify-password"
import { AdminContent } from "./admin-content"
import { ModernLogo } from "@/components/modern-logo"
import { Shield, Crown, Lock } from "lucide-react"

const ADMIN_PASSWORD = "unified2024"

const mockApplications = [
  {
    id: "1",
    name: "Epic Gaming Server",
    description: "A fantastic gaming community with custom plugins and events",
    members: 1500,
    invite: "https://discord.gg/epic",
    representativeDiscordId: "epicowner#1234",
  },
]

const mockServers = [
  {
    id: "1",
    name: "Alliance Main Hub",
    description: "The main hub for all alliance activities",
    members: 2500,
    invite: "https://discord.gg/alliance",
    verified: true,
    tags: ["Main", "Official"],
    dateAdded: "2024-01-01",
  },
]

export default function AdminPage() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState(mockApplications)
  const [servers, setServers] = useState(mockServers)
  const [passwordInput, setPasswordInput] = useState("")
  const [error, setError] = useState("")
  const [urlInfo, setUrlInfo] = useState({ password: "", tab: "" })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href)
        const urlPassword = url.searchParams.get("password") || ""
        const urlTab = url.searchParams.get("tab") || "applications"

        setUrlInfo({ password: urlPassword, tab: urlTab })
        setActiveTab(urlTab)

        if (urlPassword === ADMIN_PASSWORD) {
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error("URL parsing error:", err)
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("password", passwordInput)

      const result = await verifyPassword(formData)

      if (result.success) {
        setIsAuthenticated(true)
        sessionStorage.setItem("admin-authenticated", "true")
        setPasswordInput("")
      } else {
        setError(result.error || "Invalid password")
      }
    } catch (err) {
      setError("Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-authenticated")
    setPasswordInput("")
    setError("")
  }

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (typeof window !== "undefined" && isAuthenticated) {
      const newUrl = `/admin?password=${ADMIN_PASSWORD}&tab=${tabId}`
      window.history.replaceState({}, "", newUrl)
    }
  }

  const handleApprove = (id: string) => {
    const app = applications.find((a) => a.id === id)
    if (app) {
      const newServer = {
        id: Date.now().toString(),
        name: app.name,
        description: app.description,
        members: app.members,
        invite: app.invite,
        verified: false,
        tags: ["New"],
        dateAdded: new Date().toISOString().split("T")[0],
      }

      setServers((prev) => [...prev, newServer])
      setApplications((prev) => prev.filter((a) => a.id !== id))
      alert(`✅ Approved: ${app.name}`)
    }
  }

  const handleReject = (id: string) => {
    const app = applications.find((a) => a.id === id)
    if (app) {
      setApplications((prev) => prev.filter((a) => a.id !== id))
      alert(`❌ Rejected: ${app.name}`)
    }
  }

  const handleRemoveServer = (id: string) => {
    const server = servers.find((s) => s.id === id)
    if (server && confirm(`Remove ${server.name} from the alliance?`)) {
      setServers((prev) => prev.filter((s) => s.id !== id))
      alert(`🗑️ Removed: ${server.name}`)
    }
  }

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const newServer = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      members: Number.parseInt(formData.get("members") as string),
      invite: formData.get("invite") as string,
      verified: (formData.get("verified") as string) === "on",
      tags: formData.get("tags")?.split(", ").filter(Boolean) || [],
      dateAdded: new Date().toISOString().split("T")[0],
      logo: formData.get("logo") as string,
      representativeDiscordId: formData.get("representativeDiscordId") as string,
    }

    setServers((prev) => [...prev, newServer])
    form.reset()
    alert(`✅ Added: ${newServer.name}`)
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
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-gray-800/50 border-red-900/50 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                placeholder="Enter admin password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
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
