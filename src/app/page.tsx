"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Shield, Key, Server, FileText, Lightbulb, Brain } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-orange-500 bg-black">
          <CardContent className="p-6">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-orange-500">Welcome to the Escape Room Challenge</h1>
              <p className="text-lg text-orange-300">
                Test your problem-solving skills with our series of cybersecurity challenges.
                Each task will push your limits and teach you valuable skills.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Link href="/task1">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Lock className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 1: Password Challenge</h2>
                    </div>
                    <p className="text-orange-300">
                      Can you crack the password? Look for clues in the user's personal information.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task2">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 2: Security Protocol</h2>
                    </div>
                    <p className="text-orange-300">
                      Navigate through the security protocols and find the hidden key.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task3">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Key className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 3: Encryption Challenge</h2>
                    </div>
                    <p className="text-orange-300">
                      Decrypt the message using the provided encryption key.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task4">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Server className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 4: Server Access</h2>
                    </div>
                    <p className="text-orange-300">
                      Gain access to the server by solving the network puzzle.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task5">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 5: File Analysis</h2>
                    </div>
                    <p className="text-orange-300">
                      Analyze the hidden files to find the secret message.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task6">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 6: Pattern Recognition</h2>
                    </div>
                    <p className="text-orange-300">
                      Identify the pattern in the sequence to unlock the next level.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task7">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Brain className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 7: Logic Puzzle</h2>
                    </div>
                    <p className="text-orange-300">
                      Solve the complex logic puzzle to proceed.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/task8">
                <Card className="border-orange-500 bg-orange-900/20 transition-colors hover:bg-orange-900/30">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <Lock className="h-6 w-6 text-orange-500" />
                      <h2 className="text-xl font-bold">Task 8: Final Challenge</h2>
                    </div>
                    <p className="text-orange-300">
                      The ultimate test of your cybersecurity knowledge.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <div className="mt-8 rounded border border-orange-500/50 bg-orange-900/30 p-4">
              <h2 className="mb-2 text-xl font-bold text-orange-500">Instructions</h2>
              <ul className="list-disc pl-4 text-orange-300">
                <li>Complete each task in sequence</li>
                <li>Look for hidden clues and hints</li>
                <li>Use your problem-solving skills</li>
                <li>Don't be afraid to think outside the box</li>
                <li>Good luck!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

