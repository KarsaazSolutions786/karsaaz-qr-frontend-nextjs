'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCreateCustomCode } from '@/lib/hooks/mutations/useCustomCodeMutations'
import { useCustomCodePositions } from '@/lib/hooks/queries/useCustomCodes'
import type { CreateCustomCodeRequest } from '@/types/entities/custom-code'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
] as const

export default function NewCustomCodePage() {
  const router = useRouter()
  const createMutation = useCreateCustomCode()
  const { data: positions = [] } = useCustomCodePositions()

  const [form, setForm] = useState<CreateCustomCodeRequest>({
    name: '',
    language: 'javascript',
    position: '',
    sortOrder: 0,
    code: '',
  })

  const set = <K extends keyof CreateCustomCodeRequest>(key: K, value: CreateCustomCodeRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMutation.mutateAsync(form)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Custom Code</h1>
          <p className="mt-2 text-sm text-gray-600">Inject custom scripts or styles into your application</p>
        </div>
        <Link href="/custom-codes" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {createMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to create custom code. Please check the fields and try again.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
          <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Facebook Pixel"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Language <span className="text-red-500">*</span></label>
          <select required value={form.language} onChange={(e) => set('language', e.target.value as CreateCustomCodeRequest['language'])}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm">
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Position <span className="text-red-500">*</span></label>
          <select required value={form.position} onChange={(e) => set('position', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm">
            <option value="">— Select position —</option>
            {positions.map((pos: string) => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input type="number" value={form.sortOrder ?? 0} onChange={(e) => set('sortOrder', Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
          <p className="mt-1 text-xs text-gray-500">Lower numbers load first within the same position</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code <span className="text-red-500">*</span></label>
          <textarea required rows={12} value={form.code} onChange={(e) => set('code', e.target.value)}
            placeholder={form.language === 'javascript' ? '// Paste your script here…' : form.language === 'html' ? '<!-- Paste your HTML here… -->' : '/* Paste your CSS here… */'}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {createMutation.isPending ? 'Creating…' : 'Create Custom Code'}
          </button>
        </div>
      </form>
    </div>
  )
}
