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
    <div
      id="main-content"
      className="karsaaz-bg relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(225deg, rgba(248, 127, 251, 1) 2%, rgba(150, 131, 255, 1) 98%)',
      }}
    >
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{
          top: '-30%',
          right: '-21%',
          width: 918,
          height: 918,
          transform: 'rotate(-50.47deg)',
        }}
      >
        <img src="/images/auth/qr-diamonds.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 35, top: 343, width: 1369, height: 1369 }}
      >
        <img src="/images/auth/ellipse-outer.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 161, top: 467, width: 1115, height: 1115 }}
      >
        <img src="/images/auth/ellipse-mid.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 276, top: 591, width: 881, height: 882 }}
      >
        <img src="/images/auth/ellipse-inner.svg" alt="" className="block h-full w-full" />
      </div>

      <div className="relative z-10 w-[447px] max-w-[calc(100%-32px)]">
        <div className="rounded-[23px] bg-white/30 p-8 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]">
          <div className="mb-6 flex flex-col items-center">
            <h2 className="flex items-center justify-center gap-2 text-center text-3xl font-bold tracking-tight text-white">
              Welcome to <img src="/img/logo-white.png" alt="Karsaaz QR" className="h-10" />
            </h2>
            <p className="mt-2 text-center text-sm text-white/90">
              Let's finish setting up your organization.
            </p>
          </div>

          <div className="mb-6 rounded-lg bg-white/20 p-4 border border-white/30 text-white">
            <p className="text-sm">
              <strong className="font-semibold">Organization Name:</strong> {orgName}
            </p>
            <p className="text-sm">
              <strong className="font-semibold">Admin Email:</strong>{' '}
              {pendingRegData?.email || user?.email || 'N/A'}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-bold text-white">
                Team Size <span className="text-red-400">*</span>
              </label>
              <select
                {...form.register('team_size')}
                className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-[#8351e0] focus:outline-none focus:ring-[#8351e0]"
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
                <p className="mt-1 text-sm text-red-400">
                  {form.formState.errors.team_size.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-white">
                Organization Type / Industry <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tech, Healthcare, Finance"
                {...form.register('organization_type')}
                className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-[#8351e0] focus:outline-none focus:ring-[#8351e0]"
              />
              {form.formState.errors.organization_type && (
                <p className="mt-1 text-sm text-red-400">
                  {form.formState.errors.organization_type.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full justify-center rounded-full bg-[#8351e0] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#7246c4] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Organization'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
