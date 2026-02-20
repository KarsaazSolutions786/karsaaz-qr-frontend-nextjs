'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { wechatDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type WeChatDataFormData = z.infer<typeof wechatDataSchema>
interface WeChatDataFormProps { defaultValues?: Partial<WeChatDataFormData>; onChange?: (data: Partial<WeChatDataFormData>) => void }
export function WeChatDataForm({ defaultValues, onChange }: WeChatDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<WeChatDataFormData>({ schema: wechatDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="username" className={LABEL}>WeChat ID or Username</label>
        <input {...register('username')} id="username" type="text" placeholder="Your WeChat ID" className={INPUT} />
        {errors.username && <p className={ERROR}>{errors.username.message}</p>}
      </div>
    </form>
  )
}
