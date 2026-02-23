'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

export interface VCardItem {
  property: string
  value: string
  parameters?: Record<string, string>
}

export interface VCardCollection {
  items: VCardItem[]
}

export interface VCardEntry {
  id: string
  name: string
  phone: string
  email: string
  organization: string
  title: string
}

export function toVCardItems(entry: VCardEntry): VCardItem[] {
  return [
    { property: 'FN', value: entry.name },
    { property: 'TEL', value: entry.phone, parameters: { TYPE: 'CELL' } },
    { property: 'EMAIL', value: entry.email },
    { property: 'ORG', value: entry.organization },
    { property: 'TITLE', value: entry.title },
  ].filter(item => item.value.trim() !== '')
}

export function toVCardCollection(entries: VCardEntry[]): VCardCollection {
  return { items: entries.flatMap(toVCardItems) }
}

interface VCardListInputProps {
  value: VCardEntry[]
  onChange: (entries: VCardEntry[]) => void
  className?: string
}

function generateId(): string {
  return `vcard-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createEmptyEntry(): VCardEntry {
  return { id: generateId(), name: '', phone: '', email: '', organization: '', title: '' }
}

export function VCardListInput({ value, onChange, className }: VCardListInputProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<VCardEntry>(createEmptyEntry())
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = useCallback(() => {
    setDraft(createEmptyEntry())
    setIsAdding(true)
    setEditingId(null)
  }, [])

  const handleSaveNew = useCallback(() => {
    if (!draft.name.trim() && !draft.phone.trim() && !draft.email.trim()) return
    onChange([...value, { ...draft, id: generateId() }])
    setIsAdding(false)
    setDraft(createEmptyEntry())
  }, [draft, value, onChange])

  const handleCancelNew = useCallback(() => {
    setIsAdding(false)
    setDraft(createEmptyEntry())
  }, [])

  const handleEdit = useCallback((entry: VCardEntry) => {
    setEditingId(entry.id)
    setDraft({ ...entry })
    setIsAdding(false)
  }, [])

  const handleSaveEdit = useCallback(() => {
    onChange(value.map(e => (e.id === draft.id ? { ...draft } : e)))
    setEditingId(null)
    setDraft(createEmptyEntry())
  }, [draft, value, onChange])

  const handleCancelEdit = useCallback(() => {
    setEditingId(null)
    setDraft(createEmptyEntry())
  }, [])

  const handleRemove = useCallback(
    (id: string) => {
      onChange(value.filter(e => e.id !== id))
      if (editingId === id) setEditingId(null)
    },
    [value, onChange, editingId]
  )

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return
      const next = [...value]
      ;[next[index - 1]!, next[index]!] = [next[index]!, next[index - 1]!]
      onChange(next)
    },
    [value, onChange]
  )

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index >= value.length - 1) return
      const next = [...value]
      ;[next[index]!, next[index + 1]!] = [next[index + 1]!, next[index]!]
      onChange(next)
    },
    [value, onChange]
  )

  const updateDraft = useCallback((field: keyof VCardEntry, val: string) => {
    setDraft(prev => ({ ...prev, [field]: val }))
  }, [])

  const renderForm = (onSave: () => void, onCancel: () => void) => (
    <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50/50 p-3">
      <Input
        placeholder="Name"
        value={draft.name}
        onChange={e => updateDraft('name', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Phone"
          value={draft.phone}
          onChange={e => updateDraft('phone', e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={draft.email}
          onChange={e => updateDraft('email', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          placeholder="Organization"
          value={draft.organization}
          onChange={e => updateDraft('organization', e.target.value)}
        />
        <Input
          placeholder="Title"
          value={draft.title}
          onChange={e => updateDraft('title', e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          <XMarkIcon className="mr-1 h-4 w-4" />
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onSave}>
          <CheckIcon className="mr-1 h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn('space-y-2', className)}>
      {value.map((entry, index) =>
        editingId === entry.id ? (
          <div key={entry.id}>{renderForm(handleSaveEdit, handleCancelEdit)}</div>
        ) : (
          <div
            key={entry.id}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">
                {entry.name || 'Unnamed'}
              </p>
              <p className="truncate text-xs text-gray-500">
                {[entry.title, entry.organization].filter(Boolean).join(' · ') ||
                  [entry.phone, entry.email].filter(Boolean).join(' · ') ||
                  '—'}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
              >
                <ChevronUpIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleMoveDown(index)}
                disabled={index >= value.length - 1}
              >
                <ChevronDownIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleEdit(entry)}
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-700"
                onClick={() => handleRemove(entry.id)}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )
      )}

      {isAdding && renderForm(handleSaveNew, handleCancelNew)}

      {!isAdding && (
        <Button type="button" variant="outline" size="sm" className="w-full" onClick={handleAdd}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Add Entry
        </Button>
      )}
    </div>
  )
}
