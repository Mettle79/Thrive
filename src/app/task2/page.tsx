"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Mail, Shield, AlertTriangle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

interface Email {
  id: string
  from: string
  subject: string
  content: string
  suspicious_elements: string[]
}

export default function EmailSecurityChallenge() {
  const [selectedEmail, setSelectedEmail] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [taskTime, setTaskTime] = useState(0)

  // Initialize task tracking
  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(2)
  }, [])

  const emails: Email[] = [
    {
      id: "1",
      from: "security@stellarelevate.com",
      subject: "Important: Security Update Required",
      content: `Dear Valued Employee,

We have detected that your security credentials need to be updated. Please click the link below to verify your identity and update your password.

Click here to update: ${`<span class="relative cursor-help group/tooltip">
  https://security-stellar.elevate-update.com/login.php?id=123
  <span class="absolute -top-8 left-0 opacity-0 invisible w-max rounded bg-red-900 px-2 py-1 text-xs text-white transition-all duration-100 delay-[2000ms] group-hover/tooltip:opacity-100 group-hover/tooltip:visible">
    Actual URL: HTTP://Phishing.Attempt.com
  </span>
</span>`}

Best regards,
IT Security Team`,
      suspicious_elements: [
        "Generic greeting",
        "Urgency in subject",
        "Request to click link",
        "Suspicious URL domain"
      ]
    },
    {
      id: "2",
      from: "noreply@stellar-elevate.security.com",
      subject: "Account Access - Immediate Action Required",
      content: `ATTENTION: Your account access will be terminated in 24 hours!

To prevent account termination, please provide your current password and updated contact information immediately.

Click here: ${`<span class="relative cursor-help group/tooltip">
  hxxp://security-stellar-elevate.com/update
  <span class="absolute -top-8 left-0 opacity-0 invisible w-max rounded bg-red-900 px-2 py-1 text-xs text-white transition-all duration-100 delay-[2000ms] group-hover/tooltip:opacity-100 group-hover/tooltip:visible">
    Actual URL: HTTP://Phishing.Attempt.com
  </span>
</span>`}

Urgent action required!`,
      suspicious_elements: [
        "Suspicious domain",
        "Threatening language",
        "Unusual URL",
        "ALL CAPS text"
      ]
    },
    {
      id: "3",
      from: "it.support@NatwestThrive.com",
      subject: "Important Task Information",
      content: `Hello Team,

This email contains a special code that you will need for a later task.

The code is '362451' and it is important that you do not share or lose it.


For questions, contact the IT Help Desk at extension 2000 or reply to this email.

Thanks,
Sarah Chen
IT Support Manager
Natwest Thrive`,
      suspicious_elements: []
    }
  ]

  const handleSelectionChange = (value: string) => {
    setSelectedEmail(value)
    setSubmitted(false)  // Reset submitted state
    setError(false)      // Clear error message
  }

  const handleSubmit = () => {
    setSubmitted(true)
    if (selectedEmail === "3") {
      // Record task completion time
      const manager = LeaderboardManager.getInstance()
      const time = manager.completeTask(2)
      setTaskTime(time)
      
      setSuccess(true)
      setError(false)
    } else {
      setError(true)
      setSuccess(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Security Expert!</h1>
            <p className="mb-6 text-center text-white/80">
              Excellent work! You've successfully identified the legitimate email and protected our system from potential threats.
            </p>

            <div className="flex justify-center">
              <Link href="/task3">
                <Button className="bg-[#3C1053] hover:bg-[#3C1053]/80 text-white">Proceed to Task 3</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="absolute top-4 right-4 z-10">
        <ProgressTracker currentTask={2} />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-[#3C1053] bg-[#1E1E1E]">
          <CardContent className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">Email Security Challenge</h1>
              <p className="text-sm text-white/80">
                Your task is to identify the legitimate email among potential phishing attempts. 
                Choose carefully - cybersecurity depends on your attention to detail.
              </p>
            </div>

            <div className="mb-6 rounded border border-[#3C1053] bg-[#121212] p-4">
              <h2 className="mb-2 font-mono text-lg text-white">Security Tips:</h2>
              <ul className="list-inside list-disc space-y-1 text-sm text-white/80">
                <li>Check the sender's email address carefully</li>
                <li>Be wary of urgent or threatening language</li>
                <li>Look for personalisation in the greeting</li>
                <li>Examine links without clicking them</li>
                <li>Consider whether the request is normal for your organisation</li>
              </ul>
            </div>

            <div className="space-y-6">
              <RadioGroup value={selectedEmail} onValueChange={handleSelectionChange}>
                {emails.map((email) => (
                  <div key={email.id} className="group rounded border border-[#3C1053] bg-[#121212] p-4">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value={email.id} id={`email-${email.id}`} className="border-[#3C1053] mt-1 data-[state=checked]:border-[#BE99E6] data-[state=checked]:bg-[#BE99E6]" />
                      <Label htmlFor={`email-${email.id}`} className="flex-1 space-y-3 text-white/80">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">From: {email.from}</span>
                          <Mail className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-white">{email.subject}</div>
                        <div 
                          className="whitespace-pre-wrap text-sm"
                          dangerouslySetInnerHTML={{ __html: email.content }}
                        />
                        {submitted && selectedEmail === email.id && email.suspicious_elements.length > 0 && (
                          <div className="mt-2 text-xs text-[#E3526A]">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Suspicious elements:</span>
                            </div>
                            <ul className="list-disc list-inside mt-1">
                              {email.suspicious_elements.map((element, index) => (
                                <li key={index}>{element}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>

              {error && (
                <div className="flex items-center gap-2 text-[#E3526A]">
                  <AlertCircle className="h-5 w-5" />
                  <span>That email shows signs of being a phishing attempt. Try again!</span>
                </div>
              )}

              <Button 
                onClick={handleSubmit}
                className="w-full bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]"
                disabled={!selectedEmail}
              >
                Verify Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

