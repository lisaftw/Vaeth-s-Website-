"use client"

interface SectionDividerProps {
  variant?: "wave" | "diagonal" | "curve" | "zigzag"
  className?: string
  color?: string
}

export function SectionDivider({ variant = "wave", className = "", color = "#dc2626" }: SectionDividerProps) {
  const getSvgPath = () => {
    switch (variant) {
      case "wave":
        return "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
      case "diagonal":
        return "M0,0L1440,64L1440,0Z"
      case "curve":
        return "M0,64L1440,0L1440,64Z"
      case "zigzag":
        return "M0,32L120,16L240,32L360,16L480,32L600,16L720,32L840,16L960,32L1080,16L1200,32L1320,16L1440,32L1440,0L0,0Z"
      default:
        return "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,58.7C1248,64,1344,64,1392,64L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
    }
  }

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <svg className="relative block w-full h-16" viewBox="0 0 1440 64" preserveAspectRatio="none">
        <path d={getSvgPath()} fill={color} fillOpacity="0.1" />
        <path d={getSvgPath()} fill={color} fillOpacity="0.05" transform="translate(0, 8)" />
      </svg>
    </div>
  )
}
