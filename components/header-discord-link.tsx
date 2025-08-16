"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeaderDiscordLink() {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className="border-red-500/50 text-red-400 hover:bg-red-950/50 hover:border-red-400 bg-transparent hidden lg:flex"
    >
      <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer" className="flex items-center">
        <MessageSquare className="w-4 h-4 mr-2" />
        Discord HQ
      </a>
    </Button>
  )
}
