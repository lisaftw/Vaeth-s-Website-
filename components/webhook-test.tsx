"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { sendDiscordNotification } from "@/lib/discord-webhook"

export function WebhookTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const testWebhook = async () => {
    setIsLoading(true)
    setResult(null)

    const testApplication = {
      name: "Test Server",
      description: "This is a test application to verify the Discord webhook is working correctly.",
      members: 150,
      invite: "https://discord.gg/test",
      logo: "https://via.placeholder.com/64x64/ff0000/ffffff?text=TEST",
      representativeDiscordId: "123456789012345678",
    }

    try {
      const success = await sendDiscordNotification(testApplication)
      setResult(
        success
          ? "✅ Webhook test successful! Check your Discord channel."
          : "❌ Webhook test failed. Check console for errors.",
      )
    } catch (error) {
      setResult("❌ Webhook test failed with error: " + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Discord Webhook Test</CardTitle>
        <CardDescription>Test the Discord webhook integration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testWebhook} disabled={isLoading} className="w-full">
          {isLoading ? "Sending Test..." : "Test Discord Webhook"}
        </Button>
        {result && (
          <div
            className={`p-3 rounded-md text-sm ${
              result.includes("✅")
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {result}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
