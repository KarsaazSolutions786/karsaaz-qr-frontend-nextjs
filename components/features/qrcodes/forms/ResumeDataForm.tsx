'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { resumeDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type ResumeData = z.infer<typeof resumeDataSchema>
interface ResumeDataFormProps { defaultValues?: Partial<ResumeData>; onChange?: (data: Partial<ResumeData>) => void }
export function ResumeDataForm({ defaultValues, onChange }: ResumeDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<ResumeData>({ schema: resumeDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="name" className={LABEL}>Name *</label>
        <input {...register('name')} id="name" type="text" placeholder="John Doe" className={INPUT} />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="resume_file_id" className={LABEL}>Resume File ID</label>
        <input {...register('resume_file_id')} id="resume_file_id" type="text" placeholder="Upload your resume file via the dashboard" className={INPUT} />
        <p className="mt-1 text-xs text-gray-500">Upload your resume/CV file. Supported formats: PDF, DOCX</p>
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}
