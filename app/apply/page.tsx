"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitApplication } from "@/app/actions/submit-application"
import { ArrowLeft, Send, Shield, Users, Globe } from "lucide-react"
import Link from "next/link"

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await submitApplication(formData)
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error submitting application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Header */}
      <div className="relative z-10 bg-gray-900/50 border-b border-red-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-red-400" />
              <h1 className="text-2xl font-bold text-white">Alliance Application</h1>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Alliance</h2>
            <p className="text-gray-300 text-lg">
              Apply to become part of our growing network of Discord servers. Together, we build stronger communities.
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Grow Together</h3>
                <p className="text-gray-400 text-sm">Expand your community through cross-server collaboration</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Enhanced Security</h3>
                <p className="text-gray-400 text-sm">Benefit from shared security measures and best practices</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Global Network</h3>
                <p className="text-gray-400 text-sm">Connect with servers worldwide and share resources</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-xl">Application Form</CardTitle>
              <p className="text-gray-400">Please fill out all required fields to submit your application.</p>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-6">
                {/* Server Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Server Information</h3>

                  <div>
                    <Label htmlFor="serverName" className="text-gray-300">
                      Server Name *
                    </Label>
                    <Input
                      id="serverName"
                      name="serverName"
                      type="text"
                      required
                      placeholder="Enter your server name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">
                      Server Description *
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      placeholder="Describe your server, its purpose, and community"
                      rows={4}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="memberCount" className="text-gray-300">
                      Current Member Count *
                    </Label>
                    <Input
                      id="memberCount"
                      name="memberCount"
                      type="number"
                      required
                      min="1"
                      placeholder="e.g., 1500"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serverInvite" className="text-gray-300">
                      Discord Invite Link *
                    </Label>
                    <Input
                      id="serverInvite"
                      name="serverInvite"
                      type="url"
                      required
                      placeholder="https://discord.gg/your-invite"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="logoUrl" className="text-gray-300">
                      Server Logo URL (Optional)
                    </Label>
                    <Input
                      id="logoUrl"
                      name="logoUrl"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                    Contact Information
                  </h3>

                  <div>
                    <Label htmlFor="ownerName" className="text-gray-300">
                      Server Owner Name *
                    </Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      required
                      placeholder="Your name or username"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="representativeId" className="text-gray-300">
                      Representative Discord ID *
                    </Label>
                    <Input
                      id="representativeId"
                      name="representativeId"
                      type="text"
                      required
                      placeholder="e.g., 123456789012345678"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Right-click your profile in Discord and select "Copy User ID" (Developer Mode must be enabled)
                    </p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Agreement</h3>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm mb-3">By submitting this application, you agree to:</p>
                    <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                      <li>Follow all alliance guidelines and policies</li>
                      <li>Maintain a respectful and safe community environment</li>
                      <li>Participate in alliance activities and communications</li>
                      <li>Allow alliance representatives to join your server for verification</li>
                    </ul>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Applications are typically reviewed within 24-48 hours. You will be contacted via Discord once your
              application has been processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
