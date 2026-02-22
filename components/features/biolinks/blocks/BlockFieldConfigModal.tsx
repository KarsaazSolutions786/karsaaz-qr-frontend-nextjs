'use client';

import { useState } from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { BiolinkBlockField, BiolinkFieldType } from '@/types/entities/dynamic-biolink-block';

interface BlockFieldConfigModalProps {
  fields: BiolinkBlockField[];
  open: boolean;
  onClose: () => void;
  onSave: (fields: BiolinkBlockField[]) => void;
}

const FIELD_TYPES: { value: BiolinkFieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'image', label: 'Image' },
  { value: 'custom_code', label: 'Custom Code' },
];

export default function BlockFieldConfigModal({
  fields: initialFields,
  open,
  onClose,
  onSave,
}: BlockFieldConfigModalProps) {
  const [fields, setFields] = useState<BiolinkBlockField[]>(initialFields);

  if (!open) return null;

  const addField = () => {
    setFields([
      ...fields,
      {
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: '',
        type: 'text',
        placeholder: '',
      },
    ]);
  };

  const updateField = (index: number, updates: Partial<BiolinkBlockField>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const validFields = fields.filter((f) => f.name.trim());
    onSave(validFields);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Configure Block Fields</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
          {fields.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              No fields configured. Add a field to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id || index}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <GripVertical className="mt-2 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      placeholder="Field name"
                      className="h-9 text-sm"
                    />
                    <div className="flex gap-2">
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(index, { type: e.target.value as BiolinkFieldType })
                        }
                        className="h-9 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        {FIELD_TYPES.map((ft) => (
                          <option key={ft.value} value={ft.value}>
                            {ft.label}
                          </option>
                        ))}
                      </select>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="Placeholder"
                        className="h-9 flex-1 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeField(index)}
                    className="mt-2 rounded-lg p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <Button type="button" variant="outline" size="sm" onClick={addField}>
            <Plus className="mr-1 h-4 w-4" />
            Add Field
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave}>
              Save Fields
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
