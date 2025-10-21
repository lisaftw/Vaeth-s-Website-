"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Star, Users } from "lucide-react"

interface ServerLogoProps {
  name?: string
  logo?: string
  verified?: boolean
  members?: number
  size?: "sm" | "md" | "lg"
  showBadge?: boolean
  className?: string
}

// Generate a consistent color based on server name
function getServerColor(name = "Unknown Server"): string {
  if (!name || name.length === 0) return "bg-red-600"

  const colors = [
    "bg-red-600",
    "bg-blue-600",
    "bg-green-600",
    "bg-purple-600",
    "bg-yellow-600",
    "bg-pink-600",
    "bg-indigo-600",
    "bg-teal-600",
  ]

  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  return colors[Math.abs(hash) % colors.length]
}

// Get server initials for fallback
function getServerInitials(name = "Unknown Server"): string {
  if (!name || name.length === 0) return "US"

  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Get appropriate icon based on server type
function getServerIcon(name = "Unknown Server") {
  if (!name || name.length === 0) return Users

  const lowerName = name.toLowerCase()

  if (lowerName.includes("main") || lowerName.includes("unified") || lowerName.includes("hub")) {
    return Shield
  }
  if (lowerName.includes("elite") || lowerName.includes("premium") || lowerName.includes("vip")) {
    return Star
  }
  return Users
}

export function ServerLogo({
  name = "Unknown Server",
  logo,
  verified = false,
  members = 0,
  size = "md",
  showBadge = true,
  className = "",
}: ServerLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const colorClass = getServerColor(name)
  const initials = getServerInitials(name)
  const IconComponent = getServerIcon(name)

  return (
    <div className={`relative ${className}`}>
      <Avatar className={`${sizeClasses[size]} border-2 border-red-900/30 hover:border-red-600/50 transition-colors`}>
        <AvatarImage
          src={logo || "/placeholder.svg"}
          alt={`${name} logo`}
          className="object-cover"
          onError={(e) => {
            // Hide broken images and show fallback
            console.log(`[v0] Failed to load image for ${name}:`, logo)
            e.currentTarget.style.display = "none"
          }}
        />
        <AvatarFallback className={`${colorClass} text-white ${textSizes[size]} font-bold relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-white/5 rounded-full transform translate-x-2 -translate-y-2"></div>

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            {size === "lg" ? (
              <div className="flex flex-col items-center justify-center">
                <IconComponent className="w-4 h-4 mb-1" />
                <span className="text-xs">{initials}</span>
              </div>
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </AvatarFallback>
      </Avatar>

      {/* Verification badge */}
      {verified && showBadge && (
        <div className="absolute -top-1 -right-1">
          <Badge variant="secondary" className="bg-green-600 hover:bg-green-700 text-white border-0 p-1 rounded-full">
            <Shield className="w-3 h-3" />
          </Badge>
        </div>
      )}

      {/* Member count badge for larger sizes */}
      {members > 0 && size === "lg" && showBadge && (
        <div className="absolute -bottom-1 -right-1">
          <Badge variant="outline" className="bg-red-900/90 text-red-100 border-red-700 text-xs px-2 py-1">
            <Users className="w-3 h-3 mr-1" />
            {members.toLocaleString()}
          </Badge>
        </div>
      )}
    </div>
  )
}
