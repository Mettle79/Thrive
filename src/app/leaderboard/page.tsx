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
    return <span className="text-orange-300 font-bold">{rank}</span>
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
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold text-orange-500">Leaderboard</h1>
            {isSpectatorMode && (
              <div className="flex items-center gap-2 ml-4">
                <div className="px-2 py-1 bg-blue-600/20 border border-blue-500/50 rounded text-blue-300 text-xs font-medium">
                  Spectator Mode
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="autoRefresh" className="text-blue-300 text-sm">
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
              className="bg-orange-900/50 text-orange-500 border-orange-500 hover:bg-orange-800/50"
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
          <Card className="mb-6 border-orange-500 bg-orange-900/20">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-green-400">🎉 Challenge Complete! 🎉</h2>
              <p className="mb-4 text-orange-200">
                Congratulations! You've completed all tasks. Enter your name to submit your score to the leaderboard.
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-orange-900/30 border-orange-500 text-white placeholder:text-orange-300"
                  maxLength={20}
                />
                <Button
                  onClick={handleSubmitScore}
                  disabled={!playerName.trim() || submitting}
                  className="bg-orange-600 hover:bg-orange-700"
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
          <Card className="mb-6 border-green-500 bg-green-900/20">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-bold text-green-400">Your Score Submitted!</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-green-300">Total Time:</p>
                  <p className="text-2xl font-bold text-green-400">
                    {LeaderboardManager.formatTime(currentPlayerEntry.total_time)}
                  </p>
                </div>
                <div>
                  <p className="text-green-300">Rank:</p>
                  <p className="text-2xl font-bold text-green-400">
                    #{leaderboard.findIndex(entry => entry.id === currentPlayerEntry.id) + 1}
                  </p>
                </div>
                <div>
                  <p className="text-green-300">Date:</p>
                  <p className="text-green-400">{currentPlayerEntry.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {loading ? (
            <Card className="border-orange-500 bg-black">
              <CardContent className="p-8 text-center">
                <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-orange-500" />
                <p className="text-orange-300">Loading leaderboard...</p>
              </CardContent>
            </Card>
          ) : leaderboard.length === 0 ? (
            <Card className="border-orange-500 bg-black">
              <CardContent className="p-8 text-center">
                <Trophy className="mx-auto mb-4 h-16 w-16 text-orange-500/50" />
                <h2 className="mb-2 text-xl font-bold text-orange-500">No Scores Yet</h2>
                <p className="text-orange-300 mb-4">
                  {isSpectatorMode 
                    ? "Waiting for participants to complete the challenge..."
                    : "Be the first to complete the challenge and claim the top spot!"
                  }
                </p>
                {!isSpectatorMode && (
                  <Link href="/welcome">
                    <Button className="bg-orange-600 hover:bg-orange-700">
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
                <Card key={entry.id} className="border-orange-500 bg-black">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(startIndex + index + 1)}
                          <span className="text-base font-bold text-orange-500">
                            {entry.player_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-orange-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-lg font-bold">
                          {LeaderboardManager.formatTime(entry.total_time)}
                        </span>
                        <span className="text-xs text-orange-400 ml-2">
                          {entry.date}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Remaining entries with compact single-line cards */}
              {currentEntries.slice(3).map((entry, index) => (
                <Card key={entry.id} className="border-orange-500 bg-black">
                  <CardContent className="py-1 px-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-orange-300">
                          #{startIndex + index + 4}
                        </span>
                        <span className="text-sm font-medium text-orange-400">
                          {entry.player_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-orange-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-bold">
                          {LeaderboardManager.formatTime(entry.total_time)}
                        </span>
                        <span className="text-xs text-orange-400 ml-1">
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
                    className="bg-orange-900/50 text-orange-500 border-orange-500 hover:bg-orange-800/50"
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
                              ? "bg-orange-600 hover:bg-orange-700"
                              : "bg-orange-900/50 text-orange-500 border-orange-500 hover:bg-orange-800/50"
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
                    className="bg-orange-900/50 text-orange-500 border-orange-500 hover:bg-orange-800/50"
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Page info */}
              {totalPages > 1 && (
                <div className="text-center text-sm text-orange-400 mt-2">
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
