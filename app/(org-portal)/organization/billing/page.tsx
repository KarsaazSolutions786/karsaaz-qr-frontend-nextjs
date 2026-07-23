'use client'

import React from 'react'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { CreditCardIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function OrganizationBilling() {
  const { activeOrganization } = useOrganization()

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Billing & Plans</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your subscription, member plan allocations, and view billing history.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Current Plan</h3>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">Organization Free Tier</p>
              <p className="text-sm text-gray-500 mt-1">Free forever. Up to 5 members.</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Upgrade Plan
            </button>
          </div>
          
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h4 className="text-sm font-medium text-gray-900">Plan Features Included:</h4>
            <ul className="mt-4 space-y-3">
              {['5 Team Members', '100 QR Codes per member', 'Basic Analytics', 'Community Support'].map((feature) => (
                <li key={feature} className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
