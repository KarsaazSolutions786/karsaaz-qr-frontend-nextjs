'use client'

import { useTranslation } from '@/lib/i18n'
import type { PricingBlockData } from '@/types/entities/biolink'

interface PricingBlockProps {
  block: PricingBlockData
  isEditing?: boolean
  onUpdate?: (data: PricingBlockData['data']) => void
}

export default function PricingBlock({ block, isEditing, onUpdate }: PricingBlockProps) {
  const { t } = useTranslation();
  const { title, plans } = block.data

  if (isEditing) {
    const addPlan = () => {
      onUpdate?.({
        ...block.data,
        plans: [
          ...plans,
          {
            name: 'Plan',
            price: '0',
            currency: 'USD',
            period: 'month',
            features: [],
            buttonText: 'Get Started',
            buttonUrl: '',
            highlighted: false,
          },
        ],
      })
    }

    const removePlan = (index: number) => {
      onUpdate?.({ ...block.data, plans: plans.filter((_, i) => i !== index) })
    }

    const updatePlan = (index: number, field: string, value: string | boolean | string[]) => {
      const updated = plans.map((plan, i) =>
        i === index ? { ...plan, [field]: value } : plan
      )
      onUpdate?.({ ...block.data, plans: updated })
    }

    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Section Title (optional)')}</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Choose Your Plan"
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">{t('Plans')}</label>
          <button
            type="button"
            onClick={addPlan}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {t('+ Add Plan')}
          </button>
        </div>
        {plans.map((plan, index) => (
          <div key={index} className="space-y-2 rounded border border-gray-100 p-3">
            <div className="flex items-start gap-2">
              <input
                type="text"
                value={plan.name}
                onChange={(e) => updatePlan(index, 'name', e.target.value)}
                placeholder="Plan name"
                className="block flex-1 rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removePlan(index)}
                className="text-red-600 hover:text-red-700"
              >
                &#10005;
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={plan.price}
                onChange={(e) => updatePlan(index, 'price', e.target.value)}
                placeholder="Price"
                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={plan.currency}
                onChange={(e) => updatePlan(index, 'currency', e.target.value)}
                placeholder="USD"
                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                value={plan.period}
                onChange={(e) => updatePlan(index, 'period', e.target.value)}
                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="month">{t('/ month')}</option>
                <option value="year">{t('/ year')}</option>
                <option value="one-time">{t('One-time')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                {t('Features (one per line)')}
              </label>
              <textarea
                value={plan.features.join('\n')}
                onChange={(e) =>
                  updatePlan(index, 'features', e.target.value.split('\n'))
                }
                rows={3}
                className="block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={"Feature 1\nFeature 2\nFeature 3"}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={plan.buttonText}
                onChange={(e) => updatePlan(index, 'buttonText', e.target.value)}
                placeholder="Button text"
                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="url"
                value={plan.buttonUrl || ''}
                onChange={(e) => updatePlan(index, 'buttonUrl', e.target.value)}
                placeholder="Button URL"
                className="block rounded-md border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`highlighted-${block.id}-${index}`}
                checked={plan.highlighted || false}
                onChange={(e) => updatePlan(index, 'highlighted', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`highlighted-${block.id}-${index}`}
                className="text-sm font-medium text-gray-700"
              >
                {t('Highlight this plan')}
              </label>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (plans.length === 0) return null

  return (
    <div>
      {title && (
        <h3 className="mb-4 text-center text-xl font-bold text-gray-900">{title}</h3>
      )}
      <div
        className={`grid gap-4 ${
          plans.length === 1
            ? 'grid-cols-1 max-w-sm mx-auto'
            : plans.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative flex flex-col rounded-lg border p-5 ${
              plan.highlighted
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                {t('Popular')}
              </div>
            )}
            <h4 className="mb-2 text-lg font-semibold text-gray-900">{plan.name}</h4>
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {plan.currency} {plan.price}
              </span>
              {plan.period !== 'one-time' && (
                <span className="text-sm text-gray-500"> / {plan.period}</span>
              )}
            </div>
            {plan.features.length > 0 && (
              <ul className="mb-6 flex-1 space-y-2">
                {plan.features
                  .filter((f) => f.trim())
                  .map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 shrink-0 text-green-500">&#10003;</span>
                      {feature}
                    </li>
                  ))}
              </ul>
            )}
            <a
              href={plan.buttonUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full rounded-lg px-4 py-2.5 text-center text-sm font-semibold transition-colors ${
                plan.highlighted
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {plan.buttonText || t('Get Started')}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
