"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Crown, ExternalLink } from "lucide-react"

export function DiscordWidget() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent"></div>
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <CardTitle className="text-lg font-bold text-red-400">Alliance HQ</CardTitle>
            </div>
            <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-red-400 transition-colors">
              ×
            </button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-300">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Join our main Discord server</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm">Connect with alliance leaders</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <MessageSquare className="w-4 h-4 text-green-400" />
              <span className="text-sm">Get support & updates</span>
            </div>
            <Button
              asChild
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-2 font-semibold shadow-lg shadow-red-900/30 transition-all duration-300 hover:scale-105"
            >
              <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-4 h-4 mr-2" />
                Join Discord HQ
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
