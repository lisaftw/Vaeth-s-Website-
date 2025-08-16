'use client'

import { useEffect, useState } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'

  const triggerGlitch = () => {
    if (isGlitching) return
    
    setIsGlitching(true)
    let iterations = 0
    const maxIterations = 10

    const interval = setInterval(() => {
      setGlitchText(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) return text[index]
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          })
          .join('')
      )

      iterations += 1

      if (iterations >= maxIterations) {
        clearInterval(interval)
        setGlitchText(text)
        setIsGlitching(false)
      }
    }, 50)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 3 seconds
        triggerGlitch()
      }
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse' : ''}`}
      onMouseEnter={triggerGlitch}
    >
      {glitchText}
    </span>
  )
}
