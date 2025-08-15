"use client"

import { usePathname } from 'next/navigation'
import { Banner } from './Banner'

export function ConditionalBanner() {
  const pathname = usePathname()
  
  // Show leaderboard link only on welcome page
  const showLeaderboard = pathname === '/welcome'
  
  return <Banner showLeaderboard={showLeaderboard} />
}
