'use client';

import React, { useState } from 'react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  options?: string[];
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
}

const FIELD_TYPES: FormField['type'][] = [
  'text',
  'email',
  'number',
  'select',
  'textarea',
  'checkbox',
];

export function FormBuilder({ fields, onChange }: FormBuilderProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
    };
    onChange([...fields, newField]);
    setEditingId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index]!;
    updated[index] = updated[target]!;
    updated[target] = temp;
    onChange(updated);
  };

  return (
    <div className="flex gap-6">
      {/* Field List */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Fields</h3>
          <button
            type="button"
            onClick={addField}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            + Add Field
          </button>
        </div>

        {fields.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-500">
            No fields yet. Click &quot;Add Field&quot; to start.
          </p>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`rounded-lg border p-3 transition-colors ${
              editingId === field.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveField(index, -1)}
                  disabled={index === 0}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  aria-label="Move up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveField(index, 1)}
                  disabled={index === fields.length - 1}
                  className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  aria-label="Move down"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1">
                <span className="text-sm font-medium text-gray-800">
                  {field.label}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {field.type}
                  {field.required && ' • required'}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingId(editingId === field.id ? null : field.id)
                }
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {editingId === field.id ? 'Done' : 'Edit'}
              </button>
              <button
                type="button"
                onClick={() => removeField(field.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Edit Panel */}
            {editingId === field.id && (
              <div className="mt-3 space-y-2 border-t border-gray-200 pt-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Label
                  </label>
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateField(field.id, { label: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Type
                  </label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(field.id, {
                        type: e.target.value as FormField['type'],
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(field.id, { required: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  Required
                </label>
                {field.type === 'select' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600">
                      Options (one per line)
                    </label>
                    <textarea
                      value={(field.options || []).join('\n')}
                      onChange={(e) =>
                        updateField(field.id, {
                          options: e.target.value
                            .split('\n')
                            .filter((o) => o.trim()),
                        })
                      }
                      rows={3}
                      className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div className="w-72 shrink-0">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Preview</h3>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          {fields.length === 0 && (
            <p className="text-center text-xs text-gray-400">
              Form preview will appear here
            </p>
          )}
          {fields.map((field) => (
            <div key={field.id}>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                {field.label}
                {field.required && (
                  <span className="ml-0.5 text-red-500">*</span>
                )}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  disabled
                  rows={2}
                  placeholder={field.label}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-400"
                />
              ) : field.type === 'select' ? (
                <select
                  disabled
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-400"
                >
                  <option>Select...</option>
                  {(field.options || []).map((opt, i) => (
                    <option key={i}>{opt}</option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <label className="flex items-center gap-1.5 text-xs text-gray-400">
                  <input type="checkbox" disabled className="rounded" />
                  {field.label}
                </label>
              ) : (
                <input
                  type={field.type}
                  disabled
                  placeholder={field.label}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-400"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
