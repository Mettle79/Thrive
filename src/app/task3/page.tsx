"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, Lock } from "lucide-react"
import Link from "next/link"

export default function CryptographyChallenge() {
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  // The encrypted text is "Cryptography is fun" shifted left by 3
  const encryptedText = "Fubswrjudskb lv ixq"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.toLowerCase() === "cryptography is fun") {
      setError(false)
      setSuccess(true)
    } else {
      setError(true)
      setSuccess(false)
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
            <h1 className="mb-6 text-center text-2xl font-bold">Decryption Master!</h1>
            <p className="mb-6 text-center">
              Excellent work! You've successfully decrypted the message and proven your cryptography skills.
            </p>
            <div className="flex justify-center">
              <Link href="/task4">
                <Button className="bg-orange-600 hover:bg-orange-700">Proceed to Task 4</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col bg-black p-4 text-orange-500">
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-orange-500 bg-black">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-orange-500 mb-2">Shift Cipher Challenge</h1>
              <p className="text-sm text-orange-400 mb-4">
                Your task is to decrypt a message that has been encoded using a shift cipher.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded border border-orange-500 p-4">
                <h2 className="mb-2 font-mono text-lg text-white">Encrypted Message:</h2>
                <p className="font-mono text-2xl text-white mb-4">{encryptedText}</p>
                <div className="space-y-2 text-white">
                  <p className="text-sm">This message has been encrypted using a shift cipher where:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li>Each letter has been shifted 3 positions to the right in the alphabet</li>
                    <li>For example: 'A' becomes 'D', 'B' becomes 'E', etc.</li>
                    <li>To decrypt, shift each letter 3 positions to the left</li>
                    <li>Spaces remain unchanged</li>
                    <li>Case doesn't matter in your answer</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="answer" className="text-sm text-white">
                    Enter the decrypted message:
                  </label>
                  <Input
                    id="answer"
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="border-orange-500 bg-black font-mono text-white focus-visible:ring-orange-500"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>That's not quite right. Try shifting the letters in the other direction!</span>
                  </div>
                )}
                <Button 
                  type="submit"
                  className="w-full bg-orange-700 hover:bg-orange-600"
                >
                  Submit Answer
                </Button>
              </form>

              <div className="mt-6 rounded border border-orange-500 bg-black/50 p-4">
                <h2 className="mb-2 font-mono text-lg text-orange-500">Decryption Tips:</h2>
                <ul className="list-inside list-disc space-y-1 text-sm text-white">
                  <li>Write out the alphabet to help you track the shifts</li>
                  <li>Try decoding a few letters first to confirm the pattern</li>
                  <li>Remember that 'A' shifts to 'X', 'B' to 'Y', etc. when going backwards</li>
                  <li>Look for common words as they emerge</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded border border-orange-500 bg-black p-2">
              <div className="flex items-center">
                <Lock className="mr-2 h-4 w-4" />
                <span className="text-xs">Secure Terminal</span>
              </div>
              <div className="text-xs">System v1.0.7</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 