"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { FileText, Server, Plus, BarChart, Edit, Settings } from "lucide-react"
import { useEffect, useState } from "react"

interface AdminTabNavigationFixedProps {
  password: string
  applicationsCount: number
  serversCount: number
}

export function AdminTabNavigationFixed({ password, applicationsCount, serversCount }: AdminTabNavigationFixedProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("applications")
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
    const tab = searchParams.get("tab") || "applications"
    setActiveTab(tab)
  }, [searchParams])

  const tabs = [
    {
      id: "applications",
      label: "Applications",
      shortLabel: "Apps",
      icon: FileText,
      count: applicationsCount,
    },
    {
      id: "servers",
      label: "Servers",
      shortLabel: "Servers",
      icon: Server,
      count: serversCount,
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
      icon: BarChart,
    },
    {
      id: "content",
      label: "Content",
      shortLabel: "Content",
      icon: Edit,
    },
    {
      id: "settings",
      label: "Settings",
      shortLabel: "Settings",
      icon: Settings,
    },
  ]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    const url = `/admin?password=${encodeURIComponent(password)}&tab=${encodeURIComponent(tabId)}`
    router.push(url)
  }

  // Don't render until client-side to avoid hydration issues
  if (!isClient) {
    return (
      <div className="mb-8 md:mb-12">
        <div className="md:hidden">
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className="flex items-center justify-center px-3 py-2 rounded-lg font-semibold bg-gray-800/50 text-gray-300 whitespace-nowrap flex-shrink-0"
              >
                <tab.icon className="w-4 h-4 mr-1" />
                <div className="text-center">
                  <div className="text-sm">{tab.shortLabel}</div>
                  {tab.count !== undefined && <div className="text-xs">({tab.count})</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-4">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-gray-800/50 text-gray-300"
            >
              <tab.icon className="w-5 h-5 mr-2" />
              <div className="text-center">
                <div>{tab.label}</div>
                {tab.count !== undefined && <div className="text-xs">({tab.count})</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8 md:mb-12">
      {/* Mobile Tab Navigation - Horizontal Scroll */}
      <div className="md:hidden">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center justify-center px-3 py-2 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 cursor-pointer ${
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

      {/* Desktop Tab Navigation */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-6 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center justify-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
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

      {/* Debug Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Active Tab: {activeTab} | Password: {password ? "✓" : "✗"} | Client: {isClient ? "✓" : "✗"}
      </div>
    </div>
  )
}
