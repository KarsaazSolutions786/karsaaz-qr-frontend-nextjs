'use client'

import { useEffect, useState } from 'react'
import { Apple, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DownloadButtonsProps {
  appStoreUrl?: string
  playStoreUrl?: string
  apkUrl?: string
  className?: string
}

type Platform = 'ios' | 'android' | 'other'

export default function DownloadButtons({
  appStoreUrl,
  playStoreUrl,
  apkUrl,
  className = '',
}: DownloadButtonsProps) {
  const [platform, setPlatform] = useState<Platform>('other')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setPlatform('ios')
    } else if (/android/i.test(userAgent)) {
      setPlatform('android')
    }
  }, [])

  if (!mounted) {
    return (
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        <div className="h-14 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="h-14 w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    )
  }

  const AppStoreButton = () => (
    <Button
      asChild
      size="lg"
      className="h-14 bg-black hover:bg-gray-900 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
        <Apple className="w-7 h-7 mr-3" />
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-normal opacity-90">Download on the</span>
          <span className="text-lg font-semibold -mt-0.5">App Store</span>
        </div>
      </a>
    </Button>
  )

  const PlayStoreButton = () => (
    <Button
      asChild
      size="lg"
      className="h-14 bg-black hover:bg-gray-900 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm2.69-1.51c.48-.26.77-.76.77-1.31s-.29-1.05-.77-1.31l-2.38-1.27-2.48 2.48 2.48 2.48 2.38-1.27zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z"/>
        </svg>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-normal opacity-90">GET IT ON</span>
          <span className="text-lg font-semibold -mt-0.5">Google Play</span>
        </div>
      </a>
    </Button>
  )

  const ApkButton = () => (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="h-14 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
    >
      <a href={apkUrl} download>
        <Smartphone className="w-6 h-6 mr-3" />
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-normal opacity-70">Download</span>
          <span className="text-lg font-semibold -mt-0.5">APK File</span>
        </div>
      </a>
    </Button>
  )

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {platform === 'ios' && appStoreUrl && (
        <>
          <AppStoreButton />
          {playStoreUrl && <PlayStoreButton />}
        </>
      )}
      
      {platform === 'android' && playStoreUrl && (
        <>
          <PlayStoreButton />
          {apkUrl && <ApkButton />}
          {appStoreUrl && <AppStoreButton />}
        </>
      )}
      
      {platform === 'other' && (
        <>
          {appStoreUrl && <AppStoreButton />}
          {playStoreUrl && <PlayStoreButton />}
          {apkUrl && <ApkButton />}
        </>
      )}
    </div>
  )
}
