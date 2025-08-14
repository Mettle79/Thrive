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
    <Card className="border-orange-500 bg-black/50 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-orange-300">
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg font-bold">
              {LeaderboardManager.formatTime(elapsedTime)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
