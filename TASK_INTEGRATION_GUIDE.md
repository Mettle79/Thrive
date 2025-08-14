# Task Integration Guide

This guide shows how to integrate leaderboard tracking into tasks 2-7, following the pattern established in Task 1 and Task 8.

## Quick Integration Pattern

Each task should follow this pattern:

### 1. Imports
```typescript
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"
```

### 2. State Management
```typescript
const [taskTime, setTaskTime] = useState<number>(0)
```

### 3. Start Task Tracking
```typescript
useEffect(() => {
  const manager = LeaderboardManager.getInstance()
  manager.startTask(taskNumber) // Replace taskNumber with actual task number (2-7)
}, [])
```

### 4. Success Handler
```typescript
const handleSuccess = () => {
  const manager = LeaderboardManager.getInstance()
  const time = manager.completeTask(taskNumber) // Replace taskNumber with actual task number
  setTaskTime(time)
  // Your existing success logic here
}
```

### 5. UI Updates
```typescript
// Add ProgressTracker to your main layout
<ProgressTracker currentTask={taskNumber} />

// Show task time on success screen
{taskTime > 0 && (
  <div className="text-center mb-4">
    <p className="text-green-400">Task completed in: {LeaderboardManager.formatTime(taskTime)}</p>
  </div>
)}
```

## Complete Example for Task 2

Here's a complete example of how Task 2 should be updated:

```typescript
"use client"

import { useState, useEffect } from "react"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"
// ... other imports

export default function Task2Page() {
  const [taskTime, setTaskTime] = useState<number>(0)
  // ... other state variables

  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(2)
  }, [])

  const handleSuccess = () => {
    const manager = LeaderboardManager.getInstance()
    const time = manager.completeTask(2)
    setTaskTime(time)
    
    // Your existing success logic
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-black text-white p-4">
      <ProgressTracker currentTask={2} />
      
      {/* Your existing task content */}
      
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-green-900/90 border border-green-500 rounded-lg p-8 text-center max-w-md mx-4">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Task 2 Complete!</h2>
            {taskTime > 0 && (
              <p className="text-green-300 mb-4">
                Completed in: {LeaderboardManager.formatTime(taskTime)}
              </p>
            )}
            {/* Your existing success content */}
          </div>
        </div>
      )}
    </div>
  )
}
```

## Field Name Changes

Note that the database field names have changed from the localStorage version:

- `playerName` → `player_name`
- `totalTime` → `total_time`
- `taskTimes` → `task_times`
- `completedAt` → `completed_at`

The LeaderboardManager handles these conversions automatically, so your task code doesn't need to change.

## Async Operations

The leaderboard operations are now async with Supabase:

- `manager.submitScore()` returns a Promise
- `manager.getLeaderboard()` returns a Promise
- `manager.exportLeaderboard()` returns a Promise
- `manager.importLeaderboard()` returns a Promise

However, the task completion methods (`startTask`, `completeTask`) remain synchronous since they only work with local progress tracking.

## Testing

To test your integration:

1. Complete the task normally
2. Check that the task time is displayed on the success screen
3. Navigate to the leaderboard page
4. Use the "Test Mode: Mark All Tasks Complete" button if you want to test the full submission flow
5. Verify your score appears on the leaderboard

## Error Handling

The leaderboard system includes error handling for network issues:

- If Supabase is unavailable, the app will still work for local progress tracking
- Error messages are logged to the console
- The UI shows loading states during async operations

## Migration from localStorage

If you're updating existing tasks that used the old localStorage system:

1. The interface remains the same for task completion
2. Only the leaderboard storage has changed to Supabase
3. Progress tracking still uses localStorage for session data
4. No changes needed to existing task logic
