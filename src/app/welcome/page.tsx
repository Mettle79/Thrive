"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LeaderboardManager } from "@/lib/leaderboard"

export default function WelcomePage() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [nameError, setNameError] = useState("")
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [nameStatus, setNameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  useEffect(() => {
    // Check if user has entered correct pin (you might want to use a more secure method)
    const hasEnteredPin = sessionStorage.getItem("hasEnteredPin")
    if (!hasEnteredPin) {
      router.push("/")
    }
  }, [router])

  const checkNameDuplicate = async (name: string): Promise<boolean> => {
    try {
      const manager = LeaderboardManager.getInstance()
      const leaderboard = await manager.getLeaderboard()
      
      // Check if name already exists (case-insensitive)
      const existingName = leaderboard.find(entry => 
        entry.player_name.toLowerCase() === name.toLowerCase()
      )
      
      return !!existingName
    } catch (error) {
      console.error('Error checking name duplicate:', error)
      // If there's an error checking, allow the name to proceed
      return false
    }
  }

  const handleStartChallenge = async () => {
    // Validate name is entered
    if (!playerName.trim()) {
      setNameError("Please enter your name or team name to continue")
      return
    }

    // Check if name is still being validated
    if (nameStatus === 'checking') {
      setNameError("Please wait while we check name availability...")
      return
    }

    // Check if name is taken
    if (nameStatus === 'taken') {
      setNameError("This name is already taken. Please choose a different name.")
      return
    }

    // Double-check for duplicate name (final validation)
    setIsCheckingName(true)
    setNameError("")
    
    try {
      const isDuplicate = await checkNameDuplicate(playerName.trim())
      
      if (isDuplicate) {
        setNameError("This name is already taken. Please choose a different name.")
        setIsCheckingName(false)
        return
      }

      // Name is unique, proceed with challenge
      sessionStorage.setItem("playerName", playerName.trim())
      
      // Reset any previous progress and start fresh
      const manager = LeaderboardManager.getInstance()
      manager.resetProgress()
      
      // Start the clock only when user clicks Yes
      manager.startTask(1)
      router.push('/task1')
    } catch (error) {
      console.error('Error starting challenge:', error)
      setNameError("An error occurred. Please try again.")
      setIsCheckingName(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPlayerName(value)
    
    // Clear previous errors and status
    if (value.trim()) {
      setNameError("")
      setNameStatus('idle')
    } else {
      setNameError("")
      setNameStatus('idle')
    }
  }

  // Debounced name checking
  useEffect(() => {
    const checkName = async () => {
      if (playerName.trim().length < 2) {
        setNameStatus('idle')
        return
      }

      setNameStatus('checking')
      
      try {
        const isDuplicate = await checkNameDuplicate(playerName.trim())
        setNameStatus(isDuplicate ? 'taken' : 'available')
      } catch (error) {
        console.error('Error checking name:', error)
        setNameStatus('idle')
      }
    }

    const timeoutId = setTimeout(checkName, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [playerName])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#3C1053] to-[#121212] text-white p-4">
      <div className="w-full max-w-4xl mb-8">
        <video 
          className="w-full rounded-lg shadow-lg" 
          controls
          autoPlay
          muted
          loop
        >
          <source src="/escape room.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">Welcome to the Escape Room Challenge!</h1>
        <p className="text-xl text-white/80 mb-6">
          Are you ready to test your skills and solve the puzzles that await you.
        </p>
      </div>

      {/* Name Input Section */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="bg-[#1E1E1E] border border-[#3C1053] rounded-lg p-6">
          <label htmlFor="playerName" className="block text-white text-lg font-semibold mb-3 text-center">
            Enter Your Name or Team Name
          </label>
          <div className="relative">
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={handleNameChange}
              placeholder="e.g., John Doe or Team Alpha"
                             className={`w-full px-4 py-3 bg-[#121212] border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 transition-colors ${
                 nameStatus === 'available' 
                   ? 'border-[#BE99E6] focus:border-[#BE99E6] focus:ring-[#BE99E6]/20' 
                   : nameStatus === 'taken' 
                   ? 'border-[#E3526A] focus:border-[#E3526A] focus:ring-[#E3526A]/20'
                   : nameStatus === 'checking'
                   ? 'border-yellow-500 focus:border-yellow-400 focus:ring-yellow-400/20'
                   : 'border-[#3C1053] focus:border-[#BE99E6] focus:ring-[#BE99E6]/20'
               }`}
              maxLength={50}
            />
            {nameStatus === 'checking' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
              </div>
            )}
                         {nameStatus === 'available' && (
               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                 <div className="text-[#BE99E6] text-lg">✓</div>
               </div>
             )}
            {nameStatus === 'taken' && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="text-[#E3526A] text-lg">✗</div>
              </div>
            )}
          </div>
          
          {/* Status messages */}
          {nameStatus === 'checking' && (
            <p className="text-yellow-400 text-sm mt-2 text-center">Checking name availability...</p>
          )}
                     {nameStatus === 'available' && (
             <p className="text-white text-sm mt-2 text-center">Name is available!</p>
           )}
          {nameStatus === 'taken' && (
            <p className="text-[#E3526A] text-sm mt-2 text-center">This name is already taken. Please choose another.</p>
          )}
          {nameError && (
            <p className="text-[#E3526A] text-sm mt-2 text-center">{nameError}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Yes Button */}
        <button
          className={`flex items-center justify-center w-32 h-32 rounded-full border-4 shadow-lg text-white text-5xl font-bold transition-all focus:outline-none focus:ring-4 ${
            playerName.trim() && !isCheckingName && nameStatus === 'available'
              ? 'bg-[#BE99E6] border-[#BE99E6] hover:scale-105 focus:ring-[#BE99E6] cursor-pointer text-[#3C1053]'
              : 'bg-[#1E1E1E] border-[#1E1E1E] cursor-not-allowed opacity-50'
          }`}
          onClick={handleStartChallenge}
          disabled={!playerName.trim() || isCheckingName || nameStatus !== 'available'}
          aria-label="Start Challenge"
        >
          {isCheckingName ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2"></div>
              <span className="text-sm">Checking...</span>
            </div>
          ) : (
            'Yes'
          )}
        </button>
        {/* No Button */}
        <button
          className="flex items-center justify-center w-32 h-32 rounded-full bg-[#E3526A] border-4 border-[#E3526A] shadow-lg text-white text-5xl font-bold transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#E3526A]"
          onClick={() => setShowPopup(true)}
          aria-label="Show Task Info"
        >
          No
        </button>
      </div>

      {/* Popup Modal for No Button */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-[#1E1E1E] text-white rounded-lg p-8 max-w-lg w-full shadow-xl relative border-2 border-[#3C1053]">
            <button
              className="absolute top-2 right-2 text-2xl text-white hover:text-white/80"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Cyber Escape Room Overview</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg text-white/80">
              <li>Task 1 - Work out the password to access the login</li>
              <li>Task 2 - Email phishing challenge</li>
              <li>Task 3 - Password Strength challenge</li>
              <li>Offline Activities - 4 hands-on challenges</li>
              <li>Task 8 - Ransomware decryption challenge</li>
            </ul>
                         <p className="mt-6 text-center text-lg font-semibold text-white/80">Click Yes to begin the challenge.</p>
          </div>
        </div>
      )}
    </div>
  )
} 