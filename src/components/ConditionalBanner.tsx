"use client"

import { usePathname } from 'next/navigation'
import { Banner } from './Banner'

export function ConditionalBanner() {
  const pathname = usePathname()
  
  // Show leaderboard link only on welcome page
  const showLeaderboard = pathname === '/welcome'
  
  // Set white background for home-challenge page
  const backgroundColor = pathname === '/home-challenge' ? 'white' : undefined
  
  // Hide title and logo on home-challenge page
  const showTitle = pathname !== '/home-challenge'
  const showLogo = pathname !== '/home-challenge'
  
  return <Banner showLeaderboard={showLeaderboard} backgroundColor={backgroundColor} showTitle={showTitle} showLogo={showLogo} />
}
