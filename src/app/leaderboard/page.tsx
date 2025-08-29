"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, Medal, Clock, RefreshCw, Crown, Loader2 } from "lucide-react"
import { LeaderboardManager, LeaderboardEntry } from "@/lib/leaderboard"

import Link from "next/link"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [currentPlayerEntry, setCurrentPlayerEntry] = useState<LeaderboardEntry | null>(null)

  const [isSpectatorMode, setIsSpectatorMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [entriesPerPage] = useState(10)

  useEffect(() => {
    loadLeaderboard()
    checkCurrentPlayer()
    
    // Initialize player name from session storage
    const storedName = sessionStorage.getItem("playerName")
    if (storedName) {
      setPlayerName(storedName)
    }

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
      } else {
        // Fallback to manual input if no stored name
        setShowNameInput(true)
      }
    } else if (progress.scoreSubmitted) {
      // Score already submitted, just load the leaderboard
      await loadLeaderboard()
    }
  }

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return

    setSubmitting(true)
    try {
      const manager = LeaderboardManager.getInstance()
      const entry = await manager.submitScore(playerName.trim())
      
      if (entry) {
        setCurrentPlayerEntry(entry)
        setShowNameInput(false)
        await loadLeaderboard()
      }
    } catch (error) {
      console.error('Error submitting score:', error)
    } finally {
      setSubmitting(false)
    }
  }



  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    return <span className="text-white font-bold">{rank}</span>
  }

  // Pagination logic
  const totalPages = Math.ceil(leaderboard.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentEntries = leaderboard.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
                <div className="px-2 py-1 bg-[#BE99E6]/20 border border-[#BE99E6]/50 rounded text-[#BE99E6] text-xs font-medium">
                  Spectator Mode
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-[#BE99E6] bg-[#121212] border-[#3C1053] rounded focus:ring-[#BE99E6]"
                  />
                  <label htmlFor="autoRefresh" className="text-[#BE99E6] text-sm">
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



        {showNameInput && !isSpectatorMode && (
          <Card className="mb-6 border-[#3C1053] bg-[#1E1E1E]">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-white">🎉 Challenge Complete! 🎉</h2>
              <p className="mb-4 text-white/80">
                Congratulations! You've completed all tasks. Enter your name to submit your score to the leaderboard.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
                  maxLength={20}
                />
                <Button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim() || submitting}
                  className="bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Score'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                    #{leaderboard.findIndex(entry => entry.id === currentPlayerEntry.id) + 1}
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
                    <Button className="bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]">
                      Start Challenge
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Top 3 entries with full cards */}
              {currentEntries.slice(0, 3).map((entry, index) => (
                <Card key={entry.id} className="border-[#3C1053] bg-[#1E1E1E]">
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

              {/* Remaining entries with compact single-line cards */}
              {currentEntries.slice(3).map((entry, index) => (
                <Card key={entry.id} className="border-[#3C1053] bg-[#1E1E1E]">
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

              {/* Pagination */}
              {totalPages > 1 && (
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
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
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
                              ? "bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]"
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
                    disabled={currentPage === totalPages}
                    className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <div className="text-center text-sm text-white/80 mt-2">
                  Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, leaderboard.length)} of {leaderboard.length} entries
                </div>
              )}
            </>
          )}
        </div>


      </div>
    </div>
  )
}
