"use client"

interface AdminTabDebugProps {
  activeTab: string
  password: string
}

export function AdminTabDebug({ activeTab, password }: AdminTabDebugProps) {
  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-2 rounded text-xs z-50 border border-red-500">
      <div>Active Tab: {activeTab}</div>
      <div>Password: {password ? "✓" : "✗"}</div>
      <div>URL: {typeof window !== "undefined" ? window.location.search : "SSR"}</div>
    </div>
  )
}
