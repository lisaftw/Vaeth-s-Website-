import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ModernLogo } from "@/components/modern-logo"
import { submitApplication } from "@/app/actions/submit-application"
import Link from "next/link"
import { ArrowLeft, Users, Crown, MessageSquare, User, LinkIcon } from "lucide-react"

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <ModernLogo size="sm" />
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider animate-pulse">ALLIANCE</div>
              </div>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <ModernLogo size="lg" animated={true} className="mx-auto" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                Join the Alliance
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Apply to become part of the Unified Realms Alliance and connect with like-minded communities.
            </p>
          </div>

          {/* Application Form */}
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-red-400">Server Application</CardTitle>
              <CardDescription className="text-gray-400">
                Fill out the form below to apply for membership in the Unified Realms Alliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={submitApplication} className="space-y-6">
                {/* Server Name */}
                <div className="space-y-2">
                  <Label htmlFor="serverName" className="text-red-300 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Server Name *
                  </Label>
                  <Input
                    id="serverName"
                    name="serverName"
                    type="text"
                    required
                    placeholder="Enter your server name"
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400"
                  />
                </div>

                {/* Server Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-red-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Server Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    placeholder="Describe your server, its purpose, and what makes it unique"
                    rows={4}
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400 resize-none"
                  />
                </div>

                {/* Member Count */}
                <div className="space-y-2">
                  <Label htmlFor="memberCount" className="text-red-300 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Member Count *
                  </Label>
                  <Input
                    id="memberCount"
                    name="memberCount"
                    type="number"
                    required
                    min="1"
                    placeholder="Number of members in your server"
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400"
                  />
                </div>

                {/* Discord Invite Link */}
                <div className="space-y-2">
                  <Label htmlFor="serverInvite" className="text-red-300 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Discord Invite Link *
                  </Label>
                  <Input
                    id="serverInvite"
                    name="serverInvite"
                    type="url"
                    required
                    placeholder="https://discord.gg/your-invite-code"
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-red-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Server Owner Name *
                  </Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    required
                    placeholder="Your name or username"
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400"
                  />
                </div>

                {/* Representative Discord ID */}
                <div className="space-y-2">
                  <Label htmlFor="representativeDiscordId" className="text-red-300 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Representative Discord ID *
                  </Label>
                  <Input
                    id="representativeDiscordId"
                    name="representativeDiscordId"
                    type="text"
                    required
                    placeholder="username#1234 or @username"
                    className="bg-black/50 border-red-500/30 text-white placeholder:text-gray-500 focus:border-red-400"
                  />
                  <p className="text-sm text-gray-500">
                    The Discord username of the person we should contact regarding this application
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Application
                  </Button>
                </div>

                {/* Terms Notice */}
                <div className="text-center text-sm text-gray-500">
                  By submitting this application, you agree to our{" "}
                  <Link href="/terms" className="text-red-400 hover:text-red-300 underline">
                    Terms of Service
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
