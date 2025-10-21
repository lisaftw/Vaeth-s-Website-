"use client"

import { useState } from "react"
import Image from "next/image"
import { Crown, Shield, Star, Zap } from "lucide-react"

interface ServerAvatarProps {
  name: string
  iconUrl?: string | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showBorder?: boolean
  animated?: boolean
}

export function ServerAvatar({
  name,
  iconUrl,
  size = "md",
  className = "",
  showBorder = true,
  animated = true,
}: ServerAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  // Generate a consistent color based on server name
  const getServerColor = (serverName: string) => {
    let hash = 0
    for (let i = 0; i < serverName.length; i++) {
      hash = serverName.charCodeAt(i) + ((hash << 5) - hash)
    }

    const colors = [
      "from-red-500 to-red-700",
      "from-blue-500 to-blue-700",
      "from-green-500 to-green-700",
      "from-purple-500 to-purple-700",
      "from-yellow-500 to-yellow-700",
      "from-pink-500 to-pink-700",
      "from-indigo-500 to-indigo-700",
      "from-cyan-500 to-cyan-700",
    ]

    return colors[Math.abs(hash) % colors.length]
  }

  // Get server icon based on name
  const getServerIcon = (serverName: string) => {
    const lowerName = serverName.toLowerCase()
    if (lowerName.includes("gaming") || lowerName.includes("game")) return Zap
    if (lowerName.includes("elite") || lowerName.includes("premium")) return Crown
    if (lowerName.includes("community") || lowerName.includes("social")) return Star
    return Shield
  }

  const gradientColor = getServerColor(name)
  const IconComponent = getServerIcon(name)
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const useDiscordIcon = iconUrl && !imageError

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className} group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main avatar container */}
      <div
        className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 ${
          animated ? "group-hover:scale-110 group-hover:rotate-3" : ""
        } ${showBorder ? "ring-2 ring-red-500/30 group-hover:ring-red-400/60" : ""}`}
      >
        {useDiscordIcon ? (
          <>
            <Image
              src={iconUrl || "/placeholder.svg"}
              alt={`${name} icon`}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
            {/* Hover glow effect */}
            {animated && (
              <div
                className={`
                absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 rounded-2xl
              `}
              ></div>
            )}
          </>
        ) : (
          <>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-90`}></div>

            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 2px, transparent 2px),
                    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: "8px 8px",
                }}
              ></div>
            </div>

            {/* Server icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <IconComponent
                className={`${iconSizes[size]} text-white drop-shadow-lg transition-all duration-300 ${
                  isHovered && animated ? "scale-125 rotate-12" : ""
                }`}
              />
            </div>

            {/* Initials fallback */}
            <div className="absolute bottom-1 right-1">
              <div
                className={`
                bg-black/40 backdrop-blur-sm rounded-md px-1 py-0.5 
                ${size === "sm" ? "text-xs" : size === "md" ? "text-xs" : size === "lg" ? "text-sm" : "text-base"}
                text-white font-bold
              `}
              >
                {initials}
              </div>
            </div>

            {/* Hover glow effect */}
            {animated && (
              <div
                className={`
                absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 rounded-2xl
              `}
              ></div>
            )}
          </>
        )}
      </div>

      {/* Floating particles on hover */}
      {animated && isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full animate-ping"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}

      {/* Status indicator */}
      <div className="absolute -bottom-1 -right-1">
        <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-lg animate-pulse"></div>
      </div>
    </div>
  )
}
