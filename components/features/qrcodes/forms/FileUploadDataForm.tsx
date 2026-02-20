'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { fileUploadDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type FileUploadDataFormData = z.infer<typeof fileUploadDataSchema>
interface FileUploadDataFormProps { defaultValues?: Partial<FileUploadDataFormData>; onChange?: (data: Partial<FileUploadDataFormData>) => void }
export function FileUploadDataForm({ defaultValues, onChange }: FileUploadDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<FileUploadDataFormData>({ schema: fileUploadDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="name" className={LABEL}>File Name</label>
        <input {...register('name')} id="name" type="text" placeholder="e.g. My Document" className={INPUT} />
        {errors.name && <p className={ERROR}>{errors.name.message}</p>}
      </div>
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-purple-700">
        📁 File uploads are managed through the backend. Set the file name here, then upload your file in the QR code details.
      </div>
      <div>
        <label htmlFor="expires_at" className={LABEL}>Expiry Date</label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}
