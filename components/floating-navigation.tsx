"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, Home, Users, Crown } from "lucide-react"

export function FloatingNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300)
    }

    const updateActiveSection = () => {
      const sections = ["hero", "stats", "why-join", "servers", "cta"]
      const scrollPosition = window.pageYOffset + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    const handleScroll = () => {
      toggleVisibility()
      updateActiveSection()
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const navigationItems = [
    { id: "hero", icon: Home, label: "Home" },
    { id: "stats", icon: Users, label: "Stats" },
    { id: "servers", icon: Crown, label: "Servers" },
  ]

  return (
    <>
      {/* Floating Navigation Dots */}
      <div
        className={`fixed right-8 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        }`}
      >
        <div className="flex flex-col space-y-3 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-red-900/30">
          {navigationItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                const element = document.getElementById(id)
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              }}
              className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === id
                  ? "bg-red-500 scale-150 shadow-lg shadow-red-500/50"
                  : "bg-gray-600 hover:bg-red-400 hover:scale-125"
              }`}
              title={label}
            >
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-red-900/30">
                  {label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-40 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full w-14 h-14 p-0 shadow-2xl shadow-red-900/50 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-75"
        }`}
      >
        <ChevronUp className="w-6 h-6 animate-bounce" />
      </Button>
    </>
  )
}
