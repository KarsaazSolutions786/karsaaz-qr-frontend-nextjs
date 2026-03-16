'use client'

import type { ReactNode } from 'react'
import { useTranslation } from '@/lib/i18n'

// ─── Shared CSS class constants ───────────────────────────────────────────────

export const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export const selectClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white'

export const textareaClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export const labelClass = 'block text-sm font-medium text-gray-700'

export const hintClass = 'mt-1 text-xs text-gray-500'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProcessorFormProps {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

interface PaymentProcessorFormBaseProps extends ProcessorFormProps {
  /** Gateway slug used for ID prefixing and webhook URL generation */
  slug: string
  /** Optional description/instructions shown at the top */
  description?: ReactNode
  /** Whether this gateway requires a manual webhook URL setup */
  showWebhookUrl?: boolean
  /** Custom webhook instruction message */
  webhookMessage?: string
  /** Children contain the gateway-specific form fields */
  children?: ReactNode
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Base component for all payment processor configuration forms.
 *
 * Provides:
 * - Optional description/instructions area
 * - Optional webhook URL display with copy button
 * - A slot (children) for gateway-specific fields
 *
 * Does NOT render any gateway-specific fields (API key, secret, mode, etc.)
 * -- those are the responsibility of each gateway form component.
 */
export default function PaymentProcessorFormBase({
  slug,
  settings: _settings,
  onChange: _onChange,
  description,
  showWebhookUrl = false,
  webhookMessage,
  children,
}: PaymentProcessorFormBaseProps) {
  // _settings and _onChange are passed through for interface compatibility;
  // child forms use them directly via their own props.
  void _settings
  void _onChange
  const { t } = useTranslation()

  const webhookUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/webhooks/${slug}`
      : `/api/webhooks/${slug}`

  return (
    <div className="space-y-4">
      {/* Description / Instructions */}
      {description && (
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {description}
        </div>
      )}

      {/* Manual webhook URL display */}
      {showWebhookUrl && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">
            {webhookMessage ?? t('Add the following webhook URL in your payment processor dashboard:')}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <code className="rounded bg-white px-2 py-1 text-xs break-all select-all">
              {webhookUrl}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(webhookUrl)}
              className="shrink-0 rounded border border-amber-300 px-2 py-1 text-xs font-medium hover:bg-amber-100"
            >
              {t('Copy')}
            </button>
          </div>
        </div>
      )}

      {/* Gateway-specific fields */}
      {children}
    </div>
  )
}
