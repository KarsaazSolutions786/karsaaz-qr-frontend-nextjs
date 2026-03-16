'use client'

import { useState, useCallback } from 'react'
import { useTranslation } from '@/lib/i18n'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FormConfig, FormField, FormFieldType, FormSettings } from './types'
import { FIELD_TYPE_OPTIONS, DEFAULT_FORM_SETTINGS, createFormField } from './types'
import FieldSettingsPanel from './FieldSettingsPanel'
import FormSettingsPanel from './FormSettingsPanel'
import FormFieldRenderer from './FormFieldRenderer'
import { cn } from '@/lib/utils'

interface FormBuilderProps {
  initialConfig?: FormConfig
  onSave: (config: FormConfig) => void
}

// Sortable field wrapper for the canvas
function SortableField({
  field,
  isSelected,
  onSelect,
  onDelete,
}: {
  field: FormField
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border-2 bg-white p-4 transition-colors cursor-pointer',
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-200'
          : 'border-gray-200 hover:border-gray-300'
      )}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="flex cursor-grab items-center justify-center rounded bg-gray-200 p-1 text-gray-500 hover:bg-gray-300 active:cursor-grabbing"
          title="Drag to reorder"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
          </svg>
        </button>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute -right-3 -top-3 rounded-full bg-red-100 p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
        title="Remove field"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Field Preview */}
      <div className="pointer-events-none">
        <FormFieldRenderer
          field={field}
          value={field.type === 'checkbox' ? [] : ''}
          onChange={() => {}}
          disabled
        />
      </div>

      {/* Field Type Badge */}
      <div className="absolute right-2 top-2">
        <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 uppercase">
          {field.type}
        </span>
      </div>
    </div>
  )
}

export default function FormBuilder({ initialConfig, onSave }: FormBuilderProps) {
  const { t } = useTranslation();
  const [fields, setFields] = useState<FormField[]>(initialConfig?.fields || [])
  const [settings, setSettings] = useState<FormSettings>(
    initialConfig?.settings || { ...DEFAULT_FORM_SETTINGS }
  )
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'fields' | 'settings'>('fields')
  const [isPreview, setIsPreview] = useState(false)

  const selectedField = fields.find((f) => f.id === selectedFieldId) || null

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (over && active.id !== over.id) {
        setFields((prev) => {
          const oldIndex = prev.findIndex((f) => f.id === active.id)
          const newIndex = prev.findIndex((f) => f.id === over.id)
          return arrayMove(prev, oldIndex, newIndex)
        })
      }
    },
    []
  )

  const addField = useCallback((type: FormFieldType) => {
    const newField = createFormField(type)
    setFields((prev) => [...prev, newField])
    setSelectedFieldId(newField.id)
  }, [])

  const updateField = useCallback((updated: FormField) => {
    setFields((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    )
  }, [])

  const deleteField = useCallback(
    (id: string) => {
      setFields((prev) => prev.filter((f) => f.id !== id))
      if (selectedFieldId === id) {
        setSelectedFieldId(null)
      }
    },
    [selectedFieldId]
  )

  const handleSave = useCallback(() => {
    const config: FormConfig = {
      id: initialConfig?.id,
      fields,
      settings,
    }
    onSave(config)
  }, [fields, settings, initialConfig?.id, onSave])

  // Preview mode
  if (isPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t('Form Preview')}</h2>
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {t('Back to Editor')}
          </button>
        </div>
        <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <PreviewForm fields={fields} settings={settings} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-0 rounded-lg border border-gray-200 bg-gray-50">
      {/* Left Panel: Field Type Palette */}
      <div className="w-56 shrink-0 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{t('Add Fields')}</h3>
        </div>
        <div className="space-y-1 p-3">
          {FIELD_TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => addField(opt.type)}
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500">
                {opt.icon}
              </span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Center Panel: Form Canvas */}
      <div className="flex-1 overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {settings.title || t('Untitled Form')}
            </h3>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {fields.length} {fields.length !== 1 ? t('fields') : t('field')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t('Preview')}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              {t('Save Form')}
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="p-6">
          {fields.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="text-4xl text-gray-300 mb-3">&#9776;</div>
              <p className="text-sm text-gray-500 mb-1">
                {t('No fields added yet')}
              </p>
              <p className="text-xs text-gray-400">
                {t('Click a field type on the left panel to get started')}
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 pl-4">
                  {fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      isSelected={selectedFieldId === field.id}
                      onSelect={() => setSelectedFieldId(field.id)}
                      onDelete={() => deleteField(field.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Panel: Settings */}
      <div className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-white">
        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('fields')}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'fields'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t('Field')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={cn(
              'flex-1 px-4 py-2.5 text-sm font-medium transition-colors',
              activeTab === 'settings'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            )}
          >
            {t('Form Settings')}
          </button>
        </div>

        {activeTab === 'fields' ? (
          <FieldSettingsPanel
            field={selectedField}
            onUpdate={updateField}
          />
        ) : (
          <div className="p-4">
            <FormSettingsPanel settings={settings} onUpdate={setSettings} />
          </div>
        )}
      </div>
    </div>
  )
}

// Inline preview form component
function PreviewForm({
  fields,
  settings,
}: {
  fields: FormField[]
  settings: FormSettings
}) {
  const [values, setValues] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mb-3 text-4xl text-green-500">&#10003;</div>
        <p className="text-lg font-medium text-gray-900">{settings.successMessage}</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {settings.title && (
        <h2 className="text-xl font-semibold text-gray-900">{settings.title}</h2>
      )}
      {settings.description && (
        <p className="text-sm text-gray-600">{settings.description}</p>
      )}

      {fields.map((field) => (
        <FormFieldRenderer
          key={field.id}
          field={field}
          value={values[field.id] || (field.type === 'checkbox' ? [] : '')}
          onChange={(val) => setValues((prev) => ({ ...prev, [field.id]: val }))}
        />
      ))}

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        {settings.submitButtonText || 'Submit'}
      </button>
    </form>
  )
}
