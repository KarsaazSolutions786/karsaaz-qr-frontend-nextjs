'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wifiDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type WiFiDataFormData = z.infer<typeof wifiDataSchema>

interface WiFiDataFormProps {
  defaultValues?: WiFiDataFormData
  onSubmit: (data: WiFiDataFormData) => void
}

export function WiFiDataForm({ defaultValues, onSubmit }: WiFiDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<WiFiDataFormData>({
    resolver: zodResolver(wifiDataSchema),
    defaultValues: defaultValues || { encryption: 'WPA', hidden: false },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="ssid" className="block text-sm font-medium text-gray-700">Network Name (SSID) *</label>
        <input {...register('ssid')} id="ssid" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.ssid && <p className="mt-1 text-sm text-red-600">{errors.ssid.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
        <input {...register('password')} id="password" type="password" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="encryption" className="block text-sm font-medium text-gray-700">Encryption</label>
        <select {...register('encryption')} id="encryption" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">No Password</option>
        </select>
      </div>
      <div className="flex items-center">
        <input {...register('hidden')} id="hidden" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
        <label htmlFor="hidden" className="ml-2 block text-sm text-gray-900">Hidden Network</label>
      </div>
    </form>
  )
}
