"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function AdminDebugEnhanced() {
  const searchParams = useSearchParams()
  const [debugInfo, setDebugInfo] = useState({
    tab: "",
    password: "",
    url: "",
    timestamp: "",
  })

  useEffect(() => {
    setDebugInfo({
      tab: searchParams.get("tab") || "none",
      password: searchParams.get("password") ? "present" : "missing",
      url: window.location.href,
      timestamp: new Date().toLocaleTimeString(),
    })
  }, [searchParams])

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-3 rounded-lg text-xs z-50 border border-red-500 max-w-xs">
      <div className="font-bold text-red-400 mb-2">Admin Debug Info</div>
      <div>
        Tab: <span className="text-green-400">{debugInfo.tab}</span>
      </div>
      <div>
        Password: <span className="text-green-400">{debugInfo.password}</span>
      </div>
      <div>
        Updated: <span className="text-blue-400">{debugInfo.timestamp}</span>
      </div>
      <div className="mt-2 text-gray-400 break-all">URL: {debugInfo.url.split("?")[1] || "no params"}</div>
    </div>
  )
}
