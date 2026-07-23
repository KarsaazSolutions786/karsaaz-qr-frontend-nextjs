'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import api from '@/lib/api/client'
import { useOrganization } from '@/lib/context/OrganizationContext'
import Image from 'next/image'
import { toast } from 'sonner'
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'

export default function OrganizationOnboarding() {
  const router = useRouter()
  const { user } = useAuth()
  const { refreshOrganizations } = useOrganization()
  
  const [name, setName] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [industry, setIndustry] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name) {
      toast.error('Organization name is required')
      return
    }

    setIsSubmitting(true)
    try {
      await api.post('/organizations', {
        name,
        company_size: companySize,
        industry
      })
      
      await refreshOrganizations() // This should select the newly created org automatically
      
      toast.success('Organization created successfully!')
      router.push('/organization/dashboard')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create organization')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Image
          src="/images/auth/karsaaz-logo.svg"
          alt="Karsaaz QR"
          width={180}
          height={40}
          className="mx-auto"
        />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create your Organization
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Collaborate on QR codes, manage team members, and track analytics together.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                Company Size (Optional)
              </label>
              <div className="mt-1">
                <select
                  id="companySize"
                  name="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                >
                  <option value="">Select size...</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry (Optional)
              </label>
              <div className="mt-1">
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  placeholder="E.g., Marketing, Retail, Tech"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => router.push('/qrcodes/new')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Organization'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
