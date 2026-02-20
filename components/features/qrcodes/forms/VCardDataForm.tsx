'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { vcardDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type VCardDataFormData = z.infer<typeof vcardDataSchema>
interface VCardDataFormProps { defaultValues?: Partial<VCardDataFormData>; onChange?: (data: Partial<VCardDataFormData>) => void }
export function VCardDataForm({ defaultValues, onChange }: VCardDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<VCardDataFormData>({ schema: vcardDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="firstName" className={LABEL}>First Name</label>
        <input {...register('firstName')} id="firstName" type="text" className={INPUT} />
        {errors.firstName && <p className={ERROR}>{errors.firstName.message}</p>}
      </div>
      <div>
        <label htmlFor="lastName" className={LABEL}>Last Name</label>
        <input {...register('lastName')} id="lastName" type="text" className={INPUT} />
        {errors.lastName && <p className={ERROR}>{errors.lastName.message}</p>}
      </div>
      <div>
        <label htmlFor="phone" className={LABEL}>Phone</label>
        <input {...register('phone')} id="phone" type="tel" className={INPUT} />
        {errors.phone && <p className={ERROR}>{errors.phone.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className={LABEL}>Email</label>
        <input {...register('email')} id="email" type="email" className={INPUT} />
        {errors.email && <p className={ERROR}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="organization" className={LABEL}>Organization</label>
        <input {...register('organization')} id="organization" type="text" className={INPUT} />
        {errors.organization && <p className={ERROR}>{errors.organization.message}</p>}
      </div>
      <div>
        <label htmlFor="title" className={LABEL}>Title</label>
        <input {...register('title')} id="title" type="text" className={INPUT} />
        {errors.title && <p className={ERROR}>{errors.title.message}</p>}
      </div>
      <div>
        <label htmlFor="address" className={LABEL}>Address</label>
        <textarea {...register('address')} id="address" rows={2} className={TEXTAREA} />
        {errors.address && <p className={ERROR}>{errors.address.message}</p>}
      </div>
      <div>
        <label htmlFor="website" className={LABEL}>Website</label>
        <input {...register('website')} id="website" type="url" className={INPUT} />
        {errors.website && <p className={ERROR}>{errors.website.message}</p>}
      </div>
    </form>
  )
}
