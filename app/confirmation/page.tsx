import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, CheckCircle, Clock, MessageSquare, ArrowLeft, FileText, Users } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { EnhancedParallax } from "@/components/enhanced-parallax"
import { SmoothScrollContainer } from "@/components/smooth-scroll-container"
import { ScrollProgress } from "@/components/scroll-progress"
import { AnimatedBackground } from "@/components/animated-background"

function ConfirmationContent() {
  return (
    <SmoothScrollContainer>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <AnimatedBackground />
        <ScrollProgress />

        {/* Enhanced Background Effects */}
        <EnhancedParallax speed={0.3}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 via-black to-green-950/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        </EnhancedParallax>

        {/* Header */}
        <header className="border-b border-green-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <ScrollReveal direction="left" duration={600}>
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Crown className="w-8 h-8 text-green-500" />
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                      Unified Realms
                    </span>
                    <div className="text-xs text-green-400/70 font-medium tracking-wider">ALLIANCE</div>
                  </div>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-950/50 bg-transparent"
                >
                  <Link href="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-16 relative z-10">
          <ScrollReveal direction="up" duration={800}>
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-green-900/50 animate-pulse">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  Application Submitted!
                </span>
              </h1>
              <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto mb-6"></div>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Thank you for your interest in joining the{" "}
                <span className="text-green-400 font-semibold">Unified Realms Alliance</span>. Your application has been
                successfully submitted and is now under review.
              </p>
            </div>
          </ScrollReveal>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Application Status */}
            <ScrollReveal direction="up" duration={800} delay={200}>
              <Card className="bg-gradient-to-br from-gray-900 to-black border-green-900/30 shadow-2xl shadow-green-900/20">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-green-400 mb-2 flex items-center justify-center">
                    <Clock className="w-6 h-6 mr-2" />
                    Review Timeline
                  </CardTitle>
                  <CardDescription className="text-gray-400">Track your application progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Step */}
                    <div className="flex items-center space-x-4 p-4 bg-green-950/30 rounded-lg border border-green-900/50">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-400">Application Submitted</h3>
                        <p className="text-sm text-gray-400">Your application has been received and logged</p>
                      </div>
                      <div className="ml-auto text-xs text-green-400 font-medium">COMPLETED</div>
                    </div>

                    {/* Next Steps */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center animate-pulse">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-400">Under Review</h3>
                        <p className="text-sm text-gray-400">Our alliance council is reviewing your server</p>
                      </div>
                      <div className="ml-auto text-xs text-yellow-400 font-medium">IN PROGRESS</div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-gray-800/20 rounded-lg border border-gray-700/30">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-400">Decision & Contact</h3>
                        <p className="text-sm text-gray-500">We'll contact you via Discord with our decision</p>
                      </div>
                      <div className="ml-auto text-xs text-gray-500 font-medium">PENDING</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* What Happens Next */}
            <ScrollReveal direction="up" duration={800} delay={400}>
              <Card className="bg-gradient-to-br from-gray-900 to-black border-green-900/30 shadow-2xl shadow-green-900/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-400 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    What Happens Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
                          1
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400">Initial Review</h4>
                          <p className="text-sm text-gray-400">
                            Our team will review your server details, member count, and community focus within 24 hours.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
                          2
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400">Server Visit</h4>
                          <p className="text-sm text-gray-400">
                            A council member may visit your server to assess community activity and culture.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
                          3
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400">Council Decision</h4>
                          <p className="text-sm text-gray-400">
                            The alliance council will make a final decision based on alignment with our values.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1">
                          4
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-400">Direct Contact</h4>
                          <p className="text-sm text-gray-400">
                            We'll contact your server representative directly via Discord with our decision.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Important Information */}
            <ScrollReveal direction="up" duration={800} delay={600}>
              <div className="bg-gradient-to-r from-blue-950/30 to-blue-900/30 border border-blue-900/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Important Information
                </h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    • <strong>Response Time:</strong> We typically respond within 24-48 hours
                  </p>
                  <p>
                    • <strong>Contact Method:</strong> All communication will be through Discord
                  </p>
                  <p>
                    • <strong>Requirements:</strong> Active community, aligned values, and quality engagement
                  </p>
                  <p>
                    • <strong>Next Steps:</strong> If approved, you'll receive an alliance invitation and partnership
                    details
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal direction="up" duration={800} delay={800}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-xl py-3 text-lg font-semibold shadow-2xl shadow-green-900/50 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/">
                    <Crown className="w-5 h-5 mr-2" />
                    Return Home
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-green-500/50 text-green-400 hover:bg-green-950/50 bg-transparent rounded-xl py-3 text-lg font-semibold"
                >
                  <a href="https://discord.gg/yXTrkPPQAK" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Join Our Discord
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-500/50 text-gray-400 hover:bg-gray-950/50 bg-transparent rounded-xl py-3 text-lg font-semibold"
                >
                  <Link href="/terms">
                    <FileText className="w-5 h-5 mr-2" />
                    Review Terms
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </main>
      </div>
    </SmoothScrollContainer>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <Crown className="w-12 h-12 mx-auto mb-4 animate-pulse text-green-500" />
            <p>Loading confirmation...</p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
