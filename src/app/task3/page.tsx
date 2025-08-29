"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, Lock, CheckCircle2, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

export default function PasswordChallenge() {
  const [password, setPassword] = useState("")
  const [crackTime, setCrackTime] = useState("")
  const [success, setSuccess] = useState(false)
  const [taskTime, setTaskTime] = useState(0)

  // Initialize task tracking
  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(3)
  }, [])

  // Calculate time to crack password using multiplicative approach
  const calculateCrackTime = (pass: string): string => {
    if (!pass) return ""
    
    const length = pass.length
    let timeMultiplier = 1
    
    // Start with base time based on length (increased base time)
    let baseTime = length * 2 // 2 seconds per character as base (increased from 0.5)
    
    // Apply multipliers for each character type
    const hasLowercase = /[a-z]/.test(pass)
    const hasUppercase = /[A-Z]/.test(pass)
    const hasDigits = /[0-9]/.test(pass)
    const hasSymbols = /[^A-Za-z0-9]/.test(pass)
    
    // Count characters of each type
    const lowercaseCount = (pass.match(/[a-z]/g) || []).length
    const uppercaseCount = (pass.match(/[A-Z]/g) || []).length
    const digitCount = (pass.match(/[0-9]/g) || []).length
    const symbolCount = (pass.match(/[^A-Za-z0-9]/g) || []).length
    
    // Apply multipliers: lowercase/numbers = 4x, capitals = 8x, symbols = 16x (increased from 2x, 4x, 8x)
    if (lowercaseCount > 0) timeMultiplier *= Math.pow(4, lowercaseCount)
    if (uppercaseCount > 0) timeMultiplier *= Math.pow(8, uppercaseCount)
    if (digitCount > 0) timeMultiplier *= Math.pow(4, digitCount)
    if (symbolCount > 0) timeMultiplier *= Math.pow(16, symbolCount)
    
    // Calculate final time
    const secondsToCrack = baseTime * timeMultiplier
    
    // Convert to human readable format
    return formatTime(secondsToCrack)
  }
  
  // Format time in human readable units with better granularity
  const formatTime = (seconds: number): string => {
    if (seconds < 1) return "less than 1 second"
    if (seconds < 60) return `${Math.round(seconds)} second${Math.round(seconds) !== 1 ? 's' : ''}`
    
    const minutes = seconds / 60
    if (minutes < 60) return `${Math.round(minutes)} minute${Math.round(minutes) !== 1 ? 's' : ''}`
    
    const hours = minutes / 60
    if (hours < 24) return `${Math.round(hours)} hour${Math.round(hours) !== 1 ? 's' : ''}`
    
    const days = hours / 24
    if (days < 7) return `${Math.round(days)} day${Math.round(days) !== 1 ? 's' : ''}`
    
    const weeks = days / 7
    if (weeks < 4) return `${Math.round(weeks)} week${Math.round(weeks) !== 1 ? 's' : ''}`
    
    const months = days / 30.44 // Average days per month
    if (months < 12) return `${Math.round(months)} month${Math.round(months) !== 1 ? 's' : ''}`
    
    const years = days / 365
    if (years < 10) return `${Math.round(years * 10) / 10} year${Math.round(years * 10) / 10 !== 1 ? 's' : ''}`
    if (years < 50) return `${Math.round(years)} years`
    
    const decades = years / 10
    if (decades < 10) return `${Math.round(decades)} decade${Math.round(decades) !== 1 ? 's' : ''}`
    
    const halfCenturies = years / 50
    if (halfCenturies < 2) return `${Math.round(halfCenturies * 10) / 10} half-centur${Math.round(halfCenturies * 10) / 10 !== 1 ? 'ies' : 'y'}`
    
    const centuries = years / 100
    if (centuries < 10) return `${Math.round(centuries)} centur${Math.round(centuries) !== 1 ? 'ies' : 'y'}`
    
    const millennia = centuries / 10
    return `${Math.round(millennia)} millenni${Math.round(millennia) !== 1 ? 'a' : 'um'}`
  }
  
  // Check if password meets 1 century requirement using multiplicative approach
  const meetsRequirement = (pass: string): boolean => {
    if (!pass) return false
    
    const length = pass.length
    let timeMultiplier = 1
    
    let baseTime = length * 2
    
    const lowercaseCount = (pass.match(/[a-z]/g) || []).length
    const uppercaseCount = (pass.match(/[A-Z]/g) || []).length
    const digitCount = (pass.match(/[0-9]/g) || []).length
    const symbolCount = (pass.match(/[^A-Za-z0-9]/g) || []).length
    
    if (lowercaseCount > 0) timeMultiplier *= Math.pow(4, lowercaseCount)
    if (uppercaseCount > 0) timeMultiplier *= Math.pow(8, uppercaseCount)
    if (digitCount > 0) timeMultiplier *= Math.pow(4, digitCount)
    if (symbolCount > 0) timeMultiplier *= Math.pow(16, symbolCount)
    
    const secondsToCrack = baseTime * timeMultiplier
    const yearsToCrack = secondsToCrack / (365 * 24 * 60 * 60)
    
    return yearsToCrack >= 100
  }

  // Helper function to calculate years to crack using multiplicative approach
  const calculateYearsToCrack = (pass: string): number => {
    if (!pass) return 0
    
    const length = pass.length
    let timeMultiplier = 1
    
    let baseTime = length * 2
    
    const lowercaseCount = (pass.match(/[a-z]/g) || []).length
    const uppercaseCount = (pass.match(/[A-Z]/g) || []).length
    const digitCount = (pass.match(/[0-9]/g) || []).length
    const symbolCount = (pass.match(/[^A-Za-z0-9]/g) || []).length
    
    if (lowercaseCount > 0) timeMultiplier *= Math.pow(4, lowercaseCount)
    if (uppercaseCount > 0) timeMultiplier *= Math.pow(8, uppercaseCount)
    if (digitCount > 0) timeMultiplier *= Math.pow(4, digitCount)
    if (symbolCount > 0) timeMultiplier *= Math.pow(16, symbolCount)
    
    const secondsToCrack = baseTime * timeMultiplier
    const yearsToCrack = secondsToCrack / (365 * 24 * 60 * 60)
    
    return yearsToCrack
  }

  // Update crack time when password changes
  useEffect(() => {
    setCrackTime(calculateCrackTime(password))
  }, [password])

  const handleSubmit = () => {
    if (meetsRequirement(password)) {
      // Record task completion time
      const manager = LeaderboardManager.getInstance()
      const time = manager.completeTask(3)
      setTaskTime(time)
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
                         <h1 className="mb-6 text-center text-2xl font-bold text-white">Password Security Master!</h1>
             <p className="mb-6 text-center text-white/80">
               Incredible work! You've created a password that would take at least 1 century to crack. 
               Your understanding of password security is truly exceptional!
             </p>

            <div className="flex justify-center">
              <Link href="/offline-activities">
                <Button className="bg-[#3C1053] hover:bg-[#3C1053]/80 text-white">Begin Offline Activities</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="absolute top-4 right-4 z-10">
        <ProgressTracker currentTask={3} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <Lock className="h-12 w-12 text-white" />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold text-white">Password Strength Estimator</h1>
          
          <p className="mb-6 text-center text-white/80">
            Create a password that would take at least <span className="text-white font-bold">1 century</span> to crack.
            The system will estimate the time-to-crack based on character complexity and length.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
              />
              
              {password && (
                <div className="space-y-3 p-3 bg-[#121212] rounded-lg border border-[#3C1053]/30">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-white" />
                    <span className="text-sm text-white/80">Estimated time to crack:</span>
                  </div>
                  <div className="text-lg font-bold text-center text-white">
                    {crackTime}
                  </div>
                  
                  <div className="space-y-1 text-xs text-white/80">
                    <div className="flex justify-between">
                      <span>Length:</span>
                      <span className="text-white">{password.length} characters</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Character sets:</span>
                      <span className="text-white">
                        {[
                          /[a-z]/.test(password) && "lowercase",
                          /[A-Z]/.test(password) && "uppercase", 
                          /[0-9]/.test(password) && "digits",
                          /[^A-Za-z0-9]/.test(password) && "symbols"
                        ].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {meetsRequirement(password) ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-[#E3526A]" />
                )}
                                                 <span className="text-sm text-white/80">
                  {meetsRequirement(password) 
                    ? "Password meets 1-century requirement!" 
                    : "Password needs to take at least 1 century to crack"}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!meetsRequirement(password)}
              className="w-full bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053] disabled:opacity-50"
            >
              Complete Challenge
            </Button>
            
            <div className="text-xs text-white/80 text-center">
              <p>💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols to increase complexity!</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
} 