"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Smartphone, QrCode, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"

export default function OfflineActivities() {
  const [currentActivity, setCurrentActivity] = useState(0)

  const briefcaseActivity = {
    id: 1,
    title: "The Briefcase Code",
    description: "You'll need to locate and open a physical briefcase using the skills you've learned. Look for hidden clues and use your cryptography knowledge. The code for the briefcase is provided in the legitimate email from Task 2. If you forgot to take note of the code, you can return to Task 2 to retrieve it.",
    icon: Lock,
    color: "text-blue-500"
  }

  const subActivities = [
    {
      id: 2,
      title: "Decrypting the Code",
      description: "Use your decryption skills to solve a complex cipher. This will test your understanding of cryptographic principles.",
      icon: FileText,
      color: "text-green-500"
    },
    {
      id: 3,
      title: "Social Media",
      description: "Navigate through social media challenges to identify which pictures are safe and which are not safe to post online.",
      icon: Smartphone,
      color: "text-purple-500"
    },
    {
      id: 4,
      title: "QR Code Challenge",
      description: "Find QR codes that have been set up to not be legitimate. Identify which codes are safe to scan and which ones could pose security risks.",
      icon: QrCode,
      color: "text-orange-500"
    }
  ]

  const CurrentIcon = briefcaseActivity.icon

  return (
    <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="absolute top-4 right-4 z-10">
        <ProgressTracker />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-2xl bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-8">
            <div className="mb-8 flex justify-center">
              <Shield className="h-16 w-16 text-white" />
            </div>
            
            <h1 className="mb-6 text-center text-3xl font-bold">Offline Activities</h1>
            
            <p className="mb-8 text-center text-lg text-white/80">
              Congratulations on completing the online challenges! Now it's time to put your skills to the test in the real world.
            </p>

            <div className="mb-8">
              <h2 className="mb-4 text-center text-xl font-semibold text-white">
                Your Mission: Complete the Briefcase Challenge
              </h2>
              
              {/* Main Briefcase Activity */}
              <div className="mb-6 p-6 rounded-lg border-2 border-[#3C1053] bg-[#121212]">
                                 <div className="flex items-center gap-4 mb-4">
                   <briefcaseActivity.icon className={`h-8 w-8 ${briefcaseActivity.color}`} />
                   <div>
                     <h3 className="text-xl font-semibold text-white">{briefcaseActivity.title}</h3>
                     <p className="text-white/80">{briefcaseActivity.description}</p>
                                           <div className="mt-3">
                        <Link href="/task2">
                          <Button className="bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053] text-sm">
                            ← Return to Task 2 to get the briefcase code
                          </Button>
                        </Link>
                      </div>
                   </div>
                 </div>
                
                {/* Sub-activities contained within the briefcase */}
                <div className="ml-12 border-l-2 border-[#3C1053]/30 pl-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Activities Inside:</h4>
                  <div className="space-y-3">
                    {subActivities.map((activity) => (
                      <div 
                        key={activity.id}
                        className="p-3 rounded-lg border border-[#3C1053]/30 bg-[#121212] hover:border-[#3C1053]/60 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <activity.icon className={`h-5 w-5 ${activity.color}`} />
                          <div>
                            <h5 className="font-semibold text-white">{activity.title}</h5>
                            <p className="text-sm text-white/80 mt-1">{activity.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            <div className="mt-8 text-center">
              <p className="text-sm text-white/80 mb-4">
                When you're ready to begin the offline activities, click the button below.
              </p>
              <Link href="/task8">
                <Button className="bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to Final Task
                </Button>
              </Link>
            </div>

            <div className="mt-6 text-xs text-white/80 text-center">
              <p>💡 Tip: Work with your team members to complete these activities efficiently!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
