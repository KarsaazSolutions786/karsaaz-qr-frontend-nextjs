'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { textDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type TextDataFormData = z.infer<typeof textDataSchema>

interface TextDataFormProps {
  defaultValues?: TextDataFormData
  onSubmit: (data: TextDataFormData) => void
}

export function TextDataForm({ defaultValues, onSubmit }: TextDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TextDataFormData>({
    resolver: zodResolver(textDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">Text *</label>
        <textarea {...register('text')} id="text" rows={5} placeholder="Enter your text..." className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.text && <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>}
      </div>
    </form>
  )
}
