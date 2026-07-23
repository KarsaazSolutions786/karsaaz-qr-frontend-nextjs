'use client'

import React from 'react'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { KeyIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function OrganizationApiKeys() {
  const { activeOrganization } = useOrganization()

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">API Keys</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage API keys to authenticate programmatic access for {activeOrganization?.name || 'your Organization'}.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Generate New Key
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-lg bg-white shadow min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <KeyIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No API keys generated</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by generating a new API key to access Karsaaz QR via API.
          </p>
        </div>
      </div>
    </div>
  )
}
