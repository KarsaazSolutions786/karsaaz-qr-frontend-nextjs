'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type EmailDataFormData = z.infer<typeof emailDataSchema>

interface EmailDataFormProps {
  defaultValues?: EmailDataFormData
  onSubmit: (data: EmailDataFormData) => void
}

export function EmailDataForm({ defaultValues, onSubmit }: EmailDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailDataFormData>({
    resolver: zodResolver(emailDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
        <input {...register('email')} id="email" type="email" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
        <input {...register('subject')} id="subject" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Message</label>
        <textarea {...register('body')} id="body" rows={4} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
      </div>
    </form>
  )
}
