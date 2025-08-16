"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ModernLogo } from "./modern-logo"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Only show loading screen on initial page load, not on navigation
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedBefore")

    if (hasLoadedBefore) {
      setIsVisible(false)
      setHasLoaded(true)
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsVisible(false)
            setHasLoaded(true)
            sessionStorage.setItem("hasLoadedBefore", "true")
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  // Don't show loading screen if already loaded or on admin pages
  if (hasLoaded || pathname?.startsWith("/admin")) return null
  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-red-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.2),transparent_70%)]"></div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        {/* 3D Animated Logo */}
        <div className="mb-8">
          <ModernLogo size="xl" animated={true} className="mx-auto" />
        </div>

        {/* Loading text */}
        <h1 className="text-4xl font-bold mb-8">
          <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            UNIFIED REALMS
          </span>
        </h1>

        <div className="text-red-400 mb-8 text-lg font-medium">Initializing Alliance Systems...</div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Loading</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading messages */}
        <div className="mt-6 text-gray-500 text-sm">
          {progress < 30 && "Connecting to alliance network..."}
          {progress >= 30 && progress < 60 && "Authenticating credentials..."}
          {progress >= 60 && progress < 90 && "Loading server database..."}
          {progress >= 90 && "Welcome to the alliance!"}
        </div>
      </div>
    </div>
  )
}
