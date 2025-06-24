"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)

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
          <source src="/escape room.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Escape Room Challenge!</h1>
        <p className="text-xl text-orange-200 mb-6">
          Are you ready to test your skills and solve the puzzles that await you.
        </p>
      </div>

      <div className="flex gap-4">
        {/* Yes Button */}
        <button
          className="flex items-center justify-center w-32 h-32 rounded-full bg-green-600 border-4 border-green-300 shadow-lg text-white text-5xl font-bold transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
          onClick={() => router.push('/task1')}
          aria-label="Start Challenge"
        >
          Yes
        </button>
        {/* No Button */}
        <button
          className="flex items-center justify-center w-32 h-32 rounded-full bg-red-600 border-4 border-red-300 shadow-lg text-white text-5xl font-bold transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          onClick={() => setShowPopup(true)}
          aria-label="Show Task Info"
        >
          No
        </button>
      </div>

      {/* Popup Modal for No Button */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-b from-orange-900 to-black text-white rounded-lg p-8 max-w-lg w-full shadow-xl relative border-2 border-orange-700">
            <button
              className="absolute top-2 right-2 text-2xl text-orange-200 hover:text-white"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Cyber Escape Room Overview</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>Task 1 - Work out the password to access the login</li>
              <li>Task 2 - Email phishing challenge</li>
              <li>Task 3 - Cryptography challenge</li>
              <li>Task 4 - Password Strength challenge</li>
              <li>Task 5 - Learn to use 2-factor authentication</li>
              <li>Task 6 - Identify the correct Menu cards</li>
              <li>Task 7 - Social media challenge</li>
              <li>Task 8 - Ransomware decryption challenge</li>
            </ul>
            <p className="mt-6 text-center text-lg font-semibold text-orange-200">Click <span className='text-green-300'>Yes</span> to begin the challenge.</p>
          </div>
        </div>
      )}
    </div>
  )
} 