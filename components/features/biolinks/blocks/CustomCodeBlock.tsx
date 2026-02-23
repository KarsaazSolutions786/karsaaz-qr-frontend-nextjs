'use client'

import type { CustomCodeBlockData } from '@/types/entities/biolink'

interface CustomCodeBlockProps {
  block: CustomCodeBlockData
  isEditing?: boolean
  onUpdate?: (data: CustomCodeBlockData['data']) => void
}

export default function CustomCodeBlock({ block, isEditing, onUpdate }: CustomCodeBlockProps) {
  const { htmlCode = '', cssCode = '', jsCode = '' } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">HTML</label>
          <textarea
            value={htmlCode}
            onChange={e => onUpdate?.({ ...block.data, htmlCode: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="<div>Your HTML here</div>"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CSS</label>
          <textarea
            value={cssCode}
            onChange={e => onUpdate?.({ ...block.data, cssCode: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder=".my-class { color: red; }"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">JavaScript</label>
          <textarea
            value={jsCode}
            onChange={e => onUpdate?.({ ...block.data, jsCode: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 font-mono text-xs shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="console.log('Hello');"
          />
        </div>
      </div>
    )
  }

  if (!htmlCode && !cssCode && !jsCode) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">No custom code set</p>
      </div>
    )
  }

  const combinedHtml = `
    ${cssCode ? `<style>${cssCode}</style>` : ''}
    ${htmlCode}
    ${jsCode ? `<script>${jsCode}</script>` : ''}
  `

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <iframe
        srcDoc={combinedHtml}
        sandbox="allow-scripts"
        className="w-full border-0"
        style={{ minHeight: '100px' }}
        title="Custom code block"
      />
    </div>
  )
}
