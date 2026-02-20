'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cryptoDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type CryptoDataFormData = z.infer<typeof cryptoDataSchema>

interface CryptoDataFormProps {
  defaultValues?: CryptoDataFormData
  onSubmit: (data: CryptoDataFormData) => void
}

export function CryptoDataForm({ defaultValues, onSubmit }: CryptoDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CryptoDataFormData>({
    resolver: zodResolver(cryptoDataSchema),
    defaultValues: { coin: 'bitcoin', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="coin" className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
        <select {...register('coin')} id="coin" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500">
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="litecoin">Litecoin</option>
          <option value="bitcoincash">Bitcoin Cash</option>
        </select>
        {errors.coin && <p className="mt-1 text-sm text-red-600">{errors.coin.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Wallet Address</label>
        <input {...register('address')} id="address" type="text" placeholder="Enter wallet address" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input {...register('amount', { valueAsNumber: true })} id="amount" type="number" step="any" placeholder="0" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
        <input {...register('message')} id="message" type="text" placeholder="Optional message" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>}
      </div>
    </form>
  )
}
