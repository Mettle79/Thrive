"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, MessageCircle, Smartphone } from "lucide-react"
import Link from "next/link"

interface Scenario {
  id: number
  message: string
  isSafe: boolean
  explanation: string
}

export default function HomeChallenge() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [gameComplete, setGameComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<"safe" | "sketchy" | null>(null)

  const scenarios: Scenario[] = [
    {
      id: 1,
      message: "Your bank asks you to click a link to reset your PIN. Safe or sketchy?",
      isSafe: false,
      explanation: "Banks never send links to reset PINs via text. This is a phishing attempt to steal your banking credentials."
    },
    {
      id: 2,
      message: "Your Amazon order #12345 has been shipped! Track your package at amazon.com/track. Safe or sketchy?",
      isSafe: true,
      explanation: "This appears to be a legitimate Amazon shipping notification with a proper domain."
    },
    {
      id: 3,
      message: "URGENT: Your account will be suspended in 24 hours unless you verify your details now. Click here: bit.ly/verify-now. Safe or sketchy?",
      isSafe: false,
      explanation: "Urgent threats, suspicious shortened URLs, and requests for personal details are classic scam tactics."
    },
    {
      id: 4,
      message: "Your Netflix subscription will expire today. Renew now at netflix.com/billing to avoid interruption. Safe or sketchy?",
      isSafe: true,
      explanation: "This uses the legitimate Netflix domain and provides a reasonable service notification."
    },
    {
      id: 5,
      message: "You've won $10,000! Click here to claim your prize: tinyurl.com/prize-claim. Safe or sketchy?",
      isSafe: false,
      explanation: "Unexpected prize notifications with shortened URLs are almost always scams."
    },
    {
      id: 6,
      message: "Your PayPal account has been limited. Please log in at paypal.com/security to resolve this issue. Safe or sketchy?",
      isSafe: true,
      explanation: "This uses the legitimate PayPal domain and provides a reasonable security notification."
    },
    {
      id: 7,
      message: "Your Apple ID has been locked. Unlock now at apple-id-verify.com or lose access forever. Safe or sketchy?",
      isSafe: false,
      explanation: "Suspicious domain name and threatening language indicate this is a phishing attempt."
    },
    {
      id: 8,
      message: "Your Uber ride receipt is ready. View at uber.com/receipts. Safe or sketchy?",
      isSafe: true,
      explanation: "This uses the legitimate Uber domain and provides a reasonable service notification."
    },
    {
      id: 9,
      message: "Your bank card has been blocked due to suspicious activity. Call 1-800-FAKE-BANK immediately. Safe or sketchy?",
      isSafe: false,
      explanation: "Fake phone numbers and urgent requests to call are common scam tactics."
    },
    {
      id: 10,
      message: "Your Google account needs verification. Please confirm at google.com/security. Safe or sketchy?",
      isSafe: true,
      explanation: "This uses the legitimate Google domain and provides a reasonable security notification."
    }
  ]

  const handleAnswer = (answer: "safe" | "sketchy") => {
    setSelectedAnswer(answer)
    const current = scenarios[currentScenario]
    const isCorrect = (answer === "safe" && current.isSafe) || (answer === "sketchy" && !current.isSafe)
    
    if (isCorrect) {
      setScore(score + 1)
    }
    
    setShowResult(true)
  }

  const handleNext = () => {
    setShowResult(false)
    setSelectedAnswer(null)
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
    } else {
      setGameComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentScenario(0)
    setScore(0)
    setShowResult(false)
    setGameComplete(false)
    setSelectedAnswer(null)
  }

  const current = scenarios[currentScenario]

  if (gameComplete) {
    const percentage = Math.round((score / scenarios.length) * 100)
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
        <Card className="w-full max-w-md border-2" style={{ backgroundColor: '#1E1E1E', borderColor: '#BE99E6' }}>
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-12 w-12" style={{ color: '#BE99E6' }} />
            </div>
                         <h1 className="mb-6 text-center text-2xl font-bold" style={{ color: '#BE99E6' }}>Game Complete!</h1>
             <div className="mb-6 text-center">
               <p className="text-lg mb-2" style={{ color: '#BE99E6' }}>Your Score:</p>
              <p className="text-3xl font-bold" style={{ color: '#BE99E6' }}>
                {score}/{scenarios.length} ({percentage}%)
              </p>
            </div>
            <div className="mb-6 text-center">
              {percentage >= 80 && (
                <p className="font-semibold" style={{ color: '#BE99E6' }}>Excellent! You're a scam-spotting expert!</p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="font-semibold" style={{ color: '#BE99E6' }}>Good job! Keep learning to stay safe online.</p>
              )}
              {percentage < 60 && (
                <p className="font-semibold" style={{ color: '#E3526A' }}>Keep practicing! Online safety is crucial.</p>
              )}
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={handleRestart} 
                className="font-bold"
                style={{ backgroundColor: '#BE99E6', color: '#3C1053' }}
              >
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#BE99E6' }}>HOME CHALLENGE</h1>
          <p className="text-sm" style={{ color: 'white' }}>
            Question {currentScenario + 1} of {scenarios.length} • Score: {score}
          </p>
        </div>

        {/* Mobile Phone Interface */}
        <div className="relative mx-auto w-80 h-96 rounded-3xl border-4 shadow-2xl mb-6" style={{ backgroundColor: '#1E1E1E', borderColor: '#BE99E6' }}>
          {/* Phone Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-6 rounded-b-2xl z-10" style={{ backgroundColor: '#BE99E6' }}></div>
          
          {/* Screen Content */}
          <div className="absolute inset-2 rounded-2xl p-4 flex flex-col" style={{ backgroundColor: '#121212' }}>
            {/* Message Bubble */}
            <div className="flex-1 flex items-center justify-center">
              <div className="rounded-2xl p-4 max-w-xs" style={{ backgroundColor: '#1E1E1E' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="h-4 w-4" style={{ color: '#BE99E6' }} />
                  <span className="text-xs" style={{ color: 'white' }}>Unknown Sender</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'white' }}>
                  {current.message}
                </p>
              </div>
            </div>
            
            {/* Result Display */}
            {showResult && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                selectedAnswer === "safe" && current.isSafe 
                  ? "text-green-800" 
                  : selectedAnswer === "sketchy" && !current.isSafe
                  ? "text-green-800"
                  : "text-red-800"
              }`} style={{ 
                backgroundColor: (selectedAnswer === "safe" && current.isSafe) || (selectedAnswer === "sketchy" && !current.isSafe) 
                  ? '#BE99E6' 
                  : '#E3526A' 
              }}>
                <div className="flex items-center gap-2 mb-1">
                  {(selectedAnswer === "safe" && current.isSafe) || (selectedAnswer === "sketchy" && !current.isSafe) ? (
                    <CheckCircle className="h-4 w-4" style={{ color: '#3C1053' }} />
                  ) : (
                    <XCircle className="h-4 w-4" style={{ color: '#3C1053' }} />
                  )}
                  <span className="font-semibold" style={{ color: '#3C1053' }}>
                    {(selectedAnswer === "safe" && current.isSafe) || (selectedAnswer === "sketchy" && !current.isSafe) 
                      ? "Correct!" 
                      : "Incorrect!"}
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#3C1053' }}>{current.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Answer Buttons */}
        {!showResult && (
          <div className="flex gap-4">
            <Button 
              onClick={() => handleAnswer("safe")}
              className="flex-1 font-bold py-4 text-lg"
              style={{ backgroundColor: '#BE99E6', color: '#3C1053' }}
            >
              SAFE
            </Button>
            <Button 
              onClick={() => handleAnswer("sketchy")}
              className="flex-1 font-bold py-4 text-lg"
              style={{ backgroundColor: '#E3526A', color: 'white' }}
            >
              SKETCHY
            </Button>
          </div>
        )}

        {/* Next Button */}
        {showResult && (
          <Button 
            onClick={handleNext}
            className="w-full font-bold py-4 text-lg"
            style={{ backgroundColor: '#BE99E6', color: '#3C1053' }}
          >
            {currentScenario < scenarios.length - 1 ? "Next Question" : "Finish Game"}
          </Button>
        )}


      </div>
    </div>
  )
}
