"use client"

import { useState } from "react"
import Image from "next/image"

interface ModernLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

export function ModernLogo({ size = "md", animated = true, className = "" }: ModernLogoProps) {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  }

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className} group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main logo container with 3D effect */}
      <div
        className={`relative w-full h-full transition-all duration-500 ${animated ? "group-hover:scale-110" : ""}`}
        style={{
          transform:
            isHovered && animated
              ? "perspective(1000px) rotateX(-5deg) rotateY(5deg)"
              : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Background glow layers */}
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute inset-0 bg-red-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Orbital rings */}
        {animated && (
          <>
            <div
              className="absolute inset-0 border-2 border-red-500/30 rounded-full animate-spin"
              style={{ animationDuration: "12s" }}
            >
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1/2 shadow-lg shadow-red-500/50"></div>
            </div>
            <div
              className="absolute inset-2 border border-red-400/20 rounded-full animate-spin"
              style={{ animationDuration: "8s", animationDirection: "reverse" }}
            >
              <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-red-400 rounded-full transform -translate-y-1/2 shadow-lg shadow-red-400/50"></div>
            </div>
          </>
        )}

        {/* Main logo image */}
        <div className="relative w-full h-full z-10 rounded-full overflow-hidden">
          <Image
            src="/logo.png"
            alt="Unified Realms"
            fill
            className={`object-cover drop-shadow-2xl transition-all duration-300 ${
              isHovered && animated ? "brightness-110 contrast-110 scale-105" : ""
            }`}
          />

          {/* Holographic overlay effect */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-red-400/20 via-transparent to-red-600/20 transition-opacity duration-300 ${
              isHovered && animated ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        </div>

        {/* Floating particles around logo */}
        {animated && isHovered && (
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  left: `${15 + Math.random() * 70}%`,
                  top: `${15 + Math.random() * 70}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        )}

        {/* Energy field effect */}
        <div
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            isHovered && animated
              ? "shadow-2xl shadow-red-500/50 ring-4 ring-red-500/20"
              : "shadow-lg shadow-red-900/30"
          }`}
        ></div>
      </div>

      {/* Pulsing base glow */}
      {animated && (
        <div
          className="absolute inset-0 bg-red-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
      )}
    </div>
  )
}
