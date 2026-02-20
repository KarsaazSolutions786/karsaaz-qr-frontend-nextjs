'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCustomCode, useCustomCodePositions } from '@/lib/hooks/queries/useCustomCodes'
import { useUpdateCustomCode } from '@/lib/hooks/mutations/useCustomCodeMutations'
import type { CreateCustomCodeRequest } from '@/types/entities/custom-code'

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
] as const

export default function EditCustomCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: code, isLoading } = useCustomCode(Number(id))
  const updateMutation = useUpdateCustomCode()
  const { data: positions = [] } = useCustomCodePositions()

  const [form, setForm] = useState<CreateCustomCodeRequest>({
    name: '',
    language: 'javascript',
    position: '',
    sortOrder: 0,
    code: '',
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (code) {
      setForm({
        name: code.name,
        language: code.language,
        position: code.position,
        sortOrder: code.sortOrder,
        code: code.code,
      })
    }
  }, [code])

  const set = <K extends keyof CreateCustomCodeRequest>(key: K, value: CreateCustomCodeRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateMutation.mutateAsync({ id: Number(id), data: form })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
    </div>
  )
  if (!code) return <div className="text-center py-12">Custom code not found</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Custom Code</h1>
          <p className="mt-2 text-sm text-gray-600">{code.name}</p>
        </div>
        <Link href="/custom-codes" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to save changes.</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Changes saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
          <input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)}
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
            {/* Keep current value visible even if not in the fetched list */}
            {form.position && !positions.includes(form.position) && (
              <option value={form.position}>{form.position}</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input type="number" value={form.sortOrder ?? 0} onChange={(e) => set('sortOrder', Number(e.target.value))}
            className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Code <span className="text-red-500">*</span></label>
          <textarea required rows={14} value={form.code} onChange={(e) => set('code', e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
        </div>

        <div className="flex items-center justify-end gap-4 border-t pt-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
