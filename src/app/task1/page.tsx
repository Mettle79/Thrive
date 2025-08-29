"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Lock, ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageCarousel } from "@/components/ImageCarousel"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

export default function PasswordGame() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [hintEnabled, setHintEnabled] = useState(false)
  const [taskTime, setTaskTime] = useState(0)

  // Initialize task tracking
  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(1)
  }, [])

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !hintEnabled) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0 && !hintEnabled) {
      setHintEnabled(true)
    }
  }, [timeLeft, hintEnabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Dolphin7") {
      setError(false)
      setSuccess(true)
      
      // Record task completion time
      const manager = LeaderboardManager.getInstance()
      const time = manager.completeTask(1)
      setTaskTime(time)
    } else {
      setError(true)
      setSuccess(false)
    }
  }

  const hintImages = [
    {
      src: "/CyberSecurity.png?height=200&width=200",
      alt: "Cyber Security",
      caption: "Cyber Security"
    },
    {
      src: "/Room1.png?height=200&width=200",
      alt: "Ocean view",
      caption: "Cyber Room 1"
    },
    {
      src: "/Lucky7.png?height=160&width=100",
      alt: "Lucky number 7",
      caption: "Lucky 7"
    },
    {
      src: "/Dolphin1.png?height=200&width=200",
      alt: "Aquarium entrance",
      caption: "Dolphin"
    },

    {
      src: "/family.png?height=200&width=200",
      alt: "Family Picture",
      caption: "Family"
    },
    {
      src: "/Comics.png?height=200&width=200",
      alt: "Comics",
      caption: "Comics"
    },
    {
      src: "/Pun.png?height=200&width=200",
      alt: "Dolphin Pun",
      caption: "Dolphin Pun"
    },
    {
      src: "/Friends.png?height=200&width=200",
      alt: "Friends Picture",
      caption: "Friends"
    },
    {
      src: "/Dolphin2.png?height=200&width=200",
      alt: "Marine life exhibit",
      caption: "Dolphin2"
    },
    {
      src: "/Coding.png?height=200&width=200",
      alt: "Coding",
      caption: "Coding"
    },
    {
      src: "/Room2.png?height=200&width=200",
      alt: "Marine life exhibit",
      caption: "Room 2"
    }
  ]

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Access Granted</h1>
            <p className="mb-6 text-center text-white/80">You have successfully logged in.</p>

            <div className="flex justify-center">
              <Link href="/task2">
                <Button className="bg-[#3C1053] hover:bg-[#3C1053]/80 text-white">Proceed to Task 2</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <ProgressTracker currentTask={1} />
      </div>
      <div className="grid flex-1 gap-6 md:grid-cols-3">
        <div className="col-span-2 flex flex-col">
          <div className="mb-4 rounded border border-[#3C1053] bg-[#1E1E1E] p-4">
            <div className="mb-4 flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-[#E3526A]"></div>
              <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-4 text-sm text-white">Terminal</div>
            </div>
            <div className="mb-6 font-mono text-white/80">
              <p className="mb-2">$ System boot...</p>
              <p className="mb-2">$ Initializing security protocol...</p>
              <p className="mb-2">$ Access restricted. Password required.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-white">$</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border-[#3C1053] bg-[#121212] font-mono text-white focus-visible:ring-[#BE99E6] placeholder-white/50"
                />
              </div>
              {error && <p className="font-mono text-[#E3526A]">Access denied. Incorrect password.</p>}
              <Button type="submit" className="bg-[#BE99E6] font-mono hover:bg-[#BE99E6]/80 text-[#3C1053]">
                Submit
              </Button>
            </form>
          </div>
          <div className="flex-1 rounded border border-[#3C1053] bg-[#1E1E1E] p-4">
            <h2 className="mb-4 font-mono text-xl text-white">Challenge Notes</h2>
            <p className="font-mono text-white/80">
              Check the users personal information for clues for what their password may be.  
              You need to access the system to get to the next stage.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Button 
                variant="outline" 
                className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                onClick={() => setShowHint(true)}
                disabled={!hintEnabled}
              >
                {hintEnabled ? "Show Hint" : `Hint available in ${timeLeft}s`}
              </Button>
            </div>
            {showHint && (
              <div className="mt-4 rounded border border-[#3C1053]/50 bg-[#121212] p-4">
                <h3 className="mb-2 font-mono text-lg text-white">Hint:</h3>
                <ul className="list-disc pl-4 font-mono text-white/80">
                  <li>First letter is capital</li>
                  <li>It's the user's favorite animal</li>
                  <li>Followed by their lucky number</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="rounded border border-[#3C1053] bg-[#1E1E1E] p-4">
          <h2 className="mb-4 font-mono text-xl text-white">Non-Restricted User Apps</h2>
          <Tabs defaultValue="photos">
                         <TabsList className="grid w-full grid-cols-2 bg-[#121212]">
               <TabsTrigger value="photos" className="text-white data-[state=active]:bg-[#BE99E6] data-[state=active]:text-[#3C1053]">
                 <ImageIcon className="mr-2 h-4 w-4" />
                 Photos
               </TabsTrigger>
               <TabsTrigger value="calendar" className="text-white data-[state=active]:bg-[#BE99E6] data-[state=active]:text-[#3C1053]">
                 <Calendar className="mr-2 h-4 w-4" />
                 Calendar
               </TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-4">
              <ImageCarousel images={hintImages} />
            </TabsContent>
            <TabsContent value="calendar" className="mt-4">
              <div className="rounded border border-[#3C1053] p-2">
                <div className="mb-2 text-center font-mono text-white">July 2025</div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-white/80">
                  <div>Su</div>
                  <div>Mo</div>
                  <div>Tu</div>
                  <div>We</div>
                  <div>Th</div>
                  <div>Fr</div>
                  <div>Sa</div>

                  <div className="py-1"></div>
                  <div className="py-1"></div>
                  <div className="py-1"></div>
                  <div className="py-1"></div>
                  <div className="py-1"></div>
                  <div className="py-1"></div>
                  <div className="py-1">1</div>

                  <div className="py-1">2</div>
                  <div className="py-1">3</div>
                  <div className="py-1">4</div>
                  <div className="py-1">5</div>
                  <div className="py-1">6</div>
                  <div className="rounded bg-[#BE99E6] py-1 cursor-help text-[#3C1053]" title="Lucky number">7</div>
                  <div className="py-1">8</div>

                  <div className="py-1">9</div>
                  <div className="py-1">10</div>
                  <div className="py-1">11</div>
                  <div className="py-1">12</div>
                  <div className="py-1">13</div>
                  <div className="py-1">14</div>
                  <div className="py-1">15</div>

                  <div className="py-1">16</div>
                  <div className="py-1">17</div>
                  <div className="py-1">18</div>
                  <div className="py-1">19</div>
                  <div className="py-1">20</div>
                  <div className="py-1">21</div>
                  <div className="py-1">22</div>

                  <div className="py-1">23</div>
                  <div className="py-1">24</div>
                  <div className="py-1">25</div>
                  <div className="py-1">26</div>
                  <div className="py-1">27</div>
                  <div className="py-1">28</div>
                  <div className="py-1">29</div>

                  <div className="py-1">30</div>
                  <div className="py-1">31</div>
                </div>
                <div className="mt-2 text-xs text-white/80">
                  <p>Note: <span className="font-bold text-white">Dolphin</span> watching tour on the <span className="font-bold text-white">7th</span>!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 