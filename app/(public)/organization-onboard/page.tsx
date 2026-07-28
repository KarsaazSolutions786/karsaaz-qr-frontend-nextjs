'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/lib/hooks/useAuth'
import { organizationAPI } from '@/lib/api/endpoints/organization'
import { queryKeys } from '@/lib/query/keys'
import { useQueryClient } from '@tanstack/react-query'
import { useRegisterOrganization } from '@/lib/hooks/mutations/useRegisterOrganization'

const onboardSchema = z.object({
  team_size: z.string().min(1, 'Please select a team size'),
  organization_type: z.string().min(1, 'Please enter your organization type'),
})

type OnboardFormValues = z.infer<typeof onboardSchema>

export default function OrganizationOnboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const registerMutation = useRegisterOrganization()
  const [orgName, setOrgName] = useState('')
  const [pendingRegData, setPendingRegData] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OnboardFormValues>({
    resolver: zodResolver(onboardSchema),
    defaultValues: {
      team_size: '',
      organization_type: '',
    },
  })

  useEffect(() => {
    const email = searchParams?.get('email')
    const name = searchParams?.get('name')
    const orgNameParam = searchParams?.get('orgName')
    const password = searchParams?.get('password')
    const confirmPassword = searchParams?.get('confirmPassword')
    const termsConsent = searchParams?.get('termsConsent') === 'true'

    if (email && name && orgNameParam && password && confirmPassword) {
      setPendingRegData({
        email,
        name,
        organizationName: orgNameParam,
        password,
        confirmPassword,
        termsConsent,
      })
      setOrgName(orgNameParam)
    } else {
      if (typeof window !== 'undefined') {
        const storedName = localStorage.getItem('onboarding_org_name')
        if (storedName) {
          setOrgName(storedName)
        } else {
          setOrgName('My Organization')
        }
      }
    }
  }, [searchParams])

  const parseMaxCapacity = (size: string): number => {
    if (size === '1-10') return 10
    if (size === '11-50') return 50
    if (size === '51-200') return 200
    if (size === '200+') return 9999
    return 10
  }

  const onSubmit = async (data: OnboardFormValues) => {
    setIsSubmitting(true)
    try {
      const max_capacity = parseMaxCapacity(data.team_size)

      if (pendingRegData) {
        // They came from the registration page
        await registerMutation.mutateAsync({
          ...pendingRegData,
          organizationName: orgName,
        })

        toast.success('Organization created successfully!')

        router.push(
          `/verify-email?email=${encodeURIComponent(pendingRegData.email)}&next=${encodeURIComponent('/organization/dashboard')}`
        )
      } else {
        // Already logged in user creating another org
        await organizationAPI.create({
          name: orgName,
          max_capacity,
          organization_type: data.organization_type,
        })

        if (typeof window !== 'undefined') {
          localStorage.removeItem('onboarding_org_name')
        }

        toast.success('Organization created successfully!')
        queryClient.invalidateQueries({ queryKey: queryKeys.organization.all })
        router.push('/organization/manage')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to complete onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to Karsaaz QR
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's finish setting up your organization.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
          <p className="text-sm text-gray-700">
            <strong>Organization Name:</strong> {orgName}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Admin Email:</strong> {pendingRegData?.email || user?.email || 'N/A'}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Team Size <span className="text-red-500">*</span>
            </label>
            <select
              {...form.register('team_size')}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            >
              <option value="" disabled>
                Select team size
              </option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
            {form.formState.errors.team_size && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.team_size.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization Type / Industry <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Tech, Healthcare, Finance"
              {...form.register('organization_type')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
            />
            {form.formState.errors.organization_type && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.organization_type.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Organization'}
          </button>
        </form>
      </div>
    </div>
  )
}
