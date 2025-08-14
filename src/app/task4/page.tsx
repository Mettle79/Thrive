"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, Lock, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

export default function PasswordChallenge() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [strength, setStrength] = useState<"weak" | "medium" | "strong">("weak")
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [taskTime, setTaskTime] = useState(0)
  const [passwords, setPasswords] = useState<{ weak: string; medium: string; strong: string }>({
    weak: "",
    medium: "",
    strong: ""
  })

  // Initialize task tracking
  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(4)
  }, [])

  // Password strength checker
  const checkPasswordStrength = (pass: string) => {
    let score = 0
    const length = pass.length

    // Length check (minimum 8 characters)
    if (length >= 8) score += 1
    if (length >= 12) score += 1
    if (length >= 16) score += 1

    // Character type checks
    if (/[A-Z]/.test(pass)) score += 1
    if (/[a-z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    // Common patterns check (deduct points for common patterns)
    if (/(.)\1{2,}/.test(pass)) score -= 1
    if (/^[A-Za-z]+$/.test(pass)) score -= 1
    if (/^[0-9]+$/.test(pass)) score -= 1

    // Determine strength
    if (score >= 5) return "strong"
    if (score >= 3) return "medium"
    return "weak"
  }

  // Update strength when password changes
  useEffect(() => {
    setStrength(checkPasswordStrength(password))
  }, [password])

  // Check if passwords match
  useEffect(() => {
    setPasswordsMatch(password === confirmPassword && password !== "")
  }, [password, confirmPassword])

  const handleSubmit = () => {
    const currentStrength = checkPasswordStrength(password)
    const requiredStrength = currentStep === 0 ? "weak" : currentStep === 1 ? "medium" : "strong"

    if (currentStrength === requiredStrength && passwordsMatch) {
      setPasswords(prev => ({
        ...prev,
        [currentStrength]: password
      }))

      if (currentStep < 2) {
        setCurrentStep(prev => prev + 1)
        setPassword("")
        setConfirmPassword("")
      } else {
        // Record task completion time
        const manager = LeaderboardManager.getInstance()
        const time = manager.completeTask(4)
        setTaskTime(time)
        
        setSuccess(true)
      }
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">Password Master!</h1>
            <p className="mb-6 text-center">
              Excellent work! You've demonstrated your understanding of password strength by creating passwords of varying security levels.
            </p>
            <div className="mb-6 text-center">
              <p className="text-orange-300">Task completed in:</p>
              <p className="text-2xl font-bold text-green-400">
                {LeaderboardManager.formatTime(taskTime)}
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/task5">
                <Button className="bg-orange-600 hover:bg-orange-700">Proceed to Task 5</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const steps = [
    { title: "Create a Weak Password", description: "Create a simple password that would be considered weak."},
    { title: "Create a Medium Password", description: "Create a moderately secure password with some complexity."},
    { title: "Create a Strong Password", description: "Create a strong password with high complexity." }
  ]

  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <ProgressTracker currentTask={4} />
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <Lock className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold">Password Strength Challenge</h1>
          
          {/* Progress indicator */}
          <div className="mb-6 flex justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index === currentStep ? "text-orange-500" :
                  index < currentStep ? "text-green-500" :
                  "text-orange-300"
                }`}
              >
                <div className={`h-2 w-2 mx-auto rounded-full mb-2 ${
                  index === currentStep ? "bg-orange-500" :
                  index < currentStep ? "bg-green-500" :
                  "bg-orange-300"
                }`} />
                <span className="text-xs">{step.title}</span>
              </div>
            ))}
          </div>

          <p className="mb-6 text-center">
            {steps[currentStep].description}
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-orange-900/30 border-orange-500 text-white placeholder:text-orange-300"
              />
              <div className="flex items-center gap-2">
                <div className={`h-1 flex-1 rounded-full ${
                  strength === "weak" ? "bg-red-500" :
                  strength === "medium" ? "bg-yellow-500" :
                  "bg-green-500"
                }`} />
                <span className="text-sm text-orange-200">
                  {strength.charAt(0).toUpperCase() + strength.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-orange-900/30 border-orange-500 text-white placeholder:text-orange-300"
              />
              <div className="flex items-center gap-2">
                {passwordsMatch ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm text-orange-200">
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={strength !== (currentStep === 0 ? "weak" : currentStep === 1 ? "medium" : "strong") || !passwordsMatch}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {currentStep < 2 ? "Next Step" : "Complete Challenge"}
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
} 