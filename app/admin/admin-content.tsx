"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  ServerIcon,
  Shield,
  Plus,
  Trash2,
  Check,
  X,
  RefreshCw,
  LogOut,
  Settings,
  BarChart3,
  UserCheck,
  Edit,
  AlertTriangle,
} from "lucide-react"

// Import actions
import { getApplications, type Application } from "@/app/actions/get-applications"
import { getServers, type ServerData } from "@/app/actions/get-servers"
import { addServer } from "@/app/actions/add-server"
import { removeServer } from "@/app/actions/remove-server"
import { updateServer } from "@/app/actions/update-server"
import { approveApplication } from "@/app/actions/approve-application"
import { rejectApplication } from "@/app/actions/reject-application"
import { updateManualStatsAction } from "@/app/actions/update-manual-stats"
import { StatsUpdateButton } from "@/components/stats-update-button"

interface AdminContentProps {
  onLogout: () => void
}

export default function AdminContent({ onLogout }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<Application[]>([])
  const [servers, setServers] = useState<ServerData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [editingServer, setEditingServer] = useState<string | null>(null)
  const [currentStats, setCurrentStats] = useState({
    totalServers: 1,
    totalMembers: 250,
    securityScore: 100,
  })

  // Load data
  const loadData = async () => {
    setIsLoading(true)
    try {
      const [appsData, serversData, statsResponse] = await Promise.all([
        getApplications(),
        getServers(),
        fetch("/api/stats"),
      ])
      setApplications(appsData)
      setServers(serversData)

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setCurrentStats({
          totalServers: statsData.totalServers ?? 1,
          totalMembers: statsData.totalMembers ?? 250,
          securityScore: statsData.securityScore ?? 100,
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      setMessage("Error loading data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Handle cleanup duplicates
  const handleCleanupDuplicates = async () => {
    if (!confirm("Are you sure you want to clean up duplicate applications? This cannot be undone.")) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/cleanup-duplicates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: "TheRealms&Sovereign3301!" }),
      })

      const result = await response.json()
      setMessage(result.message)

      if (result.success) {
        await loadData()
      }
    } catch (error) {
      setMessage("Error cleaning up duplicates")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle server actions
  const handleAddServer = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await addServer(formData)
      setMessage(result.success ? result.message : result.error)
      if (result.success) {
        await loadData()
        const form = document.getElementById("add-server-form") as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setMessage("Error adding server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveServer = async (serverId: string, serverName: string) => {
    console.log("[v0] Delete button clicked for server:", serverName, "ID:", serverId)

    if (!confirm(`Are you sure you want to remove "${serverName}"? This cannot be undone.`)) {
      console.log("[v0] Delete cancelled by user")
      return
    }

    console.log("[v0] User confirmed deletion, proceeding...")
    setIsLoading(true)
    setMessage("") // Clear previous messages

    try {
      const formData = new FormData()
      formData.append("serverId", serverId)

      console.log("[v0] Calling removeServer action with serverId:", serverId)
      const result = await removeServer(formData)

      console.log("[v0] removeServer result:", result)

      if (result.success) {
        setMessage(`✓ ${result.message}`)
        console.log("[v0] Server deleted successfully, reloading data...")
        // Force reload the data
        await loadData()
        // Also force a page refresh to clear any cached data
        window.location.reload()
      } else {
        setMessage(`✗ ${result.error || "Error removing server"}`)
        console.error("[v0] Delete failed:", result.error)
      }
    } catch (error) {
      console.error("[v0] Exception in handleRemoveServer:", error)
      setMessage(`✗ Error removing server: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateServer = async (formData: FormData, serverId: string) => {
    setIsLoading(true)
    try {
      formData.append("serverId", serverId)
      const result = await updateServer(formData)
      setMessage(result.success ? result.message : result.error)
      if (result.success) {
        await loadData()
        setEditingServer(null)
      }
    } catch (error) {
      setMessage("Error updating server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveApplication = async (index: number) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await approveApplication(formData)
      setMessage(result.success ? result.message : result.message)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      setMessage("Error approving application")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectApplication = async (index: number) => {
    if (!confirm("Are you sure you want to reject this application?")) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await rejectApplication(formData)
      setMessage(result.success ? result.message : result.message)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      setMessage("Error rejecting application")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStats = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await updateManualStatsAction(formData)
      setMessage(result.success ? result.message : result.message)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      setMessage("Error updating stats")
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: "applications", label: "Applications", icon: UserCheck },
    { id: "servers", label: "Servers", icon: ServerIcon },
    { id: "stats", label: "Statistics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-red-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-red-400 text-red-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Pending Applications</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={handleCleanupDuplicates}
                  disabled={isLoading}
                  variant="outline"
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white bg-transparent"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cleanup Duplicates
                </Button>
                <Button onClick={loadData} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {applications.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">No pending applications</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {applications.map((app, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{app.name}</CardTitle>
                        <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300">{app.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Members:</span>
                          <span className="text-white ml-2">{app.members.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Invite:</span>
                          <a
                            href={app.invite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 ml-2"
                          >
                            Discord Link
                          </a>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Representative ID:</span>
                          <span className="text-white ml-2">{app.representativeDiscordId || "Not provided"}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Server Owner:</span>
                          <span className="text-white ml-2">{app.ownerName || "Not provided"}</span>
                        </div>
                      </div>
                      {app.submittedAt && (
                        <div className="text-sm">
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-white ml-2">{new Date(app.submittedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleApproveApplication(index)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleRejectApplication(index)}
                          disabled={isLoading}
                          variant="destructive"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Reject
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
              <h2 className="text-xl font-bold text-white">Server Management</h2>
              <Button onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Add Server Form */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Server
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form id="add-server-form" action={handleAddServer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Server Name
                    </Label>
                    <Input id="name" name="name" required className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="members" className="text-gray-300">
                      Members
                    </Label>
                    <Input
                      id="members"
                      name="members"
                      type="number"
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invite" className="text-gray-300">
                      Discord Invite
                    </Label>
                    <Input id="invite" name="invite" required className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="logo" className="text-gray-300">
                      Logo URL
                    </Label>
                    <Input id="logo" name="logo" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="leadDelegateName" className="text-gray-300">
                      Lead Delegate Name
                    </Label>
                    <Input
                      id="leadDelegateName"
                      name="leadDelegateName"
                      placeholder="e.g., John Doe"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leadDelegateId" className="text-gray-300">
                      Lead Delegate Discord ID
                    </Label>
                    <Input
                      id="leadDelegateId"
                      name="leadDelegateId"
                      placeholder="e.g., 123456789012345678"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Server
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Servers List */}
            <div className="grid gap-4">
              {servers.map((server) => (
                <Card key={server.id} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  {editingServer === server.id ? (
                    // Edit Mode
                    <>
                      <CardHeader>
                        <CardTitle className="text-white flex items-center">
                          <Edit className="w-5 h-5 mr-2" />
                          Editing: {server.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form
                          action={(formData) => handleUpdateServer(formData, server.id)}
                          className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                          <div>
                            <Label htmlFor={`edit-name-${server.id}`} className="text-gray-300">
                              Server Name
                            </Label>
                            <Input
                              id={`edit-name-${server.id}`}
                              name="name"
                              defaultValue={server.name}
                              required
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-members-${server.id}`} className="text-gray-300">
                              Members
                            </Label>
                            <Input
                              id={`edit-members-${server.id}`}
                              name="members"
                              type="number"
                              defaultValue={server.members}
                              required
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor={`edit-description-${server.id}`} className="text-gray-300">
                              Description
                            </Label>
                            <Textarea
                              id={`edit-description-${server.id}`}
                              name="description"
                              defaultValue={server.description}
                              required
                              className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-invite-${server.id}`} className="text-gray-300">
                              Discord Invite
                            </Label>
                            <Input
                              id={`edit-invite-${server.id}`}
                              name="invite"
                              defaultValue={server.invite}
                              required
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-logo-${server.id}`} className="text-gray-300">
                              Logo URL
                            </Label>
                            <Input
                              id={`edit-logo-${server.id}`}
                              name="logo"
                              defaultValue={server.logo || ""}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-leadDelegateName-${server.id}`} className="text-gray-300">
                              Lead Delegate Name
                            </Label>
                            <Input
                              id={`edit-leadDelegateName-${server.id}`}
                              name="leadDelegateName"
                              defaultValue={(server as any).lead_delegate_name || ""}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edit-leadDelegateId-${server.id}`} className="text-gray-300">
                              Lead Delegate Discord ID
                            </Label>
                            <Input
                              id={`edit-leadDelegateId-${server.id}`}
                              name="leadDelegateId"
                              defaultValue={(server as any).lead_delegate_discord_id || ""}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                          <div className="md:col-span-2 flex space-x-2">
                            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                              <Check className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button
                              type="button"
                              onClick={() => setEditingServer(null)}
                              variant="outline"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </>
                  ) : (
                    // View Mode
                    <>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-white text-lg mb-2 truncate">{server.name}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                              {server.verified && <Badge className="bg-green-600">Verified</Badge>}
                              {server.tags &&
                                server.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="border-gray-600 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              onClick={() => setEditingServer(server.id)}
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleRemoveServer(server.id, server.name)}
                              size="sm"
                              variant="destructive"
                              disabled={isLoading}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="w-full">
                          <div className="text-xs text-gray-400 mb-1">Description</div>
                          <div className="bg-gray-700/30 p-3 rounded-lg w-full group cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-700/50">
                            <p
                              className="text-gray-300 text-sm leading-relaxed break-words whitespace-pre-wrap line-clamp-3 group-hover:line-clamp-none transition-all duration-300 ease-in-out"
                              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                            >
                              {server.description}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div className="bg-gray-700/30 p-2 rounded min-w-0">
                            <span className="text-gray-400 block text-xs">Members</span>
                            <span className="text-white font-semibold truncate block">
                              {server.members.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-gray-700/30 p-2 rounded min-w-0">
                            <span className="text-gray-400 block text-xs">Added</span>
                            <span className="text-white font-semibold truncate block">
                              {server.dateAdded ? new Date(server.dateAdded).toLocaleDateString() : "Unknown"}
                            </span>
                          </div>
                          <div className="bg-gray-700/30 p-2 rounded min-w-0">
                            <span className="text-gray-400 block text-xs">Invite</span>
                            <a
                              href={server.invite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 font-semibold text-xs truncate block"
                            >
                              Discord Link
                            </a>
                          </div>
                          {(server as any).lead_delegate_name && (
                            <div className="bg-gray-700/30 p-2 rounded min-w-0">
                              <span className="text-gray-400 block text-xs">Lead Delegate</span>
                              <span className="text-white font-semibold text-xs truncate block">
                                {(server as any).lead_delegate_name}
                              </span>
                            </div>
                          )}
                          {(server as any).lead_delegate_discord_id && (
                            <div className="bg-gray-700/30 p-2 rounded col-span-2 min-w-0">
                              <span className="text-gray-400 block text-xs">Delegate ID</span>
                              <span className="text-white font-mono text-xs break-all">
                                {(server as any).lead_delegate_discord_id}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-700/30 p-2 rounded w-full">
                          <span className="text-gray-400 block text-xs mb-1">Server ID</span>
                          <span className="text-white font-mono text-xs break-all block">{server.id}</span>
                        </div>
                      </CardContent>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Statistics Management</h2>
              <StatsUpdateButton />
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Update Alliance Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={handleUpdateStats} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="totalServers" className="text-gray-300">
                      Total Servers
                    </Label>
                    <Input
                      id="totalServers"
                      name="totalServers"
                      type="number"
                      min="1"
                      defaultValue={(currentStats.totalServers ?? 1).toString()}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalMembers" className="text-gray-300">
                      Total Members
                    </Label>
                    <Input
                      id="totalMembers"
                      name="totalMembers"
                      type="number"
                      min="1"
                      defaultValue={(currentStats.totalMembers ?? 250).toString()}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="securityScore" className="text-gray-300">
                      Security Score (%)
                    </Label>
                    <Input
                      id="securityScore"
                      name="securityScore"
                      type="number"
                      min="0"
                      max="100"
                      defaultValue={(currentStats.securityScore ?? 100).toString()}
                      required
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Button type="submit" disabled={isLoading} className="bg-red-600 hover:bg-red-700">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Update Statistics
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">System Settings</h2>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Database Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-300">Applications</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{applications.length}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ServerIcon className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Servers</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{servers.length}</p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-300">Total Members</span>
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      {servers.reduce((total, server) => total + server.members, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <p>• Data is stored in Supabase database</p>
                  <p>• All changes are automatically saved</p>
                  <p>• Statistics are updated in real-time</p>
                  <p>• Duplicate applications can be cleaned up using the cleanup button</p>
                  <p>• Servers can be removed using the trash icon in the servers tab</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
