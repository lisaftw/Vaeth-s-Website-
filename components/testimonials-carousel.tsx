"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "Alliance Founder",
    server: "Unified Realms HQ",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    text: "Welcome to Unified Realms! We're building something special here - an alliance where Discord servers can grow together and support each other's communities. Join us as we create the ultimate network for server owners and communities.",
  },
]

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-red-950/20"></div>
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Alliance Testimonials
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-red-600 to-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Hear from our elite alliance members</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20 overflow-hidden">
              <CardContent className="p-12">
                <div className="text-center">
                  <Quote className="w-16 h-16 text-red-500/30 mx-auto mb-8" />

                  <div className="mb-8">
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed italic">
                      "{testimonials[currentIndex].text}"
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-2 mb-6">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-red-500/50">
                      <Image
                        src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xl font-bold text-red-400">{testimonials[currentIndex].name}</h4>
                      <p className="text-gray-400">{testimonials[currentIndex].server}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <Button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 rounded-full w-12 h-12 p-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-400 rounded-full w-12 h-12 p-0"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  setIsAutoPlaying(false)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-red-500 scale-125" : "bg-gray-600 hover:bg-red-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
