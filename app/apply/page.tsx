"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, AlertCircle, CheckCircle, Users, Shield, Globe } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { submitApplication } from "@/app/actions/submit-application"

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await submitApplication(formData)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "missing_fields":
        return "Please fill in all required fields."
      case "invalid_members":
        return "Please enter a valid member count."
      case "duplicate":
        return "An application with this server name and invite already exists."
      case "submission_failed":
        return "Failed to submit application. Please try again."
      default:
        return null
    }
  }

  const errorMessage = getErrorMessage(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      {/* Header */}
      <div className="relative z-10 bg-gray-900/50 border-b border-red-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the <span className="text-red-400">Unified Realms</span> Alliance
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ready to unite your server with the most powerful gaming alliance? Submit your application below and
              become part of something extraordinary.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{errorMessage}</p>
            </div>
          )}

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Massive Network</h3>
                <p className="text-gray-400">Connect with thousands of active gamers across multiple servers</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Enhanced Security</h3>
                <p className="text-gray-400">Advanced moderation tools and security protocols</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Global Reach</h3>
                <p className="text-gray-400">Expand your community with international partnerships</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <Send className="w-6 h-6 mr-3 text-red-400" />
                Server Application
              </CardTitle>
              <p className="text-gray-400">
                Fill out the form below to submit your server for review. All fields marked with * are required.
              </p>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-300 flex items-center">
                      Server Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder="Enter your server name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="members" className="text-gray-300">
                      Member Count *
                    </Label>
                    <Input
                      id="members"
                      name="members"
                      type="number"
                      min="1"
                      required
                      placeholder="e.g., 1500"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Server Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    placeholder="Describe your server, its focus, community, and what makes it special..."
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="invite" className="text-gray-300">
                      Discord Invite Link *
                    </Label>
                    <Input
                      id="invite"
                      name="invite"
                      type="url"
                      required
                      placeholder="https://discord.gg/yourserver"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo" className="text-gray-300">
                      Server Logo URL (Optional)
                    </Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="representativeId" className="text-gray-300">
                      Representative Discord ID *
                    </Label>
                    <Input
                      id="representativeId"
                      name="representativeId"
                      required
                      placeholder="123456789012345678"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      The Discord ID of your main representative/contact person
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ownerName" className="text-gray-300">
                      Server Owner Name *
                    </Label>
                    <Input
                      id="ownerName"
                      name="ownerName"
                      required
                      placeholder="Enter the server owner's name"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-400"
                    />
                  </div>
                </div>

                {/* Requirements Section */}
                <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-4">Application Requirements</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Minimum 100 active members</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Active moderation team</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Gaming-focused community</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>Commitment to alliance values</span>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="bg-gray-700/20 p-4 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-400">
                    By submitting this application, you agree to our{" "}
                    <Link href="/terms" className="text-red-400 hover:text-red-300 underline">
                      Terms of Service
                    </Link>{" "}
                    and confirm that all information provided is accurate. Applications are typically reviewed within
                    24-48 hours.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Questions about the application process? Need help with your submission?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="border-gray-600 text-gray-300 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                24/7 Support Available
              </Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Secure Application Process
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
