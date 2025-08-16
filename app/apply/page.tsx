import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Crown, ArrowLeft, User, Users, MessageSquare, Hash, Globe, UserCheck } from 'lucide-react'
import Link from "next/link"
import { submitApplication } from "../actions/submit-application"
import { ModernLogo } from "@/components/modern-logo"

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.1),transparent_50%)]"></div>

      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <ModernLogo size="sm" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                asChild
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-950/50 bg-transparent"
              >
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-950/50 bg-transparent hidden sm:flex"
              >
                <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discord HQ
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="mb-6">
            <ModernLogo size="lg" animated={true} className="mx-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Join the Alliance
            </span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Submit your Discord server for review and become part of our{" "}
            <span className="text-red-400 font-semibold">elite alliance</span>. We're looking for quality communities
            that share our vision of growth and collaboration.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-red-400 mb-2">Application Form</CardTitle>
            <CardDescription className="text-gray-400">
              Please provide detailed information about your Discord server
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitApplication} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serverName" className="text-red-400 font-medium flex items-center">
                  <Hash className="w-4 h-4 mr-2" />
                  Server Name *
                </Label>
                <Input
                  id="serverName"
                  name="serverName"
                  required
                  placeholder="Enter your Discord server name"
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serverInvite" className="text-red-400 font-medium flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Server Invite Link *
                </Label>
                <Input
                  id="serverInvite"
                  name="serverInvite"
                  type="url"
                  required
                  placeholder="https://discord.gg/your-invite"
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="memberCount" className="text-red-400 font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Member Count *
                </Label>
                <Input
                  id="memberCount"
                  name="memberCount"
                  type="number"
                  required
                  min="1"
                  placeholder="e.g., 150"
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-red-400 font-medium flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Server Owner Name *
                </Label>
                <Input
                  id="ownerName"
                  name="ownerName"
                  required
                  placeholder="Your name or username"
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="representativeDiscordId" className="text-red-400 font-medium flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Server Representative Discord ID *
                </Label>
                <Input
                  id="representativeDiscordId"
                  name="representativeDiscordId"
                  required
                  placeholder="username#1234, @username, or 123456789012345678"
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide your Discord username, new username format (@username), or user ID for direct contact
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-red-400 font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Server Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe your server's purpose, community, and what makes it special..."
                  className="bg-gray-800/50 border-red-900/30 text-white placeholder-gray-500 focus:border-red-500 focus:ring-red-500/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl py-3 text-lg font-semibold shadow-2xl shadow-red-900/50 transition-all duration-300 hover:scale-105 hover:shadow-red-900/70 group"
              >
                <Crown className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-950/30 to-red-900/30 border border-red-900/30 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-400 mb-3">What happens next?</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Our alliance council will review your application within 24-48 hours. We'll contact your server
              representative directly via Discord to discuss the next steps. Quality communities that align with our
              values will be invited to join our growing network.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
