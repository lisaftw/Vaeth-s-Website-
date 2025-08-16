import { WebhookTest } from "@/components/webhook-test"
import { FloatingBackButton } from "@/components/floating-back-button"

export default function WebhookTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-4">
      <FloatingBackButton />
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Discord Webhook Test</h1>
          <p className="text-gray-400">Test the Discord integration for application notifications</p>
        </div>

        <div className="flex justify-center">
          <WebhookTest />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">How it works:</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              When someone submits an application, a Discord message is automatically sent
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              The message includes server name, description, member count, and invite link
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              If provided, it also includes the representative's Discord ID and server logo
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-1">•</span>
              Messages are formatted as rich embeds with your alliance branding
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
