'use client'

import { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X, GripVertical } from 'lucide-react'
import type { LeadFormField } from '@/types/entities/lead-form'

const QUESTION_TYPES: { value: LeadFormField['type']; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'stars', label: 'Stars' },
  { value: 'choices', label: 'Single Choice' },
  { value: 'multi-choices', label: 'Multi Choice' },
]

const TYPES_WITH_OPTIONS: LeadFormField['type'][] = [
  'select',
  'checkbox',
  'radio',
  'choices',
  'multi-choices',
]

interface QuestionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  question: Partial<LeadFormField> | null
  onSave: (question: Omit<LeadFormField, 'id' | 'order'>) => void
}

export default function QuestionModal({
  open,
  onOpenChange,
  question,
  onSave,
}: QuestionModalProps) {
  const isEditing = !!question?.label
  const [label, setLabel] = useState(question?.label ?? '')
  const [type, setType] = useState<LeadFormField['type']>(question?.type ?? 'text')
  const [required, setRequired] = useState(question?.required ?? false)
  const [placeholder, setPlaceholder] = useState(question?.placeholder ?? '')
  const [options, setOptions] = useState<string[]>(question?.options ?? [])
  const [newOption, setNewOption] = useState('')
  const [minLength, setMinLength] = useState<string>(
    question?.validation?.minLength?.toString() ?? ''
  )
  const [maxLength, setMaxLength] = useState<string>(
    question?.validation?.maxLength?.toString() ?? ''
  )
  const [pattern, setPattern] = useState(question?.validation?.pattern ?? '')

  // Reset state when question changes
  const resetForm = useCallback(() => {
    setLabel(question?.label ?? '')
    setType(question?.type ?? 'text')
    setRequired(question?.required ?? false)
    setPlaceholder(question?.placeholder ?? '')
    setOptions(question?.options ?? [])
    setNewOption('')
    setMinLength(question?.validation?.minLength?.toString() ?? '')
    setMaxLength(question?.validation?.maxLength?.toString() ?? '')
    setPattern(question?.validation?.pattern ?? '')
  }, [question])

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) resetForm()
    onOpenChange(isOpen)
  }

  const hasOptions = TYPES_WITH_OPTIONS.includes(type)

  const addOption = () => {
    const trimmed = newOption.trim()
    if (!trimmed || options.includes(trimmed)) return
    setOptions([...options, trimmed])
    setNewOption('')
  }

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const moveOption = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= options.length) return
    const updated = [...options]
    const temp = updated[index]!
    updated[index] = updated[target]!
    updated[target] = temp
    setOptions(updated)
  }

  const handleSave = () => {
    if (!label.trim()) return

    const validation = {
      ...(minLength ? { minLength: parseInt(minLength, 10) } : {}),
      ...(maxLength ? { maxLength: parseInt(maxLength, 10) } : {}),
      ...(pattern ? { pattern } : {}),
    }

    onSave({
      type,
      label: label.trim(),
      name: question?.name ?? `field_${Date.now()}`,
      placeholder: placeholder || undefined,
      required,
      options: hasOptions ? options : undefined,
      validation: Object.keys(validation).length > 0 ? validation : undefined,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Question' : 'Add Question'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Label */}
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. What is your name?"
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label>Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as LeadFormField['type'])}
              className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {QUESTION_TYPES.map((qt) => (
                <option key={qt.value} value={qt.value}>
                  {qt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Required toggle */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
            <Label className="cursor-pointer">Required</Label>
            <Switch checked={required} onCheckedChange={setRequired} />
          </div>

          {/* Placeholder */}
          <div className="space-y-1.5">
            <Label>Placeholder</Label>
            <Input
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
              placeholder="Optional placeholder text"
            />
          </div>

          {/* Options (for select/checkbox/radio/choices) */}
          {hasOptions && (
            <div className="space-y-2">
              <Label>Options</Label>
              {options.length > 0 && (
                <div className="space-y-1 rounded-md border border-gray-200 p-2">
                  {options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50"
                    >
                      <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm">{opt}</span>
                      <button
                        type="button"
                        onClick={() => moveOption(i, -1)}
                        disabled={i === 0}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => moveOption(i, 1)}
                        disabled={i === options.length - 1}
                        className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => removeOption(i)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Remove ${opt}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add an option…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addOption()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addOption}
                  disabled={!newOption.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Validation Rules */}
          <details className="rounded-lg border border-gray-200">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700">
              Validation Rules
            </summary>
            <div className="space-y-3 px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Min Length</Label>
                  <Input
                    type="number"
                    value={minLength}
                    onChange={(e) => setMinLength(e.target.value)}
                    placeholder="0"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Length</Label>
                  <Input
                    type="number"
                    value={maxLength}
                    onChange={(e) => setMaxLength(e.target.value)}
                    placeholder="∞"
                    min={0}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Pattern (regex)</Label>
                <Textarea
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g. ^[A-Z].*"
                  rows={2}
                />
              </div>
            </div>
          </details>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            {isEditing ? 'Save Changes' : 'Add Question'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
