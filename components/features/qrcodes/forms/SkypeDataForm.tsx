'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { skypeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type SkypeDataFormData = z.infer<typeof skypeDataSchema>

interface SkypeDataFormProps {
  defaultValues?: SkypeDataFormData
  onSubmit: (data: SkypeDataFormData) => void
}

export function SkypeDataForm({ defaultValues, onSubmit }: SkypeDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SkypeDataFormData>({
    resolver: zodResolver(skypeDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Action Type</label>
        <select {...register('type')} id="type" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          <option value="call">Call</option>
          <option value="chat">Chat</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>
      <div>
        <label htmlFor="skype_name" className="block text-sm font-medium text-gray-700">Skype Name</label>
        <input {...register('skype_name')} id="skype_name" type="text" placeholder="e.g. live:username" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.skype_name && <p className="mt-1 text-sm text-red-600">{errors.skype_name.message}</p>}
      </div>
    </form>
  )
}
