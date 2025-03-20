import Image from 'next/image'

export function Banner() {
  return (
    <div className="w-full bg-[#1a1f24] py-3 px-6 flex justify-between items-center">
      <div className="text-orange-500 text-xl font-bold">
        Escape Room Challenge
      </div>
      <div className="relative h-10 w-48">
        <Image
          src="/logo.png"
          alt="Stellar Elevate Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  )
} 