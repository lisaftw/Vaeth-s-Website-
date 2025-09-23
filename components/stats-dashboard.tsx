"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { AnimatedCounter } from "./animated-counter"

interface Stats {
  totalServers: number
  totalMembers: number
  totalApplications: number
  pendingApplications: number
  approvedApplications: number
  rejectedApplications: number
  error?: string
  isError?: boolean
}

interface StatsResponse {
  success: boolean
  data: Stats
  error?: string
  isError?: boolean
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalServers: 0,
    totalMembers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log("Fetching stats from API...")
        const response = await fetch("/api/stats", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: StatsResponse = await response.json()
        console.log("Stats API response:", result)

        if (result.success && result.data) {
          setStats(result.data)

          // Set error state for non-critical errors (like missing manual stats)
          if (result.isError && result.error) {
            setError(result.error)
          } else {
            setError(null)
          }
        } else {
          // Handle API-level errors
          setError(result.error || "Failed to load stats")
          setStats(result.data || stats) // Use fallback data if available
        }
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError("Unable to connect to stats service")
        // Keep existing stats or use defaults
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-red-950/10 to-transparent">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Alliance Statistics
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 animate-pulse">
                <CardHeader className="pb-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg mb-2"></div>
                  <div className="w-24 h-4 bg-gray-700 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="w-16 h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="w-20 h-3 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-red-950/10 to-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Alliance Statistics
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4"></div>

          {error && (
            <div className="flex items-center justify-center space-x-2 text-yellow-400 text-sm mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Stats may not be current: {error}</span>
            </div>
          )}

          <p className="text-gray-400">Real-time metrics from our growing alliance network</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Server className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-2xl font-bold text-blue-400">
                    <AnimatedCounter end={stats.totalServers} duration={2000} />
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Alliance Servers</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-2xl font-bold text-green-400">
                    <AnimatedCounter end={stats.totalMembers} duration={2500} />
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Total Members</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <CardTitle className="text-2xl font-bold text-purple-400">
                    <AnimatedCounter end={stats.totalApplications} duration={1800} />
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Applications</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Application Status Breakdown */}
        {stats.totalApplications > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-900/30 hover:border-yellow-700/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-lg font-bold text-yellow-400">
                      <AnimatedCounter end={stats.pendingApplications} duration={1500} />
                    </p>
                    <p className="text-gray-400 text-sm">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-green-900/30 hover:border-green-700/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-lg font-bold text-green-400">
                      <AnimatedCounter end={stats.approvedApplications} duration={1500} />
                    </p>
                    <p className="text-gray-400 text-sm">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-lg font-bold text-red-400">
                      <AnimatedCounter end={stats.rejectedApplications} duration={1500} />
                    </p>
                    <p className="text-gray-400 text-sm">Rejected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
