'use client'

type BillingMode = 'monthly' | 'annual' | 'credit'

interface BillingModeToggleProps {
  mode: BillingMode
  onChange: (mode: BillingMode) => void
}

const OPTIONS: { value: BillingMode; label: string; badge?: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual', badge: 'Save 20%' },
  { value: 'credit', label: 'Credit' },
]

export function BillingModeToggle({ mode, onChange }: BillingModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-100 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative rounded-md px-4 py-2 text-sm font-medium transition-all ${
            mode === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt.label}
          {opt.badge && (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold text-green-700">
              {opt.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
