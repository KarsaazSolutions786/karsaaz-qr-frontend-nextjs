'use client'

import React, { useState } from 'react'
import { z } from 'zod'

const superUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

interface SuperUserConfig {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface SuperUserStepProps {
  config: SuperUserConfig
  onChange: (config: SuperUserConfig) => void
}

export function SuperUserStep({ config, onChange }: SuperUserStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = (field: keyof SuperUserConfig, value: string) => {
    const next = { ...config, [field]: value }
    onChange(next)

    // Validate on change
    const result = superUserSchema.safeParse(next)
    if (result.success) {
      setErrors({})
    } else {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((e) => {
        const key = e.path[0] as string
        if (!fieldErrors[key]) fieldErrors[key] = e.message
      })
      setErrors(fieldErrors)
    }
  }

  const fields: { key: keyof SuperUserConfig; label: string; type: string; placeholder: string }[] = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Admin User' },
    { key: 'email', label: 'Email', type: 'email', placeholder: 'admin@example.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
  ]

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-sm font-medium text-gray-700">{f.label}</label>
          <input
            type={f.type}
            value={config[f.key]}
            onChange={(e) => update(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1 ${
              errors[f.key]
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors[f.key] && (
            <p className="mt-1 text-xs text-red-600">{errors[f.key]}</p>
          )}
        </div>
      ))}
    </div>
  )
}
