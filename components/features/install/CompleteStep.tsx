'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export function CompleteStep() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="mb-3 text-2xl font-bold text-gray-900">Installation Complete!</h3>
      <p className="mb-8 max-w-md text-gray-600">
        Your application has been set up successfully. You can now log in with the admin
        account you created.
      </p>
      <Link
        href="/login"
        className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  )
}
