'use client'

import React, { useState } from 'react'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import apiClient from '@/lib/api/client'

interface LicenseStepProps {
  purchaseCode: string
  onChange: (code: string) => void
}

export function LicenseStep({ purchaseCode, onChange }: LicenseStepProps) {
  const [status, setStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle')
  const [message, setMessage] = useState('')

  const validate = async () => {
    if (!purchaseCode.trim()) {
      setStatus('invalid')
      setMessage('Please enter a purchase code.')
      return
    }
    setStatus('validating')
    setMessage('')
    try {
      const res = await apiClient.post('/install/validate-license', { purchaseCode })
      if (res.data.valid) {
        setStatus('valid')
        setMessage('License validated successfully!')
      } else {
        setStatus('invalid')
        setMessage(res.data.message || 'Invalid purchase code.')
      }
    } catch {
      setStatus('invalid')
      setMessage('Validation failed. Please check your purchase code.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Purchase Code</label>
        <input
          type="text"
          value={purchaseCode}
          onChange={(e) => { onChange(e.target.value); setStatus('idle') }}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm ${
          status === 'valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status === 'valid' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={validate}
        disabled={status === 'validating'}
        className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
      >
        {status === 'validating' && <Loader2 className="h-4 w-4 animate-spin" />}
        Validate
      </button>
    </div>
  )
}
