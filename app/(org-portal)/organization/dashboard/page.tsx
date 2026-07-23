'use client'

import React from 'react'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { QrCodeIcon, UsersIcon, KeyIcon, ArrowTrendingUpIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function OrganizationDashboard() {
  const { activeOrganization } = useOrganization()

  const stats = [
    { name: 'Total QR Codes', value: '12', icon: QrCodeIcon, change: '+2', changeType: 'increase' },
    { name: 'Active Members', value: '4', icon: UsersIcon, change: '+1', changeType: 'increase' },
    { name: 'API Requests', value: '42.5k', icon: ArrowTrendingUpIcon, change: '+12%', changeType: 'increase' },
    { name: 'Active API Keys', value: '2', icon: KeyIcon, change: '0', changeType: 'neutral' },
  ]

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">
            Welcome to {activeOrganization?.name || 'your Organization'}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Here is an overview of your organization's activity and resources.
          </p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold
                  ${item.changeType === 'increase' ? 'text-green-600' : ''}
                  ${item.changeType === 'decrease' ? 'text-red-600' : ''}
                  ${item.changeType === 'neutral' ? 'text-gray-500' : ''}
                `}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Future activity feed or charts can go here */}
      <div className="mt-8 rounded-lg bg-white shadow min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No activity yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start creating QR codes or inviting members to see activity here.
          </p>
        </div>
      </div>
    </div>
  )
}
