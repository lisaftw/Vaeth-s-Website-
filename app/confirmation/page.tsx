import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Shield, ArrowLeft, Home, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ModernLogo } from "@/components/modern-logo"
import { FloatingBackButton } from "@/components/floating-back-button"

interface ConfirmationPageProps {
  searchParams: {
    server?: string
  }
}

export default function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const serverName = searchParams.server || "Your Server"

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <ModernLogo size="sm" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
              </div>
            </Link>
            <Link href="/" className="text-gray-400 hover:text-red-400 transition-colors font-medium">
              Return to Alliance
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-all duration-300 group"
          >
            <Link href="/" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" />
              Back to Alliance
            </Link>
          </Button>
        </div>

        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-16 h-16 text-white animate-bounce" />
            </div>
            <div className="absolute inset-0 bg-green-500/30 rounded-full blur-2xl animate-ping"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              APPLICATION SUBMITTED!
            </span>
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto mb-6"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-green-900/30 shadow-2xl shadow-green-900/20 mb-8">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="w-8 h-8 text-green-500" />
                <CardTitle className="text-3xl font-bold text-green-400">{decodeURIComponent(serverName)}</CardTitle>
              </div>
              <CardDescription className="text-gray-300 text-lg">
                Your application has been successfully submitted to the Unified Realms Alliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Status Badge */}
              <div className="text-center">
                <Badge className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-6 py-3 text-lg font-bold">
                  <Clock className="w-5 h-5 mr-2" />
                  PENDING REVIEW
                </Badge>
              </div>

              {/* Review Timeline */}
              <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/20 border border-blue-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  Review Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-blue-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="font-semibold">Application Received</span>
                    <span className="ml-auto text-green-400">✓ Complete</span>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="font-semibold">Initial Review</span>
                    <span className="ml-auto text-yellow-400">⏳ In Progress</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                    <span className="font-semibold">Alliance Decision</span>
                    <span className="ml-auto">⏸️ Pending</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                    <span className="font-semibold">Welcome to Alliance</span>
                    <span className="ml-auto">⏸️ Pending</span>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="bg-gradient-to-r from-purple-950/30 to-purple-900/20 border border-purple-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2" />
                  What Happens Next?
                </h3>
                <div className="space-y-4 text-purple-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-semibold">Review Process</p>
                      <p className="text-sm text-purple-300">
                        Our alliance administrators will review your server within 24-48 hours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-semibold">Server Evaluation</p>
                      <p className="text-sm text-purple-300">
                        We'll check your server's activity, community guidelines, and overall quality
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-semibold">Decision Notification</p>
                      <p className="text-sm text-purple-300">
                        You'll receive a response via Discord DM or server announcement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-900/50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Important Information
                </h3>
                <div className="space-y-3 text-red-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                    <p>Keep your Discord server active and welcoming during the review process</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                    <p>Ensure your server invite link remains valid and accessible</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                    <p>Review our Terms of Service to ensure your server meets all requirements</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                    <p>Be patient - quality reviews take time, but it's worth the wait!</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  asChild
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-8 py-3 text-lg font-semibold shadow-2xl shadow-red-900/50 transition-all duration-300 hover:scale-105 flex-1"
                >
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Return to Alliance
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-green-500/50 text-green-400 hover:bg-green-950/50 hover:border-green-400 rounded-xl px-8 py-3 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 flex-1 bg-transparent"
                >
                  <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Join Discord HQ
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-blue-500/50 text-blue-400 hover:bg-blue-950/50 hover:border-blue-400 rounded-xl px-8 py-3 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 flex-1 bg-transparent"
                >
                  <Link href="/terms">
                    <Shield className="w-5 h-5 mr-2" />
                    Review Terms
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">Questions about your application? Need to make changes?</p>
            <p className="text-red-400 font-semibold">
              Contact us through our main Discord server or check back here for updates.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Back Button for Mobile */}
      <FloatingBackButton href="/" label="Back to Alliance" />
    </div>
  )
}
