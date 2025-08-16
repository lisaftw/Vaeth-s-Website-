"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Traffic Light Circles - Mobile Responsive */}
      <div className="absolute top-1/3 right-4 md:right-8 flex flex-col space-y-1 md:space-y-4">
        <div className="w-2 h-2 md:w-6 md:h-6 bg-red-500/30 rounded-full animate-pulse shadow-lg shadow-red-500/20"></div>
        <div
          className="w-2 h-2 md:w-6 md:h-6 bg-yellow-500/30 rounded-full animate-pulse shadow-lg shadow-yellow-500/20"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="w-2 h-2 md:w-6 md:h-6 bg-green-500/30 rounded-full animate-pulse shadow-lg shadow-green-500/20"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating Geometric Shapes - Mobile Optimized */}
      <div className="absolute top-1/4 left-4 md:left-12">
        <div
          className="w-4 h-4 md:w-8 md:h-8 border border-red-500/20 rotate-45 animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      <div className="absolute bottom-1/3 left-8 md:left-16">
        <div
          className="w-3 h-3 md:w-6 md:h-6 bg-red-400/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="absolute top-2/3 right-12 md:right-24">
        <div
          className="w-2 h-8 md:w-4 md:h-16 bg-gradient-to-b from-red-500/20 to-transparent animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      {/* Floating Particles - Reduced on Mobile */}
      <div className="absolute top-1/2 left-1/4">
        <div
          className="w-1 h-1 md:w-2 md:h-2 bg-red-300/40 rounded-full animate-ping"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="absolute bottom-1/4 right-1/3">
        <div
          className="w-1 h-1 md:w-2 md:h-2 bg-red-400/30 rounded-full animate-ping"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Subtle Grid Pattern - Hidden on Small Mobile */}
      <div className="hidden sm:block absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Orbital Rings - Mobile Optimized */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-32 h-32 md:w-64 md:h-64 border border-red-500/5 rounded-full animate-spin"
          style={{ animationDuration: "30s" }}
        ></div>
        <div
          className="absolute top-4 left-4 md:top-8 md:left-8 w-24 h-24 md:w-48 md:h-48 border border-red-400/5 rounded-full animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        ></div>
      </div>

      {/* Corner Accents - Mobile Responsive */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8">
        <div className="w-8 h-0.5 md:w-16 md:h-1 bg-gradient-to-r from-red-500/30 to-transparent"></div>
        <div className="w-0.5 h-8 md:w-1 md:h-16 bg-gradient-to-b from-red-500/30 to-transparent"></div>
      </div>

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
        <div className="w-8 h-0.5 md:w-16 md:h-1 bg-gradient-to-l from-red-500/30 to-transparent"></div>
        <div className="w-0.5 h-8 md:w-1 md:h-16 bg-gradient-to-t from-red-500/30 to-transparent ml-auto"></div>
      </div>
    </div>
  )
}
