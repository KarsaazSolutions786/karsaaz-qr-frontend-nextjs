import type { TableBlockData } from '@/types/entities/biolink'

interface TableBlockProps {
  block: TableBlockData
  isEditing?: boolean
  onUpdate?: (data: TableBlockData['data']) => void
}

function parseTableData(csv: string): string[][] {
  return csv
    .trim()
    .split('\n')
    .map((row) => row.split(',').map((cell) => cell.trim()))
}

export default function TableBlock({ block, isEditing, onUpdate }: TableBlockProps) {
  const { tableData, textColor } = block.data

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Table Data</label>
          <textarea
            value={tableData}
            onChange={(e) => onUpdate?.({ ...block.data, tableData: e.target.value })}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono text-xs"
            placeholder="Header 1, Header 2, Header 3&#10;Row 1 Col 1, Row 1 Col 2, Row 1 Col 3"
          />
          <p className="mt-1 text-xs text-gray-500">Comma separated values. Each row on a new line.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Text Color</label>
          <input
            type="color"
            value={textColor || '#000000'}
            onChange={(e) => onUpdate?.({ ...block.data, textColor: e.target.value })}
            className="mt-1 block h-10 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
    )
  }

  if (!tableData) return null

  const rows = parseTableData(tableData)
  if (rows.length === 0) return null

  const [headerRow, ...body] = rows
  const header = headerRow ?? []

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm" style={{ color: textColor || undefined }}>
        <thead className="bg-gray-50">
          <tr>
            {header.map((cell, i) => (
              <th key={i} className="px-4 py-2 text-left font-semibold text-gray-900">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
