"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface FloatingBackButtonProps {
  href?: string
  label?: string
}

export function FloatingBackButton({ href = "/", label = "Back to Alliance" }: FloatingBackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      onClick={handleBack}
      className="fixed bottom-6 left-6 z-40 bg-red-600/90 hover:bg-red-700 text-white border-0 rounded-full w-14 h-14 p-0 shadow-2xl shadow-red-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 group md:hidden"
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-300" />
    </Button>
  )
}
