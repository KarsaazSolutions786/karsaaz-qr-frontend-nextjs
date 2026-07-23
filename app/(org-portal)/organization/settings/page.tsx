'use client'

import React from 'react'
import { useOrganization } from '@/lib/context/OrganizationContext'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'

export default function OrganizationSettings() {
  const { activeOrganization } = useOrganization()

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Organization Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage the general settings and branding for {activeOrganization?.name}.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">General Information</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Update your organization's name and details.</p>
          </div>
          <form className="mt-5 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={activeOrganization?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border py-2 px-3"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-red-600">Danger Zone</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Once you delete an organization, there is no going back. Please be certain.</p>
          </div>
          <div className="mt-5">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
            >
              Delete Organization
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
