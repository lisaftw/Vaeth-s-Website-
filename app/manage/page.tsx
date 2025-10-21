"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { requestToken, verifyToken, updateMyServer } from "@/app/actions/auth-actions"
import { Shield, Server, Key, Edit, Save, X } from "lucide-react"

export default function ManageServerPage() {
  const [step, setStep] = useState<"request" | "verify" | "manage">("request")
  const [serverName, setServerName] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [token, setToken] = useState("")
  const [server, setServer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Form state for editing
  const [editForm, setEditForm] = useState({
    description: "",
    invite: "",
    logo: "",
    lead_delegate_discord_id: "",
    lead_delegate_name: "",
  })

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await requestToken(serverName, discordId)

    if (result.success && result.token) {
      setToken(result.token)
      setSuccess("Access token generated! Please save this token securely.")
      setStep("verify")
    } else {
      setError(result.error || "Failed to generate token")
    }

    setLoading(false)
  }

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await verifyToken(token)

    if (result.success && result.server) {
      setServer(result.server)
      setEditForm({
        description: result.server.description || "",
        invite: result.server.invite || "",
        logo: result.server.logo || "",
        lead_delegate_discord_id: result.server.lead_delegate_discord_id || "",
        lead_delegate_name: result.server.lead_delegate_name || "",
      })
      setStep("manage")
    } else {
      setError(result.error || "Invalid token")
    }

    setLoading(false)
  }

  const handleUpdateServer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    const result = await updateMyServer(token, editForm)

    if (result.success) {
      setSuccess(result.message || "Server updated successfully!")
      setIsEditing(false)
      // Refresh server data
      const verifyResult = await verifyToken(token)
      if (verifyResult.success && verifyResult.server) {
        setServer(verifyResult.server)
      }
    } else {
      setError(result.error || "Failed to update server")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Server className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Manage Your Server
            </h1>
          </div>
          <p className="text-gray-400">Update your server information and settings</p>
        </div>

        {step === "request" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-red-600" />
                Request Access Token
              </CardTitle>
              <CardDescription>Enter your server name and Discord ID to generate an access token</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRequestToken} className="space-y-4">
                <div>
                  <Label htmlFor="serverName">Server Name</Label>
                  <Input
                    id="serverName"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="Enter your server name"
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>

                <div>
                  <Label htmlFor="discordId">Representative Discord ID</Label>
                  <Input
                    id="discordId"
                    value={discordId}
                    onChange={(e) => setDiscordId(e.target.value)}
                    placeholder="Enter your Discord ID"
                    required
                    className="bg-zinc-800 border-zinc-700"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This must match the Discord ID registered with your server
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-900/20 border-green-900 text-green-400">
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                  {loading ? "Generating..." : "Generate Token"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("verify")}
                  className="w-full border-zinc-700"
                >
                  Already have a token? Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "verify" && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Verify Access Token
              </CardTitle>
              <CardDescription>Enter your access token to manage your server</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyToken} className="space-y-4">
                <div>
                  <Label htmlFor="token">Access Token</Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your access token"
                    required
                    className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                  {loading ? "Verifying..." : "Verify Token"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("request")}
                  className="w-full border-zinc-700"
                >
                  Back to Request Token
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "manage" && server && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-red-600" />
                  {server.name}
                </div>
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-zinc-700">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </CardTitle>
              <CardDescription>Manage your server information</CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-400">Description</Label>
                    <p className="text-white mt-1">{server.description || "No description"}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Discord Invite</Label>
                    <p className="text-white mt-1">{server.invite || "No invite"}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Logo URL</Label>
                    <p className="text-white mt-1 break-all">{server.logo || "No logo"}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Lead Delegate Name</Label>
                    <p className="text-white mt-1">{server.lead_delegate_name || "Not set"}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Lead Delegate Discord ID</Label>
                    <p className="text-white mt-1">{server.lead_delegate_discord_id || "Not set"}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Member Count</Label>
                    <p className="text-white mt-1">{server.members || 0}</p>
                  </div>

                  <div>
                    <Label className="text-gray-400">Tags</Label>
                    <div className="flex gap-2 mt-1">
                      {server.tags?.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-red-900/20 text-red-400 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateServer} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="invite">Discord Invite Code</Label>
                    <Input
                      id="invite"
                      value={editForm.invite}
                      onChange={(e) => setEditForm({ ...editForm, invite: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="e.g., yXTrkPPQAK"
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <Input
                      id="logo"
                      value={editForm.logo}
                      onChange={(e) => setEditForm({ ...editForm, logo: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="delegateName">Lead Delegate Name</Label>
                    <Input
                      id="delegateName"
                      value={editForm.lead_delegate_name}
                      onChange={(e) => setEditForm({ ...editForm, lead_delegate_name: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Enter delegate name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="delegateId">Lead Delegate Discord ID</Label>
                    <Input
                      id="delegateId"
                      value={editForm.lead_delegate_discord_id}
                      onChange={(e) => setEditForm({ ...editForm, lead_delegate_discord_id: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                      placeholder="Enter Discord ID"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-900/20 border-green-900 text-green-400">
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700">
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="border-zinc-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
