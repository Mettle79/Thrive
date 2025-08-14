# Escape Room Leaderboard System

## Overview

This leaderboard system tracks user completion times from Task 1 through Task 8, providing a competitive element to the escape room challenge. The system stores data locally and provides export/import functionality for data sharing.

## Features

### 🏆 **Core Functionality**
- **Real-time Progress Tracking**: Shows current task progress and elapsed time
- **Individual Task Timing**: Records completion time for each task
- **Total Time Calculation**: Tracks overall challenge completion time
- **Leaderboard Rankings**: Displays top 50 scores sorted by fastest completion
- **Export/Import**: Share leaderboard data between devices

### 📊 **Progress Tracker**
- Visual progress bar showing completion percentage
- Task-by-task status indicators
- Real-time elapsed time display
- Current task highlighting

### 🎯 **Leaderboard Display**
- Top 50 scores with rankings
- Individual task completion times
- Player names and completion dates
- Medal icons for top 3 positions

## Implementation Details

### Data Storage
- **Local Storage**: Uses browser localStorage for persistence
- **Session Management**: Tracks progress across browser sessions
- **Data Structure**: JSON format for easy export/import

### Key Components

#### `LeaderboardManager` (`src/lib/leaderboard.ts`)
- Singleton class for managing leaderboard data
- Handles task timing, progress tracking, and score submission
- Provides export/import functionality

#### `ProgressTracker` (`src/components/ProgressTracker.tsx`)
- Visual component showing current progress
- Displays elapsed time and task completion status
- Responsive design for different screen sizes

#### `LeaderboardPage` (`src/app/leaderboard/page.tsx`)
- Dedicated page for viewing leaderboard
- Score submission interface
- Export/import controls

### Integration Points

#### Task Pages
Each task page should:
1. Import the leaderboard manager
2. Call `startTask(taskNumber)` on component mount
3. Call `completeTask(taskNumber)` when task is completed
4. Display completion time to user

#### Example Integration:
```typescript
import { LeaderboardManager } from "@/lib/leaderboard"
import { ProgressTracker } from "@/components/ProgressTracker"

export default function TaskPage() {
  const [taskTime, setTaskTime] = useState(0)

  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(1) // Replace with actual task number
  }, [])

  const handleTaskComplete = () => {
    const manager = LeaderboardManager.getInstance()
    const time = manager.completeTask(1) // Replace with actual task number
    setTaskTime(time)
    // Show success screen with completion time
  }

  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mb-4">
        <ProgressTracker currentTask={1} />
      </div>
      {/* Task content */}
    </div>
  )
}
```

## Usage Instructions

### For Users
1. **Start Challenge**: Progress tracking begins when entering the welcome page
2. **Complete Tasks**: Each task completion is automatically timed
3. **View Progress**: Progress tracker shows current status and elapsed time
4. **Submit Score**: After completing all 8 tasks, enter name to submit to leaderboard
5. **View Leaderboard**: Access leaderboard via navigation or completion screen

### For Administrators
1. **Export Data**: Use export button to download leaderboard as JSON
2. **Import Data**: Use import button to load leaderboard data from file
3. **Reset Progress**: Clear localStorage to reset all progress (for testing)

## Data Structure

### Leaderboard Entry
```typescript
interface LeaderboardEntry {
  id: string
  playerName: string
  totalTime: number // in seconds
  taskTimes: number[] // individual task completion times
  completedAt: string
  date: string
}
```

### Progress Data
```typescript
interface TaskProgress {
  startTime: number
  completedTasks: Set<number>
  taskStartTimes: { [key: number]: number }
  taskEndTimes: { [key: number]: number }
}
```

## Future Enhancements

### Potential Improvements
1. **Cloud Database**: Integrate with Supabase/Firebase for global leaderboards
2. **Real-time Updates**: WebSocket integration for live leaderboard updates
3. **Achievement System**: Badges for fastest individual tasks
4. **Team Challenges**: Multiplayer/team leaderboards
5. **Analytics**: Detailed performance analytics and insights

### Technical Considerations
- **Data Validation**: Input sanitization for player names
- **Performance**: Optimize for large leaderboard datasets
- **Security**: Consider server-side validation for competitive environments
- **Accessibility**: Ensure screen reader compatibility

## Installation

1. Install required dependencies:
```bash
npm install @radix-ui/react-progress
```

2. The system is automatically integrated into existing task pages
3. Access leaderboard at `/leaderboard` route
4. Progress tracking begins automatically on welcome page

## Troubleshooting

### Common Issues
- **Progress Not Saving**: Check localStorage permissions
- **Import Fails**: Ensure JSON file format is correct
- **Timer Issues**: Refresh page to reset progress tracking

### Development Notes
- System works with static export (`output: 'export'`)
- All data stored client-side for privacy
- No server dependencies required
