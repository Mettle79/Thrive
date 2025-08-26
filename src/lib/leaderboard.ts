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
    const endTime = Math.max(...Object.values(this.progress.taskEndTimes))
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

      const entry: Omit<LeaderboardEntry, 'id' | 'created_at'> = {
        player_name: playerName,
        total_time: totalTime,
        task_times: taskTimes,
        completed_at: now.toISOString(),
        date: now.toLocaleDateString()
      }

      const { data, error } = await supabase
        .from('leaderboard')
        .insert([entry])
        .select()
        .single()

      if (error) {
        console.error('Error submitting score:', error)
        return null
      }

      // Mark as submitted only after successful database insertion
      this.progress.scoreSubmitted = true
      this.saveProgressToStorage()
      
      console.log('Score submitted successfully:', data)
      return data
    } catch (error) {
      console.error('Error submitting score:', error)
      return null
    } finally {
      this.isSubmitting = false
    }
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (!supabase) {
      console.error('Supabase not configured. Cannot fetch leaderboard.')
      return []
    }

    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_time', { ascending: true })

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      return data || []
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
