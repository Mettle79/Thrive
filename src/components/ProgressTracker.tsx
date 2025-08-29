"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { LeaderboardManager } from "@/lib/leaderboard"

interface ProgressTrackerProps {
  currentTask?: number
  showTimer?: boolean
}

export function ProgressTracker({ currentTask = 1, showTimer = true }: ProgressTrackerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    const manager = LeaderboardManager.getInstance()

    // Update elapsed time
    const updateTimer = () => {
      const progressData = manager.getProgress()
      const startTime = progressData.startTime
      if (startTime > 0) {
        const currentTime = Date.now()
        setElapsedTime(currentTime - startTime)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-[#3C1053] bg-[#1E1E1E] text-white shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 text-white">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm font-bold">
            {LeaderboardManager.formatTime(elapsedTime)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
