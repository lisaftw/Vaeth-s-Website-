"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  ServerIcon,
  Lock,
  ArrowLeft,
} from "lucide-react"
import { getApplicationsData, getServersData, type Application, type Server } from "@/lib/data-store"
import { approveApplication } from "@/app/actions/approve-application"
import { rejectApplication } from "@/app/actions/reject-application"
import { removeServer } from "@/app/actions/remove-server"
import { addServer } from "@/app/actions/add-server"
import { updateServer } from "@/app/actions/update-server"
import { manageAnnouncements } from "@/app/actions/manage-announcements"
import { manageSettings } from "@/app/actions/manage-settings"
import type React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

const ADMIN_PASSWORD = "unified2024"

export default function AdminContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // State management
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState<Application[]>([])
  const [servers, setServers] = useState<Server[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [showDebug, setShowDebug] = useState(true)
  const [newServer, setNewServer] = useState({
    name: "",
    description: "",
    members: "",
    invite: "",
    logo: "",
    tags: "",
    representativeDiscordId: "",
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
          loadData()
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

  const loadData = () => {
    try {
      console.log("Loading admin data...")
      const appsData = getApplicationsData()
      const serversData = getServersData()

      console.log("Loaded applications:", appsData)
      console.log("Loaded servers:", serversData)

      setApplications(appsData)
      setServers(serversData)

      console.log("Data loaded successfully:", { applications: appsData.length, servers: serversData.length })
    } catch (error) {
      console.error("Error loading data:", error)
      setError("Failed to load data: " + String(error))
    }
  }

  const handleApprove = async (index: number) => {
    setLoading(true)
    try {
      console.log("Approving application at index:", index)
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await approveApplication(formData)

      if (result.success) {
        console.log("Application approved successfully")
        loadData() // Refresh data
        alert(result.message)
      } else {
        console.error("Failed to approve application:", result.error)
        alert(result.error)
      }
    } catch (error) {
      console.error("Error approving application:", error)
      alert("Failed to approve application")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (index: number) => {
    if (!confirm("Are you sure you want to reject this application?")) return

    setLoading(true)
    try {
      console.log("Rejecting application at index:", index)
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await rejectApplication(formData)

      if (result.success) {
        console.log("Application rejected successfully")
        loadData() // Refresh data
        alert(result.message)
      } else {
        console.error("Failed to reject application:", result.error)
        alert(result.error)
      }
    } catch (error) {
      console.error("Error rejecting application:", error)
      alert("Failed to reject application")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveServer = async (index: number) => {
    if (!confirm("Are you sure you want to remove this server from the alliance?")) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("index", index.toString())
      const result = await removeServer(formData)

      if (result.success) {
        loadData() // Refresh data
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error removing server:", error)
      alert("Failed to remove server")
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
      formData.append("tags", newServer.tags)
      formData.append("representativeDiscordId", newServer.representativeDiscordId)

      const result = await addServer(formData)

      if (result.success) {
        setNewServer({
          name: "",
          description: "",
          members: "",
          invite: "",
          logo: "",
          tags: "",
          representativeDiscordId: "",
        })
        loadData() // Refresh data
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error adding server:", error)
      alert("Failed to add server")
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
      formData.append("representativeDiscordId", editServerData.representativeDiscordId || "")

      const result = await updateServer(formData)

      if (result.success) {
        setEditingServer(null)
        setEditServerData(null)
        loadData() // Refresh data
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error updating server:", error)
      alert("Failed to update server")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAnnouncement = async () => {
    try {
      const result = await manageAnnouncements({ content: announcement, action: "create" })
      if (result.success) {
        setAnnouncement("")
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error saving announcement:", error)
      alert("Failed to save announcement")
    }
  }

  const handleSaveSettings = async () => {
    try {
      const result = await manageSettings(settings)
      if (result.success) {
        alert(result.message)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
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
        loadData() // Load data after successful login

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

  // Auto-refresh data every 10 seconds when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        console.log("Auto-refreshing admin data...")
        loadData()
      }, 10000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

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
      icon: ServerIcon,
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
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
              </div>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold">
                <Crown className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">ADMIN COMMAND CENTER</span>
                <span className="sm:hidden">ADMIN</span>
              </Badge>
              <Link
                href="/"
                className="text-gray-400 hover:text-red-400 transition-colors font-medium text-sm md:text-base"
              >
                <span className="hidden sm:inline">Exit Command Center</span>
                <span className="sm:hidden">Exit</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Button */}
        <div className="mb-6 md:mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 group"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" />
              <span className="hidden sm:inline">Back to Alliance</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              COMMAND CENTER
            </span>
          </h1>
          <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4 md:mb-6"></div>
          <p className="text-lg md:text-xl text-gray-300">Manage applications and servers for the alliance</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 md:mb-12">
          <div className="md:hidden">
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                        : "bg-gray-800/50 text-gray-300 hover:bg-red-950/30 hover:text-red-400"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    <div className="text-center">
                      <div className="text-sm">{tab.shortLabel}</div>
                      {tab.count !== undefined && <div className="text-xs">({tab.count})</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50"
                      : "bg-gray-800/50 text-gray-300 hover:bg-red-950/30 hover:text-red-400"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <div className="text-center">
                    <div>{tab.label}</div>
                    {tab.count !== undefined && <div className="text-xs">({tab.count})</div>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <Shield className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Pending Applications</h2>
              <Badge className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 md:px-4 py-1 md:py-2 text-base md:text-lg font-bold">
                {applications.length}
              </Badge>
            </div>

            {applications.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
                <CardContent className="text-center py-16 md:py-20 px-4">
                  <div className="relative w-20 md:w-24 h-20 md:h-24 mx-auto mb-6 md:mb-8">
                    <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center">
                      <Check className="w-10 md:w-12 h-10 md:h-12 text-red-500" />
                    </div>
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">All Clear, Commander</h3>
                  <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
                    No pending applications at the moment. The alliance is ready for new members.
                  </p>
                  <Button
                    onClick={loadData}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Refresh Data
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6 md:space-y-8">
                {applications.map((application, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/10 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 to-transparent opacity-50"></div>
                    <CardHeader className="relative z-10 p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                          <div className="mx-auto sm:mx-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center border-2 border-red-600/30">
                              {application.logo ? (
                                <img
                                  src={application.logo || "/placeholder.svg"}
                                  alt={application.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <ServerIcon className="w-8 h-8 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                              <Crown className="w-5 md:w-6 h-5 md:h-6 text-red-500" />
                              <CardTitle className="text-xl md:text-2xl font-bold text-red-400">
                                {application.name}
                              </CardTitle>
                            </div>
                            <CardDescription className="text-gray-300 text-base md:text-lg leading-relaxed">
                              {application.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 md:px-4 py-2 font-bold text-sm md:text-base mx-auto lg:mx-0">
                          PENDING REVIEW
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 p-4 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                        <div className="space-y-3">
                          <Label className="text-base md:text-lg font-semibold text-red-400 flex items-center">
                            <Users className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                            Member Count
                          </Label>
                          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                            <span className="text-xl md:text-2xl font-bold text-white">
                              {application.members.toLocaleString()}
                            </span>
                            <span className="text-gray-400 ml-2">members</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-base md:text-lg font-semibold text-red-400 flex items-center">
                            <ExternalLink className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                            Server Access
                          </Label>
                          <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                            <a
                              href={application.invite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-red-400 hover:text-red-300 transition-colors font-semibold"
                            >
                              <ExternalLink className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                              Visit Server
                            </a>
                          </div>
                        </div>
                        {application.representativeDiscordId && (
                          <div className="space-y-3">
                            <Label className="text-base md:text-lg font-semibold text-red-400 flex items-center">
                              <Users className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                              Representative
                            </Label>
                            <div className="bg-gray-800/50 rounded-lg p-3 md:p-4">
                              <span className="text-white font-mono text-sm break-all">
                                {application.representativeDiscordId}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-4">
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
                          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                        >
                          <X className="w-4 h-4 mr-2" />
                          REJECT APPLICATION
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
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <ServerIcon className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Alliance Servers</h2>
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 md:px-4 py-1 md:py-2 text-base md:text-lg font-bold">
                {servers.length}
              </Badge>
            </div>

            {servers.length === 0 ? (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
                <CardContent className="text-center py-16 md:py-20 px-4">
                  <div className="relative w-20 md:w-24 h-20 md:h-24 mx-auto mb-6 md:mb-8">
                    <div className="w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center">
                      <ServerIcon className="w-10 md:w-12 h-10 md:h-12 text-blue-500" />
                    </div>
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">No Servers Yet</h3>
                  <p className="text-gray-400 text-base md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
                    Add servers to the alliance or approve applications to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {servers.map((server, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-xl shadow-red-900/10 overflow-hidden"
                  >
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                          <div className="mx-auto sm:mx-0 relative">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center border-2 border-blue-600/30">
                              {server.logo ? (
                                <img
                                  src={server.logo || "/placeholder.svg"}
                                  alt={server.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <ServerIcon className="w-8 h-8 text-blue-400" />
                              )}
                            </div>
                            {server.verified && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 text-center sm:text-left">
                            {editingServer === index && editServerData ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Server Name</Label>
                                    <Input
                                      value={editServerData.name}
                                      onChange={(e) => setEditServerData({ ...editServerData, name: e.target.value })}
                                      className="bg-gray-700 border-gray-600 text-white"
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
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div className="md:col-span-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      value={editServerData.description}
                                      onChange={(e) =>
                                        setEditServerData({ ...editServerData, description: e.target.value })
                                      }
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label>Discord Invite</Label>
                                    <Input
                                      value={editServerData.invite}
                                      onChange={(e) => setEditServerData({ ...editServerData, invite: e.target.value })}
                                      className="bg-gray-700 border-gray-600 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label>Logo URL</Label>
                                    <Input
                                      value={editServerData.logo || ""}
                                      onChange={(e) => setEditServerData({ ...editServerData, logo: e.target.value })}
                                      className="bg-gray-700 border-gray-600 text-white"
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
                                    className="border-gray-600 bg-transparent text-gray-300"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
                                  <CardTitle className="text-lg md:text-xl font-bold text-red-400">
                                    {server.name}
                                  </CardTitle>
                                  {server.verified && (
                                    <Badge className="bg-blue-600 text-white border-0 px-2 py-1 text-xs font-bold">
                                      VERIFIED
                                    </Badge>
                                  )}
                                </div>
                                {server.tags && server.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                                    {server.tags.map((tag, tagIndex) => (
                                      <Badge
                                        key={tagIndex}
                                        className="bg-gray-700/50 text-gray-300 border-0 px-2 py-1 text-xs"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <CardDescription className="text-gray-300 leading-relaxed text-sm md:text-base">
                                  {server.description}
                                </CardDescription>
                              </>
                            )}
                          </div>
                        </div>
                        {editingServer !== index && (
                          <div className="flex flex-col items-center lg:items-end space-y-2 mx-auto lg:mx-0">
                            <div className="flex items-center text-gray-400">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="font-semibold">{server.members.toLocaleString()}</span>
                            </div>
                            {server.dateAdded && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                {new Date(server.dateAdded).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {editingServer !== index && (
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                          <a
                            href={server.invite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-red-400 hover:text-red-300 transition-colors font-semibold"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit Server
                          </a>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => startEditServer(index, server)}
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleRemoveServer(index)}
                              variant="outline"
                              size="sm"
                              disabled={loading}
                              className="border-red-600/50 text-red-400 hover:bg-red-950/50 hover:border-red-400 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add Server Tab */}
        {activeTab === "add-server" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <Plus className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Add New Server</h2>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 max-w-4xl mx-auto">
              <CardHeader className="text-center pb-4 md:pb-6 p-4 md:p-6">
                <CardTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Manually Add Server to Alliance
                </CardTitle>
                <CardDescription className="text-gray-300 text-base md:text-lg">
                  Add a server directly to the alliance with custom settings and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
                <form onSubmit={handleAddServer} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="add-name" className="text-base md:text-lg font-semibold text-red-400">
                        Server Name *
                      </Label>
                      <Input
                        id="add-name"
                        value={newServer.name}
                        onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                        placeholder="Enter server name"
                        required
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="add-members" className="text-base md:text-lg font-semibold text-red-400">
                        Member Count *
                      </Label>
                      <Input
                        id="add-members"
                        type="number"
                        value={newServer.members}
                        onChange={(e) => setNewServer({ ...newServer, members: e.target.value })}
                        placeholder="e.g., 1,500"
                        required
                        min="1"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="add-description" className="text-base md:text-lg font-semibold text-red-400">
                      Server Description *
                    </Label>
                    <Textarea
                      id="add-description"
                      value={newServer.description}
                      onChange={(e) => setNewServer({ ...newServer, description: e.target.value })}
                      placeholder="Describe what makes this server special, its community, features, and what players can expect..."
                      required
                      rows={4}
                      className="bg-gray-800/50 border border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 p-4 text-base md:text-lg rounded-lg resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="add-invite" className="text-base md:text-lg font-semibold text-red-400">
                        Discord Invite Link *
                      </Label>
                      <Input
                        id="add-invite"
                        type="url"
                        value={newServer.invite}
                        onChange={(e) => setNewServer({ ...newServer, invite: e.target.value })}
                        placeholder="https://discord.gg/yourserver"
                        required
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="add-logo" className="text-base md:text-lg font-semibold text-red-400">
                        Server Logo URL
                      </Label>
                      <Input
                        id="add-logo"
                        type="url"
                        value={newServer.logo}
                        onChange={(e) => setNewServer({ ...newServer, logo: e.target.value })}
                        placeholder="https://example.com/logo.png"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="add-tags" className="text-base md:text-lg font-semibold text-red-400">
                        Server Tags
                      </Label>
                      <Input
                        id="add-tags"
                        value={newServer.tags}
                        onChange={(e) => setNewServer({ ...newServer, tags: e.target.value })}
                        placeholder="Gaming, PvP, Community, Events"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                      <p className="text-gray-500 text-sm">Separate tags with commas</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="add-representative" className="text-base md:text-lg font-semibold text-red-400">
                        Representative Discord ID
                      </Label>
                      <Input
                        id="add-representative"
                        value={newServer.representativeDiscordId}
                        onChange={(e) => setNewServer({ ...newServer, representativeDiscordId: e.target.value })}
                        placeholder="username#1234 or @username"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-base md:text-lg"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-blue-900/50 rounded-xl p-4 md:p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 md:w-6 h-5 md:h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-blue-300 text-base md:text-lg mb-2">Admin Note</h4>
                        <p className="text-blue-200 leading-relaxed text-sm md:text-base">
                          This will add the server directly to the alliance without going through the application
                          process. Make sure all information is accurate and the server meets alliance standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:space-x-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl px-6 md:px-10 py-3 md:py-4 text-base md:text-lg font-bold shadow-2xl shadow-green-900/50 transition-all duration-300 hover:scale-105 flex-1"
                    >
                      <Plus className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                      {loading ? "Adding..." : "Add to Alliance"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 md:mb-8">
              <Settings className="w-6 md:w-8 h-6 md:h-8 text-red-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Analytics Dashboard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Applications</p>
                      <p className="text-2xl font-bold text-white">{applications.length}</p>
                    </div>
                    <Shield className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Servers</p>
                      <p className="text-2xl font-bold text-white">{servers.length}</p>
                    </div>
                    <ServerIcon className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Verified Servers</p>
                      <p className="text-2xl font-bold text-white">{servers.filter((s) => s.verified).length}</p>
                    </div>
                    <Check className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Members</p>
                      <p className="text-2xl font-bold text-white">
                        {servers.reduce((total, server) => total + server.members, 0).toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-white">System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-green-400">Discord Webhook</h3>
                        <p className="text-sm text-gray-400">Application notifications active</p>
                      </div>
                      <Badge className="bg-green-600">Online</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-blue-400">Data Storage</h3>
                        <p className="text-sm text-gray-400">In-memory storage active</p>
                      </div>
                      <Badge className="bg-blue-600">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
                      <div>
                        <h3 className="font-semibold text-yellow-400">Auto-Approval</h3>
                        <p className="text-sm text-gray-400">Manual review required</p>
                      </div>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                        Disabled
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.length === 0 && servers.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No recent activity</p>
                    ) : (
                      <>
                        {applications.slice(0, 3).map((app, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <div>
                              <p className="text-white font-medium">{app.name}</p>
                              <p className="text-sm text-gray-400">Application submitted</p>
                            </div>
                          </div>
                        ))}
                        {servers.slice(0, 2).map((server, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <div>
                              <p className="text-white font-medium">{server.name}</p>
                              <p className="text-sm text-gray-400">Server active</p>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {showDebug && (
          <Card className="mt-8 bg-gray-800 border-gray-600">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-yellow-400">🐛 Admin Debug Panel</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setShowDebug(false)} className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div>✅ Component Mounted: {mounted ? "SUCCESS" : "FAILED"}</div>
              <div>✅ Authentication: {isAuthenticated ? "SUCCESS" : "FAILED"}</div>
              <div>✅ Active Tab: {activeTab}</div>
              <div>✅ Applications Count: {applications.length}</div>
              <div>✅ Servers Count: {servers.length}</div>
              <div>✅ URL Password: "{searchParams?.get("password") || "none"}"</div>
              <div>✅ URL Tab: "{searchParams?.get("tab") || "none"}"</div>
              <div>✅ Loading State: {loading ? "ACTIVE" : "IDLE"}</div>
              <div>✅ Error State: {error || "none"}</div>
              <div>✅ Discord Webhook: CONFIGURED</div>
              <div>✅ Auto-refresh: ENABLED (10s)</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
