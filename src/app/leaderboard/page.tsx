"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Clock, RefreshCw, Crown, Loader2, Play } from "lucide-react"
import { LeaderboardManager, LeaderboardEntry } from "@/lib/leaderboard"

import Link from "next/link"

function LeaderboardContent() {
  const searchParams = useSearchParams()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentPlayerEntry, setCurrentPlayerEntry] = useState<LeaderboardEntry | null>(null)

  const [isSpectatorMode, setIsSpectatorMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentInProgressPage, setCurrentInProgressPage] = useState(1)
  const [entriesPerPage] = useState(10)
  const [inProgressProgress, setInProgressProgress] = useState<Record<string, { completed: number; total: number; currentTask: number }>>({})
  const [highlightedPlayer, setHighlightedPlayer] = useState<string | null>(null)

  useEffect(() => {
    loadLeaderboard()
    checkCurrentPlayer()
    
    // Check if user is a spectator (no progress data)
    const manager = LeaderboardManager.getInstance()
    const progress = manager.getProgress()
    if (progress.completedTasks.size === 0 && !progress.scoreSubmitted) {
      setIsSpectatorMode(true)
    }
  }, [])

  // Auto-refresh for spectator mode
  useEffect(() => {
    if (isSpectatorMode && autoRefresh) {
      const interval = setInterval(() => {
        loadLeaderboard()
      }, 5000) // Refresh every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isSpectatorMode, autoRefresh])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const manager = LeaderboardManager.getInstance()
      const data = await manager.getLeaderboard()
      setLeaderboard(data)
      
      // Get progress info for current player if they're in progress
      const currentPlayerName = sessionStorage.getItem("playerName")
      if (currentPlayerName) {
        const progress = manager.getProgressSummary()
        setInProgressProgress(prev => ({
          ...prev,
          [currentPlayerName]: progress
        }))
      }
      
      // Handle scrollTo parameter
      const scrollToPlayer = searchParams.get('scrollTo')
      if (scrollToPlayer && data.length > 0) {
        // Find the player's entry
        const playerEntry = data.find(entry => entry.player_name === scrollToPlayer)
        if (playerEntry) {
          // Calculate which page the player is on
          const playerIndex = data.findIndex(entry => entry.id === playerEntry.id)
          const targetPage = Math.floor(playerIndex / entriesPerPage) + 1
          
          // Set the page and highlight the player
          setCurrentPage(targetPage)
          setHighlightedPlayer(scrollToPlayer)
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedPlayer(null)
          }, 3000)
          
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 100)
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentPlayer = async () => {
    const manager = LeaderboardManager.getInstance()
    const progress = manager.getProgress()
    
    if (manager.isAllTasksCompleted() && !progress.scoreSubmitted) {
      // Check if player name is already stored
      const storedName = sessionStorage.getItem("playerName")
      if (storedName) {
        // Check if user already has a completed entry in the database
        const hasCompletedEntry = await manager.checkIfUserHasCompletedEntry(storedName)
        
        if (hasCompletedEntry) {
          // User already has a completed entry, mark as submitted locally
          progress.scoreSubmitted = true
          manager.saveProgress()
          await loadLeaderboard()
        } else {
          // Auto-submit with stored name
          setSubmitting(true)
          try {
            const entry = await manager.submitScore(storedName)
            if (entry) {
              setCurrentPlayerEntry(entry)
              await loadLeaderboard()
            }
          } catch (error) {
            console.error('Error submitting score:', error)
          } finally {
            setSubmitting(false)
          }
        }
      }
    } else if (progress.scoreSubmitted) {
      // Score already submitted, just load the leaderboard
      await loadLeaderboard()
    } else {
      await loadLeaderboard()
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-white font-bold">{rank}</span>
  }

  // Calculate completed entries count for proper ranking
  const completedEntries = leaderboard.filter(entry => (entry.status || 'completed') === 'completed')
  const inProgressEntries = leaderboard.filter(entry => (entry.status || 'completed') === 'in_progress')
  
  // Pagination logic for completed entries
  const totalPages = Math.ceil(completedEntries.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentCompletedEntries = completedEntries.slice(startIndex, endIndex)
  
  // Pagination logic for in-progress entries
  const totalInProgressPages = Math.ceil(inProgressEntries.length / entriesPerPage)
  const inProgressStartIndex = (currentInProgressPage - 1) * entriesPerPage
  const inProgressEndIndex = inProgressStartIndex + entriesPerPage
  const currentInProgressEntries = inProgressEntries.slice(inProgressStartIndex, inProgressEndIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleInProgressPageChange = (page: number) => {
    setCurrentInProgressPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            {isSpectatorMode && (
              <div className="flex items-center gap-2 ml-4">
                <div className="px-2 py-1 bg-[#E3526A]/20 border border-[#BE99E6]/50 rounded text-[#E3526A] text-xs font-medium">
                  Spectator Mode
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-[#E3526A] bg-[#121212] border-[#3C1053] rounded focus:ring-[#BE99E6]"
                  />
                  <label htmlFor="autoRefresh" className="text-[#E3526A] text-sm">
                    Auto-refresh
                  </label>
                </div>
              </div>
            )}
          </div>
                    <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadLeaderboard}
              disabled={loading}
              className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>

          </div>
        </div>

        {currentPlayerEntry && !isSpectatorMode && (
          <Card className="mb-6 border-[#3C1053] bg-[#1E1E1E]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">Your Score Submitted!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-white/80">Total Time:</p>
                  <p className="text-2xl font-bold text-white">
                    {LeaderboardManager.formatTime(currentPlayerEntry.total_time)}
                  </p>
                </div>
                <div>
                  <p className="text-white/80">Rank:</p>
                  <p className="text-2xl font-bold text-white">
                    #{completedEntries.findIndex(entry => entry.id === currentPlayerEntry.id) + 1}
                  </p>
                </div>
                <div>
                  <p className="text-white/80">Date:</p>
                  <p className="text-white">{currentPlayerEntry.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {loading ? (
            <Card className="border-[#3C1053] bg-[#1E1E1E]">
              <CardContent className="p-8 text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-white" />
                <p className="text-white/80">Loading leaderboard...</p>
              </CardContent>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card className="border-[#3C1053] bg-[#1E1E1E]">
              <CardContent className="p-8 text-center">
                <Trophy className="mx-auto mb-4 h-16 w-16 text-white/50" />
                <h2 className="mb-2 text-xl font-bold text-white">No Scores Yet</h2>
                <p className="text-white/80 mb-4">
                  {isSpectatorMode 
                    ? "Waiting for participants to complete the challenge..."
                    : "Be the first to complete the challenge and claim the top spot!"
                  }
                </p>
                {!isSpectatorMode && (
                  <Link href="/welcome">
                    <Button className="bg-[#E3526A] hover:bg-[#E3526A]/80 text-[#E3526A]">
                      Start Challenge
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Dynamic Layout: Two columns when in-progress users exist, full width when none */}
              <div className={`grid gap-6 ${inProgressEntries.length > 0 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                
                {/* Completed Entries - Left side (or full width when no in-progress) */}
                <div className={`${inProgressEntries.length > 0 ? 'md:col-span-2 md:order-1 order-2' : 'col-span-1'}`}>
                  {completedEntries.length > 0 && (
                    <>
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          Completed Times
                        </h2>
                        <p className="text-white/60 text-sm">Fastest completion times</p>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Top 3 completed entries with full cards */}
                        {currentCompletedEntries.slice(0, 3).map((entry, index) => (
                          <Card key={entry.id} className={`border-[#3C1053] bg-[#1E1E1E] ${
                            highlightedPlayer === entry.player_name 
                              ? 'ring-2 ring-[#BE99E6] ring-opacity-75 animate-pulse' 
                              : ''
                          }`}>
                            <CardContent className="py-3 px-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    {getRankIcon(startIndex + index + 1)}
                                    <span className="text-base font-bold text-white">
                                      {entry.player_name}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-lg font-bold">
                                    {LeaderboardManager.formatTime(entry.total_time)}
                                  </span>
                                  <span className="text-xs text-white/60 ml-2">
                                    {entry.date}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {/* Remaining completed entries with compact cards */}
                        {currentCompletedEntries.slice(3).map((entry, index) => (
                          <Card key={entry.id} className={`border-[#3C1053] bg-[#1E1E1E] ${
                            highlightedPlayer === entry.player_name 
                              ? 'ring-2 ring-[#BE99E6] ring-opacity-75 animate-pulse' 
                              : ''
                          }`}>
                            <CardContent className="py-1 px-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-bold text-white/80">
                                    #{startIndex + index + 4}
                                  </span>
                                  <span className="text-sm font-medium text-white">
                                    {entry.player_name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-white/80">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm font-bold">
                                    {LeaderboardManager.formatTime(entry.total_time)}
                                  </span>
                                  <span className="text-xs text-white/60 ml-1">
                                    {entry.date}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* In-Progress Entries - Right side (only when in-progress users exist) */}
                {inProgressEntries.length > 0 && (
                  <div className="md:col-span-1 md:order-2 order-1">
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Play className="h-5 w-5 text-[#E3526A]" />
                        In Progress
                      </h2>
                      <p className="text-white/60 text-sm">Currently playing</p>
                    </div>
                    
                    <div className="space-y-3">
                      {currentInProgressEntries.map((entry, index) => (
                        <Card key={entry.id} className={`border-[#E3526A]/50 bg-[#E3526A]/10 ${
                          highlightedPlayer === entry.player_name 
                            ? 'ring-2 ring-[#BE99E6] ring-opacity-75 animate-pulse' 
                            : ''
                        }`}>
                          <CardContent className="py-1 px-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Play className="h-3 w-3 text-[#E3526A]" />
                                <span className="text-sm font-medium text-[#E3526A]">
                                  {entry.player_name}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs bg-[#E3526A] text-white px-1 py-0.5 rounded text-xs">
                                  In Progress
                                </span>
                                <div className="text-xs text-[#E3526A]/80 mt-1">
                                  {entry.date}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {/* In-Progress Pagination */}
                    {totalInProgressPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => handleInProgressPageChange(currentInProgressPage - 1)}
                          disabled={currentInProgressPage === 1}
                          className="bg-[#121212] text-white border-[#E3526A]/50 hover:bg-[#E3526A]/20 text-xs px-2 py-1"
                        >
                          ‹
                        </Button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(3, totalInProgressPages) }, (_, i) => {
                            let pageNum
                            if (totalInProgressPages <= 3) {
                              pageNum = i + 1
                            } else if (currentInProgressPage <= 2) {
                              pageNum = i + 1
                            } else if (currentInProgressPage >= totalInProgressPages - 1) {
                              pageNum = totalInProgressPages - 2 + i
                            } else {
                              pageNum = currentInProgressPage - 1 + i
                            }
                            
                            return (
                              <Button
                                key={pageNum}
                                variant={currentInProgressPage === pageNum ? "default" : "outline"}
                                onClick={() => handleInProgressPageChange(pageNum)}
                                className={
                                  currentInProgressPage === pageNum
                                    ? "bg-[#E3526A] hover:bg-[#E3526A]/80 text-white text-xs px-2 py-1"
                                    : "bg-[#121212] text-white border-[#E3526A]/50 hover:bg-[#E3526A]/20 text-xs px-2 py-1"
                                }
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleInProgressPageChange(currentInProgressPage + 1)}
                          disabled={currentInProgressPage === totalInProgressPages}
                          className="bg-[#121212] text-white border-[#E3526A]/50 hover:bg-[#E3526A]/20 text-xs px-2 py-1"
                        >
                          ›
                        </Button>
                      </div>
                    )}
                    
                    {/* In-Progress Page info */}
                    {totalInProgressPages > 1 && (
                      <div className="text-center text-xs text-[#E3526A]/80 mt-2">
                        Page {currentInProgressPage} of {totalInProgressPages}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination - only show for completed entries */}
              {completedEntries.length > entriesPerPage && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, Math.ceil(completedEntries.length / entriesPerPage)) }, (_, i) => {
                      const totalCompletedPages = Math.ceil(completedEntries.length / entriesPerPage)
                      let pageNum
                      if (totalCompletedPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalCompletedPages - 2) {
                        pageNum = totalCompletedPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-white"
                              : "bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(completedEntries.length / entriesPerPage)}
                    className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Page info - only show for completed entries */}
              {completedEntries.length > entriesPerPage && (
                <div className="text-center text-sm text-white/80 mt-2">
                  Page {currentPage} of {Math.ceil(completedEntries.length / entriesPerPage)} • Showing {startIndex + 1}-{Math.min(endIndex, completedEntries.length)} of {completedEntries.length} completed entries
                </div>
              )}
            </>
          )}
        </div>


      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: '#BE99E6' }} />
          <p style={{ color: '#BE99E6' }}>Loading leaderboard...</p>
        </div>
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  )
}
