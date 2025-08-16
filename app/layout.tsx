import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LoadingScreen } from "@/components/loading-screen"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Unified Realms - Elite Discord Alliance",
  description: "A powerful alliance of Discord servers working together to grow and thrive",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta property="og:url" content="https://unifiedrealms.org" />
        <meta property="og:title" content="Unified Realms - Elite Discord Alliance" />
        <meta
          property="og:description"
          content="Join our growing alliance of Discord servers. Connect, grow, and thrive together."
        />
        <meta name="theme-color" content="#dc2626" />
        <link rel="canonical" href="https://unifiedrealms.org" />
        <style>{`
          html {
            scroll-behavior: smooth;
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #000;
          }
          
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #dc2626, #b91c1c);
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #ef4444, #dc2626);
          }
          
          /* Firefox scrollbar */
          * {
            scrollbar-width: thin;
            scrollbar-color: #dc2626 #000;
          }

          /* Hide v0 attribution */
          [data-v0-t], 
          .v0-attribution,
          [class*="v0-"],
          [id*="v0-"],
          iframe[src*="v0.dev"],
          div[style*="v0.dev"],
          a[href*="v0.dev"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            position: absolute !important;
            left: -9999px !important;
            width: 0 !important;
            height: 0 !important;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <LoadingScreen />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  )
}
