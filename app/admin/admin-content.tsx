"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Check,
  X,
  Users,
  ExternalLink,
  User,
  Settings,
  MessageSquare,
  Server,
  Plus,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
} from "lucide-react"
import { approveApplication } from "@/app/actions/approve-application"
import { rejectApplication } from "@/app/actions/reject-application"
import { getApplications } from "@/app/actions/get-applications"
import { getServers } from "@/app/actions/get-servers"
import { addServer } from "@/app/actions/add-server"
import { updateServer } from "@/app/actions/update-server"
import { removeServer } from "@/app/actions/remove-server"
import { manageAnnouncements } from "@/app/actions/manage-announcements"
import { manageSettings } from "@/app/actions/manage-settings"
import { AdminFormButton } from "@/components/admin-form-button"
import { AdminDebugEnhanced } from "@/components/admin-debug-enhanced"
import type React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Shield, Lock } from "lucide-react"
import Link from "next/link"

interface Application {
  id: string
  serverName: string
  description: string
  memberCount: number
  serverUrl: string
  representative: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
}

const ADMIN_PASSWORD = "unified2024"

export default function AdminPanelContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State management
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<Application[]>([])
  const [servers, setServers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showDebug, setShowDebug] = useState(true)
  const [newServer, setNewServer] = useState({
    name: "",
    description: "",
    memberCount: 0,
    url: "",
    representative: "",
    logoUrl: "",
  })
  const [editingServer, setEditingServer] = useState<string | null>(null)
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
      const [appsResult, serversResult] = await Promise.all([getApplications(), getServers()])

      if (appsResult.success) {
        setApplications(appsResult.applications)
      }

      if (serversResult.success) {
        setServers(serversResult.servers)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (applicationId: string) => {
    try {
      const result = await approveApplication(applicationId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Error approving application:", error)
    }
  }

  const handleReject = async (applicationId: string) => {
    try {
      const result = await rejectApplication(applicationId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Error rejecting application:", error)
    }
  }

  const handleAddServer = async () => {
    try {
      const result = await addServer(newServer)
      if (result.success) {
        setNewServer({
          name: "",
          description: "",
          memberCount: 0,
          url: "",
          representative: "",
          logoUrl: "",
        })
        await loadData()
      }
    } catch (error) {
      console.error("Error adding server:", error)
    }
  }

  const handleUpdateServer = async (serverId: string, updates: any) => {
    try {
      const result = await updateServer(serverId, updates)
      if (result.success) {
        setEditingServer(null)
        await loadData()
      }
    } catch (error) {
      console.error("Error updating server:", error)
    }
  }

  const handleRemoveServer = async (serverId: string) => {
    try {
      const result = await removeServer(serverId)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      console.error("Error removing server:", error)
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
      icon: Server,
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
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-800">
        {[
          { id: "applications", label: "Applications", icon: MessageSquare },
          { id: "servers", label: "Servers", icon: Server },
          { id: "announcements", label: "Announcements", icon: MessageSquare },
          { id: "settings", label: "Settings", icon: Settings },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
              activeTab === id ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Pending Applications</h2>
            <Badge variant="secondary" className="bg-yellow-600 text-white">
              {applications.filter((app) => app.status === "pending").length} Pending
            </Badge>
          </div>

          {applications.filter((app) => app.status === "pending").length === 0 ? (
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            applications
              .filter((app) => app.status === "pending")
              .map((application) => (
                <Card key={application.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl text-red-400 flex items-center gap-2">
                          <Server className="w-5 h-5" />
                          {application.serverName}
                        </CardTitle>
                        <Badge className="bg-yellow-600 text-white">PENDING REVIEW</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">{application.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-800">
                      <div className="flex items-center gap-2 text-red-400">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">Member Count</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <ExternalLink className="w-4 h-4" />
                        <span className="font-semibold">Server Access</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-400">
                        <User className="w-4 h-4" />
                        <span className="font-semibold">Representative</span>
                      </div>

                      <div className="text-white font-mono text-lg">
                        {application.memberCount.toLocaleString()}{" "}
                        <span className="text-sm text-gray-400">members</span>
                      </div>
                      <div>
                        <a
                          href={application.serverUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                          Visit Server
                        </a>
                      </div>
                      <div className="text-white font-mono">{application.representative}</div>
                    </div>

                    {/* Fixed Button Sizing */}
                    <div className="flex gap-3 pt-4">
                      <AdminFormButton
                        action={async () => await handleApprove(application.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <Check className="w-4 h-4" />
                        APPROVE & WELCOME
                      </AdminFormButton>

                      <AdminFormButton
                        action={async () => await handleReject(application.id)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <X className="w-4 h-4" />
                        DECLINE
                      </AdminFormButton>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Servers Tab */}
      {activeTab === "servers" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Server Management</h2>
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {servers.length} Active Servers
            </Badge>
          </div>

          {/* Add New Server Form */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Server
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serverName" className="text-white">
                    Server Name
                  </Label>
                  <Input
                    id="serverName"
                    value={newServer.name}
                    onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="memberCount" className="text-white">
                    Member Count
                  </Label>
                  <Input
                    id="memberCount"
                    type="number"
                    value={newServer.memberCount}
                    onChange={(e) => setNewServer({ ...newServer, memberCount: Number.parseInt(e.target.value) || 0 })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="serverUrl" className="text-white">
                    Server URL
                  </Label>
                  <Input
                    id="serverUrl"
                    value={newServer.url}
                    onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="representative" className="text-white">
                    Representative
                  </Label>
                  <Input
                    id="representative"
                    value={newServer.representative}
                    onChange={(e) => setNewServer({ ...newServer, representative: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newServer.description}
                  onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddServer}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!newServer.name || !newServer.description}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Server
              </Button>
            </CardContent>
          </Card>

          {/* Server List */}
          <div className="space-y-4">
            {servers.map((server) => (
              <Card key={server.id} className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <h3 className="text-xl font-bold text-white">{server.name}</h3>
                      <p className="text-gray-300">{server.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{server.memberCount.toLocaleString()} members</span>
                        <span>Rep: {server.representative}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingServer(editingServer === server.id ? null : server.id)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveServer(server.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Announcements</h2>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Create Announcement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Enter announcement content..."
                className="bg-gray-800 border-gray-700 text-white"
                rows={4}
              />
              <Button
                onClick={handleSaveAnnouncement}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!announcement.trim()}
              >
                <Save className="w-4 h-4 mr-2" />
                Publish Announcement
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">System Settings</h2>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxServers" className="text-white">
                  Maximum Servers
                </Label>
                <Input
                  id="maxServers"
                  type="number"
                  value={settings.maxServers}
                  onChange={(e) => setSettings({ ...settings, maxServers: Number.parseInt(e.target.value) || 0 })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoApproval"
                  checked={settings.autoApproval}
                  onChange={(e) => setSettings({ ...settings, autoApproval: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="autoApproval" className="text-white">
                  Enable Auto-Approval
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="maintenanceMode" className="text-white">
                  Maintenance Mode
                </Label>
                {settings.maintenanceMode && <AlertTriangle className="w-4 h-4 text-yellow-500 ml-2" />}
              </div>

              <Button onClick={handleSaveSettings} className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Debug Panel */}
      <AdminDebugEnhanced applications={applications} servers={servers} activeTab={activeTab} />
    </div>
  )
}
