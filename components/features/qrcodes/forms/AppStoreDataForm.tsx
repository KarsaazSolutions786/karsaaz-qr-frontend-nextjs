'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { appStoreDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
const INPUT = 'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'; const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'; const ERROR = 'mt-1 text-xs text-red-500'
type AppStoreDataFormData = z.infer<typeof appStoreDataSchema>
interface AppStoreDataFormProps { defaultValues?: Partial<AppStoreDataFormData>; onChange?: (data: Partial<AppStoreDataFormData>) => void }
export function AppStoreDataForm({ defaultValues, onChange }: AppStoreDataFormProps) {
  const { register, formState: { errors } } = useQRFormWatch<AppStoreDataFormData>({ schema: appStoreDataSchema, defaultValues, onChange })
  return (
    <form className="space-y-5">
      <div>
        <label htmlFor="appName" className={LABEL}>App Name</label>
        <input {...register('appName')} id="appName" type="text" placeholder="My Awesome App" className={INPUT} />
        {errors.appName && <p className={ERROR}>{errors.appName.message}</p>}
      </div>
      <div>
        <label htmlFor="iosUrl" className={LABEL}>iOS App Store URL</label>
        <input {...register('iosUrl')} id="iosUrl" type="url" placeholder="https://apps.apple.com/app/..." className={INPUT} />
        {errors.iosUrl && <p className={ERROR}>{errors.iosUrl.message}</p>}
      </div>
      <div>
        <label htmlFor="androidUrl" className={LABEL}>Google Play Store URL</label>
        <input {...register('androidUrl')} id="androidUrl" type="url" placeholder="https://play.google.com/store/apps/..." className={INPUT} />
        {errors.androidUrl && <p className={ERROR}>{errors.androidUrl.message}</p>}
      </div>
    </form>
  )
}
