'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { bannerApi, type BannerSettings } from '@/lib/api/endpoints/banner'
import { BannerSettingsForm } from '@/components/features/settings/BannerSettingsForm'

const DEFAULT_BANNER: BannerSettings = {
  enabled: false,
  type: 'info',
  content: '',
  dismissible: true,
  link_url: '',
  link_text: '',
  background_color: '#3B82F6',
  text_color: '#FFFFFF',
}

export default function BannerSettingsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['banner-settings'],
    queryFn: () => bannerApi.getSettings(),
    staleTime: 60000,
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/system/settings" className="hover:text-gray-700 transition-colors">
          Settings
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">Website Banner</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Website Banner</h1>
        <p className="mt-2 text-sm text-gray-600">
          Configure the banner that appears at the top of the website
        </p>
      </div>

      {/* Content */}
      <div className="mt-8">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        )}
        {isError && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            Failed to load banner settings. Please try again.
          </div>
        )}
        {!isLoading && !isError && (
          <BannerSettingsForm initialData={data ?? DEFAULT_BANNER} />
        )}
      </div>
    </div>
  )
}
