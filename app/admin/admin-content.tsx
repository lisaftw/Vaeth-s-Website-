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

interface AdminContentProps {
  onLogout: () => void
}

export default function AdminContent({ onLogout }: AdminContentProps) {
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<Application[]>([])
  const [servers, setServers] = useState<ServerData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [editingServer, setEditingServer] = useState<number | null>(null)
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
          totalServers: statsData.totalServers,
          totalMembers: statsData.totalMembers,
          securityScore: statsData.securityScore,
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

  // Handle server actions
  const handleAddServer = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await addServer(formData)
      setMessage(result.success ? result.message : result.error)
      if (result.success) {
        await loadData()
        // Reset form
        const form = document.getElementById("add-server-form") as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setMessage("Error adding server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveServer = async (index: number) => {
    if (!confirm("Are you sure you want to remove this server?")) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await removeServer(formData)
      setMessage(result.success ? result.message : result.error)
      if (result.success) {
        await loadData()
      }
    } catch (error) {
      setMessage("Error removing server")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateServer = async (formData: FormData, index: number) => {
    setIsLoading(true)
    try {
      formData.append("index", index.toString())
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
      setMessage(result.success ? result.message : result.error)
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
      setMessage(result.success ? result.message : result.error)
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
        await loadData() // Reload data to get updated stats
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
              <Button onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
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
            <div className="grid gap-6">
              {servers.map((server, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{server.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        {server.verified && <Badge className="bg-green-600">Verified</Badge>}
                        <Button
                          onClick={() => setEditingServer(editingServer === index ? null : index)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleRemoveServer(index)}
                          size="sm"
                          variant="destructive"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingServer === index ? (
                      <form
                        action={(formData) => handleUpdateServer(formData, index)}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <Label htmlFor={`edit-name-${index}`} className="text-gray-300">
                            Server Name
                          </Label>
                          <Input
                            id={`edit-name-${index}`}
                            name="name"
                            defaultValue={server.name}
                            required
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-members-${index}`} className="text-gray-300">
                            Members
                          </Label>
                          <Input
                            id={`edit-members-${index}`}
                            name="members"
                            type="number"
                            defaultValue={server.members}
                            required
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor={`edit-description-${index}`} className="text-gray-300">
                            Description
                          </Label>
                          <Textarea
                            id={`edit-description-${index}`}
                            name="description"
                            defaultValue={server.description}
                            required
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-invite-${index}`} className="text-gray-300">
                            Discord Invite
                          </Label>
                          <Input
                            id={`edit-invite-${index}`}
                            name="invite"
                            defaultValue={server.invite}
                            required
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-logo-${index}`} className="text-gray-300">
                            Logo URL
                          </Label>
                          <Input
                            id={`edit-logo-${index}`}
                            name="logo"
                            defaultValue={server.logo || ""}
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
                            className="border-gray-600"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-gray-300">{server.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Members:</span>
                            <span className="text-white ml-2">{server.members.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Added:</span>
                            <span className="text-white ml-2">
                              {server.dateAdded ? new Date(server.dateAdded).toLocaleDateString() : "Unknown"}
                            </span>
                          </div>
                        </div>
                        {server.tags && server.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {server.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="border-gray-600 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Statistics Management</h2>

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
                      defaultValue={currentStats.totalServers.toString()}
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
                      defaultValue={currentStats.totalMembers.toString()}
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
                      defaultValue={currentStats.securityScore.toString()}
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
