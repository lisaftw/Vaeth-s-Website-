import { getBumpLeaderboard } from "@/lib/bump-helpers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LeaderboardPage() {
  const leaderboard = await getBumpLeaderboard(20)

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Alliance Leaderboard
            </h1>
          </div>
          <p className="text-gray-400">Top servers ranked by activity and engagement</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              Top Servers
            </CardTitle>
            <CardDescription>Servers are ranked by their total bump count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((server, index) => {
                const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null
                const rankColor =
                  index === 0
                    ? "text-yellow-400"
                    : index === 1
                      ? "text-gray-300"
                      : index === 2
                        ? "text-amber-600"
                        : "text-gray-500"

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${rankColor} w-12 text-center`}>
                        {medal || `#${index + 1}`}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{server.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {server.members?.toLocaleString() || 0} members
                          </span>
                          <span className="text-red-400">{server.bump_count || 0} bumps</span>
                        </div>
                      </div>
                    </div>
                    {server.last_bump && (
                      <div className="text-sm text-gray-500">
                        Last bump: {new Date(server.last_bump).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No servers on the leaderboard yet. Be the first to bump!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild variant="outline" className="border-zinc-700 bg-transparent">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
