import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModernLogo } from "@/components/modern-logo"
import Link from "next/link"
import { CheckCircle, Clock, MessageSquare, Home, ExternalLink } from "lucide-react"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <ModernLogo size="sm" />
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider animate-pulse">ALLIANCE</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <ModernLogo size="lg" animated={true} className="mx-auto" />
            </div>
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                Application Submitted!
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for applying to join the Unified Realms Alliance. Your application has been received and is now
              under review.
            </p>
          </div>

          {/* Review Timeline */}
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-red-400 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                Review Process
              </CardTitle>
              <CardDescription className="text-gray-400">
                Here's what happens next with your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-400">Application Received</h3>
                    <p className="text-sm text-gray-400">Your application has been successfully submitted</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-yellow-400">Under Review</h3>
                    <p className="text-sm text-gray-400">Our team is currently reviewing your application</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-gray-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-400">Decision Notification</h3>
                    <p className="text-sm text-gray-400">You'll be contacted via Discord with our decision</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Next */}
          <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-red-400">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Review Period</h4>
                    <p className="text-sm">Our team will review your application within 3-5 business days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Discord Contact</h4>
                    <p className="text-sm">
                      We'll reach out to your representative via Discord for any questions or updates.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-400">Final Decision</h4>
                    <p className="text-sm">You'll receive a final decision and next steps if approved.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-yellow-400">Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Make sure your Discord server invite link is permanent and doesn't expire</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Keep your representative Discord account active for communication</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>
                    Applications are reviewed based on server activity, community guidelines, and alignment with our
                    values
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <Link href="https://discord.gg/unifiedrealms" target="_blank" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Join Our Discord
                <ExternalLink className="w-3 h-3" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              <Link href="/terms" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Review Terms
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
