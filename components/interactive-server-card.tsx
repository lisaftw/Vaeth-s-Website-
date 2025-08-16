"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Zap, Crown, Star, Shield, Tag, Calendar } from "lucide-react"
import { ServerLogo } from "./server-logo"

interface Server {
  name: string
  description: string
  invite: string
  members: number
  logo?: string
  verified?: boolean
  tags?: string[]
  dateAdded?: string
}

interface InteractiveServerCardProps {
  server: Server
  index: number
}

export function InteractiveServerCard({ server, index }: InteractiveServerCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 200)
  }

  const getStatusBadge = () => {
    if (server.tags?.includes("Founding")) return { text: "Founding", color: "bg-red-600" }
    if (server.tags?.includes("Official")) return { text: "Official", color: "bg-blue-600" }
    if (server.tags?.includes("Premium")) return { text: "Premium", color: "bg-purple-600" }
    if (server.tags?.includes("Active")) return { text: "Active", color: "bg-green-600" }
    return { text: "Community", color: "bg-gray-600" }
  }

  const statusBadge = getStatusBadge()

  return (
    <Card
      className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 hover:border-red-600/50 transition-all duration-500 group overflow-hidden relative ${
        isHovered ? "scale-105 shadow-2xl shadow-red-900/50" : ""
      } ${isClicked ? "scale-95" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Animated background */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent transition-opacity duration-500 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      ></div>

      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Server Logo */}
            <ServerLogo
              name={server.name}
              logo={server.logo}
              size="lg"
              animated={true}
              showBorder={true}
              verified={server.verified}
            />
            <div className="flex flex-col">
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full shadow-lg animate-pulse ${
                    isHovered ? "bg-green-400 shadow-green-400/50" : "bg-green-500 shadow-green-500/50"
                  }`}
                ></div>
                <Badge className={`${statusBadge.color} text-white border-0 px-3 py-1 font-bold text-xs`}>
                  {statusBadge.text}
                </Badge>
                {server.verified && (
                  <Badge className="bg-blue-600 text-white border-0 px-2 py-1 font-bold text-xs">VERIFIED</Badge>
                )}
              </div>
              <CardTitle
                className={`text-xl font-bold transition-colors duration-300 ${
                  isHovered ? "text-red-300" : "text-red-400"
                }`}
              >
                {server.name}
              </CardTitle>
            </div>
          </div>
          <div className={`transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`}>
            {server.verified ? (
              <Crown className="w-6 h-6 text-yellow-500" />
            ) : index % 3 === 0 ? (
              <Crown className="w-6 h-6 text-yellow-500" />
            ) : index % 3 === 1 ? (
              <Star className="w-6 h-6 text-blue-500" />
            ) : (
              <Shield className="w-6 h-6 text-green-500" />
            )}
          </div>
        </div>

        {/* Tags */}
        {server.tags && server.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {server.tags.slice(0, 4).map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                className="bg-gray-700/50 text-gray-300 border-0 px-2 py-1 text-xs hover:bg-red-600/20 hover:text-red-300 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {server.tags.length > 4 && (
              <Badge className="bg-gray-600/50 text-gray-400 border-0 px-2 py-1 text-xs">
                +{server.tags.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <CardDescription className="text-gray-300 leading-relaxed">{server.description}</CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-gray-400">
            <Users
              className={`w-5 h-5 text-red-500 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}
            />
            <span className="text-lg font-semibold text-white">{server.members.toLocaleString()}</span>
            <span className="text-sm">members</span>
          </div>
          <Button
            asChild
            size="sm"
            className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-6 py-2 font-semibold shadow-lg shadow-red-900/30 transition-all duration-300 ${
              isHovered ? "scale-105 shadow-2xl shadow-red-900/50" : ""
            }`}
          >
            <a href={server.invite} target="_blank" rel="noopener noreferrer">
              <Zap className="w-4 h-4 mr-2" />
              Join
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Date added */}
        {server.dateAdded && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            Joined {new Date(server.dateAdded).toLocaleDateString()}
          </div>
        )}

        {/* Progress bar animation */}
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000 ${
              isHovered ? "w-full" : "w-0"
            }`}
          ></div>
        </div>
      </CardContent>
    </Card>
  )
}
