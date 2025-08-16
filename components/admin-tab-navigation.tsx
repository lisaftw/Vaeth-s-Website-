"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface AdminTabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  password: string
  applicationsCount: number
  serversCount: number
}

export function AdminTabNavigation({
  activeTab,
  onTabChange,
  password,
  applicationsCount,
  serversCount,
}: AdminTabNavigationProps) {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "applications", label: "Applications", icon: "📝", count: applicationsCount },
    { id: "servers", label: "Servers", icon: "🖥️", count: serversCount },
    { id: "add-server", label: "Add Server", icon: "➕" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "content", label: "Content", icon: "📢" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
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
                <span className="w-4 h-4 mr-1">{tab.icon}</span>
                <div className="text-center">
                  <div className="text-sm">{tab.label}</div>
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
              <span className="w-5 h-5 mr-2">{tab.icon}</span>
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
    <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "outline"}
          onClick={() => handleTabClick(tab.id)}
          className="flex items-center gap-2"
        >
          <span>{tab.icon}</span>
          {tab.label}
        </Button>
      ))}
    </div>
  )
}
