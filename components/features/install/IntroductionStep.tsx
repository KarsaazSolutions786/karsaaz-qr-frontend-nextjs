'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

export function IntroductionStep() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
        <Sparkles className="h-8 w-8 text-purple-600" />
      </div>
      <h3 className="mb-3 text-2xl font-bold text-gray-900">Welcome to Karsaaz QR</h3>
      <p className="mb-6 max-w-md text-gray-600">
        Thank you for choosing Karsaaz QR! This wizard will guide you through the initial setup
        of your application in just a few steps.
      </p>
      <div className="rounded-lg bg-blue-50 px-6 py-4 text-sm text-blue-700">
        <p className="font-medium">Let&apos;s get started!</p>
        <p className="mt-1 text-blue-600">
          Click &quot;Next&quot; to begin configuring your application.
        </p>
      </div>
    </div>
  )
}
