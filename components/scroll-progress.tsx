"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = scrollPx / winHeightPx
      setScrollProgress(scrolled)
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    return () => window.removeEventListener("scroll", updateScrollProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-black/20 z-50 backdrop-blur-sm">
      <div
        className="h-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 transition-all duration-150 ease-out shadow-lg shadow-red-500/50"
        style={{
          width: `${scrollProgress * 100}%`,
          boxShadow: scrollProgress > 0 ? "0 0 20px rgba(239, 68, 68, 0.6)" : "none",
        }}
      />
    </div>
  )
}
