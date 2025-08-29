"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

// Function to generate dynamic PIN based on date
function generateDynamicPin() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1 // getMonth() returns 0-11

  // Calculate the dynamic values (2 days before and 2 months before)
  const dynamicDay = Math.max(1, day - 2)
  const dynamicMonth = Math.max(1, month - 2)

  // Format as DDMM
  const pin = `${String(dynamicDay).padStart(2, '0')}${String(dynamicMonth).padStart(2, '0')}`
  
  return pin
}

export default function Home() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const correctPin = generateDynamicPin()
    if (pin === correctPin) {
      setError(false)
      // Store pin verification in sessionStorage
      sessionStorage.setItem("hasEnteredPin", "true")
      // Redirect to welcome page
      window.location.href = "/welcome"
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center">
        <Card className="border-[#3C1053] bg-[#1E1E1E]">
          <CardContent className="p-8">
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="Stellar Elevate Logo"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>

            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-white">
                Welcome to the Cyber Security Escape Rooms
              </h1>
              
              <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
                <div className="mb-4">
                  <Input
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="border-[#3C1053] bg-[#121212] text-white placeholder:text-white/70"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-[#E3526A]">
                      Incorrect PIN. Please try again.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053] font-semibold">
                  Begin Challenge
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}

