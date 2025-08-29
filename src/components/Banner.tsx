import Image from 'next/image'
import Link from 'next/link'
import { Trophy } from 'lucide-react'

interface BannerProps {
  showLeaderboard?: boolean
}

export function Banner({ showLeaderboard = false }: BannerProps) {
  return (
    <div className="w-full bg-[#1a1f24] py-3 px-6 flex justify-between items-center">
      <div className="text-[#BE99E6] text-xl font-bold">
        Escape Room Challenge
      </div>
      <div className="flex items-center gap-4">
        {showLeaderboard && (
          <Link 
            href="/leaderboard"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors"
          >
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">Leaderboard</span>
          </Link>
        )}
        <div className="relative h-14 w-56 mt-1 -ml-2">
          <Image
            src="/logo.png"
            alt="Stellar Elevate Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
} 