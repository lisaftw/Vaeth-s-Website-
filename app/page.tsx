import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Handshake, Megaphone, Crown, Shield } from "lucide-react"
import Link from "next/link"
import { getServers } from "./actions/get-servers"
import { StatsDashboard } from "@/components/stats-dashboard"
import { InteractiveServerCard } from "@/components/interactive-server-card"
import { TypingAnimation } from "@/components/typing-animation"
import { ModernLogo } from "@/components/modern-logo"
import { MobileNavigation } from "@/components/mobile-navigation"

export default async function HomePage() {
  const servers = await getServers()

  const typingTexts = ["Elite Discord Alliance", "Powerful Server Network", "Strategic Partnerships", "Digital Empire"]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ModernLogo size="sm" />
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider animate-pulse">ALLIANCE</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-red-400 hover:text-red-300 transition-colors font-medium relative group">
                Home
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link href="/apply" className="text-gray-300 hover:text-red-400 transition-colors relative group">
                Apply
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-red-400 transition-colors relative group">
                Terms
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </nav>

            {/* Mobile Navigation */}
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative py-16 md:py-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-black to-red-950/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(220,38,38,0.1),transparent_50%)]"></div>

        <div className="container mx-auto text-center relative z-20">
          <div className="mb-8 md:mb-12">
            {/* Modern 3D Logo */}
            <div className="mb-6 md:mb-8">
              <ModernLogo size="lg" animated={true} className="mx-auto" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
                UNIFIED
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                REALMS
              </span>
            </h1>

            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6 md:mb-8 animate-pulse"></div>

            {/* Typing Animation */}
            <div className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              A <span className="text-red-400 font-semibold">growing alliance</span> of Discord servers united in
              purpose,
            </div>
            <div className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              building powerful partnerships to create the{" "}
              <span className="text-red-400 font-semibold">
                <TypingAnimation texts={typingTexts} speed={150} deleteSpeed={100} pauseTime={2000} />
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-6 md:px-10 py-3 md:py-4 text-lg font-semibold shadow-2xl shadow-red-900/50 transition-all duration-300 hover:scale-105 hover:shadow-red-900/70 group"
            >
              <Link href="/apply">
                <Crown className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Join the Alliance
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-red-500/50 text-red-400 hover:bg-red-950/50 hover:border-red-400 rounded-xl px-6 md:px-10 py-3 md:py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 group bg-transparent"
            >
              <Link href="#servers">
                <Shield className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Explore Realms
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      <section id="stats">
        <StatsDashboard />
      </section>

      {/* Why Join Section */}
      <section id="why-join" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Why Join the Alliance?
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-900/50 transition-all duration-300 group-hover:scale-110">
                  <Users className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                  Exponential Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center text-gray-300 text-lg leading-relaxed">
                  Connect with our <span className="text-red-400 font-semibold">growing network</span> of quality
                  Discord communities and discover new members who share your interests and values.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-900/50 transition-all duration-300 group-hover:scale-110">
                  <Handshake className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                  Strategic Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center text-gray-300 text-lg leading-relaxed">
                  Build <span className="text-red-400 font-semibold">meaningful connections</span> with other server
                  owners, share resources and knowledge, and grow together through collaborative efforts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 hover:border-red-700/50 transition-all duration-500 hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:shadow-2xl group-hover:shadow-red-900/50 transition-all duration-300 group-hover:scale-110">
                  <Megaphone className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-400 mb-3 group-hover:text-red-300 transition-colors">
                  Elite Promotion
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <CardDescription className="text-center text-gray-300 text-lg leading-relaxed">
                  Get featured in our <span className="text-red-400 font-semibold">alliance network</span> and benefit
                  from cross-promotion that introduces your server to new potential members.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Servers */}
      <section id="servers" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                Elite Realms
              </span>
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Discover the most prestigious servers in our alliance</p>
          </div>

          {servers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {servers.map((server, index) => (
                <InteractiveServerCard key={index} server={server} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Crown className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">Growing Our Alliance</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We're just getting started! Be among the first servers to join our alliance and help us build something
                incredible.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 rounded-xl px-8 py-3 font-semibold hover:scale-105 transition-all duration-300"
              >
                <Link href="/apply">
                  <Crown className="w-5 h-5 mr-2" />
                  Join Our Alliance
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900 to-red-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.3),transparent_70%)]"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <ModernLogo size="md" animated={true} className="mx-auto" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-red-300 animate-pulse">Ascend</span>?
          </h2>

          <p className="text-red-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Submit your Discord server for review and join our{" "}
            <span className="font-semibold animate-pulse">growing alliance</span> in the digital realm.
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white text-red-600 hover:bg-red-50 border-0 rounded-xl px-12 py-4 text-xl font-bold shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-white/20"
          >
            <Link href="/apply">
              <Crown className="w-6 h-6 mr-3 animate-bounce" />
              Apply for Membership
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900/30 py-12 px-4 relative">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <ModernLogo size="sm" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Unified Realms
                </span>
                <div className="text-xs text-red-400/70 font-medium tracking-wider">ALLIANCE</div>
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
                Terms of Service
              </Link>
              <a
                href="https://discord.gg/yXTrkPPQAK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Join Main Server
              </a>
              <div className="text-gray-500 text-sm">© 2024 Unified Realms Alliance</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-red-900/20 text-center">
            <p className="text-gray-500 italic animate-pulse">
              "United we stand, divided we fall. Together, we conquer all realms."
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
