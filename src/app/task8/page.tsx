"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Shield, Lock, FileText, Key, Server, CheckCircle2, XCircle, Lightbulb } from "lucide-react"
import Link from "next/link"
import { ProgressTracker } from "@/components/ProgressTracker"
import { LeaderboardManager } from "@/lib/leaderboard"

export default function RansomwareChallenge() {
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogFile, setShowLogFile] = useState(false)
  const [showKeys, setShowKeys] = useState(false)
  const [decryptionKey, setDecryptionKey] = useState("")
  const [isDecrypted, setIsDecrypted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(520)
  const [taskTime, setTaskTime] = useState(0)

  // Initialize task tracking
  useEffect(() => {
    const manager = LeaderboardManager.getInstance()
    manager.startTask(8)
  }, [])

  const logFile = [
    "=== System Log File ===",
    "Date: 2024-03-15",
    "Time: 14:23:45",
    "System Status: ENCRYPTED",
    "",
    "Initial System Check:",
    "✓ CPU: Intel Core i9-13900K",
    "✓ RAM: 32GB DDR5",
    "✓ Storage: 2TB NVMe SSD",
    "✓ Network: 1Gbps Ethernet",
    "",
    "Security Protocol Status:",
    "✓ Firewall: Active",
    "✓ Intrusion Detection: Active",
    "✓ Antivirus: Active",
    "✓ Encryption: Active",
    "",
    "Recent System Events:",
    "[14:20:00] System startup initiated",
    "[14:20:05] Loading system modules...",
    "[14:20:10] Initializing security protocols",
    "[14:20:15] Checking system integrity",
    "[14:20:20] Verifying user permissions",
    "[14:20:25] Loading encryption modules",
    "[14:20:30] System ready for operation",
    "",
    "Encryption Status:",
    "✓ Primary Encryption: Active",
    "✓ Secondary Encryption: Active",
    "✓ Backup Encryption: Active",
    "",
    "Encryption Details:",
    "Algorithm: AES-256",
    "Key Rotation: Every 24 hours",
    "Last Key Rotation: 2024-03-14 14:23:45",
    "",
    "System Access Log:",
    "[14:21:00] User login attempt - SUCCESS",
    "[14:21:05] Accessing secure directory",
    "[14:21:10] Opening encrypted files",
    "[14:21:15] Reading system logs",
    "[14:21:20] Accessing user data",
    "[14:21:25] Reading configuration files",
    "[14:21:30] Accessing network settings",
    "[14:21:35] Reading security protocols",
    "[14:21:40] Accessing encryption keys",
    "[14:21:45] Reading system status",
    "",
    "Network Activity:",
    "[14:22:00] Establishing secure connection",
    "[14:22:05] Verifying SSL certificate",
    "[14:22:10] Checking network security",
    "[14:22:15] Monitoring traffic",
    "[14:22:20] Analyzing packets",
    "[14:22:25] Checking for threats",
    "[14:22:30] Verifying connections",
    "[14:22:35] Monitoring bandwidth",
    "[14:22:40] Checking latency",
    "[14:22:45] Analyzing network health",
    "",
    "Security Events:",
    "[14:23:00] Running security scan",
    "[14:23:05] Checking for malware",
    "[14:23:10] Verifying system integrity",
    "[14:23:15] Checking for vulnerabilities",
    "[14:23:20] Analyzing threat patterns",
    "[14:23:25] Monitoring system changes",
    "[14:23:30] Checking for unauthorized access",
    "[14:23:35] Verifying security protocols",
    "[14:23:40] Analyzing security logs",
    "[14:23:45] System encryption activated",
    "",
    "Encryption Key Reference:",
    "Primary Key Location: Matrix C7",
    "Secondary Key Location: Matrix B4",
    "Backup Key Location: Matrix D9",
    "",
    "System Status Summary:",
    "✓ All systems operational",
    "✓ Security protocols active",
    "✓ Encryption active",
    "✓ Network secure",
    "✓ User access verified",
    "",
    "Next System Check:",
    "Scheduled for: 2024-03-15 15:23:45",
    "Duration: 5 minutes",
    "Priority: High",
    "",
    "End of Log File",
    "Last Updated: 2024-03-15 14:23:45"
  ]

  const encryptionKeys = [
    ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1"],
    ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2", "J2"],
    ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3", "J3"],
    ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4", "J4"],
    ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5", "J5"],
    ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6", "J6"],
    ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7", "J7"],
    ["A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8", "J8"],
    ["A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9", "J9"],
    ["A10", "B10", "C10", "D10", "E10", "F10", "G10", "H10", "I10", "J10"]
  ]

  const keyValues: { [key: string]: string } = {
    "A1": "K9L2-M4N5-P7Q8-R3S6", "B1": "X2Y5-Z8W1-V4U7-T9M3", "C1": "H6J9-L4K7-N2P5-R8S1",
    "D1": "Q3W6-E9T2-M5X8-B4V7", "E1": "F8C1-D5G2-H7J4-K3N6", "F1": "P9R2-S4T7-U1W5-Y6Z3",
    "G1": "L8M1-N3O6-Q2R5-T4V9", "H1": "B7C0-D2E5-G8H3-J1K4", "I1": "W3X6-Z9Y2-A5B8-C4D7",
    "J1": "E1F4-G7H0-J3K6-L5M8",
    "A2": "R4S7-U2V5-W8X1-Y3Z6", "B2": "M9N2-P5Q8-R1S4-T7U0", "C2": "K6L9-O3P6-Q2R5-S8T1",
    "D2": "V4W7-X0Y3-Z6A9-B2C5", "E2": "D8E1-F4G7-H2I5-J8K1", "F2": "L3M6-N9O2-P5Q8-R1S4",
    "G2": "T7U0-V3W6-X9Y2-Z5A8", "H2": "B1C4-D7E0-F3G6-H9I2", "I2": "J5K8-L2M5-N8O1-P4Q7",
    "J2": "R2S5-T8U1-V4W7-X0Y3",
    "A3": "Z6A9-C2D5-E8F1-G4H7", "B3": "I2J5-K8L1-M4N7-O0P3", "C3": "Q6R9-S3T6-U2V5-W8X1",
    "D3": "Y3Z6-A9B2-C5D8-E1F4", "E3": "G7H0-J3K6-L5M8-N2O5", "F3": "P4Q7-R1S4-T7U0-V3W6",
    "G3": "X9Y2-Z5A8-B1C4-D7E0", "H3": "F3G6-H9I2-J5K8-L2M5", "I3": "N8O1-P4Q7-R2S5-T8U1",
    "J3": "V4W7-X0Y3-Z6A9-C2D5",
    "A4": "E8F1-G4H7-I2J5-K8L1", "B4": "M4N7-O0P3-Q6R9-S3T6", "C4": "U2V5-W8X1-Y3Z6-A9B2",
    "D4": "C5D8-E1F4-G7H0-J3K6", "E4": "L5M8-N2O5-P4Q7-R1S4", "F4": "T7U0-V3W6-X9Y2-Z5A8",
    "G4": "B1C4-D7E0-F3G6-H9I2", "H4": "J5K8-L2M5-N8O1-P4Q7", "I4": "R2S5-T8U1-V4W7-X0Y3",
    "J4": "Z6A9-C2D5-E8F1-G4H7",
    "A5": "I2J5-K8L1-M4N7-O0P3", "B5": "Q6R9-S3T6-U2V5-W8X1", "C5": "Y3Z6-A9B2-C5D8-E1F4",
    "D5": "G7H0-J3K6-L5M8-N2O5", "E5": "P4Q7-R1S4-T7U0-V3W6", "F5": "X9Y2-Z5A8-B1C4-D7E0",
    "G5": "F3G6-H9I2-J5K8-L2M5", "H5": "N8O1-P4Q7-R2S5-T8U1", "I5": "V4W7-X0Y3-Z6A9-C2D5",
    "J5": "E8F1-G4H7-I2J5-K8L1",
    "A6": "M4N7-O0P3-Q6R9-S3T6", "B6": "U2V5-W8X1-Y3Z6-A9B2", "C6": "C5D8-E1F4-G7H0-J3K6",
    "D6": "L5M8-N2O5-P4Q7-R1S4", "E6": "T7U0-V3W6-X9Y2-Z5A8", "F6": "B1C4-D7E0-F3G6-H9I2",
    "G6": "J5K8-L2M5-N8O1-P4Q7", "H6": "R2S5-T8U1-V4W7-X0Y3", "I6": "Z6A9-C2D5-E8F1-G4H7",
    "J6": "I2J5-K8L1-M4N7-O0P3",
    "A7": "Q6R9-S3T6-U2V5-W8X1", "B7": "Y3Z6-A9B2-C5D8-E1F4", "C7": "X7K9-M2P4-R5T8-V3N6",
    "D7": "P4Q7-R1S4-T7U0-V3W6", "E7": "X9Y2-Z5A8-B1C4-D7E0", "F7": "F3G6-H9I2-J5K8-L2M5",
    "G7": "N8O1-P4Q7-R2S5-T8U1", "H7": "V4W7-X0Y3-Z6A9-C2D5", "I7": "E8F1-G4H7-I2J5-K8L1",
    "J7": "M4N7-O0P3-Q6R9-S3T6",
    "A8": "U2V5-W8X1-Y3Z6-A9B2", "B8": "C5D8-E1F4-G7H0-J3K6", "C8": "L5M8-N2O5-P4Q7-R1S4",
    "D8": "T7U0-V3W6-X9Y2-Z5A8", "E8": "B1C4-D7E0-F3G6-H9I2", "F8": "J5K8-L2M5-N8O1-P4Q7",
    "G8": "R2S5-T8U1-V4W7-X0Y3", "H8": "Z6A9-C2D5-E8F1-G4H7", "I8": "I2J5-K8L1-M4N7-O0P3",
    "J8": "Q6R9-S3T6-U2V5-W8X1",
    "A9": "Y3Z6-A9B2-C5D8-E1F4", "B9": "G7H0-J3K6-L5M8-N2O5", "C9": "P4Q7-R1S4-T7U0-V3W6",
    "D9": "X9Y2-Z5A8-B1C4-D7E0", "E9": "F3G6-H9I2-J5K8-L2M5", "F9": "N8O1-P4Q7-R2S5-T8U1",
    "G9": "V4W7-X0Y3-Z6A9-C2D5", "H9": "E8F1-G4H7-I2J5-K8L1", "I9": "M4N7-O0P3-Q6R9-S3T6",
    "J9": "U2V5-W8X1-Y3Z6-A9B2",
    "A10": "C5D8-E1F4-G7H0-J3K6", "B10": "L5M8-N2O5-P4Q7-R1S4", "C10": "T7U0-V3W6-X9Y2-Z5A8",
    "D10": "B1C4-D7E0-F3G6-H9I2", "E10": "J5K8-L2M5-N8O1-P4Q7", "F10": "R2S5-T8U1-V4W7-X0Y3",
    "G10": "Z6A9-C2D5-E8F1-G4H7", "H10": "I2J5-K8L1-M4N7-O0P3", "I10": "Q6R9-S3T6-U2V5-W8X1",
    "J10": "Y3Z6-A9B2-C5D8-E1F4"
  }

  const correctDecryptionKey = "X7K9-M2P4-R5T8-V3N6" // This is the key that should be in C7

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === "Ransomware") {
      setIsLoggedIn(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const handleDecrypt = () => {
    if (decryptionKey === correctDecryptionKey) {
      setIsTransitioning(true)
      setError(false)
      
      // Record task completion time
      const manager = LeaderboardManager.getInstance()
      const time = manager.completeTask(8)
      setTaskTime(time)
      
      // Wait 5 seconds before showing success screen
      setTimeout(() => {
        setIsTransitioning(false)
        setIsDecrypted(true)
      }, 2500)
    } else {
      setError(true)
    }
  }

  // Add useEffect for the timer
  useEffect(() => {
    if (isLoggedIn && !isDecrypted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0) {
      setShowHint(true)
    }
  }, [isLoggedIn, isDecrypted, timeRemaining])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white bg-gradient-to-b from-[#3C1053] to-[#121212]">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Lock className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Server Access Required</h1>
            <p className="mb-6 text-center text-white/80">
              Our server has been compromised by a sinister organisation. Enter the password to access the system.  The password is the word you discovered from the previous task.
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
              />
              {error && (
                <div className="flex items-center gap-2 text-[#E3526A]">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">Incorrect password</span>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]">
                Access Server
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isTransitioning) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white bg-gradient-to-b from-[#3C1053] to-[#121212]">
        <Card className="w-full max-w-md bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col items-center justify-center gap-4">
              <Server className="h-24 w-24 text-white animate-pulse" />
              <div className="text-center">
                <h1 className="mb-2 text-2xl font-bold text-white">Server Restored!</h1>
                <p className="text-white/80">The encryption has been removed and the system is being restored...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isDecrypted) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white bg-gradient-to-b from-[#3C1053] to-[#121212]">
        <Card className="w-full max-w-2xl bg-[#1E1E1E] text-white border-[#3C1053]">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <Shield className="h-12 w-12 text-white" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold text-white">Server Decrypted!</h1>
            <p className="mb-6 text-center text-white/80">
              Congratulations! You've successfully decrypted the server and thwarted the ransomware attack.
            </p>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-white">🎉 Mission Accomplished! 🎉</h2>
                             <p className="mt-2 text-white/80">
                 You have successfully completed the Escape Room Challenge on Cyber Security!
               </p>

            </div>

            <div className="flex justify-center">
              <Link href={`/leaderboard?scrollTo=${encodeURIComponent(sessionStorage.getItem("playerName") || "")}`}>
                <Button className="bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]">
                  View My Position on Leaderboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <div className="fireworks-container">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
        <style jsx>{`
          .fireworks-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }
          .firework {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            animation: firework 2s infinite;
          }
          .firework:nth-child(1) {
            background: #ff0;
            animation-delay: 0s;
            left: 20%;
            top: 20%;
          }
          .firework:nth-child(2) {
            background: #f0f;
            animation-delay: 0.5s;
            left: 40%;
            top: 40%;
          }
          .firework:nth-child(3) {
            background: #0ff;
            animation-delay: 1s;
            left: 60%;
            top: 30%;
          }
          .firework:nth-child(4) {
            background: #f00;
            animation-delay: 1.5s;
            left: 80%;
            top: 50%;
          }
          .firework:nth-child(5) {
            background: #0f0;
            animation-delay: 2s;
            left: 30%;
            top: 70%;
          }
          @keyframes firework {
            0% {
              transform: translate(0, 0);
              opacity: 1;
            }
            50% {
              transform: translate(var(--x, 100px), var(--y, -100px));
              opacity: 1;
            }
            100% {
              transform: translate(var(--x, 200px), var(--y, -200px));
              opacity: 0;
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gradient-to-b from-[#3C1053] to-[#121212] p-4 text-white">
      <div className="absolute top-4 right-4 z-10">
        <ProgressTracker currentTask={8} />
      </div>
      <div className="mx-auto w-full max-w-4xl">
        <Card className="border-[#3C1053] bg-[#1E1E1E]">
          <CardContent className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-8 w-8 text-[#E3526A]" />
                <h1 className="text-2xl font-bold text-white">Server Status: <span className="text-[#E3526A]">ENCRYPTED</span></h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLogFile(true)}
                  className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Log File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowKeys(true)}
                  className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Encryption Keys
                </Button>
              </div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-[#3C1053] bg-[#121212]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <Server className="h-24 w-24 text-[#E3526A]" />
                <div className="text-center text-white/80">
                  <p className="text-lg font-semibold text-white">Our server has been encrypted by hijackers!</p>
                  <p className="mt-2 text-sm">They are holding our data to ransom. How can we recover our system?</p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                type="text"
                placeholder="Enter decryption key"
                value={decryptionKey}
                onChange={(e) => setDecryptionKey(e.target.value)}
                className="bg-[#121212] border-[#3C1053] text-white placeholder:text-white/50"
              />
              {error && (
                <div className="flex items-center gap-2 text-[#E3526A]">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm">Unable to decrypt drive with this key</span>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={handleDecrypt}
                  className="flex-1 bg-[#BE99E6] hover:bg-[#BE99E6]/80 text-[#3C1053]"
                  disabled={!decryptionKey}
                >
                  Decrypt Drive
                </Button>
                {!showHint ? (
                  <Button
                    variant="outline"
                    className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                    disabled
                  >
                    Hint ({timeRemaining}s)
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowLogFile(true)}
                    className="bg-[#121212] text-white border-[#3C1053] hover:bg-[#3C1053]/20"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Hint
                  </Button>
                )}
              </div>
            </div>

            {showLogFile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <Card className="w-full max-w-2xl border-[#3C1053] bg-[#1E1E1E]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">System Log File</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowLogFile(false)}
                        className="text-white hover:text-white/80"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="font-mono text-sm text-white/80 max-h-[60vh] overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {logFile.map((line, index) => (
                          <span key={index}>{line}<br /></span>
                        ))}
                      </pre>
                    </div>
                    {showHint && (
                      <div className="mt-4 rounded border border-[#3C1053]/50 bg-[#121212] p-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Lightbulb className="h-5 w-5" />
                          <span className="font-bold text-white">Hint:</span>
                          <span>Look for the "Encryption Key Reference" section in the log file to find the correct key location.</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {showKeys && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                <Card className="w-full max-w-2xl border-[#3C1053] bg-[#1E1E1E]">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-white">Encryption Keys Matrix</h2>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowKeys(false)}
                        className="text-white hover:text-white/80"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="grid grid-cols-10 gap-2 font-mono text-sm text-white/80">
                        {encryptionKeys.map((row, rowIndex) => (
                          row.map((position, colIndex) => (
                            <div 
                              key={`${rowIndex}-${colIndex}`} 
                              className="rounded border border-[#3C1053]/50 p-2 text-center"
                            >
                              <div className="font-bold text-white">{position}</div>
                              {keyValues[position] && (
                                <div className="mt-1 text-xs text-white/60">{keyValues[position]}</div>
                              )}
                            </div>
                          ))
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 