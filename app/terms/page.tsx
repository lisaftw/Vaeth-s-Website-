import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Crown, AlertTriangle, Scale, Mail, ArrowLeft } from "lucide-react"
import { ModernLogo } from "@/components/modern-logo"
import { FloatingBackButton } from "@/components/floating-back-button"

export default function TermsPage() {
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
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-red-400 transition-colors">
                Home
              </Link>
              <Link href="/apply" className="text-gray-300 hover:text-red-400 transition-colors">
                Apply
              </Link>
              <Link href="/terms" className="text-red-400 font-medium">
                Terms
              </Link>
            </nav>
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

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <ModernLogo size="lg" animated={true} className="mx-auto" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                ALLIANCE CHARTER
              </span>
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">The sacred laws that govern our digital empire</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-red-900/30 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-red-900/30">
                <div className="flex items-center space-x-3">
                  <Scale className="w-8 h-8 text-red-500" />
                  <h2 className="text-2xl font-bold text-red-400">Terms of Service</h2>
                </div>
                <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
              </div>

              <div className="prose prose-red max-w-none text-gray-300 space-y-12">
                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                    <Crown className="w-6 h-6 mr-3" />
                    1. Acceptance of Terms
                  </h3>
                  <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-6 mb-6">
                    <p className="text-lg leading-relaxed">
                      By accessing and using the <span className="text-red-400 font-semibold">Unified Realms</span>{" "}
                      website and services, you accept and agree to be bound by the terms and provisions of this
                      agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    These Terms of Service apply to all users of the site, including without limitation users who are
                    browsers, vendors, customers, merchants, and/or contributors of content.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-3" />
                    2. Description of Service
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    <span className="text-red-400 font-semibold">Unified Realms</span> is an elite platform that
                    facilitates the discovery and promotion of Discord servers through an exclusive alliance network. We
                    provide:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-semibold text-red-400">Elite Directory</span>
                      </div>
                      <p className="text-sm text-gray-400">Curated collection of premium Discord servers</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-semibold text-red-400">Application System</span>
                      </div>
                      <p className="text-sm text-gray-400">Rigorous review process for server owners</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-semibold text-red-400">Promotional Network</span>
                      </div>
                      <p className="text-sm text-gray-400">Cross-promotion opportunities for alliance members</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="font-semibold text-red-400">Strategic Partnerships</span>
                      </div>
                      <p className="text-sm text-gray-400">Community networking and collaboration facilitation</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-3" />
                    3. Discord Terms Compliance
                  </h3>
                  <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-6">
                    <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                      All servers listed on <span className="text-red-400 font-semibold">Unified Realms</span> must
                      maintain strict compliance with Discord's Terms of Service and Community Guidelines:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          Zero tolerance for harassment or hate speech
                        </div>
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          No illegal or harmful content sharing
                        </div>
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          Respect for intellectual property rights
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          Professional spam and promotion policies
                        </div>
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          Age restrictions and safety compliance
                        </div>
                        <div className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          Active moderation and community standards
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6">4. Elite Submission Guidelines</h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    When submitting your Discord server for alliance membership, you must ensure:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gray-800/30 rounded-lg p-4 flex items-start">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Accuracy & Authenticity</h4>
                        <p className="text-gray-300">
                          All information provided is accurate, up-to-date, and represents your server truthfully
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 flex items-start">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Professional Standards</h4>
                        <p className="text-gray-300">
                          Your server maintains active moderation, clear rules, and professional community standards
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4 flex items-start">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400 mb-2">Authority & Ownership</h4>
                        <p className="text-gray-300">
                          You have the legal authority to represent the server and make binding commitments
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6">5. Review & Approval Process</h3>
                  <div className="bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-900/50 rounded-xl p-6">
                    <h4 className="font-bold text-red-300 text-xl mb-4">Our Elite Review Process</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">1</span>
                          </div>
                          <span className="text-gray-300">Manual review by alliance commanders</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">2</span>
                          </div>
                          <span className="text-gray-300">Comprehensive content and compliance verification</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">3</span>
                          </div>
                          <span className="text-gray-300">Community activity and engagement assessment</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">4</span>
                          </div>
                          <span className="text-gray-300">3-5 business day review timeline</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6">6. Governing Law</h3>
                  <p className="text-gray-300 leading-relaxed">
                    These terms and conditions are governed by and construed in accordance with applicable digital
                    commerce laws. Any disputes arising under these terms shall be subject to binding arbitration in
                    accordance with industry standards.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center">
                    <Mail className="w-6 h-6 mr-3" />
                    7. Contact Information
                  </h3>
                  <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                    For questions about these Terms of Service or alliance matters:
                  </p>
                  <div className="bg-gradient-to-r from-red-950/30 to-red-900/20 border border-red-900/50 rounded-xl p-6">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                      <div>
                        <Mail className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h4 className="font-bold text-red-300 mb-2">Email</h4>
                        <p className="text-gray-300">notpreston.rp@gmail.com</p>
                      </div>
                      <div>
                        <Shield className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h4 className="font-bold text-red-300 mb-2">Discord</h4>
                        <a
                          href="https://discord.gg/yXTrkPPQAK"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Join Main Server
                        </a>
                      </div>
                      <div>
                        <Crown className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h4 className="font-bold text-red-300 mb-2">Website</h4>
                        <Link href="/" className="text-red-400 hover:text-red-300 transition-colors">
                          unifiedrealms.org
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-950/50 to-red-900/30 p-8 border-t border-red-900/30">
              <Link
                href="/"
                className="inline-flex items-center text-red-400 hover:text-red-300 font-semibold text-lg transition-colors"
              >
                ← Return to the Realms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back Button for Mobile */}
      <FloatingBackButton href="/" label="Back to Alliance" />
    </div>
  )
}
