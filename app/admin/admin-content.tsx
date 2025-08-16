"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  ExternalLink,
  Check,
  X,
  Crown,
  Shield,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
} from "lucide-react"
import { getApplicationsData, getServersData, type Application, type Server } from "@/lib/data-store"
import { approveApplication } from "@/app/actions/approve-application"
import { rejectApplication } from "@/app/actions/reject-application"
import { removeServer } from "@/app/actions/remove-server"
import { addServer } from "@/app/actions/add-server"
import { updateServer } from "@/app/actions/update-server"
import { CardDescription } from "@/components/ui/card"
import { manageAnnouncements } from "@/app/actions/manage-announcements"
import { manageSettings } from "@/app/actions/manage-settings"
import { AdminDebugEnhanced } from "@/components/admin-debug-enhanced"
import type React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import Link from "next/link"

interface AdminContentProps {
  initialApplications: Application[]
  initialServers: Server[]
}

const ADMIN_PASSWORD = "unified2024"

export default function AdminContent({ initialApplications, initialServers }: AdminContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State management
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [servers, setServers] = useState<Server[]>(initialServers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showDebug, setShowDebug] = useState(true)
  const [newServer, setNewServer] = useState({
    name: "",
    description: "",
    members: "",
    invite: "",
    logo: "",
  })
  const [editingServer, setEditingServer] = useState<number | null>(null)
  const [editServerData, setEditServerData] = useState<Server | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const [settings, setSettings] = useState({
    maxServers: 50,
    autoApproval: false,
    maintenanceMode: false,
  })

  // Check authentication and load data
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        setMounted(true)
        console.log("Admin Panel - Mounted successfully")

        // Get URL parameters safely with null checks
        let urlPassword = ""
        let urlTab = "applications"

        try {
          urlPassword = searchParams?.get("password") || ""
          urlTab = searchParams?.get("tab") || "applications"
        } catch (err) {
          console.warn("Error reading search params:", err)
        }

        console.log("Admin Panel - URL Check:", { urlPassword, urlTab })

        setActiveTab(urlTab)

        // Check if password is correct
        if (urlPassword === ADMIN_PASSWORD) {
          console.log("Admin Panel - Auto-authenticating from URL")
          setIsAuthenticated(true)
        } else if (urlPassword) {
          console.log("Admin Panel - Invalid password in URL:", urlPassword)
          setError("Invalid password in URL")
        }
      } catch (err) {
        console.error("Admin Panel - Error in initialization:", err)
        setError("Error initializing admin panel: " + String(err))
      }
    }

    initializeAdmin()
  }, [searchParams])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [appsResult, serversResult] = await Promise.all([getApplicationsData(), getServersData()])

      if (appsResult) {
        setApplications(appsResult)
      }

      if (serversResult) {
        setServers(serversResult)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const refreshData = () => {
    setApplications(getApplicationsData())
    setServers(getServersData())
  }

  const handleApprove = async (index: number) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      await approveApplication(formData)
      refreshData()
    } catch (error) {
      console.error("Error approving application:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (index: number) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      await rejectApplication(formData)
      refreshData()
    } catch (error) {
      console.error("Error rejecting application:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveServer = async (index: number) => {
    if (!confirm("Are you sure you want to remove this server?")) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      await removeServer(formData)
      refreshData()
    } catch (error) {
      console.error("Error removing server:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddServer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newServer.name || !newServer.description || !newServer.members || !newServer.invite) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name", newServer.name)
      formData.append("description", newServer.description)
      formData.append("members", newServer.members)
      formData.append("invite", newServer.invite)
      formData.append("logo", newServer.logo)

      await addServer(formData)
      setNewServer({ name: "", description: "", members: "", invite: "", logo: "" })
      refreshData()
    } catch (error) {
      console.error("Error adding server:", error)
    } finally {
      setLoading(false)
    }
  }

  const startEditServer = (index: number, server: Server) => {
    setEditingServer(index)
    setEditServerData({ ...server })
  }

  const cancelEditServer = () => {
    setEditingServer(null)
    setEditServerData(null)
  }

  const handleUpdateServer = async (index: number) => {
    if (!editServerData) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      formData.append("name", editServerData.name)
      formData.append("description", editServerData.description)
      formData.append("members", editServerData.members.toString())
      formData.append("invite", editServerData.invite)
      formData.append("logo", editServerData.logo || "")

      await updateServer(formData)
      setEditingServer(null)
      setEditServerData(null)
      refreshData()
    } catch (error) {
      console.error("Error updating server:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAnnouncement = async () => {
    try {
      const result = await manageAnnouncements({ content: announcement, action: "create" })
      if (result.success) {
        setAnnouncement("")
      }
    } catch (error) {
      console.error("Error saving announcement:", error)
    }
  }

  const handleSaveSettings = async () => {
    try {
      const result = await manageSettings(settings)
      if (result.success) {
        // Settings saved successfully
      }
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Admin Panel - Manual login attempt")

    try {
      if (passwordInput === ADMIN_PASSWORD) {
        console.log("Admin Panel - Manual login successful")
        setIsAuthenticated(true)
        setError("")

        // Update URL safely
        try {
          const newUrl = `/admin?password=${ADMIN_PASSWORD}&tab=${activeTab}`
          router.push(newUrl)
        } catch (err) {
          console.warn("Error updating URL:", err)
        }
      } else {
        console.log("Admin Panel - Manual login failed")
        setError("Invalid password")
      }
    } catch (err) {
      console.error("Admin Panel - Login error:", err)
      setError("Login failed: " + String(err))
    }
  }

  const handleTabChange = (tabId: string) => {
    try {
      setActiveTab(tabId)
      try {
        const url = `/admin?password=${ADMIN_PASSWORD}&tab=${encodeURIComponent(tabId)}`
        router.push(url)
      } catch (err) {
        console.warn("Error changing tab URL:", err)
      }
    } catch (err) {
      console.error("Tab change error:", err)
      setError("Tab change failed: " + String(err))
    }
  }

  // Don't render until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/10"></div>
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 relative z-10">
          <CardHeader className="text-center pb-6 md:pb-8 px-4 md:px-6">
            <div className="mb-4 md:mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock className="w-5 md:w-6 h-5 md:h-6 text-red-500" />
              <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                ADMIN ACCESS
              </CardTitle>
              <Lock className="w-5 md:w-6 h-5 md:h-6 text-red-500" />
            </div>
            <CardDescription className="text-gray-300 text-base md:text-lg">
              Enter the master key to access the command center
            </CardDescription>
            {error && (
              <div className="mt-4 p-3 bg-red-950/30 border border-red-600/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base md:text-lg font-semibold text-red-400">
                  Master Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                />
                <p className="text-xs text-gray-500">Hint: unified2024</p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-3 text-base md:text-lg font-bold"
              >
                <Shield className="w-5 h-5 mr-2" />
                {loading ? "Authenticating..." : "Access Command Center"}
              </Button>
            </form>

            {/* Debug Panel */}
            {showDebug && (
              <div className="mt-6 p-4 bg-gray-800 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-yellow-400 font-semibold">Debug Info</span>
                  <Button size="sm" variant="ghost" onClick={() => setShowDebug(false)} className="h-6 w-6 p-0">
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-1 text-gray-300">
                  <div>
                    Mounted: <span className="text-green-400">{mounted ? "✓" : "✗"}</span>
                  </div>
                  <div>
                    Authenticated: <span className="text-red-400">{isAuthenticated ? "✓" : "✗"}</span>
                  </div>
                  <div>
                    URL Password: <span className="text-blue-400">"{searchParams?.get("password") || ""}"</span>
                  </div>
                  <div>
                    URL Tab: <span className="text-blue-400">"{searchParams?.get("tab") || ""}"</span>
                  </div>
                  <div>
                    Loading: <span className="text-orange-400">{loading ? "✓" : "✗"}</span>
                  </div>
                  <div>
                    Error: <span className="text-red-400">{error || "none"}</span>
                  </div>
                  <div className="pt-2 text-yellow-300">Expected URL: /admin?password=unified2024&tab=applications</div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-400 hover:text-red-400 transition-colors">
                ← Return to Realms
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tabs = [
    {
      id: "applications",
      label: "Applications",
      shortLabel: "Apps",
      icon: Shield,
      count: applications.length,
    },
    {
      id: "servers",
      label: "Servers",
      shortLabel: "Servers",
      icon: Users,
      count: servers.length,
    },
    {
      id: "add-server",
      label: "Add Server",
      shortLabel: "Add",
      icon: Plus,
    },
    {
      id: "analytics",
      label: "Analytics",
      shortLabel: "Stats",
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Admin Command Center
            </h1>
            <p className="text-gray-400 mt-2">Manage alliance applications and servers</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-red-500 text-red-400">
              <Crown className="w-4 h-4 mr-2" />
              Administrator
            </Badge>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-red-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 bg-gray-600 text-white">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pending Applications</h2>
              <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                {applications.length} Pending
              </Badge>
            </div>

            {applications.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Shield className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Pending Applications</h3>
                  <p className="text-gray-500">All applications have been processed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {applications.map((app, index) => (
                  <Card
                    key={index}
                    className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                            {app.logo ? (
                              <img
                                src={app.logo || "/placeholder.svg"}
                                alt={app.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <Crown className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl text-white">{app.name}</CardTitle>
                            <p className="text-gray-400 mt-1">{app.description}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600 hover:bg-yellow-700">PENDING REVIEW</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">Member Count</span>
                          <span className="font-semibold text-white">{app.members.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">Server Access</span>
                          <a
                            href={app.invite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 text-sm font-medium underline"
                          >
                            Visit Server
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">Representative</span>
                          <span className="font-mono text-sm text-white bg-gray-700 px-2 py-1 rounded">
                            {app.representativeDiscordId || "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => handleApprove(index)}
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          APPROVE & WELCOME
                        </Button>
                        <Button
                          onClick={() => handleReject(index)}
                          disabled={loading}
                          variant="destructive"
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                        >
                          <X className="w-4 h-4 mr-2" />
                          DECLINE APPLICATION
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Servers Tab */}
        {activeTab === "servers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Alliance Servers</h2>
              <Badge variant="outline" className="border-green-500 text-green-400">
                {servers.length} Active
              </Badge>
            </div>

            {/* Add New Server Form */}
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddServer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Server Name *</Label>
                    <Input
                      id="name"
                      value={newServer.name}
                      onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="members">Member Count *</Label>
                    <Input
                      id="members"
                      type="number"
                      value={newServer.members}
                      onChange={(e) => setNewServer({ ...newServer, members: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newServer.description}
                      onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite">Discord Invite *</Label>
                    <Input
                      id="invite"
                      value={newServer.invite}
                      onChange={(e) => setNewServer({ ...newServer, invite: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="https://discord.gg/..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={newServer.logo}
                      onChange={(e) => setNewServer({ ...newServer, logo: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Server
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Servers List */}
            {servers.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No Servers Yet</h3>
                  <p className="text-gray-500">Add your first server to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {servers.map((server, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                            {server.logo ? (
                              <img
                                src={server.logo || "/placeholder.svg"}
                                alt={server.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <Crown className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl text-white">{server.name}</CardTitle>
                            <p className="text-gray-400 mt-1">{server.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600 hover:bg-green-700">ACTIVE</Badge>
                          {server.verified && (
                            <Badge variant="outline" className="border-blue-500 text-blue-400">
                              VERIFIED
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingServer === index && editServerData ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Server Name</Label>
                              <Input
                                value={editServerData.name}
                                onChange={(e) => setEditServerData({ ...editServerData, name: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div>
                              <Label>Member Count</Label>
                              <Input
                                type="number"
                                value={editServerData.members}
                                onChange={(e) =>
                                  setEditServerData({
                                    ...editServerData,
                                    members: Number.parseInt(e.target.value) || 0,
                                  })
                                }
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label>Description</Label>
                              <Textarea
                                value={editServerData.description}
                                onChange={(e) => setEditServerData({ ...editServerData, description: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div>
                              <Label>Discord Invite</Label>
                              <Input
                                value={editServerData.invite}
                                onChange={(e) => setEditServerData({ ...editServerData, invite: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div>
                              <Label>Logo URL</Label>
                              <Input
                                value={editServerData.logo || ""}
                                onChange={(e) => setEditServerData({ ...editServerData, logo: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleUpdateServer(index)}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              onClick={cancelEditServer}
                              variant="outline"
                              className="border-gray-600 bg-transparent"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">Members</span>
                              <span className="font-semibold text-white">{server.members.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-green-400" />
                              <a
                                href={server.invite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 text-sm font-medium underline"
                              >
                                Visit Server
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-300">Added</span>
                              <span className="text-sm text-white">
                                {server.dateAdded ? new Date(server.dateAdded).toLocaleDateString() : "Unknown"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditServer(index, server)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleRemoveServer(index)}
                              variant="destructive"
                              size="sm"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Discord Webhook</h3>
                      <p className="text-sm text-gray-400">Notifications for new applications</p>
                    </div>
                    <Badge className="bg-green-600">Active</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Auto-approval</h3>
                      <p className="text-sm text-gray-400">Automatically approve applications</p>
                    </div>
                    <Badge variant="outline" className="border-red-500 text-red-400">
                      Disabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-gray-400">Send email alerts to admins</p>
                    </div>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                      Pending
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-900/20 border border-green-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{applications.length}</div>
                    <div className="text-sm text-gray-400">Pending Applications</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{servers.length}</div>
                    <div className="text-sm text-gray-400">Active Servers</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Debug Panel */}
      <AdminDebugEnhanced applications={applications} servers={servers} activeTab={activeTab} />
    </div>
  )
}
