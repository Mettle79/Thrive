"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has entered correct pin (you might want to use a more secure method)
    const hasEnteredPin = sessionStorage.getItem("hasEnteredPin")
    if (!hasEnteredPin) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-900 to-black text-white p-4">
      <div className="w-full max-w-4xl mb-8">
        <video 
          className="w-full rounded-lg shadow-lg" 
          controls
          autoPlay
          muted
          loop
        >
          <source src="/Escape.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Escape Room Challenge!</h1>
        <p className="text-xl text-orange-200 mb-6">
          Get ready to test your skills and solve the puzzles that await you.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/task1">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Start Challenge
          </Button>
        </Link>
      </div>
    </div>
  )
} 