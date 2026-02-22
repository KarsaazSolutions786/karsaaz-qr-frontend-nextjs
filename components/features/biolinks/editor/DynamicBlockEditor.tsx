'use client';

import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { DynamicBiolinkBlock, BiolinkBlockField } from '@/types/entities/dynamic-biolink-block';

interface DynamicBlockEditorProps {
  block: DynamicBiolinkBlock;
  onChange: (block: DynamicBiolinkBlock) => void;
  onConfigureFields: () => void;
}

export default function DynamicBlockEditor({
  block,
  onChange,
  onConfigureFields,
}: DynamicBlockEditorProps) {
  const handleNameChange = (name: string) => {
    onChange({ ...block, name });
  };

  const handleFieldValueChange = (fieldIndex: number, value: string) => {
    const updatedFields = (block.fields || []).map((f, i) =>
      i === fieldIndex ? { ...f, placeholder: value } : f
    );
    onChange({ ...block, fields: updatedFields });
  };

  const handleCustomCodeChange = (customCode: string) => {
    onChange({ ...block, customCode });
  };

  const renderFieldInput = (field: BiolinkBlockField, index: number) => {
    switch (field.type) {
      case 'textarea':
      case 'custom_code':
        return (
          <textarea
            value={field.placeholder || ''}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            placeholder={`Enter ${field.name}...`}
            rows={field.type === 'custom_code' ? 6 : 3}
            className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              field.type === 'custom_code' ? 'font-mono' : ''
            }`}
          />
        );
      case 'image':
        return (
          <Input
            type="url"
            value={field.placeholder || ''}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            placeholder="Image URL"
            className="h-9 text-sm"
          />
        );
      default:
        return (
          <Input
            value={field.placeholder || ''}
            onChange={(e) => handleFieldValueChange(index, e.target.value)}
            placeholder={`Enter ${field.name}...`}
            className="h-9 text-sm"
          />
        );
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
      {/* Block Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">Block Name</label>
          <Input
            value={block.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Block name"
            className="h-9 text-sm font-medium"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onConfigureFields}
          className="ml-3 mt-5"
        >
          <Settings2 className="mr-1 h-4 w-4" />
          Fields
        </Button>
      </div>

      {/* Block Preview */}
      {block.fields && block.fields.length > 0 && (
        <div className="space-y-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <p className="text-xs font-medium text-gray-500">Content Fields</p>
          {block.fields.map((field, index) => (
            <div key={field.id || index}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {field.name || `Field ${index + 1}`}
              </label>
              {renderFieldInput(field, index)}
            </div>
          ))}
        </div>
      )}

      {/* Custom Code Area */}
      {block.customCode !== undefined && (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Custom Code</label>
          <textarea
            value={block.customCode || ''}
            onChange={(e) => handleCustomCodeChange(e.target.value)}
            placeholder="Enter custom HTML/CSS..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Empty State */}
      {(!block.fields || block.fields.length === 0) && !block.customCode && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-8 text-center">
          <p className="text-sm text-gray-500">No fields configured.</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onConfigureFields}
            className="mt-1 text-blue-600 hover:text-blue-700"
          >
            Add fields to get started
          </Button>
        </div>
      )}
    </div>
  );
}
