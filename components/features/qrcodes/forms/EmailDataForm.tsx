'use client'

import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { emailDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'

const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type EmailDataFormData = z.infer<typeof emailDataSchema>

interface EmailDataFormProps {
  defaultValues?: Partial<EmailDataFormData>
  onChange?: (data: Partial<EmailDataFormData>) => void
}

export function EmailDataForm({ defaultValues, onChange }: EmailDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<EmailDataFormData>({
    schema: emailDataSchema,
    defaultValues,
    onChange,
  })

  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="email" className={LABEL}>Email Address *</label>
        <input {...register('email')} id="email" type="email" placeholder="user@example.com" className={INPUT} />
        {errors.email && <p className={ERROR}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="subject" className={LABEL}>Subject</label>
        <input {...register('subject')} id="subject" type="text" placeholder="Email subject" className={INPUT} />
      </div>
      <div>
        <label htmlFor="body" className={LABEL}>Message</label>
        <textarea {...register('body')} id="body" rows={4} placeholder="Email body text..." className={TEXTAREA} />
      </div>
    </form>
  )
}
