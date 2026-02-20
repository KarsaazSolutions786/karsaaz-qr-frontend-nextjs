'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { wechatDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

type WeChatDataFormData = z.infer<typeof wechatDataSchema>

interface WeChatDataFormProps {
  defaultValues?: WeChatDataFormData
  onSubmit: (data: WeChatDataFormData) => void
}

export function WeChatDataForm({ defaultValues, onSubmit }: WeChatDataFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<WeChatDataFormData>({
    resolver: zodResolver(wechatDataSchema),
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">WeChat Username</label>
        <input {...register('username')} id="username" type="text" placeholder="e.g. your_wechat_id" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500" />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
      </div>
    </form>
  )
}
