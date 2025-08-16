"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  Server,
  Settings,
  CheckCircle,
  XCircle,
  Trash2,
  Crown,
  ExternalLink,
  Plus,
  ArrowLeft,
  Lock,
  AlertCircle,
} from "lucide-react"

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

export default function AdminPanel() {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [applications, setApplications] = useState(mockApplications)
  const [servers, setServers] = useState(mockServers)
  const [passwordInput, setPasswordInput] = useState("")
  const [error, setError] = useState("")
  const [urlInfo, setUrlInfo] = useState({ password: "", tab: "" })

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")

      if (typeof window !== "undefined") {
        const newUrl = `/admin?password=${ADMIN_PASSWORD}&tab=${activeTab}`
        window.history.replaceState({}, "", newUrl)
      }
    } else {
      setError("Invalid password")
    }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/10"></div>
        <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl relative z-10">
          <CardHeader className="text-center pb-6 px-6">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock className="w-6 h-6 text-red-500" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                ADMIN ACCESS
              </CardTitle>
              <Lock className="w-6 h-6 text-red-500" />
            </div>
            <CardDescription className="text-gray-300 text-lg">
              Enter the master key to access the command center
            </CardDescription>
            {error && (
              <div className="mt-4 p-3 bg-red-950/30 border border-red-600/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="password" className="text-lg font-semibold text-red-400">
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
                  className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                />
                <p className="text-xs text-gray-500">Password: unified2024</p>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-3 text-lg font-bold"
              >
                <Shield className="w-5 h-5 mr-2" />
                Access Command Center
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg text-xs">
              <div className="text-yellow-400 font-semibold mb-2">🐛 Debug Info</div>
              <div className="space-y-1 text-gray-300">
                <div>Mounted: ✅</div>
                <div>Authenticated: ❌</div>
                <div>URL Password: "{urlInfo.password}"</div>
                <div>URL Tab: "{urlInfo.tab}"</div>
                <div>Expected: "unified2024"</div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="/" className="text-gray-400 hover:text-red-400 transition-colors">
                ← Return to Realms
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
              </div>
            </a>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-0 px-4 py-2 text-sm font-bold">
                <Crown className="w-4 h-4 mr-2" />
                ADMIN COMMAND CENTER
              </Badge>
              <a href="/" className="text-gray-400 hover:text-red-400 transition-colors font-medium">
                Exit Command Center
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="ghost"
            className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" />
            Back to Alliance
          </Button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              COMMAND CENTER
            </span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300">Manage applications and servers for the alliance</p>
        </div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: "applications", label: "Applications", icon: Shield, count: applications.length },
              { id: "servers", label: "Servers", icon: Server, count: servers.length },
              { id: "add-server", label: "Add Server", icon: Plus },
              { id: "analytics", label: "Analytics", icon: Settings },
            ].map((tab) => {
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

        {activeTab === "applications" && (
          <div>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Shield className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Pending Applications</h2>
              <Badge className="bg-red-600/20 text-red-400 border border-red-600/30 px-4 py-2 text-lg font-bold">
                {applications.length}
              </Badge>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-8">
                {applications.map((application) => (
                  <Card
                    key={application.id}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 to-transparent opacity-50"></div>
                    <CardHeader className="relative z-10 p-6">
                      <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center border-2 border-red-600/30">
                            <Server className="w-8 h-8 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start space-x-3 mb-4">
                              <Crown className="w-6 h-6 text-red-500" />
                              <CardTitle className="text-2xl font-bold text-red-400">{application.name}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-300 text-lg leading-relaxed">
                              {application.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-4 py-2 font-bold">
                          PENDING REVIEW
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-red-400 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Member Count
                          </Label>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <span className="text-2xl font-bold text-white">
                              {application.members.toLocaleString()}
                            </span>
                            <span className="text-gray-400 ml-2">members</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-red-400 flex items-center">
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Server Access
                          </Label>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <a
                              href={application.invite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-red-400 hover:text-red-300 transition-colors font-semibold"
                            >
                              <ExternalLink className="w-5 h-5 mr-2" />
                              Visit Server
                            </a>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-red-400 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Representative
                          </Label>
                          <div className="bg-gray-800/50 rounded-lg p-4">
                            <span className="text-white font-mono text-sm break-all">
                              {application.representativeDiscordId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                        <Button
                          onClick={() => handleApprove(application.id)}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl py-4 text-lg font-bold shadow-lg shadow-green-900/30 transition-all duration-300 hover:scale-105"
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          APPROVE & WELCOME
                        </Button>
                        <Button
                          onClick={() => handleReject(application.id)}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-4 text-lg font-bold shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-105"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          REJECT APPLICATION
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
                <CardContent className="text-center py-20 px-4">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">All Clear, Commander</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    No pending applications at the moment. The alliance is ready for new members.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === "servers" && (
          <div>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Server className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Alliance Servers</h2>
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 text-lg font-bold">
                {servers.length}
              </Badge>
            </div>

            <div className="space-y-6">
              {servers.map((server) => (
                <Card
                  key={server.id}
                  className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-xl shadow-red-900/10 overflow-hidden"
                >
                  <CardHeader className="p-6">
                    <div className="flex flex-col lg:flex-row items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-full flex items-center justify-center border-2 border-blue-600/30">
                            <Server className="w-8 h-8 text-blue-400" />
                          </div>
                          {server.verified && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start space-x-3 mb-2">
                            <CardTitle className="text-xl font-bold text-red-400">{server.name}</CardTitle>
                            {server.verified && (
                              <Badge className="bg-blue-600 text-white border-0 px-2 py-1 text-xs font-bold">
                                VERIFIED
                              </Badge>
                            )}
                          </div>
                          {server.tags && server.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
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
                          <CardDescription className="text-gray-300 leading-relaxed">
                            {server.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center text-gray-400">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="font-semibold">{server.members.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {new Date(server.dateAdded).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <a
                        href={server.invite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-red-400 hover:text-red-300 transition-colors font-semibold"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Server
                      </a>
                      <Button
                        onClick={() => handleRemoveServer(server.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-600/50 text-red-400 hover:bg-red-950/50 hover:border-red-400 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "add-server" && (
          <div>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Plus className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Add New Server</h2>
            </div>

            <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 max-w-4xl mx-auto">
              <CardHeader className="text-center pb-6 p-6">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Manually Add Server to Alliance
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Add a server directly to the alliance with custom settings and tags
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <form onSubmit={handleAddServer} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="add-name" className="text-lg font-semibold text-red-400">
                        Server Name *
                      </Label>
                      <Input
                        id="add-name"
                        name="name"
                        placeholder="Enter server name"
                        required
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="add-members" className="text-lg font-semibold text-red-400">
                        Member Count *
                      </Label>
                      <Input
                        id="add-members"
                        name="members"
                        type="number"
                        placeholder="e.g., 1,500"
                        required
                        min="1"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="add-description" className="text-lg font-semibold text-red-400">
                      Server Description *
                    </Label>
                    <textarea
                      id="add-description"
                      name="description"
                      placeholder="Describe what makes this server special, its community, features, and what players can expect..."
                      required
                      rows={4}
                      className="w-full bg-gray-800/50 border border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 p-4 text-lg rounded-lg resize-none"
                    />
                    <p className="text-gray-500 text-sm">
                      Provide a detailed description to help players understand what your server offers.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="add-image" className="text-lg font-semibold text-red-400">
                      Server Image/Logo URL
                    </Label>
                    <Input
                      id="add-image"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/server-logo.png"
                      className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                    />
                    <p className="text-gray-500 text-sm">
                      Optional: Provide a URL to your server's logo or banner image (PNG, JPG, GIF supported).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="add-invite" className="text-lg font-semibold text-red-400">
                        Discord Invite Link *
                      </Label>
                      <Input
                        id="add-invite"
                        name="invite"
                        type="url"
                        placeholder="https://discord.gg/yourserver"
                        required
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="add-tags" className="text-lg font-semibold text-red-400">
                        Server Tags
                      </Label>
                      <Input
                        id="add-tags"
                        name="tags"
                        placeholder="Gaming, PvP, Community, Events"
                        className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                      />
                      <p className="text-gray-500 text-sm">Separate tags with commas (e.g., Gaming, PvP, Community)</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="add-representative" className="text-lg font-semibold text-red-400">
                      Representative Discord ID
                    </Label>
                    <Input
                      id="add-representative"
                      name="representativeDiscordId"
                      placeholder="username#1234 or @username"
                      className="bg-gray-800/50 border-red-900/50 focus:border-red-500 text-white placeholder-gray-500 h-12 text-lg"
                    />
                    <p className="text-gray-500 text-sm">
                      Discord username of the main server representative or owner.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="add-verified"
                      name="verified"
                      className="w-5 h-5 text-red-600 bg-gray-700 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                    />
                    <Label htmlFor="add-verified" className="text-lg font-semibold text-red-400 cursor-pointer">
                      Mark as Verified Server
                    </Label>
                    <Badge className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-1 text-xs">
                      ADMIN ONLY
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-blue-900/50 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-blue-300 text-lg mb-2">Admin Note</h4>
                        <p className="text-blue-200 leading-relaxed">
                          This will add the server directly to the alliance without going through the application
                          process. Make sure all information is accurate and the server meets alliance standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 pt-4">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl px-10 py-4 text-lg font-bold shadow-2xl shadow-green-900/50 transition-all duration-300 hover:scale-105 flex-1"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Alliance
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent rounded-xl px-10 py-4 text-lg font-bold flex-1"
                      onClick={(e) => {
                        e.preventDefault()
                        const form = e.target.form as HTMLFormElement
                        form.reset()
                      }}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div className="flex items-center justify-center space-x-4 mb-8">
              <Settings className="w-8 h-8 text-red-500" />
              <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
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
                    <Server className="w-8 h-8 text-green-400" />
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
                    <CheckCircle className="w-8 h-8 text-blue-400" />
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
          </div>
        )}

        <Card className="mt-8 bg-gray-800 border-gray-600">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-400">🐛 Admin Debug Panel</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <div>✅ Component Mounted: SUCCESS</div>
            <div>✅ Authentication: {isAuthenticated ? "SUCCESS" : "FAILED"}</div>
            <div>✅ Active Tab: {activeTab}</div>
            <div>✅ Applications Count: {applications.length}</div>
            <div>✅ Servers Count: {servers.length}</div>
            <div>✅ URL Password: "{urlInfo.password}"</div>
            <div>✅ URL Tab: "{urlInfo.tab}"</div>
            <div>✅ Window Object: {typeof window !== "undefined" ? "AVAILABLE" : "NOT AVAILABLE"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
