"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shield, Lock, Smartphone, QrCode, FileText, ArrowRight, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"

export default function OfflineActivities() {
  const [currentActivity, setCurrentActivity] = useState(0)
  const [decryptionAnswer, setDecryptionAnswer] = useState("")
  const [isDecryptionComplete, setIsDecryptionComplete] = useState(false)
  const [socialMediaAnswer, setSocialMediaAnswer] = useState("")
  const [isSocialMediaComplete, setIsSocialMediaComplete] = useState(false)
  const [qrCodeAnswer, setQrCodeAnswer] = useState("")
  const [isQrCodeComplete, setIsQrCodeComplete] = useState(false)

  // Check if decryption answer is correct (case insensitive)
  const checkDecryptionAnswer = (answer: string) => {
    return answer.toLowerCase().trim() === "cryptography is fun"
  }

  // Handle decryption answer input
  const handleDecryptionInput = (value: string) => {
    setDecryptionAnswer(value)
    setIsDecryptionComplete(checkDecryptionAnswer(value))
  }

  // Check if social media answer is correct (case insensitive)
  const checkSocialMediaAnswer = (answer: string) => {
    return answer.toLowerCase().trim() === "catfishing"
  }

  // Handle social media answer input
  const handleSocialMediaInput = (value: string) => {
    setSocialMediaAnswer(value)
    setIsSocialMediaComplete(checkSocialMediaAnswer(value))
  }

  // Check if QR code answer is correct
  const checkQrCodeAnswer = (answer: string) => {
    return answer.trim() === "054260"
  }

  // Handle QR code answer input
  const handleQrCodeInput = (value: string) => {
    setQrCodeAnswer(value)
    setIsQrCodeComplete(checkQrCodeAnswer(value))
  }

  // Check if all challenges are complete
  const areAllChallengesComplete = () => {
    return isDecryptionComplete && isSocialMediaComplete && isQrCodeComplete
  }

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
      id: 4,
      title: "QR Code Challenge",
      description: "Find QR codes that have been set up to not be legitimate. Identify which codes are safe to scan and which ones could pose security risks.",
      icon: QrCode,
      color: "text-orange-500"
    },
    {
      id: 3,
      title: "Social Media",
      description: "Navigate through social media challenges to identify which pictures are safe and which are not safe to post online.",
      icon: Smartphone,
      color: "text-purple-500"
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
                          <div className="flex-1">
                            <h5 className="font-semibold text-white">{activity.title}</h5>
                            <p className="text-sm text-white/80 mt-1">{activity.description}</p>
                            
                            {/* Add input field for Decrypting the Code activity */}
                            {activity.id === 2 && (
                              <div className="mt-3 space-y-2">
                                <div className="p-2 bg-[#121212] rounded border border-[#3C1053]/30">
                                  <p className="text-xs text-white/80 italic">
                                    💡 Hint: Think about a secret message; the answer is a simple phrase about how fun it is to solve!
                                  </p>
                                </div>
                                <Input
                                  type="text"
                                  placeholder="Enter your decryption answer here..."
                                  value={decryptionAnswer}
                                  onChange={(e) => handleDecryptionInput(e.target.value)}
                                  className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
                                />
                                <div className="flex items-center gap-2">
                                  {isDecryptionComplete ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : decryptionAnswer.length > 0 ? (
                                    <XCircle className="h-4 w-4 text-[#E3526A]" />
                                  ) : null}
                                  <span className="text-xs text-white/80">
                                    {isDecryptionComplete 
                                      ? "Correct!" 
                                      : decryptionAnswer.length > 0 && "Enter the correct phrase to continue"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Add input field for Social Media activity */}
                            {activity.id === 3 && (
                              <div className="mt-3 space-y-2">
                                <div className="p-2 bg-[#121212] rounded border border-[#3C1053]/30">
                                  <p className="text-xs text-white/80 italic">
                                    💡 Hint: Look at all your photos; which one is relatable to a cyber term?
                                  </p>
                                </div>
                                <Input
                                  type="text"
                                  placeholder="Enter the social media code here..."
                                  value={socialMediaAnswer}
                                  onChange={(e) => handleSocialMediaInput(e.target.value)}
                                  className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
                                />
                                <div className="flex items-center gap-2">
                                  {isSocialMediaComplete ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : socialMediaAnswer.length > 0 ? (
                                    <XCircle className="h-4 w-4 text-[#E3526A]" />
                                  ) : null}
                                  <span className="text-xs text-white/80">
                                    {isSocialMediaComplete 
                                      ? "Correct!" 
                                      : socialMediaAnswer.length > 0 && "Enter the correct code to continue"}
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Add input field for QR Code Challenge activity */}
                            {activity.id === 4 && (
                              <div className="mt-3 space-y-2">
                                <div className="p-2 bg-[#121212] rounded border border-[#3C1053]/30">
                                  <p className="text-xs text-white/80 italic">
                                    💡 Hint: All QR codes are unique. The code you need is one you've already used today, but in a different order.
                                  </p>
                                </div>
                                <Input
                                  type="text"
                                  placeholder="Enter the QR code answer here..."
                                  value={qrCodeAnswer}
                                  onChange={(e) => handleQrCodeInput(e.target.value)}
                                  className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
                                />
                                <div className="flex items-center gap-2">
                                  {isQrCodeComplete ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : qrCodeAnswer.length > 0 ? (
                                    <XCircle className="h-4 w-4 text-[#E3526A]" />
                                  ) : null}
                                  <span className="text-xs text-white/80">
                                    {isQrCodeComplete 
                                      ? "Correct!" 
                                      : qrCodeAnswer.length > 0 && "Enter the correct code to continue"}
                                  </span>
                                </div>
                              </div>
                            )}
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
                {areAllChallengesComplete() 
                  ? "Excellent! You've completed all the challenges. You can now proceed to the final task."
                  : "Complete all three challenges ('Decrypting the Code', 'Social Media', and 'QR Code Challenge') above before you can continue."
                }
              </p>
              <Link href={areAllChallengesComplete() ? "/task8?fromOffline=true" : "#"}>
                <Button 
                  className={`${
                    areAllChallengesComplete() 
                      ? "bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]" 
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!areAllChallengesComplete()}
                >
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
