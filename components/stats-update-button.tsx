"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { updateAllStats } from "@/app/actions/stats-actions"
import { useToast } from "@/hooks/use-toast"

export function StatsUpdateButton() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdate = async () => {
    setLoading(true)

    try {
      const result = await updateAllStats()

      if (result.success) {
        toast({
          title: "Stats Updated",
          description: result.message,
        })
      } else {
        toast({
          title: "Update Failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stats",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpdate}
      disabled={loading}
      variant="outline"
      size="sm"
      className="border-zinc-700 bg-transparent"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Updating..." : "Update All Stats"}
    </Button>
  )
}
