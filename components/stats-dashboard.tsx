"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Server, Crown, Shield } from "lucide-react"

export function StatsDashboard() {
  const stats = [
    {
      title: "Total Servers",
      value: 1,
      icon: Server,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      suffix: "",
    },
    {
      title: "Alliance Members",
      value: 0,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      suffix: "",
    },
    {
      title: "Elite Partnerships",
      value: 0,
      icon: Crown,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      suffix: "",
    },
    {
      title: "Security Score",
      value: 100,
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      suffix: "%",
    },
  ]

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/10 via-transparent to-red-950/10"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Alliance Statistics
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Real-time metrics from across the digital empire</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 hover:border-red-600/50 transition-all duration-500 hover:scale-105 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <CardTitle className="text-3xl font-bold text-white">
                      {stat.value}
                      {stat.suffix}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className={`font-semibold ${stat.color} text-lg`}>{stat.title}</p>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${stat.color.replace("text-", "from-")} to-transparent rounded-full animate-pulse`}
                    style={{ width: `${Math.min(stat.value / 10, 100)}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
