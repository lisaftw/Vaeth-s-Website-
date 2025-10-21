"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, ExternalLink, Shield, Star, Calendar, User, TrendingUp } from "lucide-react"
import { ServerLogo } from "./server-logo"

interface Server {
  name: string
  description: string
  members: number
  invite: string
  logo?: string
  discordIcon?: string
  verified?: boolean
  dateAdded?: string
  tags?: string[]
  isMainServer?: boolean
  leadDelegateName?: string
  leadDelegateDiscordId?: string
  bumpCount?: number
  lastBump?: string
}

interface InteractiveServerCardProps {
  server: Server
  index: number
}

// Helper function to ensure proper Discord invite URL format
function getDiscordInviteUrl(invite: string): string {
  if (!invite) return "https://discord.gg/yXTrkPPQAK"
  if (invite.startsWith("http")) return invite
  if (invite.includes("discord.gg/")) return `https://${invite}`
  return `https://discord.gg/${invite}`
}

// Helper function to format member count
function formatMemberCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

// Helper function to format date
function formatDate(dateString?: string): string {
  if (!dateString) return "Recently"

  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  } catch {
    return "Recently"
  }
}

export function InteractiveServerCard({ server, index }: InteractiveServerCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  const handleJoinServer = async () => {
    setIsJoining(true)

    try {
      const discordUrl = getDiscordInviteUrl(server.invite)
      console.log("Opening Discord invite:", discordUrl)
      window.open(discordUrl, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("Error opening Discord invite:", error)
      window.open("https://discord.gg/yXTrkPPQAK", "_blank", "noopener,noreferrer")
    } finally {
      setTimeout(() => setIsJoining(false), 1000)
    }
  }

  return (
    <Card
      className={`
        bg-gradient-to-br from-gray-900 to-black border-red-900/30 
        hover:border-red-700/50 transition-all duration-500 
        hover:scale-105 group relative overflow-hidden
        ${isHovered ? "shadow-2xl shadow-red-900/25" : "shadow-lg shadow-black/50"}
        ${server.isMainServer ? "ring-2 ring-red-600/50" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl transform translate-x-16 -translate-y-16 group-hover:bg-red-600/10 transition-colors duration-500"></div>

      <CardHeader className="text-center pb-4 relative z-10">
        {/* Server Logo */}
        <div className="mx-auto mb-4">
          <ServerLogo
            name={server.name}
            logo={server.logo}
            discordIcon={server.discordIcon}
            verified={server.verified}
            members={server.members}
            size="lg"
            showBadge={true}
          />
        </div>

        {/* Server Name */}
        <CardTitle className="text-xl font-bold text-white mb-2 group-hover:text-red-300 transition-colors flex items-center justify-center gap-2">
          {server.name}
          {server.isMainServer && (
            <Badge className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              MAIN
            </Badge>
          )}
          {server.verified && !server.isMainServer && (
            <Badge className="bg-green-600 hover:bg-green-700 text-white border-0 text-xs">
              <Star className="w-3 h-3 mr-1" />
              VERIFIED
            </Badge>
          )}
        </CardTitle>

        {/* Member Count */}
        <div className="flex items-center justify-center gap-2 text-red-400 mb-3">
          <Users className="w-4 h-4" />
          <span className="font-semibold text-lg">{formatMemberCount(server.members)} members</span>
        </div>

        {/* Tags */}
        {server.tags && server.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mb-3">
            {server.tags.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="outline" className="text-xs border-red-700/50 text-red-300 bg-red-950/30">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Bump Count */}
        {server.bumpCount && server.bumpCount > 0 && (
          <div className="flex items-center justify-center gap-2 text-yellow-400 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>Bumped {server.bumpCount} times</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative z-10">
        {/* Description */}
        <div
          className="mb-6 cursor-pointer"
          onMouseEnter={() => setIsDescriptionExpanded(true)}
          onMouseLeave={() => setIsDescriptionExpanded(false)}
        >
          <CardDescription
            className={`
              text-center text-gray-300 text-sm leading-relaxed 
              transition-all duration-300
              ${isDescriptionExpanded ? "line-clamp-none" : "line-clamp-3"}
            `}
          >
            {server.description}
          </CardDescription>
          {/* Show indicator if text is long */}
          {!isDescriptionExpanded && server.description.length > 150 && (
            <div className="text-center mt-2">
              <span className="text-xs text-red-400/70 italic">Hover to read more...</span>
            </div>
          )}
        </div>

        {/* Lead Delegate Info */}
        {server.leadDelegateName && (
          <div className="mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
              <User className="w-3 h-3" />
              <span className="font-semibold text-gray-300">Lead Delegate:</span>
              <span>{server.leadDelegateName}</span>
            </div>
          </div>
        )}

        {/* Server Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {formatDate(server.dateAdded)}</span>
          </div>
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoinServer}
          disabled={isJoining}
          className={`
            w-full bg-gradient-to-r from-red-600 to-red-700 
            hover:from-red-700 hover:to-red-800 text-white border-0 
            rounded-xl py-3 font-semibold shadow-lg shadow-red-900/50 
            transition-all duration-300 hover:scale-105 hover:shadow-red-900/70 
            group/button relative overflow-hidden
            ${isJoining ? "opacity-75 cursor-not-allowed" : ""}
          `}
        >
          {/* Button background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>

          {/* Button content */}
          <div className="relative z-10 flex items-center justify-center gap-2">
            <ExternalLink className={`w-4 h-4 ${isJoining ? "animate-spin" : "group-hover/button:animate-bounce"}`} />
            <span>{isJoining ? "Opening..." : "Join Server"}</span>
          </div>
        </Button>

        {/* Additional info for main server */}
        {server.isMainServer && (
          <div className="mt-4 p-3 bg-red-950/20 rounded-lg border border-red-900/30">
            <p className="text-xs text-red-300 text-center">
              🏰 Main alliance hub - Strategic coordination & partnerships
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
