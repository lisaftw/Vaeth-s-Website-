"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, Clock, TrendingUp, Shield, Users, Edit, Settings, ExternalLink, LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Server {
  id: string
  name: string
  description: string
  invite: string
  members: number
  logo?: string
  lead_delegate_name?: string
  lead_delegate_discord_id?: string
  auto_update_enabled: boolean
  last_bump?: string
  bump_count: number
  created_at: string
}

export default function MyServerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bumping, setBumping] = useState(false)
  const [server, setServer] = useState<Server | null>(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")
  const [canBump, setCanBump] = useState(true)
  const [nextBumpTime, setNextBumpTime] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    invite: "",
    logo: "",
    members: 0,
    leadDelegateName: "",
    leadDelegateDiscordId: "",
    autoUpdateEnabled: true,
  })

  useEffect(() => {
    loadServer()
  }, [])

  useEffect(() => {
    if (server?.id) {
      checkBumpStatus()
    }
  }, [server?.id])

  useEffect(() => {
    // Update countdown timer every minute
    if (!canBump && nextBumpTime) {
      const interval = setInterval(() => {
        updateTimeRemaining()
      }, 60000) // Update every minute

      return () => clearInterval(interval)
    }
  }, [canBump, nextBumpTime])

  const updateTimeRemaining = () => {
    if (!nextBumpTime) return

    const now = new Date()
    const next = new Date(nextBumpTime)
    const diff = next.getTime() - now.getTime()

    if (diff <= 0) {
      setCanBump(true)
      setTimeRemaining(null)
      return
    }

    const hours = Math.floor(diff / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))
    setTimeRemaining(`${hours}h ${minutes}m`)
  }

  const loadServer = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/my-server")

      if (response.status === 401) {
        router.push("/my-server/login")
        return
      }

      if (!response.ok) {
        throw new Error("Failed to load server")
      }

      const data = await response.json()

      if (data.servers && data.servers.length > 0) {
        const serverData = data.servers[0]
        setServer(serverData)
        setFormData({
          name: serverData.name || "",
          description: serverData.description || "",
          invite: serverData.invite || "",
          logo: serverData.logo || "",
          members: serverData.members || 0,
          leadDelegateName: serverData.lead_delegate_name || "",
          leadDelegateDiscordId: serverData.lead_delegate_discord_id || "",
          autoUpdateEnabled: serverData.auto_update_enabled ?? true,
        })
      } else {
        showMessage("No servers found. Please apply first.", "error")
      }
    } catch (error) {
      console.error("Error loading server:", error)
      showMessage("Failed to load server data", "error")
    } finally {
      setLoading(false)
    }
  }

  const checkBumpStatus = async () => {
    if (!server?.id) return

    try {
      const response = await fetch(`/api/my-server/can-bump?serverId=${server.id}`)
      const data = await response.json()

      setCanBump(data.canBump)
      if (data.nextBumpTime) {
        setNextBumpTime(data.nextBumpTime)
        updateTimeRemaining()
      }
    } catch (error) {
      console.error("Error checking bump status:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!server?.id) return

    setSaving(true)
    showMessage("", "success")

    try {
      const response = await fetch("/api/my-server/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: server.id,
          updates: {
            name: formData.name,
            description: formData.description,
            invite: formData.invite,
            logo: formData.logo,
            members: Number.parseInt(formData.members.toString()),
            leadDelegateName: formData.leadDelegateName,
            leadDelegateDiscordId: formData.leadDelegateDiscordId,
            autoUpdateEnabled: formData.autoUpdateEnabled,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        showMessage(data.message, "success")
        await loadServer()
      } else {
        showMessage(data.error || "Failed to update server", "error")
      }
    } catch (error) {
      console.error("Error updating server:", error)
      showMessage("Failed to update server", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleBump = async () => {
    if (!server?.id || !canBump) return

    setBumping(true)
    showMessage("", "success")

    try {
      const response = await fetch("/api/my-server/bump", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: server.id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        showMessage("Server bumped successfully! 🚀", "success")
        await loadServer()
        await checkBumpStatus()
      } else {
        showMessage(data.message || "Failed to bump server", "error")
      }
    } catch (error) {
      console.error("Error bumping server:", error)
      showMessage("Failed to bump server", "error")
    } finally {
      setBumping(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/my-server/logout", { method: "POST" })
      router.push("/my-server/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    if (msg) {
      setTimeout(() => setMessage(""), 5000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your server...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-red-900/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">My Server Dashboard</h1>
                <p className="text-sm text-gray-400">Manage your alliance server</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <Link href="/">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" className="text-gray-400 hover:text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              messageType === "success"
                ? "bg-green-950/50 border-green-700 text-green-300"
                : "bg-red-950/50 border-red-700 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{server?.members.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-400 mt-2">Current member count</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Bumps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{server?.bump_count || 0}</p>
              <p className="text-sm text-gray-400 mt-2">Total bumps</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Last Bump
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold text-white">
                {server?.last_bump
                  ? new Date(server.last_bump).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {canBump ? "Ready to bump!" : `Next bump in ${timeRemaining}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Bump Card */}
          <Card className="bg-gradient-to-br from-yellow-950/50 to-gray-800/50 border-yellow-700/50 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Bump Server
              </CardTitle>
              <CardDescription className="text-gray-300">
                Boost your server's visibility in the alliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Bump Status:</p>
                {canBump ? (
                  <Badge className="bg-green-600 text-white">Ready to Bump</Badge>
                ) : (
                  <div>
                    <Badge className="bg-yellow-600 text-white mb-2">On Cooldown</Badge>
                    <p className="text-xs text-gray-400">Next bump in: {timeRemaining}</p>
                  </div>
                )}
              </div>
              <Button
                onClick={handleBump}
                disabled={!canBump || bumping}
                className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white"
              >
                {bumping ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Bumping...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Bump Now
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-400 text-center">
                Bumping places your server at the top of the list for 2 hours
              </p>
            </CardContent>
          </Card>

          {/* Server Info Form */}
          <Card className="bg-gray-800/50 border-gray-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-red-400" />
                Server Information
              </CardTitle>
              <CardDescription className="text-gray-300">Update your server details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Server Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="members" className="text-gray-300">
                      Member Count
                    </Label>
                    <Input
                      id="members"
                      type="number"
                      value={formData.members}
                      onChange={(e) => setFormData({ ...formData, members: Number.parseInt(e.target.value) || 0 })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invite" className="text-gray-300">
                      Discord Invite Link
                    </Label>
                    <Input
                      id="invite"
                      value={formData.invite}
                      onChange={(e) => setFormData({ ...formData, invite: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://discord.gg/..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo" className="text-gray-300">
                      Logo URL (Optional)
                    </Label>
                    <Input
                      id="logo"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="leadDelegateName" className="text-gray-300">
                      Lead Delegate Name
                    </Label>
                    <Input
                      id="leadDelegateName"
                      value={formData.leadDelegateName}
                      onChange={(e) => setFormData({ ...formData, leadDelegateName: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="leadDelegateDiscordId" className="text-gray-300">
                      Lead Delegate Discord ID
                    </Label>
                    <Input
                      id="leadDelegateDiscordId"
                      value={formData.leadDelegateDiscordId}
                      onChange={(e) => setFormData({ ...formData, leadDelegateDiscordId: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="123456789012345678"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <input
                    type="checkbox"
                    id="autoUpdate"
                    checked={formData.autoUpdateEnabled}
                    onChange={(e) => setFormData({ ...formData, autoUpdateEnabled: e.target.checked })}
                    className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500"
                  />
                  <Label htmlFor="autoUpdate" className="text-gray-300 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span>Enable automatic stats updates (via Discord bot)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Allow the alliance bot to automatically update your member count every 10 minutes
                    </p>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
