'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { resumeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'
type ResumeData = z.infer<typeof resumeDataSchema>
interface ResumeDataFormProps {
  defaultValues?: Partial<ResumeData>
  onChange?: (data: Partial<ResumeData>) => void
}
export function ResumeDataForm({ defaultValues, onChange }: ResumeDataFormProps) {
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<ResumeData>({ schema: resumeDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="name" className={LABEL}>
          Name *
        </label>
        <input
          {...register('name')}
          id="name"
          type="text"
          placeholder="John Doe"
          className={INPUT}
        />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="resume_file" className={LABEL}>
          Resume File
        </label>
        <input
          id="resume_file"
          type="file"
          accept=".pdf,.docx,.doc"
          className="mt-1.5 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition"
        />
        <p className="mt-1 text-xs text-gray-500">Supported formats: PDF, DOCX. Max size: 10MB</p>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          Expiry Date
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}
