import { createClient } from '@supabase/supabase-js'

// Database types
export interface LeaderboardEntry {
  id: string
  player_name: string
  total_time: number
  task_times: Record<string, number>
  completed_at: string
  date: string
  created_at: string
  status?: 'in_progress' | 'completed' // Optional for backward compatibility
  started_at?: string
}

export interface TaskProgress {
  startTime: number
  completedTasks: Set<number>
  taskStartTimes: Record<number, number>
  taskEndTimes: Record<number, number>
  scoreSubmitted?: boolean
}

// Create Supabase client with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
  }
} else {
  console.warn('Missing Supabase environment variables. Leaderboard functionality will be limited.')
}

export class LeaderboardManager {
  private static instance: LeaderboardManager
  private progress: TaskProgress

  private constructor() {
    this.progress = this.loadProgressFromStorage()
  }

  static getInstance(): LeaderboardManager {
    if (!LeaderboardManager.instance) {
      LeaderboardManager.instance = new LeaderboardManager()
    }
    return LeaderboardManager.instance
  }

  // Progress tracking methods (still use localStorage for session data)
  startTask(taskNumber: number): void {
    if (!this.progress.startTime) {
      this.progress.startTime = Date.now()
    }
    this.progress.taskStartTimes[taskNumber] = Date.now()
    this.saveProgressToStorage()
  }

  completeTask(taskNumber: number): number {
    // Check if task is already completed
    if (this.progress.completedTasks.has(taskNumber)) {
      // Return the original completion time without overwriting
      const startTime = this.progress.taskStartTimes[taskNumber] || this.progress.startTime
      const endTime = this.progress.taskEndTimes[taskNumber]
      return endTime - startTime
    }
    
    // Task not completed yet, proceed with normal completion
    this.progress.completedTasks.add(taskNumber)
    this.progress.taskEndTimes[taskNumber] = Date.now()
    this.saveProgressToStorage()
    
    const startTime = this.progress.taskStartTimes[taskNumber] || this.progress.startTime
    const endTime = this.progress.taskEndTimes[taskNumber]
    return endTime - startTime
  }

  getProgress(): TaskProgress {
    return { ...this.progress }
  }

  private saveProgressToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('escape-room-progress', JSON.stringify({
        ...this.progress,
        completedTasks: Array.from(this.progress.completedTasks)
      }))
    }
  }

  public saveProgress(): void {
    this.saveProgressToStorage()
  }

  private loadProgressFromStorage(): TaskProgress {
    if (typeof window === 'undefined') {
      return {
        startTime: 0,
        completedTasks: new Set(),
        taskStartTimes: {},
        taskEndTimes: {},
        scoreSubmitted: false
      }
    }

    const stored = localStorage.getItem('escape-room-progress')
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        completedTasks: new Set(parsed.completedTasks || [])
      }
    }

    return {
      startTime: 0,
      completedTasks: new Set(),
      taskStartTimes: {},
      taskEndTimes: {},
      scoreSubmitted: false
    }
  }

  isAllTasksCompleted(): boolean {
    return this.progress.completedTasks.size === 4
  }

  getTotalTime(): number {
    if (!this.progress.startTime) return 0
    const endTimeValues = Object.values(this.progress.taskEndTimes)
    if (endTimeValues.length === 0) return 0
    const endTime = Math.max(...endTimeValues)
    return endTime - this.progress.startTime
  }

  getTaskTimes(): Record<string, number> {
    const taskTimes: Record<string, number> = {}
    // Only include remaining tasks: 1, 2, 3, 8
    const validTasks = [1, 2, 3, 8]
    for (let i of validTasks) {
      if (this.progress.completedTasks.has(i)) {
        const startTime = this.progress.taskStartTimes[i] || this.progress.startTime
        const endTime = this.progress.taskEndTimes[i]
        taskTimes[i.toString()] = endTime - startTime
      }
    }
    return taskTimes
  }

  // Supabase leaderboard methods
  private isSubmitting = false

  async createInProgressEntry(playerName: string): Promise<LeaderboardEntry | null> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot create in-progress entry.')
      return null
    }

    try {
      const now = new Date()
      const entry: any = {
        player_name: playerName,
        total_time: 0,
        task_times: {},
        completed_at: now.toISOString(), // Will be updated when completed
        date: now.toLocaleDateString()
      }

      // Only add new fields if they exist in the database
      // This will be handled gracefully by Supabase
      try {
        entry.status = 'in_progress'
        entry.started_at = now.toISOString()
      } catch (e) {
        console.warn('New fields not available in database yet, using fallback')
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .insert([entry])
        .select()
        .single()

      if (error) {
        console.error('Error creating in-progress entry:', error)
        console.error('Error details:', error.message, error.details, error.hint)
        return null
      }

      console.log('In-progress entry created successfully:', data)
      return data
    } catch (error) {
      console.error('Error creating in-progress entry:', error)
      return null
    }
  }

  async submitScore(playerName: string): Promise<LeaderboardEntry | null> {
    
    // Prevent multiple simultaneous submissions
    if (this.isSubmitting) {
      console.log('Score submission already in progress')
      return null
    }

    if (!this.isAllTasksCompleted() || this.progress.scoreSubmitted) {
      console.log('Cannot submit score: tasks not completed or already submitted')
      return null
    }

    if (!supabase) {
      console.error('Supabase not configured. Cannot submit score.')
      return null
    }

    this.isSubmitting = true

    try {
      const totalTime = this.getTotalTime()
      const taskTimes = this.getTaskTimes()
      const now = new Date()

      // First, try to find and update existing in-progress entry
      // Only do this if the status field exists in the database
      let existingEntry = null
      try {
        const { data, error: findError } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('player_name', playerName)
          .eq('status', 'in_progress')
          .single()
        
        if (!findError) {
          existingEntry = data
        }
      } catch (e) {
        console.warn('Status field not available, skipping in-progress lookup:', e)
      }

      // Remove the old error check since we're handling it in the try-catch above

      if (existingEntry) {
        // Update existing in-progress entry
        const updateData: any = {
          total_time: totalTime,
          task_times: taskTimes,
          completed_at: now.toISOString(),
          date: now.toLocaleDateString()
        }
        
        // Only add status field if it exists in the database
        try {
          updateData.status = 'completed'
        } catch (e) {
          console.warn('Status field not available for update')
        }
        
        // Try to update the existing entry
        const { data, error } = await supabase
          .from('leaderboard')
          .update(updateData)
          .eq('id', existingEntry.id)
          .select()

        if (error) {
          console.error('Error updating existing entry:', error)
          return null
        }
        
        // If update returns empty array, it means RLS is blocking the update
        // Use delete + insert workaround
        if (data && data.length === 0) {
          // Delete the old entry
          const { error: deleteError } = await supabase
            .from('leaderboard')
            .delete()
            .eq('id', existingEntry.id)
          
          if (deleteError) {
            console.error('Delete error:', deleteError)
            return null
          }
          
          // Create new completed entry
          const newEntry = {
            player_name: playerName,
            total_time: totalTime,
            task_times: taskTimes,
            completed_at: now.toISOString(),
            date: now.toLocaleDateString(),
            status: 'completed'
          }
          
          const { data: insertData, error: insertError } = await supabase
            .from('leaderboard')
            .insert([newEntry])
            .select()
          
          if (insertError) {
            console.error('Insert error:', insertError)
            return null
          }
          
          return insertData?.[0] || null
        }

        // Mark as submitted only after successful database update
        this.progress.scoreSubmitted = true
        this.saveProgressToStorage()
        
        return data?.[0] || null
      } else {
        // Create new completed entry (fallback for edge cases)
        const entry: any = {
          player_name: playerName,
          total_time: totalTime,
          task_times: taskTimes,
          completed_at: now.toISOString(),
          date: now.toLocaleDateString()
        }
        
        // Only add status field if it exists in the database
        try {
          entry.status = 'completed'
        } catch (e) {
          console.warn('Status field not available for new entry')
        }

        const { data, error } = await supabase
          .from('leaderboard')
          .insert([entry])
          .select()

        if (error) {
          console.error('Error submitting score:', error)
          return null
        }

        // Mark as submitted only after successful database insertion
        this.progress.scoreSubmitted = true
        this.saveProgressToStorage()
        
        return data?.[0] || null
      }
    } catch (error) {
      console.error('Error submitting score:', error)
      return null
    } finally {
      this.isSubmitting = false
    }
  }

  async checkIfUserHasCompletedEntry(playerName: string): Promise<boolean> {
    if (!supabase) {
      return false
    }

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('id, status')
        .eq('player_name', playerName)
        .eq('status', 'completed')
        .limit(1)

      if (error) {
        console.error('Error checking for completed entry:', error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error('Error checking for completed entry:', error)
      return false
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot fetch leaderboard.')
      return []
    }

    try {
      // Run cleanup of abandoned entries (in background, don't wait for it)
      this.cleanupAbandonedEntries().catch(error => {
        console.warn('Background cleanup failed:', error)
      })

      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('status', { ascending: true }) // completed entries first
        .order('total_time', { ascending: true }) // then by time
        .order('started_at', { ascending: true }) // then in-progress by start time
      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      // Manual sorting to ensure proper order: in-progress entries first, then completed by time
      const sortedData = (data || []).sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        // Handle backward compatibility - if status doesn't exist, treat as completed
        const aStatus = a.status || 'completed'
        const bStatus = b.status || 'completed'
        
        // In-progress entries first (at the very top)
        if (aStatus === 'in_progress' && bStatus === 'completed') return -1
        if (aStatus === 'completed' && bStatus === 'in_progress') return 1
        
        // If both in-progress, sort by started_at (most recent first)
        if (aStatus === 'in_progress' && bStatus === 'in_progress') {
          const aStart = new Date(a.started_at || a.created_at).getTime()
          const bStart = new Date(b.started_at || b.created_at).getTime()
          return bStart - aStart // Most recent first
        }
        
        // If both completed, sort by total_time (fastest first)
        if (aStatus === 'completed' && bStatus === 'completed') {
          return a.total_time - b.total_time
        }
        
        return 0
      })

      return sortedData
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }

  async exportLeaderboard(): Promise<string> {
    const leaderboard = await this.getLeaderboard()
    return JSON.stringify(leaderboard, null, 2)
  }

  async importLeaderboard(data: string): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot import leaderboard.')
      return false
    }

    try {
      const entries = JSON.parse(data)
      
      // Clear existing data
      const { error: deleteError } = await supabase
        .from('leaderboard')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

      if (deleteError) {
        console.error('Error clearing leaderboard:', deleteError)
        return false
      }

      // Insert new data
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert(entries)

      if (insertError) {
        console.error('Error importing leaderboard:', insertError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error importing leaderboard:', error)
      return false
    }
  }

  // Method to clean up abandoned in-progress entries
  async cleanupAbandonedEntries(maxAgeHours: number = 24): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot cleanup abandoned entries.')
      return false
    }

    try {
      // Only run cleanup if the new fields exist in the database
      const cutoffTime = new Date()
      cutoffTime.setHours(cutoffTime.getHours() - maxAgeHours)

      try {
        const { data: abandonedEntries, error: fetchError } = await supabase
          .from('leaderboard')
          .select('id, player_name, started_at')
          .eq('status', 'in_progress')
          .lt('started_at', cutoffTime.toISOString())

        if (fetchError) {
          console.warn('Cleanup not available - new fields not in database yet')
          return true // Not an error, just not available yet
        }

        if (!abandonedEntries || abandonedEntries.length === 0) {
          console.log('No abandoned entries found')
          return true
        }

        const abandonedIds = abandonedEntries.map((entry: LeaderboardEntry) => entry.id)
        
        const { error: deleteError } = await supabase
          .from('leaderboard')
          .delete()
          .in('id', abandonedIds)

        if (deleteError) {
          console.error('Error removing abandoned entries:', deleteError)
          return false
        }

        console.log(`Removed ${abandonedIds.length} abandoned in-progress entries`)
        return true
      } catch (e) {
        console.warn('Cleanup not available - new fields not in database yet')
        return true // Not an error, just not available yet
      }
    } catch (error) {
      console.error('Error cleaning up abandoned entries:', error)
      return false
    }
  }

  // Method to clean up duplicate entries
  async cleanupDuplicates(): Promise<boolean> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot cleanup duplicates.')
      return false
    }

    try {
      // Get all entries
      const { data: entries, error: fetchError } = await supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: true })

      if (fetchError) {
        console.error('Error fetching entries for cleanup:', fetchError)
        return false
      }

      if (!entries || entries.length === 0) {
        console.log('No entries to cleanup')
        return true
      }

      // Group by player_name and total_time to find duplicates
      const grouped: Record<string, LeaderboardEntry[]> = {}
      entries.forEach((entry: LeaderboardEntry) => {
        const key = `${entry.player_name}-${entry.total_time}`
        if (!grouped[key]) {
          grouped[key] = []
        }
        grouped[key].push(entry)
      })

      // Find duplicates and keep only the first one
      const duplicatesToRemove: string[] = []
      Object.values(grouped).forEach(group => {
        if (group.length > 1) {
          // Keep the first entry (oldest), remove the rest
          const duplicates = group.slice(1)
          duplicatesToRemove.push(...duplicates.map(d => d.id))
        }
      })

      if (duplicatesToRemove.length === 0) {
        console.log('No duplicates found')
        return true
      }

      // Remove duplicates
      const { error: deleteError } = await supabase
        .from('leaderboard')
        .delete()
        .in('id', duplicatesToRemove)

      if (deleteError) {
        console.error('Error removing duplicates:', deleteError)
        return false
      }

      console.log(`Removed ${duplicatesToRemove.length} duplicate entries`)
      return true
    } catch (error) {
      console.error('Error cleaning up duplicates:', error)
      return false
    }
  }

  resetProgress(): void {
    this.progress = {
      startTime: 0,
      completedTasks: new Set(),
      taskStartTimes: {},
      taskEndTimes: {},
      scoreSubmitted: false
    }
    this.saveProgressToStorage()
  }

  startNewGame(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('escape-room-progress')
      
      // Clear sessionStorage
      sessionStorage.removeItem('playerName')
      sessionStorage.removeItem('hasEnteredPin')
      
      // Reset progress
      this.resetProgress()
    }
  }

  getCurrentTask(): number {
    // Only include remaining tasks: 1, 2, 3, 8
    const validTasks = [1, 2, 3, 8]
    for (let i of validTasks) {
      if (!this.progress.completedTasks.has(i)) {
        return i
      }
    }
    return 8
  }

  getProgressSummary(): { completed: number; total: number; currentTask: number } {
    const validTasks = [1, 2, 3, 8]
    const completed = this.progress.completedTasks.size
    const total = validTasks.length
    const currentTask = this.getCurrentTask()
    
    return { completed, total, currentTask }
  }

  isTaskCompleted(taskNumber: number): boolean {
    return this.progress.completedTasks.has(taskNumber)
  }

  static formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
