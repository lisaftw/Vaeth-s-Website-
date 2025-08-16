"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface AdminFormButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  type?: "button" | "submit" | "reset"
  disabled?: boolean
}

export function AdminFormButton({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "submit",
  disabled = false,
  ...props
}: AdminFormButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    if (type === "submit") {
      setIsLoading(true)
      // Reset loading state after a delay to handle potential errors
      setTimeout(() => setIsLoading(false), 5000)
    }
  }

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
