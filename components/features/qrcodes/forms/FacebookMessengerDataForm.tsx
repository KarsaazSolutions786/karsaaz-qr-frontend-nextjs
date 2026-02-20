'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { facebookMessengerDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type FacebookMessengerDataFormData = z.infer<typeof facebookMessengerDataSchema>

interface FacebookMessengerDataFormProps {
  defaultValues?: FacebookMessengerDataFormData
  onSubmit: (data: FacebookMessengerDataFormData) => void
}

export function FacebookMessengerDataForm({ defaultValues, onSubmit }: FacebookMessengerDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FacebookMessengerDataFormData>({
    resolver: zodResolver(facebookMessengerDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="facebook_page_name" className="block text-sm font-medium text-gray-700">Facebook Page Name</label>
        <input {...register('facebook_page_name')} id="facebook_page_name" type="text" placeholder="e.g. YourPageName" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.facebook_page_name && <p className="mt-1 text-sm text-red-600">{errors.facebook_page_name.message}</p>}
      </div>
    </form>
  )
}
