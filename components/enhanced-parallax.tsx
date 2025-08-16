"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface EnhancedParallaxProps {
  children: React.ReactNode
  speed?: number
  direction?: "vertical" | "horizontal"
  className?: string
  offset?: number
}

export function EnhancedParallax({
  children,
  speed = 0.5,
  direction = "vertical",
  className = "",
  offset = 0,
}: EnhancedParallaxProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [elementTop, setElementTop] = useState(0)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const updateElementPosition = () => {
      const rect = element.getBoundingClientRect()
      setElementTop(rect.top + window.scrollY)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      const rect = element.getBoundingClientRect()
      const isVisible = rect.bottom >= 0 && rect.top <= window.innerHeight
      setIsInView(isVisible)
    }

    updateElementPosition()
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", updateElementPosition)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", updateElementPosition)
    }
  }, [])

  const getTransform = () => {
    if (!isInView) return "translate3d(0, 0, 0)"

    const rate = (scrollY - elementTop + offset) * speed

    if (direction === "horizontal") {
      return `translate3d(${rate}px, 0, 0)`
    }
    return `translate3d(0, ${rate}px, 0)`
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: getTransform(),
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}
