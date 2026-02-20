'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { linkedinDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type LinkedInDataFormData = z.infer<typeof linkedinDataSchema>

interface LinkedInDataFormProps {
  defaultValues?: LinkedInDataFormData
  onSubmit: (data: LinkedInDataFormData) => void
}

export function LinkedInDataForm({ defaultValues, onSubmit }: LinkedInDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LinkedInDataFormData>({
    resolver: zodResolver(linkedinDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
        <input {...register('linkedin')} id="linkedin" type="text" placeholder="e.g. https://linkedin.com/in/yourprofile" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.linkedin && <p className="mt-1 text-sm text-red-600">{errors.linkedin.message}</p>}
      </div>
    </form>
  )
}
