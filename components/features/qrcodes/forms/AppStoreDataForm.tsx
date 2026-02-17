'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { appStoreDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type AppStoreDataFormData = z.infer<typeof appStoreDataSchema>

interface AppStoreDataFormProps {
  defaultValues?: AppStoreDataFormData
  onSubmit: (data: AppStoreDataFormData) => void
}

export function AppStoreDataForm({ defaultValues, onSubmit }: AppStoreDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<AppStoreDataFormData>({
    resolver: zodResolver(appStoreDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name *</label>
        <input {...register('appName')} id="appName" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.appName && <p className="mt-1 text-sm text-red-600">{errors.appName.message}</p>}
      </div>
      <div>
        <label htmlFor="iosUrl" className="block text-sm font-medium text-gray-700">iOS App Store URL</label>
        <input {...register('iosUrl')} id="iosUrl" type="url" placeholder="https://apps.apple.com/..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.iosUrl && <p className="mt-1 text-sm text-red-600">{errors.iosUrl.message}</p>}
      </div>
      <div>
        <label htmlFor="androidUrl" className="block text-sm font-medium text-gray-700">Android Play Store URL</label>
        <input {...register('androidUrl')} id="androidUrl" type="url" placeholder="https://play.google.com/..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.androidUrl && <p className="mt-1 text-sm text-red-600">{errors.androidUrl.message}</p>}
      </div>
    </form>
  )
}
