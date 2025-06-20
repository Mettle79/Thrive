"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, XCircle, Lightbulb } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

// Define the image data with their correct safety status and associated letters
const originalImages = [
  { id: 1, src: "/Pics/Safe1.jpg", isSafe: true, letter: "R" },
  { id: 2, src: "/Pics/Safe2.jpg", isSafe: true, letter: "a" },
  { id: 3, src: "/Pics/Safe3.png", isSafe: true, letter: "n" },
  { id: 4, src: "/Pics/Safe4.jpg", isSafe: true, letter: "s" },
  { id: 5, src: "/Pics/safe5a.jpg", isSafe: true, letter: "o" },
  { id: 6, src: "/Pics/Safe6.JPG", isSafe: true, letter: "m" },
  { id: 7, src: "/Pics/Safe7.jpg", isSafe: true, letter: "w" },
  { id: 8, src: "/Pics/safe8.png", isSafe: true, letter: "a" },
  { id: 9, src: "/Pics/Safe9.JPG", isSafe: true, letter: "r" },
  { id: 10, src: "/Pics/Safe10.jpg", isSafe: true, letter: "e" },
  { id: 11, src: "/Pics/Unsafe1.jpg", isSafe: false, letter: "B" },
  { id: 12, src: "/Pics/Unsafe2.jpg", isSafe: false, letter: "a" },
  { id: 13, src: "/Pics/Unsafe3.JPG", isSafe: false, letter: "d" },
  { id: 14, src: "/Pics/Unsafe4.JPG", isSafe: false, letter: "y" },
  { id: 15, src: "/Pics/Unsafe5.PNG", isSafe: false, letter: "z" },
]

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function ImageSafetyTask() {
  const [images, setImages] = useState(originalImages)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [userSelections, setUserSelections] = useState<{ [key: number]: boolean }>({})
  const [isComplete, setIsComplete] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [incorrectImages, setIncorrectImages] = useState<typeof images>([])
  const [showWordInput, setShowWordInput] = useState(false)
  const [wordInput, setWordInput] = useState("")
  const [wordSolved, setWordSolved] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showIntroduction, setShowIntroduction] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintCooldown, setHintCooldown] = useState(30)
  const [hintAvailable, setHintAvailable] = useState(false)

  // Shuffle images when component mounts
  useEffect(() => {
    setImages(shuffleArray(originalImages))
  }, [])

  // Handle hint cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!hintAvailable && hintCooldown > 0) {
      timer = setInterval(() => {
        setHintCooldown(prev => prev - 1)
      }, 1000)
    } else if (hintCooldown === 0) {
      setHintAvailable(true)
    }
    return () => clearInterval(timer)
  }, [hintAvailable, hintCooldown])

  // Reset hint cooldown when word input is shown
  useEffect(() => {
    if (showWordInput) {
      setHintCooldown(30)
      setHintAvailable(false)
    }
  }, [showWordInput])

  const handleSelection = (isSafe: boolean) => {
    const currentImages = getCurrentImages()
    const currentImage = currentImages[currentImageIndex]
    
    // Store the user's selection
    setUserSelections(prev => ({
      ...prev,
      [currentImage.id]: isSafe
    }))

    // Move to next image or complete if done
    if (currentImageIndex < currentImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
    } else {
      checkCompletion()
    }
  }

  const checkCompletion = () => {
    // Get all images that were incorrectly identified
    const incorrect = images.filter(image => {
      const userSelection = userSelections[image.id]
      // Only consider it incorrect if the user made a selection and it was wrong
      return userSelection !== undefined && userSelection !== image.isSafe
    })
    
    setIncorrectImages(incorrect)
    setIsComplete(incorrect.length === 0)
    setShowFeedback(true)
    
    if (incorrect.length > 0) {
      setCurrentImageIndex(0) // Reset to first incorrect image
      // Clear the selections for incorrect images to allow fresh attempts
      setUserSelections(prev => {
        const newSelections = { ...prev }
        incorrect.forEach(image => {
          delete newSelections[image.id]
        })
        return newSelections
      })
    } else {
      setShowWordInput(true) // Show word input when all images are correct
    }
  }

  const getCurrentImages = () => {
    return showFeedback ? incorrectImages : images
  }

  const handleStartOver = () => {
    setImages(shuffleArray(originalImages))
    setCurrentImageIndex(0)
    setUserSelections({})
    setShowFeedback(false)
    setIncorrectImages([])
    setShowWordInput(false)
    setWordInput("")
    setWordSolved(false)
    setShowIntroduction(true)
    setShowHint(false)
    setHintUsed(false)
    setHintCooldown(30)
    setHintAvailable(false)
  }

  const handleWordSubmit = () => {
    if (wordInput.toLowerCase() === "ransomware") {
      setWordSolved(true)
      setShowError(false)
    } else {
      setShowError(true)
    }
  }

  const handleStartTask = () => {
    setShowIntroduction(false)
  }

  const handleHintClick = () => {
    if (!hintUsed) {
      setShowHint(true)
      setHintUsed(true)
    }
  }

  if (wordSolved) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">Task Complete!</h1>
            <p className="mb-6 text-center">
              Congratulations! You've correctly identified the word "Ransomware" from the letters associated with the safe images.
            </p>
            <div className="flex justify-center">
              <Link href="/task8">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Continue to Next Task
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showIntroduction) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-2xl bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">Image Safety Review Task</h1>
            <div className="mb-6 space-y-4 text-left">
              <p className="text-lg">
                Welcome to the Image Safety Review task! You will be presented with a series of images, and your task has two parts:
              </p>
              <div className="space-y-2">
                <p><strong>Part 1:</strong> For each image, determine whether it's safe to post online or not. Consider factors like:</p>
                <ul className="list-disc list-inside ml-4 space-y-1 text-orange-200">
                  <li>Personal information that could be used to identify you</li>
                  <li>Location details that could reveal where you live or work</li>
                  <li>Sensitive content that could be embarrassing or harmful</li>
                  <li>Financial information or documents</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p><strong>Part 2:</strong> As you review the images, pay attention to the letter associated with each image that you identify as <strong>safe to post</strong>. These letters will spell out a word related to cybersecurity.</p>
                <p className="text-orange-300 font-semibold">Make sure to write down these letters as you go - you'll need them later!</p>
              </div>
              <p className="text-lg">
                Once you've correctly identified all images, you'll be asked to enter the word that the letters spell out.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleStartTask}
                className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3"
              >
                Start Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isComplete && showWordInput) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">Enter the Cybersecurity Word</h1>
            <p className="mb-6 text-center">
              Great job identifying all the images correctly! Now enter the word that the letters from the safe images spell out:
            </p>
            <div className="mb-6">
              <Input
                type="text"
                value={wordInput}
                onChange={(e) => {
                  setWordInput(e.target.value)
                  setShowError(false)
                }}
                placeholder="Enter the word"
                className="bg-orange-800/50 border-orange-500 text-white"
              />
            </div>
            {showError && (
              <div className="mb-6 text-center text-red-500">
                <p>That's not the correct word.</p>
                <p className="mt-2">Think about what the letters from the safe images spell out.</p>
                <p className="mt-2">The word is related to a type of cyber attack that threatens to publish or withhold your data.</p>
              </div>
            )}
            {showHint && (
              <div className="mb-6 text-center text-orange-300">
                <p>When someone threatens to publish or withhold your data, you could say your information is being held to...</p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleWordSubmit}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Submit
              </Button>
              {!hintUsed && (
                <Button
                  onClick={handleHintClick}
                  className={`bg-orange-600 hover:bg-orange-700 ${!hintAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!hintAvailable}
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {hintAvailable ? 'Get Hint' : `Hint available in ${hintCooldown}s`}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentImages = getCurrentImages()

  // If there are no images to display, show a message
  if (currentImages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-white">
        <Card className="w-full max-w-md bg-orange-900/50 text-white border-orange-500">
          <CardContent className="p-6">
            <div className="mb-6 flex justify-center">
              <AlertCircle className="h-12 w-12 text-orange-500" />
            </div>
            <h1 className="mb-6 text-center text-2xl font-bold">No Images to Review</h1>
            <p className="mb-6 text-center">
              There are no images to review at this time.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleStartOver}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 text-white">
      <Card className="w-full max-w-4xl bg-orange-900/50 text-white border-orange-500">
        <CardContent className="p-6">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="h-12 w-12 text-orange-500" />
          </div>
          <h1 className="mb-6 text-center text-2xl font-bold">Image Safety Review</h1>
          <p className="mb-6 text-center text-orange-200">
            {showFeedback 
              ? "Please review these images again. Consider personal information, location details, and sensitive content carefully."
              : "Review each image and determine if it's safe to post online. Consider personal information, location details, and sensitive content."}
          </p>

          <div className="mb-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
              <Image
                src={currentImages[currentImageIndex]?.src || ""}
                alt={`Image ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-orange-300">
                Image {currentImageIndex + 1} of {currentImages.length}
                {showFeedback && ` (${incorrectImages.length} to review)`}
              </p>
              <p className="mt-2 text-2xl font-bold text-orange-300">
                Letter: {currentImages[currentImageIndex]?.letter}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => handleSelection(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Safe to Post
            </Button>
            <Button
              onClick={() => handleSelection(false)}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Not Safe
            </Button>
          </div>

          {showFeedback && (
            <div className="mt-6 text-center">
              <p className="text-red-500">
                {incorrectImages.length} images were incorrectly identified. Please review them again.
              </p>
              <Button
                onClick={handleStartOver}
                className="mt-4 bg-orange-600 hover:bg-orange-700"
              >
                Start Over
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 