'use client'

import dynamic from 'next/dynamic'
import loaderAnimation from '@/public/animations/loader.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieLoaderProps {
  /** Width & height of the animation (default 120) */
  size?: number
  /** Extra Tailwind classes on the wrapper */
  className?: string
}

/**
 * LottieLoader — renders the branded Karsaaz QR loading animation.
 * Uses dynamic import to avoid SSR issues with lottie-react.
 */
export function LottieLoader({ size = 120, className = '' }: LottieLoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={loaderAnimation}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </div>
  )
}

/** Full-screen centred loader — used for page-level loading states */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <LottieLoader size={160} />
    </div>
  )
}
