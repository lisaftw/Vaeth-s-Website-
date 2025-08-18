"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface StatsData {
  totalServers: number
  totalMembers: number
  securityScore: number
  lastUpdated: string
  error?: string
}

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalServers: 1,
    totalMembers: 250,
    securityScore: 100,
    lastUpdated: new Date().toISOString(),
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Function to fetch updated stats
  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("=== FETCHING STATS FROM API ===")
      console.log("Making request to /api/stats...")

      const response = await fetch("/api/stats", {
        method: "GET",
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API response not ok:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Received stats data:", data)

      // Update stats, using fallbacks for any missing data
      const newStats: StatsData = {
        totalServers: data.totalServers || 1,
        totalMembers: data.totalMembers || 250,
        securityScore: data.securityScore || 100,
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        error: data.error,
      }

      console.log("Setting new stats:", newStats)
      setStats(newStats)

      if (data.error) {
        console.warn("API returned with error:", data.error)
        setError(`API Warning: ${data.error}`)
      }
    } catch (fetchError) {
      console.error("=== FETCH STATS ERROR ===")
      console.error("Error fetching stats:", fetchError)
      console.error("Error type:", typeof fetchError)
      console.error("Error message:", fetchError instanceof Error ? fetchError.message : String(fetchError))

      const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError)
      setError(`Failed to fetch stats: ${errorMessage}`)

      // Keep existing stats on error, don't reset them
      console.log("Keeping existing stats due to error")
    } finally {
      setIsLoading(false)
      console.log("=== FETCH STATS COMPLETE ===")
    }
  }

  useEffect(() => {
    console.log("StatsDashboard mounted, fetching initial stats...")
    fetchStats()

    // Refresh stats every 60 seconds (increased from 30 to reduce load)
    const interval = setInterval(() => {
      console.log("Auto-refreshing stats...")
      fetchStats()
    }, 60000)

    return () => {
      console.log("StatsDashboard unmounting, clearing interval")
      clearInterval(interval)
    }
  }, [])

  const statsConfig = [
    {
      title: "Alliance Servers",
      value: stats.totalServers,
      icon: Server,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      suffix: "",
      description: "Total servers in alliance",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      suffix: "",
      description: "Combined member count",
    },
    {
      title: "Security Score",
      value: stats.securityScore,
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      suffix: "%",
      description: "Alliance security rating",
    },
  ]

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-red-950/10"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Alliance Statistics
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Real-time metrics from across the digital empire</p>
          {stats.lastUpdated && (
            <p className="text-gray-500 text-sm mt-2">Last updated: {new Date(stats.lastUpdated).toLocaleString()}</p>
          )}
          {error && (
            <p className="text-yellow-500 text-sm mt-2 bg-yellow-500/10 px-4 py-2 rounded-lg inline-block">⚠️ {error}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {statsConfig.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 hover:border-red-600/50 transition-all duration-500 hover:scale-105 group overflow-hidden relative"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <div className="w-6 h-6 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-3xl font-bold text-white">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className={`font-semibold ${stat.color} text-lg mb-1`}>{stat.title}</p>
                <p className="text-gray-500 text-sm">{stat.description}</p>
                <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color.replace("text-", "from-")} to-transparent rounded-full transition-all duration-1000 ${
                      isLoading ? "animate-pulse" : ""
                    }`}
                    style={{ width: `${Math.min((stat.value / (stat.suffix === "%" ? 1 : 10)) * 10, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Debug info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 text-center">
            <details className="text-gray-500 text-xs">
              <summary className="cursor-pointer hover:text-gray-400">Debug Info</summary>
              <pre className="mt-2 text-left bg-gray-900 p-4 rounded-lg overflow-auto">
                {JSON.stringify({ stats, isLoading, error }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </section>
  )
}
