'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDynamicBiolinkBlock } from '@/lib/hooks/queries/useDynamicBiolinkBlocks'
import { useUpdateDynamicBiolinkBlock } from '@/lib/hooks/mutations/useDynamicBiolinkBlockMutations'
import { dynamicBiolinkBlocksAPI } from '@/lib/api/endpoints/dynamic-biolink-blocks'
import type { BiolinkBlockField, BiolinkFieldType, CreateDynamicBiolinkBlockRequest } from '@/types/entities/dynamic-biolink-block'

const FIELD_TYPES: { value: BiolinkFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'image', label: 'Image' },
  { value: 'custom_code', label: 'Custom Code' },
]

interface FieldFormState {
  name: string
  placeholder: string
  type: BiolinkFieldType
  iconFile: File | null
  uploading: boolean
}

const emptyField = (): FieldFormState => ({
  name: '',
  placeholder: '',
  type: 'text',
  iconFile: null,
  uploading: false,
})

export default function EditDynamicBiolinkBlockPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: block, isLoading } = useDynamicBiolinkBlock(Number(id))
  const updateMutation = useUpdateDynamicBiolinkBlock()

  const [name, setName] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const [saved, setSaved] = useState(false)

  const [fields, setFields] = useState<BiolinkBlockField[]>([])
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [fieldForm, setFieldForm] = useState<FieldFormState>(emptyField())

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (block) {
      setName(block.name)
      setCustomCode(block.customCode ?? '')
      setFields(block.fields ?? [])
    }
  }, [block])

  const setFieldVal = <K extends keyof FieldFormState>(key: K, value: FieldFormState[K]) =>
    setFieldForm((prev) => ({ ...prev, [key]: value }))

  const addField = async () => {
    if (!fieldForm.name.trim()) return
    let iconId: number | undefined

    if (fieldForm.iconFile) {
      setFieldVal('uploading', true)
      try {
        iconId = await dynamicBiolinkBlocksAPI.uploadFile(fieldForm.iconFile).then((r: { id?: number }) => r?.id)
      } finally {
        setFieldVal('uploading', false)
      }
    }

    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: fieldForm.name,
        placeholder: fieldForm.placeholder || undefined,
        type: fieldForm.type,
        icon_id: iconId,
      },
    ])
    setFieldForm(emptyField())
    setShowFieldModal(false)
  }

  const removeField = (idx: number) => setFields((prev) => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let iconId: number | undefined

    if (iconFile) {
      try {
        setUploadingIcon(true)
        iconId = await dynamicBiolinkBlocksAPI.uploadFile(iconFile).then((r: { id?: number }) => r?.id)
      } finally {
        setUploadingIcon(false)
      }
    }

    const payload: CreateDynamicBiolinkBlockRequest = {
      name,
      customCode: customCode || undefined,
      iconId: iconId ?? block?.iconId,
      fields: fields.length ? fields : undefined,
    }

    await updateMutation.mutateAsync({ id: Number(id), data: payload })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (isLoading) return (
    <div className="flex min-h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
    </div>
  )
  if (!block) return <div className="text-center py-12">Block not found</div>

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Dynamic Block</h1>
          <p className="mt-2 text-sm text-gray-600">{block.name}</p>
        </div>
        <Link href="/dynamic-biolink-blocks" className="text-sm text-blue-600 hover:text-blue-900">← Back</Link>
      </div>

      {updateMutation.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to save changes.</div>
      )}
      {saved && (
        <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">Changes saved successfully.</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Block Details */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Block Details</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Block Icon</label>
              {block.iconId && !iconFile && (
                <p className="mb-1 text-xs text-gray-500">Current icon ID: {block.iconId}. Upload a new file to replace it.</p>
              )}
              <input type="file" accept="image/*" onChange={(e) => setIconFile(e.target.files?.[0] ?? null)}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100" />
            </div>
          </div>
        </section>

        {/* Section 2: Fields */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Fields</h2>
            <button type="button" onClick={() => setShowFieldModal(true)}
              className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">
              + Add Field
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">No fields added yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {fields.map((f, idx) => (
                <li key={f.id ?? idx} className="flex items-center justify-between py-3">
                  <div>
                    <span className="text-sm font-medium text-gray-900">{f.name}</span>
                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      {FIELD_TYPES.find((t) => t.value === f.type)?.label ?? f.type}
                    </span>
                    {f.placeholder && (
                      <span className="ml-2 text-xs text-gray-400">placeholder: {f.placeholder}</span>
                    )}
                  </div>
                  <button type="button" onClick={() => removeField(idx)}
                    className="ml-4 text-sm text-red-500 hover:text-red-700">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Section 3: Custom Code */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Custom Code</h2>
          <textarea rows={8} value={customCode} onChange={(e) => setCustomCode(e.target.value)}
            placeholder="Optional custom code for this block…"
            className="block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
        </section>

        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={updateMutation.isPending || uploadingIcon}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            {updateMutation.isPending || uploadingIcon ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Add Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" ref={modalRef}
          onClick={(e) => { if (e.target === modalRef.current) setShowFieldModal(false) }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Add Field</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <input type="file" accept="image/*" onChange={(e) => setFieldVal('iconFile', e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-sm hover:file:bg-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                <input type="text" value={fieldForm.name} onChange={(e) => setFieldVal('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Placeholder</label>
                <input type="text" value={fieldForm.placeholder} onChange={(e) => setFieldVal('placeholder', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select value={fieldForm.type} onChange={(e) => setFieldVal('type', e.target.value as BiolinkFieldType)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none">
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowFieldModal(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={addField} disabled={!fieldForm.name.trim() || fieldForm.uploading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                {fieldForm.uploading ? 'Uploading…' : 'Add Field'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
