"use client"

import { useEffect, useState } from "react"
import { ProgressTracker } from "./ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

interface TaskWrapperProps {
  taskNumber: number
  children: React.ReactNode
  onComplete?: (taskTime: number) => void
}

export function TaskWrapper({ taskNumber, children, onComplete }: TaskWrapperProps) {
  const [taskTime, setTaskTime] = useState(0)

  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(taskNumber)
  }, [taskNumber])

  const completeTask = () => {
    const manager = LeaderboardManager.getInstance()
    const time = manager.completeTask(taskNumber)
    setTaskTime(time)
    onComplete?.(time)
    return time
  }

  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mb-4">
        <ProgressTracker currentTask={taskNumber} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

// Export a hook for easy task completion
export function useTaskCompletion(taskNumber: number) {
  const [taskTime, setTaskTime] = useState(0)

  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(taskNumber)
  }, [taskNumber])

  const completeTask = () => {
    const manager = LeaderboardManager.getInstance()
    const time = manager.completeTask(taskNumber)
    setTaskTime(time)
    return time
  }

  return { taskTime, completeTask }
}
