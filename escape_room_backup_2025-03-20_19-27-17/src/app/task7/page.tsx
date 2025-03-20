"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"
import Link from "next/link"

export default function Task7() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 text-white">
      <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <Shield className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold">Task 7: Password Revealed</h1>
          <p className="mb-6 text-center">
            You've successfully completed the QR code challenge. Here's the password you'll need for the final task.
          </p>
          <div className="mb-6 rounded border border-orange-500 bg-black/50 p-4">
            <h2 className="mb-2 font-mono text-lg text-orange-500">Important Information:</h2>
            <p className="text-sm text-white">
              The password for the final task is: <span className="font-bold text-orange-400">Ransomware</span>
            </p>
          </div>
          <div className="flex justify-center">
            <Link href="/task8">
              <Button className="bg-orange-600 hover:bg-orange-700">Proceed to Final Task</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 