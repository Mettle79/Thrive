"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, Lock, CheckCircle2, XCircle, Key, Smartphone } from "lucide-react"
import Link from "next/link"

export default function TwoFactorChallenge() {
  const [step, setStep] = useState(0)
  const [code, setCode] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [success, setSuccess] = useState(false)

  // Simulated 2FA code (in real world, this would be generated securely)
  const correctCode = "6298"

  const handleSubmitCode = () => {
    if (code === correctCode) {
      setSuccess(true)
    } else {
      setAttempts(prev => prev + 1)
      setCode("")
    }
  }

  const steps = [
    {
      title: "Security Alert!",
      description: "Someone has obtained your password! They're trying to access your account...",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "2FA to the Rescue!",
      description: "But wait! You have 2FA enabled. The attacker needs a special code from the legitimate email in task 2 to proceed.",
      icon: Shield,
      color: "text-green-500"
    },
    {
      title: "Enter Your 2FA Code",
      description: "Enter the 4-digit code from your email in task 2 to proceed.",
      icon: Smartphone,
      color: "text-orange-500"
    }
  ]

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">2FA Master!</h1>
            <p className="mb-6 text-center">
              Excellent work! You've successfully demonstrated how 2FA protects your account even when your password is compromised.
            </p>
            <div className="flex justify-center">
              <Link href="/task6">
                <Button className="bg-orange-600 hover:bg-orange-700">Proceed to Task 6</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const CurrentIcon = steps[step].icon

  return (
    <div className="flex flex-1 items-center justify-center p-4 text-white">
      <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <CurrentIcon className={`h-12 w-12 ${steps[step].color}`} />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold">{steps[step].title}</h1>
          
          {/* Progress indicator */}
          <div className="mb-6 flex justify-between">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex-1 text-center ${
                  index === step ? "text-orange-500" :
                  index < step ? "text-green-500" :
                  "text-orange-300"
                }`}
              >
                <div className={`h-2 w-2 mx-auto rounded-full mb-2 ${
                  index === step ? "bg-orange-500" :
                  index < step ? "bg-green-500" :
                  "bg-orange-300"
                }`} />
                <span className="text-xs">{s.title}</span>
              </div>
            ))}
          </div>

          <p className="mb-6 text-center">
            {steps[step].description}
          </p>

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 4-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="bg-orange-900/30 border-orange-500 text-white placeholder:text-orange-300 text-center text-2xl tracking-widest"
                />
                {attempts > 0 && (
                  <div className="flex flex-col items-center gap-2 text-red-500">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      <span className="text-sm">Incorrect code. Please try again.</span>
                    </div>
                    <Link href="/task2" className="text-sm text-orange-400 hover:text-orange-300">
                      Need the code? Click here to return to Task 2
                    </Link>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmitCode}
                disabled={code.length !== 4}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                Verify Code
              </Button>
            </div>
          )}

          {step < 2 && (
            <Button
              onClick={() => setStep(prev => prev + 1)}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              Continue
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 