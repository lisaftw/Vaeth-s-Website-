import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Crown, MessageSquare, ArrowLeft, Clock, Users, Shield } from 'lucide-react'
import Link from "next/link"
import { ModernLogo } from "@/components/modern-logo"

export default function ConfirmationPage() {
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-900/50 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Application Submitted!
                </span>
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto mb-6"></div>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Thank you for your interest in joining the{" "}
                <span className="text-red-400 font-semibold">Unified Realms Alliance</span>. Your application has been
                successfully received and is now under review.
              </p>
            </div>
          </div>

          {/* Review Timeline */}
          <Card className="mb-8 bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-400 flex items-center">
                <Clock className="w-6 h-6 mr-3" />
                Review Timeline
              </CardTitle>
              <CardDescription className="text-gray-400">
                Here's what happens next with your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-400 mb-1">Application Received</h3>
                    <p className="text-gray-400 text-sm">
                      Your application has been successfully submitted and logged in our system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-yellow-400 mb-1">Under Review</h3>
                    <p className="text-gray-400 text-sm">
                      Our alliance council is currently reviewing your server and application details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400 mb-1">Direct Contact</h3>
                    <p className="text-gray-400 text-sm">
                      We'll reach out to your server representative via Discord within 24-48 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400 mb-1">Alliance Invitation</h3>
                    <p className="text-gray-400 text-sm">
                      Approved servers will receive an official invitation to join our alliance network.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-400 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Server quality and community standards assessment</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Alignment with alliance values and goals</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Member engagement and activity evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Partnership potential and mutual benefits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-400 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Keep your Discord server invite link active</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Ensure your representative is available for contact</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Review our terms of service and alliance guidelines</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-sm">Join our main Discord for updates and announcements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-8 py-3 text-lg font-semibold shadow-2xl shadow-red-900/50 transition-all duration-300 hover:scale-105"
            >
              <Link href="/">
                <Crown className="w-5 h-5 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-red-500/50 text-red-400 hover:bg-red-950/50 hover:border-red-400 rounded-xl px-8 py-3 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-5 h-5 mr-2" />
                Join Main Discord
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-gray-500/50 text-gray-400 hover:bg-gray-950/50 hover:border-gray-400 rounded-xl px-8 py-3 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Link href="/terms">
                <Shield className="w-5 h-5 mr-2" />
                Review Terms
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
