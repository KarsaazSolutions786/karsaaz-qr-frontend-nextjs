'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const domainSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain name is required')
    .regex(
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
      'Enter a valid domain (e.g., qr.example.com)'
    ),
})

type DomainFormData = z.infer<typeof domainSchema>

interface DomainFormProps {
  defaultValues?: Partial<DomainFormData>
  onSubmit: (data: DomainFormData) => void | Promise<void>
  isLoading?: boolean
}

export function DomainForm({ defaultValues, onSubmit, isLoading }: DomainFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DomainFormData>({
    resolver: zodResolver(domainSchema),
    defaultValues: { domain: '', ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="domain" className="block text-sm font-semibold text-gray-700">
          Domain Name *
        </label>
        <input
          {...register('domain')}
          id="domain"
          type="text"
          placeholder="qr.example.com"
          disabled={isLoading}
          className="mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 disabled:opacity-50"
        />
        {errors.domain && (
          <p className="mt-1 text-xs text-red-500">{errors.domain.message}</p>
        )}
      </div>

      {/* CNAME Instruction Panel */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="text-sm font-semibold text-blue-900">DNS Configuration</h3>
        <p className="mt-1 text-sm text-blue-700">
          Add the following CNAME record in your DNS provider:
        </p>
        <div className="mt-3 overflow-x-auto rounded-md bg-white p-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono text-gray-800">
              <tr>
                <td className="pr-4 py-1">CNAME</td>
                <td className="pr-4 py-1">Your subdomain</td>
                <td className="py-1">cname.yourdomain.com</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-blue-600">
          DNS changes may take up to 48 hours to propagate.
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : defaultValues?.domain ? 'Update Domain' : 'Add Domain'}
        </button>
      </div>
    </form>
  )
}
