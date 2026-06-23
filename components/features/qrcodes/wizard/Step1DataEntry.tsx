'use client'

import { Suspense, useCallback, useMemo } from 'react'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { Lightbulb, Zap, Shield, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { QRFormDataForType, QRWizardFormDataState } from '@/types/qr-wizard'
import { LAZY_QR_FORMS } from './lazy-qr-forms'
import { WizardFormSkeleton } from './WizardStepSkeleton'

const TYPE_TIPS: Record<string, string[]> = {
  text: [
    'Enter any text, URL, or message you want to encode.',
    'Static QR — the content cannot be changed after printing.',
    'Keep text short for better scan reliability.',
  ],
  url: [
    'Always include https:// for a valid link.',
    'Dynamic QR — you can change the destination URL anytime.',
    'Great for marketing campaigns where you need tracking.',
  ],
  vcard: [
    'Fill in your contact details to create a shareable business card.',
    "Scanning adds you directly to the phone's contacts.",
    'Include a photo URL for a professional touch.',
  ],
  wifi: [
    'Your WiFi password is encoded in the QR — no need to share it verbally.',
    'Supports WPA/WPA2, WEP, and open networks.',
    'Perfect for cafés, offices, and Airbnbs.',
  ],
  email: [
    'Pre-fill recipient, subject, and body for one-tap emails.',
    'Great for feedback forms and support requests.',
  ],
  whatsapp: [
    'Include your phone number with country code (e.g. +1...).',
    'You can pre-fill a message users will send you.',
  ],
  'business-profile': [
    'Showcase your business details — name, hours, contact info.',
    'Dynamic QR — update your profile anytime without reprinting.',
    'Add location, phone, email and social links.',
  ],
}

const DEFAULT_TIPS = [
  'Fill in the required fields, then click Next to customize your design.',
  'You can come back and edit this data anytime.',
  'Dynamic QR types let you change content after printing.',
]

interface Step1DataEntryProps {
  qrType: string
  data: QRWizardFormDataState
  onChange: (data: QRWizardFormDataState) => void
}

function LazyQRForm({
  qrType,
  data,
  onChange,
}: {
  qrType: string
  data: QRWizardFormDataState
  onChange: (data: QRWizardFormDataState) => void
}) {
  const FormComponent = LAZY_QR_FORMS[qrType]
  const { t } = useTranslation()

  if (!FormComponent) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>{t('Form for this type is not yet available.')}</p>
        <p className="mt-2 text-sm">{t('You can still proceed to design your QR code.')}</p>
      </div>
    )
  }

  const handleDataChange = (formData: Partial<QRFormDataForType<typeof qrType>>) => {
    onChange(formData as QRWizardFormDataState)
  }

  return (
    <FormComponent
      defaultValues={data as Record<string, unknown>}
      onChange={handleDataChange as (data: Record<string, unknown>) => void}
    />
  )
}

export default function Step1DataEntry({ qrType, data, onChange }: Step1DataEntryProps) {
  const { t } = useTranslation()
  const typeInfo = QR_TYPES.find(tp => tp.id === qrType)
  const tips = useMemo(() => TYPE_TIPS[qrType] || DEFAULT_TIPS, [qrType])
  const isDynamic = typeInfo?.cat === 'dynamic'

  const handleDataChange = useCallback(
    (formData: QRWizardFormDataState) => {
      onChange(formData)
    },
    [onChange]
  )

  return (
    <div className="space-y-6">
      {typeInfo && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-white p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-purple-100">
              {typeInfo.icon.endsWith('.svg') || typeInfo.icon.endsWith('.png') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={typeInfo.icon} alt={typeInfo.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-2xl">{typeInfo.icon}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">{typeInfo.name}</h3>
                {isDynamic ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <Zap className="h-3 w-3" />
                    {t('Dynamic')}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-0.5 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200">
                    {t('Static')}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{typeInfo.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Suspense fallback={<WizardFormSkeleton />}>
            <LazyQRForm qrType={qrType} data={data} onChange={handleDataChange} />
          </Suspense>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
                <Lightbulb className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-purple-900">{t('Tips')}</h4>
            </div>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-gray-600">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-purple-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {isDynamic && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-800">{t('Dynamic QR')}</span>
              </div>
              <p className="text-xs leading-relaxed text-emerald-700">
                {t(
                  'You can change the destination content anytime without reprinting. Includes scan analytics and tracking.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
